/* ****************************************************************************
 * Start Waterfall series code                                                *
 *****************************************************************************/

wrap(axisProto, 'getSeriesExtremes', function (proceed, renew) {
	// Run uber method
	proceed.call(this, renew);

	if (this.isXAxis) {
		return;
	}

	var axis = this,
		visitedStacks = [],
		resetMinMax = true;


	// recalculate extremes for each waterfall stack
	each(axis.series, function (series) {
		// process only visible, waterfall series, one from each stack
		if (!series.visible || !series.stackKey || series.type !== 'waterfall' || visitedStacks.indexOf(series.stackKey) !== -1) {
			return;
		}

		// reset previously found dataMin and dataMax, do it only once
		if (resetMinMax) {
			axis.dataMin = axis.dataMax = null;
			resetMinMax = false;
		}


		var yData = series.processedYData,
			yDataLength = yData.length,
			seriesDataMin = yData[0],
			seriesDataMax = yData[0],
			threshold = series.options.threshold,
			stacks = axis.stacks,
			stackKey = series.stackKey,
			negKey = '-' + stackKey,
			total,
			previous,
			key,
			i;


		// set new stack totals including preceding values, finds new min and max values
		for (i = 0; i < yDataLength; i++) {
			key = yData[i] < 0 ? negKey : stackKey;
			total = stacks[key][i].total;

			if (i > 0) {
				total += previous;
				stacks[key][i].setTotal(total);

				// _cum is used to avoid conflict with Series.translate method
				stacks[key][i]._cum = null;
			}


			// find min / max values
			if (total < seriesDataMin) {
				seriesDataMin = total;
			}

			if (total > seriesDataMax) {
				seriesDataMax = total;
			}

			previous = total;
		}


		// set new extremes
		series.dataMin = seriesDataMin;
		series.dataMax = seriesDataMax;
		axis.dataMin = mathMin(pick(axis.dataMin, seriesDataMin), seriesDataMin, threshold);
		axis.dataMax = mathMax(pick(axis.dataMax, seriesDataMax), seriesDataMax, threshold);

		// remember series' stack key
		visitedStacks.push(series.stackKey);
	});
});


// 1 - set default options
defaultPlotOptions.waterfall = merge(defaultPlotOptions.column, {
	lineWidth: 1,
	lineColor: '#333',
	dashStyle: 'dot',
	borderWidth: 1,
	borderColor: '#333',
	shadow: false
});


