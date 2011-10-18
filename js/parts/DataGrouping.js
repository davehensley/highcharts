/* ****************************************************************************
 * Start data grouping module												 *
 ******************************************************************************/
var DATA_GROUPING = 'dataGrouping',
	seriesProto = Series.prototype,
	baseProcessData = seriesProto.processData,
	baseGeneratePoints = seriesProto.generatePoints,
	baseDestroy = seriesProto.destroy,
	baseTooltipHeaderFormatter = seriesProto.tooltipHeaderFormatter,
	NUMBER = 'number',
	
	/**
	 * Define the available approximation types. The data grouping approximations takes an array
	 * or numbers as the first parameter. In case of ohlc, four arrays are sent in as four parameters.
	 * Each array consists only of numbers. In case null values belong to the group, the property
	 * .hasNulls will be set to true on the array.
	 */
	approximations = {
		sum: function (arr) {
			var len = arr.length, 
				ret;
				
			// 1. it consists of nulls exclusively
			if (!len && arr.hasNulls) {
				ret = null;
			// 2. it has a length and real values
			} else if (len) {
				ret = 0;
				while (len--) {
					ret += arr[len];
				}
			}
			// 3. it has zero length, so just return undefined 
			// => doNothing()
			
			return ret;
		},
		average: function (arr) {
			var len = arr.length,
				ret = approximations.sum(arr);
				
			// If we have a number, return it divided by the length. If not, return
			// null or undefined based on what the sum method finds.
			if (typeof ret === NUMBER && len) {
				ret = ret / len;
			}
			
			return ret;
		},
		open: function (arr) {
			return arr.length ? arr[0] : (arr.hasNulls ? null : UNDEFINED);
		},
		high: function (arr) {
			return arr.length ? mathMax.apply(0, arr) : (arr.hasNulls ? null : UNDEFINED);
		},
		low: function (arr) {
			return arr.length ? mathMin.apply(0, arr) : (arr.hasNulls ? null : UNDEFINED);
		},
		close: function (arr) {
			return arr.length ? arr[arr.length - 1] : (arr.hasNulls ? null : UNDEFINED);
		},
		// ohlc is a special case where a multidimensional array is input and an array is output
		ohlc: function (open, high, low, close) {
			open = approximations.open(open);
			high = approximations.high(high);
			low = approximations.low(low);
			close = approximations.close(close);
			
			if (typeof open === NUMBER || typeof high === NUMBER || typeof low === NUMBER || typeof close === NUMBER) {
				return [open, high, low, close];
			} 
			// else, return is undefined
		}
	};

/**
 * Takes parallel arrays of x and y data and groups the data into intervals defined by groupPositions, a collection
 * of starting x values for each group.
 */
seriesProto.groupData = function (xData, yData, groupPositions, approximation) {
	var series = this,
		data = series.data,
		dataOptions = series.options.data,
		groupedXData = [],
		groupedYData = [],
		dataLength = xData.length,
		pointX,
		pointY,
		groupedY,
		values1 = [],
		values2 = [],
		values3 = [],
		values4 = [],
		i;
	
		for (i = 0; i <= dataLength; i++) {

			// when a new group is entered, summarize and initiate the previous group
			while ((groupPositions[1] !== UNDEFINED && xData[i] >= groupPositions[1]) ||
					i === dataLength) { // get the last group

				// get group x and y 
				pointX = groupPositions.shift();				
				groupedY = typeof approximation === 'function' ?
						approximation(values1, values2, values3, values4) : // custom approximation callback function
						approximations[approximation](values1, values2, values3, values4); // predefined approximation
				
				// push the grouped data		
				if (groupedY !== UNDEFINED) {
					groupedXData.push(pointX);
					groupedYData.push(groupedY);
				}
				
				// reset the aggregate arrays
				values1 = [];
				values2 = [];
				values3 = [];
				values4 = [];
				
				// don't loop beyond the last group
				if (i === dataLength) {
					break;
				}
			}
			
			// break out
			if (i === dataLength) {
				break;
			}
			
			// for each raw data point, push it to an array that contains all values for this specific group
			pointY = yData[i];
			if (approximation === 'ohlc') {
				
				var index = series.cropStart + i,
					point = (data && data[index]) || series.pointClass.prototype.applyOptions.apply({}, [dataOptions[index]]),
					open = point.open,
					high = point.high,
					low = point.low,
					close = point.close;
				
				
				if (typeof open === NUMBER) {
					values1.push(open);
				} else if (open === null) {
					values1.hasNulls = true;
				}
				
				if (typeof high === NUMBER) {
					values2.push(high);
				} else if (high === null) {
					values2.hasNulls = true;
				}
				
				if (typeof low === NUMBER) {
					values3.push(low);
				} else if (low === null) {
					values3.hasNulls = true;
				}
				
				if (typeof close === NUMBER) {
					values4.push(close);
				} else if (close === null) {
					values4.hasNulls = true;
				}
			} else {
				if (typeof pointY === NUMBER) {
					values1.push(pointY);
				} else if (pointY === null) {
					values1.hasNulls = true;
				}
			}

		}
	return [groupedXData, groupedYData];
};

