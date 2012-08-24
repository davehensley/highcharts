$(function () {
    $.getJSON('http://www.highcharts.com/samples/data/jsonp.php?filename=range.json&callback=?', function(data) {
    	
    	// Shorten the data
    	data = data.splice(181, 14);
  
    	window.chart = new Highcharts.Chart({
    	
		    chart: {
		        renderTo: 'container',
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
		        data: data,
		        dataLabels: {
		        	enabled: true,
		        	yHigh: 16,
		        	yLow: -5,
		        	style: {
		        		color: 'white'
		        	}
		        }
		    }]
		
		});
    });
    
});