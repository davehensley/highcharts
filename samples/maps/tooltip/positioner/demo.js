$(function () {

    $.getJSON('http://www.highcharts.com/samples/data/jsonp.php?filename=world-population-density.json&callback=?', function (data) {
        
        // Initiate the chart
        $('#container').highcharts('Map', {

            chart: {
                width: 800
            },

            title: {
                text: 'Tooltip positioner demo'
            },
            
            legend: {
                title: {
                    text: 'Population density per km²'
                }
            },
        
            tooltip: {
                positioner: function () {
                    return { x: 0, y: 250 }
                },
                borderWidth: 0,
                shadow: false
            },

            colorAxis: {
                min: 1,
                max: 1000,
                type: 'logarithmic'
            },

            series : [{
                data : data,
                mapData: Highcharts.maps.world,
                joinBy: 'code',
                name: 'Population density',
                states: {
                    hover: {
                        color: '#BADA55'
                    }
                },
                tooltip: {
                    valueSuffix: '/km²'
                }
            }]
        });
    });
});