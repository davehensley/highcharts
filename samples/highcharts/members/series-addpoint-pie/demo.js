$(function () {
    $('#container').highcharts({
        chart: {
            type: 'pie'
        },
        
        xAxis: {
        },
        
        series: [{
            data: [29.9, 71.5, 106.4]        
        }]
    });
    
    
    // the button action
    $('#button').click(function() {
        chart.series[0].addPoint(Math.random() * 100);
    });
});