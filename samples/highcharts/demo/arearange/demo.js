$(function () {
    $.getJSON('http://www.highcharts.com/samples/data/jsonp.php?filename=range.json&callback=?', function(data) {
    
    	window.$('#container').highcharts({
    	
		    chart: {
		        type: 'arearange'
		    },
		    
		    title: {
		        text: 'Temperature variation by day'
		    },
		
		    xAxis: {
		        type: 'datetime'
		    },
		    
		    yAxis: {
		        title: {
		            text: null
		        }
		    },
		
		    tooltip: {
		        crosshairs: true,
		        shared: true,
		        valueSuffix: '°C'
		    },
		    
		    legend: {
		        enabled: false
		    },
		
		    series: [{
		        name: 'Temperatures',
		        data: data
		    }]
		
		});
    });
    
});