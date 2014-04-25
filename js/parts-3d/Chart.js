/*** 
	EXTENSION FOR 3D CHARTS
***/
// Shorthand to check the is3d flag
Highcharts.Chart.prototype.is3d = function () {
	return this.options.chart.options3d && this.options.chart.options3d.enabled;
};

Highcharts.wrap(Highcharts.Chart.prototype, 'isInsidePlot', function (proceed) {
	if (this.is3d()) {
		return true;
	} else {
		return proceed.apply(this, [].slice.call(arguments, 1));
	}
});

Highcharts.wrap(Highcharts.Chart.prototype, 'init', function (proceed) {	
	var args = arguments;
	args[1] = Highcharts.merge({ 
		chart: {
			options3d: {
				enabled: false,
				alpha: 0,
				beta: 0,
				depth: 100,
				viewDistance: 25,

				frame: {
					bottom: { size: 1, color: 'rgba(255,255,255,0)' },
					side: { size: 1, color: 'rgba(255,255,255,0)' },
					back: { size: 1, color: 'rgba(255,255,255,0)' }
				}
			}
		}
	}, args[1]);

	proceed.apply(this, [].slice.call(args, 1));
});

Highcharts.wrap(Highcharts.Chart.prototype, 'setChartSize', function (proceed) {
	proceed.apply(this, [].slice.call(arguments, 1));

	if (this.is3d()) {
		var inverted = this.inverted,
			clipBox = this.clipBox,
			margin = this.margin,
			x = inverted ? 'y' : 'x',
			y = inverted ? 'x' : 'y',
			w = inverted ? 'height' : 'width',
			h = inverted ? 'width' : 'height';

		clipBox[x] = -(margin[3] || 0);
		clipBox[y] = -(margin[0] || 0);
		clipBox[w] = this.chartWidth + (margin[3] || 0) + (margin[1] || 0);
		clipBox[h] = this.chartHeight + (margin[0] || 0) + (margin[2] || 0);
	}
});

Highcharts.wrap(Highcharts.Chart.prototype, 'redraw', function (proceed) {
	if (this.is3d()) {
		// Set to force a redraw of all elements
		this.isDirtyBox = true;
	}
	proceed.apply(this, [].slice.call(arguments, 1));	
});

Highcharts.Chart.prototype.retrieveStacks = function () {
	var stacks = {},
		type = this.options.chart.type,
		typeOptions = this.options.plotOptions[type],
		stacking = typeOptions.stacking,
		grouping = typeOptions.grouping,
		i = 1;

	if (grouping || !stacking) { return this.series; }

	Highcharts.each(this.series, function (S) {
		if (!stacks[S.options.stack || 0]) {
			stacks[S.options.stack || 0] = { series: [S], position: i};
			i++;
		} else {
			stacks[S.options.stack || 0].series.push(S);
		}
	});
	stacks.totalStacks = i + 1;
	return stacks;
};

Highcharts.wrap(Highcharts.Series.prototype, 'alignDataLabel', function (proceed) {
	proceed.apply(this, [].slice.call(arguments, 1));
	if (this.chart.is3d()) {
		var args = arguments,
			dataLabel = args[2],
			chart = this.chart;

		var options3d = chart.options.chart.options3d,
			origin = {
				x: chart.plotWidth / 2,
				y: chart.plotHeight / 2, 
				z: options3d.depth,
				vd: options3d.viewDistance
			},
			alpha = options3d.alpha,
			beta = options3d.beta * (chart.yAxis[0].opposite ? -1 : 1);

		var pos = [{x: dataLabel.x, y: dataLabel.y, z: dataLabel.z}];
		pos = perspective(pos, alpha, beta, origin);

		dataLabel.attr({x: pos[0].x, y: pos[0].y});
	} 
});
