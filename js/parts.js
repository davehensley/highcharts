/*jslint node: true, white: true */
'use strict';
var HighchartsConfig = {
		version: [{highcharts: '3.0.7'},{Highstock: '1.3.7.'}],
		parts: [
			/* ADAPTERS */
			{name: 'standalone-framework.src', component: 'Standalone Framework', group:"Adapters", baseUrl: 'adapters'},		
			/*{name: 'mootools-adapter.src', component: 'Mootools Adapter', group:"Adapters", baseUrl: 'adapters'},
			{name: 'prototype-adapter.src', component: 'Prototype Adapter', group:"Adapters", baseUrl: 'a dapters'},*/

			/* CORE */
			{name: 'Intro', component: 'Core', group: 'Core', baseUrl:  'parts'},
			{name: 'Globals', component: 'Core', group: "Core", baseUrl: 'parts'},
			{name: 'Utilities', component: 'Core', group: "Core", baseUrl: 'parts'},
			{name: 'PathAnimation', component: 'Core', group: "Core", baseUrl: 'parts'},			
			/* JQueryAdpater */
			{name: 'JQueryAdapter', component: 'JQuery Adapter', group: "Adapters", baseUrl: 'parts'},
			/* CORE CONTINUES*/
			{name: 'Adapters', component: 'Core', group: "Core", baseUrl: 'parts'},
			{name: 'Options', component: 'Core', group: "Core", baseUrl: 'parts'},
			{name: 'Color', component: 'Core', group: "Core", baseUrl: 'parts'},
			{name: 'SvgRenderer', component: 'Core', group: "Core", baseUrl: 'parts'},
			{name: 'Html', component: 'Html', group: 'Features', baseUrl: 'parts', depends: {component: ['Core']}},
			{name: 'VmlRenderer', component: 'VML Renderer', group: "Renderers", depends: {component: ['Html']}, baseUrl: 'parts'},
			{name: 'CanVGRenderer', component: 'CanVG Renderer', group: "Renderers", depends: {component: ['Core']}, baseUrl: 'parts'},
			{name: 'Tick', component: 'Core', group: "Core", baseUrl: 'parts'},			
			{name: 'PlotLineOrBand', component: 'Plotlines or bands', group: 'Features', depends: {component: ['Core']}, baseUrl: 'parts'},
			{name: 'Axis', component: 'Core', group: "Core", baseUrl: 'parts' },
			{name: 'DateTimeAxis', component: 'DateTime Axis', group: 'Features', depends: { component: ['Core']}, baseUrl: 'parts'},
			{name: 'LogarithmicAxis', component: 'Logarithmic Axis', group: 'Features', depends: {component: ['Core']}, baseUrl: 'parts'},
			{name: 'Tooltip', component: 'Tooltip', group: 'Dynamics and Interaction', depends: { component: ["Interaction"]}, baseUrl: 'parts'},
			{name: 'Pointer', component: 'Interaction', group: "Dynamics and Interaction", depends: { component: ['Core']}, baseUrl: 'parts'},
			{name: 'TouchPointer', component: 'Touch', group: "Dynamics and Interaction", depends: { component: ['Interaction', 'Core']}, baseUrl: 'parts'},
			{name: "MSPointer", component: "MS Touch", group: "Dynamics and Interaction", depends: { component: ['Touch']}, baseUrl: 'parts'},
			{name: 'Legend', component: 'Core', group: "Core", baseUrl: 'parts'},
			{name: 'Chart', component: 'Core', group: "Core", baseUrl: 'parts'},
			{name: 'CenteredSeriesMixin', component: 'CenteredSeriesMixin', baseUrl: 'parts'},
			{name: 'Point', component: 'Core', group: 'Core', baseUrl: 'parts'},
			{name: 'Series', component: 'Core', group: "Core", baseUrl: 'parts'},
			{name: 'Stacking', component: 'Stacking', group: "Features", baseUrl: 'parts'},
			{name: 'Dynamics', component: 'Dynamics', group: 'Dynamics and Interaction', depends: {component: ['Core']}, baseUrl: 'parts'},
			{name: 'LineSeries', component: 'LineSeries', group: "Chart and Serie types", depends: {component: ['Core']}, baseUrl: 'parts'},
			{name: 'AreaSeries', component: 'AreaSeries', group: "Chart and Serie types", depends: {component: ['Core']}, baseUrl: 'parts'},
			{name: 'SplineSeries', component: 'SplineSeries', group: "Chart and Serie types", depends: {component: ['Core']}, baseUrl: 'parts'},
			{name: 'AreaSplineSeries', component: 'AreaSplineSeries', group: "Chart and Serie types", depends: {component: ['Core', 'AreaSeries','SplineSeries']}, baseUrl: 'parts'},
			{name: 'ColumnSeries', component: 'ColumnSeries', group: "Chart and Serie types", depends: {component: ['Core']}, baseUrl: 'parts'},
			{name: 'BarSeries', component: 'BarSeries', group: "Chart and Serie types", depends: {component: ['Core','ColumnSeries']}, baseUrl: 'parts'},
			{name: 'ScatterSeries', component: 'ScatterSeries', group: "Chart and Serie types", depends: {component: ['Core','ColumnSeries']}, baseUrl: 'parts'},
			{name: 'PieSeries', component: 'PieSeries', group: "Chart and Serie types", depends: {component: ['Core'], name: ['CenteredSeriesMixin']}, baseUrl: 'parts'},
			{name: 'DataLabels', component: 'DataLabels', group: 'Features', depends: {component: ['Core']}, baseUrl: 'parts'},
			{name: 'Interaction', component: 'Interaction', group: "Dynamics and Interaction", depends: { component: ['Core']}, baseUrl: 'parts'},

			/* STOCK */
			{name: 'OrdinalAxis', component: 'Stock', group: 'Stock', depends: {component: ['Core']}, baseUrl: 'parts'},
			{name: 'DataGrouping', component: 'Stock', group: 'Stock', depends: {component: ['Core']}, baseUrl: 'parts'},
			{name: 'OHLCSeries', component: 'OHLC', group: 'Stock', depends: {component: ['Stock', 'ColumnSeries']}, baseUrl: 'parts'},
			{name: 'CandlestickSeries', component: 'Candlestick', group: 'Stock', depends: {component: ['Stock','OHLC', 'ColumnSeries']}, baseUrl: 'parts'},
			{name: 'FlagsSeries', component: 'Flags', group: 'Stock', depends: {component: ['Stock','ColumnSeries']}, baseUrl: 'parts'},
			{name: 'Scroller', component: 'Stock', group: 'Stock', depends: {component: ['Core','LineSeries']}, baseUrl: 'parts'},
			{name: 'RangeSelector', component: 'Stock', group: 'Stock', depends: {component: ['Core']}, baseUrl: 'parts'},
			{name: 'StockNavigation', component: 'Stock', group: 'Stock', depends: {component: ['Core']}, baseUrl: 'parts'},
			{name: 'StockChart', component: 'Stock', group: 'Stock', depends: {component: ['Core', 'Interaction', 'Tooltip']}, baseUrl: 'parts'},

			/* PARTS-MORE */
			{name: 'Pane', baseUrl: 'parts-more'},
			{name: 'RadialAxis', depends: {name: ['CenteredSeriesMixin']}, baseUrl: 'parts-more'},
			{name: 'AreaRangeSeries', component: 'AreaRangeSeries', group: "Chart and Serie types", depends: {component: ['ColumnSeries', 'AreaSeries']}, baseUrl: 'parts-more'},
			{name: 'AreaSplineRangeSeries', component: 'AreaSplineRangeSeries', group: "Chart and Serie types", depends: {component: ['AreaRangeSeries', 'SplineSeries']}, baseUrl: 'parts-more'},
			{name: 'ColumnRangeSeries', component: 'ColumnRangeSeries', group: 'Chart and Serie types', depends: {component: ['Core', 'ColumnSeries', 'AreaRangeSeries']}, baseUrl: 'parts-more'},
			{name: 'GaugeSeries', component: 'Gauge', group: 'Chart and Serie types', depends: {component: ['Core','LineSeries'], name: ['RadialAxis', 'Pane', 'PlotLineOrBand']}, baseUrl: 'parts-more'},
			{name: 'BoxPlotSeries', component: 'BoxPlotSeries', group: "Chart and Serie types", depends: {component: ['ColumnSeries']}, baseUrl: 'parts-more'},
			{name: 'ErrorBarSeries', component: 'ErrorBarSeries', group: "Chart and Serie types", depends: {component: ['BoxPlotSeries']}, baseUrl: 'parts-more'},
			{name: 'WaterfallSeries', component: 'WaterfallSeries', group: "Chart and Serie types", depends: {component: ['ColumnSeries']}, baseUrl: 'parts-more'},
			{name: 'BubbleSeries', component: 'BubbleSeries', group: "Chart and Serie types", depends: {component: ['Core', 'ScatterSeries' ]}, baseUrl: 'parts-more'},
			{name: 'Polar', component: 'Polar', group: 'Features', depends: {component: ['Core'], name: ['RadialAxis', 'Pane', 'ColumnSeries', 'AreaSeries']}, baseUrl: 'parts-more'},
			{name: 'Facade', component: 'Core', group: "Core", baseUrl: 'parts'},
			{name: 'Outro', component: 'Core', group: 'Core', baseUrl:  'parts'},
			/* MODULES */
			{name: 'funnel.src', component: 'Funnel', group: "Chart and Serie types", depends: {component: ['Core', 'DataLabels', 'PieSeries']}, baseUrl: 'modules'},
			{name: 'exporting.src', component: 'Exporting', group: "Modules", depends: {component: ['Core']}, baseUrl: 'modules'},
			{name: 'data.src', component: 'Data', group: "Modules", depends: {component: ['Core']}, baseUrl: 'modules'},
			{name: 'no-data-to-display.src', component: 'No-data-to-display', group: "Modules", depends: {component: ['Core']}, baseUrl: 'modules'},
			{name: 'drilldown.src', component: 'Drilldown', group: "Modules", depends: {component: ['Core']}, baseUrl: 'modules'},
			{name: 'solid-gauge.src', component: 'Solid Gauge', group: "Modules", depends: {component: ['Gauge']}, baseUrl: 'modules'}
		],

		groups: {
			'Core': { description: 'The Core of Highcharts', depends: {component: ['LineSeries']}},
			'Stock': { description: 'Highstock lets you create stock or general timeline charts'},
			'Chart and Serie types': { description: 'All the serie types available with Highcharts. Note: LineSeries is the base serie, required by the Core module'},
			/*'Chart and Serie types': { description: 'This is the description for Chart and Serie types group'},*/
			'Features': { description: 'Enable behaviours to the chart'},
			'Renderers': { description: 'Alternatives to standard SVG rendering'},
			'Modules':  { description: ''},
			'Dynamics and Interaction': { description: 'Leaving these out makes your chart completely static'},
			'Adapters': { description: 'Choose your own library to run Highcharts. Use Highcharts standalone framework when you want minimum bandwidth use, web apps built on other frameworks, or just a simple website where you want to keep it clean.'}
			},

		components: {
			'Standalone Framework': {description: 'If you don\'t want to load JQuery in your page'},
			'JQuery Adapter': {description: 'Run Highcharts on top of JQuery'},
			'Core': { description: 'This module is required for all other modules.'},
			'Stock': { description: 'For general stock and timeline chart, including navigator, scrollbar and range selector'},
			'Chart and Serie types': { description:  'The chart types available with Highcharts'},
			'VML Renderer': {description: 'This concerns old IE, which doesn\'t support SVG.'},
			'CanVG Renderer': {description: 'For rendering charts with Android 2.* devices, charts are rendered on canvas.'},
			'Tooltip': {description: 'The tooltip appears when hovering over a point in a series'},
			'Interaction': {description: 'Enabling mouse interaction with the chart'},
			'Touch': { description: 'Zooming the preferred way, by two-finger gestures. In response to the zoomType settings, the charts can be zoomed in and out as well as panned by one finger.'},
			'Html': { description: 'Use HTML to render the contents of the tooltip instead of SVG. Using HTML allows advanced formatting like tables and images in the tooltip. It is also recommended for rtl languages'},
			'DateTime Axis': {description: 'Enable support for an Axis based on time units'},
			'Plotlines or bands': {description: 'Enable drawing plotlines and -bands on your chart.'},
			'Logarithmic Axis': {description: 'Enable logarithmic axis. On a logarithmic axis the numbers along the axis increase logarithmically and the axis adjusts itself to the data series present in the chart.'},
			'Stacking': { description: 'Stack the data in your series on top of each other instead of overlapping.'},
			'DataLabels': { description: 'Data labels display each point\'s value or other information related to the point'},
			'Polar': { description: 'For turning the regular chart  into a polar chart.'},
			'MS Touch': { description: 'Optimised touch support for Microsoft touch devices'},
			'Dynamics': { description: 'Adds support for creating more dynamic charts, by adding API methods for adding series, points, etc.'},
			'LineSeries': { description:  ''},
			'AreaSeries': { description:  ''},
			'SplineSeries': { description:  ''},
			'ColumnSeries': { description:  ''},
			'BarSeries': { description:  ''},
			'ScatterSeries': { description:  ''},
			'PieSeries': { description:  ''},
			'AreaRangeSeries': { description:  ''},
			'AreaSplineSeries': { description:  ''},
			'AreaSplineRangeSeries': { description:  ''},
			'ColumnRangeSeries': { description:  ''},
			'Gauge': { description:  ''},
			'BoxPlotSeries': {description: 'A box plot, or box-and-whiskers chart, displays groups of data by their five point summaries: minimum, lower quartile, median, upper quartile and maximum. '},
			'BubbleSeries': {description: 'Bubble charts allow three dimensional data to be plotted in an X/Y diagram with sized bubbles.'},
			'WaterfallSeries': { description: 'Waterfall charts display the cumulative effects of income and expences, or other similar data. In Highcharts, a point can either be positive or negative, an intermediate sum or the total sum.'},
			'Funnel': {description: 'A funnel is a chart type mainly used by sales personnel to monitor the stages of the sales cycle, from first interest to the closed sale.'},
			'ErrorBarSeries': {description: 'An error bar series is a secondary series that lies on top of a parent series and displays the possible error range of each parent point.'}, 
			'OHLC': {description: 'The Open-High-Low-Close chart is typically used to illustrate movements in the price over time'},
			'Candlestick': {description: 'Like the OHLC chart, using columns to represent the range of price movement.'},
			'Flags': {description: 'Series consists of flags marking events or points of interests'},
			'Exporting': {description: 'For saving the chart to an image'},
			'Data': {description: 'Intended to ease the common process of loading data from CSV, HTML tables and even Google Spreadsheets'},
			'No-data-to-display': {description: 'When there\'s no data to display, the chart is showing a message'},
			'Drilldown': {description: 'Add drill down features, allowing point click to show detailed data series related to each point.'},
			'Solid Gauge': {description: 'Display your data in a solid gauge'}
		}
	};