// 2 - Create the series object
seriesTypes.waterfall = extendClass(seriesTypes.column, {
	type: 'waterfall',

	upColorProp: 'fill',

	pointArrayMap: ['y', 'low'],

	pointValKey: 'y',

	/**
	 * Init waterfall series, force stacking
	 */
	init: function (chart, options) {
		options.stacking = true;
		seriesTypes.column.prototype.init.call(this, chart, options);
	},


	/**
	 * Translate data points from raw values
	 */
	translate: function () {
		var series = this,
			stacking = series.options.stacking,
			axis = series.yAxis,
			len,
			i,

			points,
			point,
			shapeArgs,
			sum = 0,
			sumStart = 0,
			subSum = 0,
			subSumStart = 0,
			edges,
			cumulative,
			prevStack,
			prevY,
			stack,
			y,
			h;

		// run column series translate
		seriesTypes.column.prototype.translate.apply(this);


		points = this.points;
		subSumStart = sumStart = points[0];

		for (i = 1, len = points.length; i < len; i++) {
			// cache current point object
			point = points[i];
			shapeArgs = point.shapeArgs;

			if (stacking) {
				// get current and previous stack
				stack = series.getStack(i);
				prevStack = series.getStack(i - 1);
				prevY = series.getStackY(prevStack);
			}

			// set new intermediate sum values after reset
			if (subSumStart === null) {
				subSumStart = point;
				subSum = 0;
			}

			// sum only points with value, not intermediate or total sum
			if (point.y && !point.isSum && !point.isIntermediateSum) {
				sum += point.y;
				subSum += point.y;
			}

			// calculate sum points
			if (point.isSum || point.isIntermediateSum) {

				if (point.isIntermediateSum) {
					edges = series.getSumEdges(subSumStart, points[i - 1]);
					point.y = subSum;
					subSumStart = null;
				} else {
					edges = series.getSumEdges(sumStart, points[i - 1]);
					point.y = sum;
				}

				shapeArgs.y = point.plotY = edges[1];
				shapeArgs.height = edges[0] - edges[1];

			// calculate other (up or down) points based on y value
			} else if (point.y < 0) {

				if (stacking) {
					// use "_cum" instead of already calculated "cum" to avoid reverse ordering negative columns
					cumulative = stack._cum === null ? prevStack.total : stack._cum;
					stack._cum = cumulative + point.y;
					y = mathCeil(axis.translate(cumulative, 0, 1));
					h = mathCeil(axis.translate(stack._cum, 0, 1));
				}

				shapeArgs.y = y;
				shapeArgs.height = h - y;
			} else {
				if (!stacking) {
					shapeArgs.y -= points[i - 1].shapeArgs.height;
				} else if (shapeArgs.y + shapeArgs.height > prevY) {
					shapeArgs.height = prevY - shapeArgs.y;
				}
			}
			
		}
	},

	/**
	 * Call default processData then override yData to reflect waterfall's extremes on yAxis
	 */
	processData: function (force) {
		Series.prototype.processData.call(this, force);

		var series = this,
			options = series.options,
			yData = series.yData,
			length = yData.length,
			prev,
			curr,
			subSum,
			sum,
			i;

		prev = sum = subSum = options.threshold;

		for (i = 0; i < length; i++) {
			curr = yData[i];

			// processed yData only if it's not already processed
			if (curr !== null && typeof curr !== 'number') {

				if (curr === "sum") {
					yData[i] = null;

				} else if (curr === "intermediateSum") {
					yData[i] = null;
					subSum = prev;

				} else {
					yData[i] = curr[0];// + prev;
				}

				prev = yData[i];
			}
		}
	},

	/**
	 * Return [y, low] array, if low is not defined, it's replaced with null for further calculations
	 */
	toYData: function (pt) {
		if (pt.isSum) {
			return "sum";
		} else if (pt.isIntermediateSum) {
			return "intermediateSum";
		}

		return [pt.y];
	},

	/**
	 * Postprocess mapping between options and SVG attributes
	 */
	getAttribs: function () {
		seriesTypes.column.prototype.getAttribs.apply(this, arguments);

		var series = this,
			options = series.options,
			stateOptions = options.states,
			upColor = options.upColor || series.color,
			hoverColor = Highcharts.Color(upColor).brighten(0.1).get(),
			seriesDownPointAttr = merge(series.pointAttr),
			upColorProp = series.upColorProp;

		seriesDownPointAttr[''][upColorProp] = upColor;
		seriesDownPointAttr.hover[upColorProp] = stateOptions.hover.upColor || hoverColor;
		seriesDownPointAttr.select[upColorProp] = stateOptions.select.upColor || upColor;

		each(series.points, function (point) {
			if (point.y > 0 && !point.color) {
				point.pointAttr = seriesDownPointAttr;
				point.color = upColor;
			}
		});
	},

	/**
	 * Draw columns' connector lines
	 */
	getGraphPath: function () {

		var data = this.data,
			length = data.length,
			lineWidth = this.options.lineWidth + this.options.borderWidth,
			normalizer = mathRound(lineWidth) % 2 / 2,
			path = [],
			M = 'M',
			L = 'L',
			prevArgs,
			pointArgs,
			i,
			d;

		for (i = 1; i < length; i++) {
			pointArgs = data[i].shapeArgs;
			prevArgs = data[i - 1].shapeArgs;

			d = [
				M,
				prevArgs.x + prevArgs.width, prevArgs.y + normalizer,
				L,
				pointArgs.x, prevArgs.y + normalizer
			];

			if (data[i - 1].y < 0) {
				d[2] += prevArgs.height;
				d[5] += prevArgs.height;
			}

			path = path.concat(d);
		}

		return path;
	},

	getStack: function (i) {
		var axis = this.yAxis,
			stacks = axis.stacks,
			key = this.stackKey;

		if (this.processedYData[i] < 0) {
			key = '-' + key;
		}

		return stacks[key][i];
	},

	getStackY: function (stack) {
		return mathCeil(this.yAxis.translate(stack.total, null, true));
	},

	/**
	 * Return array of top and bottom position for sum column based on given edge points
	 */
	getSumEdges: function (pointA, pointB) {
		var valueA,
			valueB,
			tmp;

		valueA = pointA.y >= 0 ? pointA.shapeArgs.y + pointA.shapeArgs.height : pointA.shapeArgs.y;
		valueB = pointB.y >= 0 ? pointB.shapeArgs.y : pointB.shapeArgs.y + pointB.shapeArgs.height;

		if (valueB > valueA) {
			tmp = valueA;
			valueA = valueB;
			valueB = tmp;
		}

		return [valueA, valueB];
	},

	/**
	 * Place sums' dataLabels on the top of column regardles of its value
	 */
	alignDataLabel: function (point, dataLabel, options,  alignTo, isNew) {
		var dlBox;

		if (point.isSum || point.isIntermediateSum) {
			dlBox = point.dlBox || point.shapeArgs;

			if (dlBox) {
				alignTo = merge(dlBox);
			}

			alignTo.height = 0;
			options.verticalAlign = 'bottom';
			options.align = pick(options.align, 'center');

			Series.prototype.alignDataLabel.call(this, point, dataLabel, options, alignTo, isNew);
		} else {
			seriesTypes.column.prototype.alignDataLabel.apply(this, arguments);
		}
	},

	drawGraph: Series.prototype.drawGraph
});

/* ****************************************************************************
 * End Waterfall series code                                                  *
 *****************************************************************************/
