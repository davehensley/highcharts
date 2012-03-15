$(function () {
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container',
            type: 'column',
            rightMargin: 80
        },
        
        xAxis: {
            type: 'datetime',
            tickInterval: 24 * 3600 * 1000,
            minPadding: 0.1,
            maxPadding: 0.1
        },
        
        yAxis: [{
            // default options
        }, {
            linkedTo: 0,
            opposite: true
        }],
        
        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4],
            pointStart: Date.UTC(2010, 0, 1),
            pointInterval: 24 * 3600 * 1000 // one day
        }]
    });
});