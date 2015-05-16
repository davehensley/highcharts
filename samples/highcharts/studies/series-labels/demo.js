$(function () {
    Highcharts.setOptions({
        lang: {
            months: ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli',
                'august', 'september', 'oktober', 'november', 'desember'],
            weekdays: ['sundag', 'mï¿½ndag', 'tysdag', 'onsdag', 'torsdag', 'fredag', 'laurdag']
        },
        colors: ['#DF5353', '#aaeeee', '#ff0066', '#eeaaee', '#DDDF0D', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee', '#ff0066', '#eeaaee', '#DDDF0D', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee']
    });
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container',
            borderColor: '#4572A7',
            backgroundColor: null,
            plotBorderWidth: 1,
            plotBorderColor: '#CCCCCC',
            backgroundColor: '#222',
            plotShadow: true,
            type: 'spline'
        },
        title: {
            text: ''
        },
        xAxis: {
            type: 'datetime',
            lineWidth: 1,
            lineColor: '#CCCCCC',
            tickPixelInterval: 80,
            tickLength: 5,
            tickWidth: 1,
            tickColor: '#FFFFFF',
            tickPosition: 'outside', // 'inside' or 'outside'
            gridLineWidth: 1,
            gridLineColor: '#444444',
            labels: {
                formatter: function () {
                    return Highcharts.dateFormat('%b', this.value);
                },
                align: 'left',
                x: 3
            },
            plotLines: [{
                value: Date.UTC(1971, 0, 01),
                color: '#444444',
                width: 3
            }],
            dateTimeLabelFormats: { // TODO: should this be a language setting as well?
                weekly: '%e. %b %y',
                twicemonthly: '%e. %b %y',
                monthly: '%b %y',
                twomonths: '%b %y',
                threemonths: '%b %y',
                fourmonths: '%b %y',
                sixmonths: '%b %y',
                yearly: '%Y'
            },
            showFirstLabel: true,
            showLastLabel: false,
            minRange: 30 * 24 * 3600 * 1000,
            startOnTick: true,
            endOnTick: true
        },
        yAxis: {
            min: 0, //0,
            max: 3.5,
            lineWidth: 1,
            lineColor: '#CCCCCC',
            tickPixelInterval: 50,
            tickLength: 5,
            tickWidth: 1,
            tickColor: '#FFFFFF',
            tickPosition: 'inside',
            gridLineWidth: 1,
            gridLineColor: '#444444',
            alternateGridColor: 'rgba(0, 0, 0, .2)',
            minorTickInterval: null,
            minorTickLength: 2,
            minorTickWidth: 0,
            minorTickColor: '#cccccc',
            minorTickPosition: 'outside',
            minorGridLineWidth: 1,
            minorGridLineColor: '#333333',
            minRange: 1,
            showFirstLabel: false,
            showLastLabel: true,
            labels: {
                formatter: function () {
                    if (this.value % 1 == 0) return Highcharts.numberFormat(this.value, 0) + 'm';
                    else return '';
                }
            },
            title: {
                text: 'Snjodjup'
            },
            maxZoom: 1
        },
        legend: {
            floating: true,
            layout: 'vertical',
            borderWidth: 1,
            borderColor: '#444444',
            borderCornerRadius: 5,
            shadow: true,
            backgroundColor: 'rgba(32, 32, 32, .75)',
            align: 'left',
            x: 80,
            verticalAlign: 'top',
            y: 30,
            itemStyle: {
                color: '#CCCCCC',
                listStyle: 'none',
                listStyleImage: 'none'
            },
            itemHiddenStyle: {
                color: '#444444'
            },
            itemHoverStyle: {
                color: 'white'
            }
        },
        tooltip: {
            formatter: function () {
                var heading = this.series.name == 'Snitt' ?
                    'Snitt' :
                    "Vinteren " + (parseInt(this.series.name) - 1) + "-" + this.series.name;

                return "<b>" + heading + "</b><br/>" + Highcharts.dateFormat('%e. %b', this.x, true) + ":<br/>" + Highcharts.numberFormat(100 * this.y, 0) + " cm snjo";
            },
            backgroundColor: 'rgba(0, 0, 0, .75)',
            borderWidth: 2,
            style: {
                color: '#CCCCCC'
            }
        },
        plotOptions: {
            series: {

                lineWidth: 2,
                shadow: true,
                marker: {
                    enabled: false,
                    symbol: 'circle',
                    states: {
                        hover: {
                            enabled: true
                        }
                    }
                }
            }
        },
        series: [{
            name: 'Snitt',
            dashStyle: 'shortdot',
            lineWidth: 4,
            shadow: false,
            color: '#888',
            data: [
                [24169600000, 0],
                [25379200000, 0.047603337526341],
                [26588800000, 0.19737645282537],
                [27798400000, 0.28491505667271],
                [29008000000, 0.40296707260495],
                [30217600000, 0.56964681386909],
                [31427200000, 0.74087962961224],
                [32636800000, 1.0603403778716],
                [33846400000, 1.3072110828202],
                [35056000000, 1.5097064081949],
                [36265600000, 1.6535664963435],
                [37475200000, 1.8619518260584],
                [38684800000, 1.8962671530145],
                [39894400000, 1.8812740280778],
                [41104000000, 1.7619060463346],
                [42313600000, 1.4540457031714],
                [43523200000, 0.97541033224884],
                [44732800000, 0.41658163265306],
                [45942400000, 0.12483134920635],
                [47152000000, 0]
            ]
        }, {
            name: '2000',
            data: [
                [27475200000, 0.00],
                [28339200000, 0.20],
                [33264000000, 1.90],
                [35683200000, 2.80],
                [37670400000, 3.40],
                [38880000000, 3.40],
                [40518000000, 3.30],
                [41209200000, 3.00],
                [42850800000, 2.00],
                [44233200000, 1.20],
                [44665200000, 1.10],
                [46047600000, 0.30],
                [46566000000, 0.00]
            ],
            visible: false
        }, {
            name: '2001',
            data: [
                [24706800000, 0.00],
                [26089200000, 0.20],
                [29635200000, 0.10],
                [32400000000, 0.20],
                [33091200000, 0.25],
                [34128000000, 0.35],
                [36892800000, 0.65],
                [38275200000, 1.00],
                [40345200000, 1.05],
                [43974000000, 0.30],
                [44578800000, 0.00]
            ],
            visible: false
        }, {
            name: '2002',
            data: [
                [25225200000, 0.00],
                [26265600000, 0.20],
                [28857600000, 0.50],
                [31622400000, 0.60],
                [32486400000, 0.50],
                [33782400000, 0.90],
                [36460800000, 2.00],
                [37670400000, 2.90],
                [38534400000, 2.70],
                [39567600000, 2.30],
                [40863600000, 2.00],
                [41641200000, 1.80],
                [42591600000, 1.55],
                [43542000000, 1.10],
                [44492400000, 0.40],
                [44838000000, 0.00]
            ],
            visible: false
        }, {
            name: '2003',
            data: [
                [25138800000, 0.00],
                [25830000000, 0.30],
                [26438400000, 0.50],
                [27043200000, 0.25],
                [27648000000, 0.50],
                [28598400000, 0.40],
                [30067200000, 0.40],
                [30758400000, 0.40],
                [31708800000, 0.47],
                [32313600000, 0.50],
                [33350400000, 1.20],
                [34041600000, 1.20],
                [35510400000, 1.30],
                [36201600000, 1.25],
                [37584000000, 1.50],
                [38361600000, 1.45],
                [39481200000, 1.65],
                [40258800000, 1.60],
                [40690800000, 1.50],
                [41814000000, 1.20],
                [42418800000, 1.15],
                [43369200000, 1.05],
                [44406000000, 0.40],
                [44578800000, 0.25],
                [44751600000, 0.00]
            ],
            visible: false
        }, {
            name: '2004',
            data: [
                [27734400000, 0.00],
                [28166400000, 0.10],
                [28684800000, 0.20],
                [29376000000, 0.40],
                [30326400000, 0.50],
                [30585600000, 0.60],
                [31276800000, 0.65],
                [31881600000, 0.65],
                [32313600000, 0.65],
                [32832000000, 0.80],
                [33868800000, 1.00],
                [34732800000, 1.15],
                [35251200000, 1.10],
                [35856000000, 1.10],
                [36720000000, 1.20],
                [37152000000, 1.20],
                [37670400000, 1.20],
                [38793600000, 1.35],
                [39654000000, 1.25],
                [40863600000, 1.15],
                [41727600000, 0.80],
                [42073200000, 0.65],
                [42678000000, 0.25],
                [43110000000, 0.00]
            ],
            visible: false
        }, {
            name: '2005',
            data: [
                [26352000000, 0.01],
                [26870400000, 0.10],
                [28684800000, 0.20],
                [29721600000, 0.20],
                [31017600000, 0.55],
                [31536000000, 0.60],
                [31795200000, 0.97],
                [32313600000, 1.61],
                [32832000000, 1.90],
                [33350400000, 1.85],
                [34732800000, 2.02],
                [35337600000, 2.43],
                [35942400000, 2.51],
                [37065600000, 2.47],
                [37843200000, 2.48],
                [38188800000, 2.53],
                [38880000000, 2.31],
                [39567600000, 2.20],
                [40086000000, 2.45],
                [40604400000, 2.59],
                [41382000000, 2.37],
                [41986800000, 2.20],
                [43196400000, 1.90],
                [44751600000, 1.20],
                [45702000000, 0.80],
                [46220400000, 0.40],
                [46566000000, 0.00]
            ],
            visible: false
        }, {
            name: '2006',
            data: [
                [26265600000, 0.00],
                [27907200000, 0.15],
                [29635200000, 0.20],
                [30326400000, 0.25],
                [30931200000, 0.30],
                [32140800000, 0.27],
                [32832000000, 0.48],
                [33264000000, 0.67],
                [33955200000, 0.69],
                [34214400000, 0.69],
                [34560000000, 0.69],
                [35164800000, 0.79],
                [35942400000, 0.68],
                [36374400000, 0.74],
                [36979200000, 0.75],
                [37324800000, 0.75],
                [38707200000, 0.75],
                [39308400000, 0.77],
                [39567600000, 0.89],
                [39999600000, 0.99],
                [40431600000, 1.15],
                [41382000000, 1.39],
                [41986800000, 1.09],
                [42418800000, 0.80],
                [43282800000, 0.40],
                [43974000000, 0.00]
            ],
            visible: false
        }, {
            name: '2007',
            data: [
                [25657200000, 0.00],
                [26265600000, 0.36],
                [27216000000, 0.35],
                [27820800000, 0.48],
                [29980800000, 1.00],
                [30499200000, 1.11],
                [30931200000, 0.90],
                [32572800000, 1.76],
                [33264000000, 2.20],
                [33868800000, 2.17],
                [34128000000, 2.40],
                [34473600000, 2.25],
                [34732800000, 2.34],
                [35078400000, 2.27],
                [35683200000, 2.27],
                [36288000000, 2.39],
                [37497600000, 2.48],
                [38102400000, 3.07],
                [38448000000, 2.93],
                [39308400000, 2.78],
                [39740400000, 2.80],
                [39999600000, 2.94],
                [40172400000, 2.94],
                [41986800000, 2.25],
                [42937200000, 2.02],
                [43542000000, 1.98],
                [44146800000, 1.78],
                [44665200000, 1.40],
                [45270000000, 0.55],
                [46047600000, 0.20],
                [46220400000, 0.00]
            ],
            visible: false
        }, {
            name: '2008',
            data: [
                [25916400000, 0.00],
                [27043200000, 0.60],
                [27734400000, 0.70],
                [28944000000, 0.80],
                [29548800000, 0.60],
                [30153600000, 0.60],
                [31190400000, 0.67],
                [31536000000, 0.81],
                [32140800000, 0.78],
                [32486400000, 0.98],
                [33782400000, 1.84],
                [34992000000, 1.80],
                [35683200000, 1.80],
                [36201600000, 1.92],
                [36892800000, 2.49],
                [37497600000, 2.79],
                [37843200000, 2.73],
                [38707200000, 2.61],
                [39481200000, 2.76],
                [39826800000, 2.82],
                [40431600000, 2.80],
                [42159600000, 2.10],
                [44146800000, 1.10],
                [45356400000, 0.25],
                [45615600000, 0.00]
            ],
            visible: false
        }, {
            name: '2009',
            data: [
                [25138800000, 0.00],
                [25830000000, 0.20],
                [28857600000, 0.47],
                [29721600000, 0.55],
                [30931200000, 1.38],
                [32140800000, 1.38],
                [32745600000, 1.38],
                [34214400000, 1.38],
                [34819200000, 1.48],
                [35942400000, 1.50],
                [37584000000, 1.89],
                [38707200000, 2.00],
                [39654000000, 1.94],
                [40086000000, 1.91],
                [40431600000, 1.75],
                [40950000000, 1.60],
                [44060400000, 0.60],
                [44578800000, 0.35],
                [45183600000, 0.00]
            ],
            visible: false
        }, {
            name: '2010',
            data: [
                [24361200000, 0.00],
                [24793200000, 0.15],
                [28598400000, 0.35],
                [29808000000, 0.46],
                [31536000000, 0.59],
                [33523200000, 0.58],
                [34214400000, 0.62],
                [34732800000, 0.65],
                [36115200000, 0.77],
                [37238400000, 0.77],
                [37756800000, 0.79],
                [38620800000, 0.86],
                [39654000000, 0.80],
                [40863600000, 0.94],
                [41382000000, 0.90],
                [43282800000, 0.39],
                [43714800000, 0.00]
            ],
            visible: true
        }, {
            name: '2011',
            data: [
                [25052400000, 0.00],
                [25484400000, 0.18],
                [26697600000, 0.32],
                [27388800000, 0.40],
                [27993600000, 0.38],
                [29808000000, 0.40],
                [31104000000, 0.56],
                [33004800000, 1.07],
                [33436800000, 1.00],
                [34905600000, 1.78],
                [35596800000, 1.60],
                [36374400000, 1.57],
                [37756800000, 1.96],
                [38188800000, 1.82],
                [38793600000, 1.80],
                [39308400000, 1.90],
                [40518000000, 1.68],
                [41295600000, 1.25],
                [42505200000, 0.85],
                [43974000000, 0.00]
            ],
            visible: true
        }, {
            name: '2012',
            data: [
                [27043200000, 0.00],
                [27475200000, 0.05],
                [28512000000, 0.20],
                [29635200000, 0.65],
                [30240000000, 1.18],
                [31276800000, 1.17],
                [31968000000, 1.60],
                [32659200000, 2.04],
                [33177600000, 2.22],
                [34473600000, 2.00],
                [36374400000, 2.53],
                [36892800000, 2.16],
                [38188800000, 2.35],
                [39308400000, 2.03],
                [39826800000, 2.11],
                [41209200000, 2.15],
                [41727600000, 2.05],
                [43196400000, 2.28],
                [43974000000, 1.65],
                [44233200000, 1.45],
                [44838000000, 1.25],
                [45356400000, 0.97],
                [46047600000, 0.50],
                [46825200000, 0.00]
            ],
            visible: true
        }, {
            name: '2013',
            data: [
                [25311600000, 0.00],
                [26524800000, 0.28],
                [26956800000, 0.25],
                [28512000000, 0.20],
                [28944000000, 0.28],
                [31017600000, 0.28],
                [31276800000, 0.47],
                [32400000000, 0.79],
                [33696000000, 0.72],
                [34387200000, 1.02],
                [35078400000, 1.12],
                [36288000000, 1.20],
                [37497600000, 1.18],
                [40172400000, 1.19],
                [41900400000, 1.85],
                [42246000000, 2.22],
                [43455600000, 1.15],
                [44751600000, 0.00]
            ],
            visible: true
        }, {
            type: 'spline',
            name: '2014',
            data: [[26049600000, 0.00], [27000000000, 0.40], [28900800000, 0.25], [31579200000, 1.66], [32356800000, 1.80], [35812800000, 1.76], [38750400000, 2.62], [40906800000, 2.41], [41857200000, 2.05], [43066800000, 1.70], [43930800000, 1.10], [45399600000, 0.00]],
            visible: true
        }, {
            type: 'areaspline',
            name: '2015',
            color: '#FFFFFF',
            lineWidth: 3,
            marker: {
                enabled: true
            },
            fillColor: 'rgba(170, 238, 238, .4)',
            data: [[28382400000, 0.00], [29332800000, 0.25], [30542400000, 1.41], [30974400000, 1.64], [31838400000, 1.60], [32961600000, 2.55], [33566400000, 2.62], [34516800000, 2.50], [35380800000, 2.42], [37108800000, 2.74], [37800000000, 2.62], [38664000000, 2.60], [39438000000, 2.81], [40302000000, 2.63], [41684400000, 2.77], [43239600000, 2.36]],
            visible: true
        }]
    });
});