$(function () {
    $('#container').highcharts({
        title: {
            text: 'Basic annotations demo'
        },
        credits: {
            enabled: false
        },

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        series: [{
            data: [29.9, {
                id: 'point1',
                y: 71.5
            }, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }],

        annotations: [{
            linkedTo: 'point1',
            title: {
                y: -25,
                text: 'Emphasized<br>annotation',
                style: {
                    color: 'red',
                    fontSize: '15px'
                }
            }
        }]

    });
});