/**
 * Extend the basic processData method, that crops the data to the current zoom
 * range, with data grouping logic.
 */
seriesProto.processData = function () {
	var series = this,
		options = series.options,
		dataGroupingOptions = options[DATA_GROUPING],
		groupingEnabled = dataGroupingOptions && dataGroupingOptions.enabled;

	// run base method
	series.forceCrop = groupingEnabled; // #334
	baseProcessData.apply(series);

	// disabled?
	if (!groupingEnabled) {
		return;
	}

	var i,
		chart = series.chart,
		processedXData = series.processedXData,
		processedYData = series.processedYData,
		plotSizeX = chart.plotSizeX,
		xAxis = series.xAxis,
		groupPixelWidth = pick(xAxis.groupPixelWidth, dataGroupingOptions.groupPixelWidth),
		maxPoints = plotSizeX / groupPixelWidth,
		dataLength = processedXData.length,
		groupedData = series.groupedData,
		chartSeries = chart.series;

	// attempt to solve #334: if multiple series are compared on the same x axis, give them the same
	// group pixel width
	if (!xAxis.groupPixelWidth) {
		i = chartSeries.length;
		while (i--) {
			if (chartSeries[i].xAxis === xAxis && chartSeries[i].options[DATA_GROUPING]) {
				groupPixelWidth = mathMax(groupPixelWidth, chartSeries[i].options[DATA_GROUPING].groupPixelWidth);
			}
		}
		xAxis.groupPixelWidth = groupPixelWidth;
	}

	// clear previous groups
	each(groupedData || [], function (point, i) {
		if (point) {
			// TODO: find out why this is looping over all points in the Navigator when changing range
			groupedData[i] = point.destroy ? point.destroy() : null;
		}
	});

	
	if (dataLength > maxPoints || dataGroupingOptions.forced) {
		series.hasGroupedData = true;

		series.points = null; // force recreation of point instances in series.translate

		var xMin = processedXData[0],
			xMax = processedXData[dataLength - 1],
			interval = groupPixelWidth * (xMax - xMin) / plotSizeX,
			groupPositions = getTimeTicks(interval, xMin, xMax, null, dataGroupingOptions.units),
			groupedXandY = series.groupData(processedXData, processedYData, groupPositions, dataGroupingOptions.approximation),
			groupedXData = groupedXandY[0],
			groupedYData = groupedXandY[1];
			
		// prevent the smoothed data to spill out left and right, and make
		// sure data is not shifted to the left
		if (dataGroupingOptions.smoothed) {
			i = groupedXData.length - 1;
			groupedXData[i] = xMax;
			while (i-- && i > 0) {
				groupedXData[i] += interval / 2;
			}
			groupedXData[0] = xMin;
		}

		// record what data grouping values were used
		series.currentDataGrouping = groupPositions.info;
		if (options.pointRange === null) { // null means auto, as for columns, candlesticks and OHLC
			series.pointRange = groupPositions.info.totalRange;
		}
		
		// set series props
		series.processedXData = groupedXData;
		series.processedYData = groupedYData;

	} else {
		series.currentDataGrouping = null;
		series.pointRange = options.pointRange;
	}


};

seriesProto.generatePoints = function () {
	var series = this;

	baseGeneratePoints.apply(series);

	// record grouped data in order to let it be destroyed the next time processData runs
	series.groupedData = series.hasGroupedData ? series.points : null;
};

/**
 * Make the tooltip's header reflect the grouped range
 */
