$(function () {
    $.getJSON('http://www.highcharts.com/samples/data/jsonp.php?filename=usdeur.json&callback=?', function (data) {

        var year = new Date(data[data.length-1][0]).getFullYear(); // Get year of last data point

        // Create the chart
        $('#container').highcharts('StockChart', {


            rangeSelector : {
                selected : 1
            },

            title : {
                text : 'USD to EUR exchange rate'
            },

            tooltip: {
                style: {
                    width: '200px'
                },
                valueDecimals: 4
            },

            yAxis : {
                title : {
                    text : 'Exchange rate'
                }
            },

            series : [{
                name : 'USD to EUR',
                data : data,
                id : 'dataseries'

            // the event marker flags
            }, {
                type : 'flags',
                data : [{
                    x : Date.UTC(year, 3, 25),
                    title : 'H',
                    text : 'Euro Contained by Channel Resistance'
                }, {
                    x : Date.UTC(year, 3, 28),
                    title : 'G',
                    text : 'EURUSD: Bulls Clear Path to 1.50 Figure'
                }, {
                    x : Date.UTC(year, 4, 4),
                    title : 'F',
                    text : 'EURUSD: Rate Decision to End Standstill'
                }, {
                    x : Date.UTC(year, 4, 5),
                    title : 'E',
                    text : 'EURUSD: Enter Short on Channel Break'
                }, {
                    x : Date.UTC(year, 4, 6),
                    title : 'D',
                    text : 'Forex: U.S. Non-Farm Payrolls Expand 244K, U.S. Dollar Rally Cut Short By Risk Appetite'
                }, {
                    x : Date.UTC(year, 4, 6),
                    title : 'C',
                    text : 'US Dollar: Is This the Long-Awaited Recovery or a Temporary Bounce?'
                }],
                onSeries : 'dataseries',
                shape : 'circlepin',
                width : 16
            }]
        });
    });
});
