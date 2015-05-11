/**
 * Set the default options for spline
 */
defaultPlotOptions.spline = merge(defaultSeriesOptions);

/**
 * SplineSeries object
 */
var SplineSeries = extendClass(Series, {
	type: 'spline',

	/**
	 * Get the spline segment from a given point's previous neighbour to the given point
	 */
	getPointSpline: function (points, point, i) {
		var smoothing = 1.5, // 1 means control points midway between points, 2 means 1/3 from the point, 3 is 1/4 etc
			denom = smoothing + 1,
			plotX = point.plotX,
			plotY = point.plotY,
			lastPoint = points[i - 1],
			nextPoint = points[i + 1],
			leftContX,
			leftContY,
			rightContX,
			rightContY,
			ret,
			j;
/*
		j = i;
		while (j--) {
			if (points[j] && points[j].x !== undefined) {
				lastPoint = points[j];
				break;
			}
		}
		j = i;
		while (j < points.length && j++) {
			if (points[j] && points[j].x !== undefined) {
				nextPoint = points[j];
				break;
			}
		}
		*/
		//if (!lastPoint) return;
		// Find control points
		if (/*point.x !== undefined && */lastPoint && !lastPoint.isNull && nextPoint && !nextPoint.isNull) {
			var lastX = lastPoint.plotX,
				lastY = lastPoint.plotY,
				nextX = nextPoint.plotX,
				nextY = nextPoint.plotY,
				correction;

			leftContX = (smoothing * plotX + lastX) / denom;
			leftContY = (smoothing * plotY + lastY) / denom;
			rightContX = (smoothing * plotX + nextX) / denom;
			rightContY = (smoothing * plotY + nextY) / denom;

			// have the two control points make a straight line through main point
			correction = ((rightContY - leftContY) * (rightContX - plotX)) /
				(rightContX - leftContX) + plotY - rightContY;

			leftContY += correction;
			rightContY += correction;

			// to prevent false extremes, check that control points are between
			// neighbouring points' y values
			if (leftContY > lastY && leftContY > plotY) {
				leftContY = mathMax(lastY, plotY);
				rightContY = 2 * plotY - leftContY; // mirror of left control point
			} else if (leftContY < lastY && leftContY < plotY) {
				leftContY = mathMin(lastY, plotY);
				rightContY = 2 * plotY - leftContY;
			}
			if (rightContY > nextY && rightContY > plotY) {
				rightContY = mathMax(nextY, plotY);
				leftContY = 2 * plotY - rightContY;
			} else if (rightContY < nextY && rightContY < plotY) {
				rightContY = mathMin(nextY, plotY);
				leftContY = 2 * plotY - rightContY;
			}			
			/*if (point.leftCliff) {
				leftContY += this.yAxis.toPixels(point.y - point.leftCliff, true) - plotY;
			}			
			if (point.rightCliff) {
				rightContY += this.yAxis.toPixels(point.y - point.rightCliff, true) - plotY;
			}*/

			// record for drawing in next point
			point.rightContX = rightContX;
			point.rightContY = rightContY;

			
		}
		
		// Visualize control points for debugging
		/*
		if (leftContX) {
			this.chart.renderer.circle(leftContX + this.chart.plotLeft, leftContY + this.chart.plotTop, 2)
				.attr({
					stroke: 'red',
					'stroke-width': 1,
					fill: 'none'
				})
				.add();
			this.chart.renderer.path(['M', leftContX + this.chart.plotLeft, leftContY + this.chart.plotTop,
				'L', plotX + this.chart.plotLeft, plotY + this.chart.plotTop])
				.attr({
					stroke: 'red',
					'stroke-width': 1
				})
				.add();
			this.chart.renderer.circle(rightContX + this.chart.plotLeft, rightContY + this.chart.plotTop, 2)
				.attr({
					stroke: 'green',
					'stroke-width': 1,
					fill: 'none'
				})
				.add();
			this.chart.renderer.path(['M', rightContX + this.chart.plotLeft, rightContY + this.chart.plotTop,
				'L', plotX + this.chart.plotLeft, plotY + this.chart.plotTop])
				.attr({
					stroke: 'green',
					'stroke-width': 1
				})
				.add();
		}
		// */
		ret = [
			'C',
			lastPoint.rightContX || lastPoint.plotX,
			lastPoint.rightContY || lastPoint.plotY,
			leftContX || plotX,
			leftContY || plotY,
			plotX,
			plotY
		];
		lastPoint.rightContX = lastPoint.rightContY = null; // reset for updating series later
		return ret;
	}
});
seriesTypes.spline = SplineSeries;

