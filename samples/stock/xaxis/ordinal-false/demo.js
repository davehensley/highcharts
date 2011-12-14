$(function() {
	$.getJSON('http://www.highcharts.com/samples/data/jsonp.php?filename=aapl-c.json&callback=?', function(data) {

		// Create the chart
		window.chart = new Highcharts.StockChart({
			chart : {
				renderTo : 'container'
			},

			rangeSelector : {
				selected : 1
			},

			title : {
				text : 'AAPL Stock Price'
			},
			
			xAxis: {
				ordinal: false
			},
			
			navigator: {
				xAxis: {
					ordinal: false
				}
			},
			
			series : [{
				name : 'AAPL Stock Price',
				data : data,
				marker : {
					enabled : true,
					radius : 3
				},
				shadow : true,
				tooltip : {
					yDecimals : 2
				}
			}]
		});
	});
});