seriesProto.tooltipHeaderFormatter = function (key) {
	var series = this,
		options = series.options,
		tooltipOptions = series.tooltipOptions,
		dataGroupingOptions = options.dataGrouping,
		xDateFormat = tooltipOptions.xDateFormat,
		xDateFormatEnd,
		xAxis = series.xAxis,
		currentDataGrouping,
		dateTimeLabelFormats,
		labelFormats,
		formattedKey,
		n,
		ret;
	
	// apply only to grouped series
	if (xAxis.options.type === 'datetime') {
		
		// set variables
		currentDataGrouping = series.currentDataGrouping;		
		dateTimeLabelFormats = dataGroupingOptions.dateTimeLabelFormats;
		
		// if we have grouped data, use the grouping information to get the right format
		if (currentDataGrouping) {
			labelFormats = dateTimeLabelFormats[currentDataGrouping.unitName];
			if (currentDataGrouping.count === 1) {
				xDateFormat = labelFormats[0];
			} else {
				xDateFormat = labelFormats[1];
				xDateFormatEnd = labelFormats[2];
			} 
		// if not grouped, and we don't have set the xDateFormat option, get the best fit,
		// so if the least distance between points is one minute, show it, but if the 
		// least distance is one day, skip hours and minutes etc.
		} else if (!xDateFormat) {
			for (n in timeUnits) {
				if (timeUnits[n] >= xAxis.closestPointRange) {
					xDateFormat = dateTimeLabelFormats[n][0];
					break;
				}	
			}		
		}
		
		// now format the key
		formattedKey = dateFormat(xDateFormat, key);
		if (xDateFormatEnd) {
			formattedKey += dateFormat(xDateFormatEnd, key + currentDataGrouping.totalRange - 1);
		}
		
		// return the replaced format
		ret = tooltipOptions.headerFormat.replace('{point.key}', formattedKey);
	
	// else, fall back to the regular formatter
	} else {
		ret = baseTooltipHeaderFormatter.apply(series, [key]);
	}
	
	return ret;
};

/**
 * Extend the series destroyer
 */
seriesProto.destroy = function () {
	var series = this,
		groupedData = series.groupedData || [],
		i = groupedData.length;

	while (i--) {
		if (groupedData[i]) {
			groupedData[i].destroy();
		}
	}
	baseDestroy.apply(series);
};


// Extend the plot options
/*jslint white:true */
var commonOptions = {
	approximation: 'average', // average, open, high, low, close, sum
	//forced: undefined,
	groupPixelWidth: 2,
	// the first one is the point or start value, the second is the start value if we're dealing with range,
	// the third one is the end value if dealing with a range
	dateTimeLabelFormats: hash( 
		SECOND, ['%A, %b %e, %H:%M:%S', '%A, %b %e, %H:%M:%S', '-%H:%M:%S'],
		MINUTE, ['%A, %b %e, %H:%M', '%A, %b %e, %H:%M', '-%H:%M'],
		HOUR, ['%A, %b %e, %H:%M', '%A, %b %e, %H:%M', '-%H:%M'],
		DAY, ['%A, %b %e, %Y', '%A, %b %e', '-%A, %b %e, %Y'],
		WEEK, ['Week from %A, %b %e, %Y', '%A, %b %e', '-%A, %b %e, %Y'],
		MONTH, ['%B %Y', '%B', '-%B %Y'],
		YEAR, ['%Y', '%Y', '-%Y']
	),

	// smoothed = false, // enable this for navigator series only
	units: [[
		MILLISECOND, // unit name
		[1, 2, 5, 10, 20, 25, 50, 100, 200, 500] // allowed multiples
	], [
		SECOND,
		[1, 2, 5, 10, 15, 30]
	], [
		MINUTE,
		[1, 2, 5, 10, 15, 30]
	], [
		HOUR,
		[1, 2, 3, 4, 6, 8, 12]
	], [
		DAY,
		[1]
	], [
		WEEK,
		[1]
	], [
		MONTH,
		[1, 3, 6]
	], [
		YEAR,
		null
	]]
};

// line types
defaultPlotOptions.line[DATA_GROUPING] =
	defaultPlotOptions.spline[DATA_GROUPING] =
	defaultPlotOptions.area[DATA_GROUPING] =
	defaultPlotOptions.areaspline[DATA_GROUPING] = commonOptions;

// bar-like types (OHLC and candleticks inherit this as the classes are not yet built)
defaultPlotOptions.column[DATA_GROUPING] = merge(commonOptions, {
		approximation: 'sum',
		groupPixelWidth: 10
});
/*jslint white:false */
/* ****************************************************************************
 * End data grouping module												   *
 ******************************************************************************/