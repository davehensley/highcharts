$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "lv-an",
            "value": 0
        },
        {
            "hc-key": "lv-jj",
            "value": 1
        },
        {
            "hc-key": "lv-vc",
            "value": 2
        },
        {
            "hc-key": "lv-r",
            "value": 3
        },
        {
            "hc-key": "lv-me",
            "value": 4
        },
        {
            "hc-key": "lv-jp",
            "value": 5
        },
        {
            "hc-key": "lv-jk",
            "value": 6
        },
        {
            "hc-key": "lv-rb",
            "value": 7
        },
        {
            "hc-key": "lv-kt",
            "value": 8
        },
        {
            "hc-key": "lv-sc",
            "value": 9
        },
        {
            "hc-key": "lv-ak",
            "value": 10
        },
        {
            "hc-key": "lv-og",
            "value": 11
        },
        {
            "hc-key": "lv-ko",
            "value": 12
        },
        {
            "hc-key": "lv-sr",
            "value": 13
        },
        {
            "hc-key": "lv-pl",
            "value": 14
        },
        {
            "hc-key": "lv-vt",
            "value": 15
        },
        {
            "hc-key": "lv-je",
            "value": 16
        },
        {
            "hc-key": "lv-oz",
            "value": 17
        },
        {
            "hc-key": "lv-rd",
            "value": 18
        },
        {
            "hc-key": "lv-vl",
            "value": 19
        },
        {
            "hc-key": "lv-ba",
            "value": 20
        },
        {
            "hc-key": "lv-bl",
            "value": 21
        },
        {
            "hc-key": "lv-ka",
            "value": 22
        },
        {
            "hc-key": "lv-zi",
            "value": 23
        },
        {
            "hc-key": "lv-dd",
            "value": 24
        },
        {
            "hc-key": "lv-lv",
            "value": 25
        },
        {
            "hc-key": "lv-se",
            "value": 26
        },
        {
            "hc-key": "lv-ad",
            "value": 27
        },
        {
            "hc-key": "lv-cr",
            "value": 28
        },
        {
            "hc-key": "lv-ga",
            "value": 29
        },
        {
            "hc-key": "lv-in",
            "value": 30
        },
        {
            "hc-key": "lv-br",
            "value": 31
        },
        {
            "hc-key": "lv-ju",
            "value": 32
        },
        {
            "hc-key": "lv-kg",
            "value": 33
        },
        {
            "hc-key": "lv-bd",
            "value": 34
        },
        {
            "hc-key": "lv-ik",
            "value": 35
        },
        {
            "hc-key": "lv-kk",
            "value": 36
        },
        {
            "hc-key": "lv-ol",
            "value": 37
        },
        {
            "hc-key": "lv-bb",
            "value": 38
        },
        {
            "hc-key": "lv-ml",
            "value": 39
        },
        {
            "hc-key": "lv-rp",
            "value": 40
        },
        {
            "hc-key": "lv-ss",
            "value": 41
        },
        {
            "hc-key": "lv-su",
            "value": 42
        },
        {
            "hc-key": "lv-sp",
            "value": 43
        },
        {
            "hc-key": "lv-am",
            "value": 44
        },
        {
            "hc-key": "lv-vm",
            "value": 45
        },
        {
            "hc-key": "lv-be",
            "value": 46
        },
        {
            "hc-key": "lv-er",
            "value": 47
        },
        {
            "hc-key": "lv-vr",
            "value": 48
        },
        {
            "hc-key": "lv-km",
            "value": 49
        },
        {
            "hc-key": "lv-lg",
            "value": 50
        },
        {
            "hc-key": "lv-bt",
            "value": 51
        },
        {
            "hc-key": "lv-na",
            "value": 52
        },
        {
            "hc-key": "lv-ce",
            "value": 53
        },
        {
            "hc-key": "lv-pg",
            "value": 54
        },
        {
            "hc-key": "lv-pu",
            "value": 55
        },
        {
            "hc-key": "lv-vb",
            "value": 56
        },
        {
            "hc-key": "lv-sm",
            "value": 57
        },
        {
            "hc-key": "lv-rn",
            "value": 58
        },
        {
            "hc-key": "lv-lu",
            "value": 59
        },
        {
            "hc-key": "lv-ci",
            "value": 60
        },
        {
            "hc-key": "lv-l",
            "value": 61
        },
        {
            "hc-key": "lv-vg",
            "value": 62
        },
        {
            "hc-key": "lv-bu",
            "value": 63
        },
        {
            "hc-key": "lv-dg",
            "value": 64
        },
        {
            "hc-key": "lv-lm",
            "value": 65
        },
        {
            "hc-key": "lv-gu",
            "value": 66
        },
        {
            "hc-key": "lv-ma",
            "value": 67
        },
        {
            "hc-key": "lv-ta",
            "value": 68
        },
        {
            "hc-key": "lv-jg",
            "value": 69
        },
        {
            "hc-key": "lv-tu",
            "value": 70
        },
        {
            "hc-key": "lv-jm",
            "value": 71
        },
        {
            "hc-key": "lv-mr",
            "value": 72
        },
        {
            "hc-key": "lv-lj",
            "value": 73
        },
        {
            "hc-key": "lv-vs",
            "value": 74
        },
        {
            "hc-key": "lv-kn",
            "value": 75
        },
        {
            "hc-key": "lv-kd",
            "value": 76
        },
        {
            "hc-key": "lv-au",
            "value": 77
        },
        {
            "hc-key": "lv-az",
            "value": 78
        },
        {
            "hc-key": "lv-pk",
            "value": 79
        },
        {
            "hc-key": "lv-rc",
            "value": 80
        },
        {
            "hc-key": "lv-gr",
            "value": 81
        },
        {
            "hc-key": "lv-ni",
            "value": 82
        },
        {
            "hc-key": "lv-as",
            "value": 83
        },
        {
            "hc-key": "lv-pt",
            "value": 84
        },
        {
            "hc-key": "lv-vn",
            "value": 85
        },
        {
            "hc-key": "lv-dn",
            "value": 86
        },
        {
            "hc-key": "lv-rr",
            "value": 87
        },
        {
            "hc-key": "lv-ne",
            "value": 88
        },
        {
            "hc-key": "lv-ag",
            "value": 89
        },
        {
            "hc-key": "lv-il",
            "value": 90
        },
        {
            "hc-key": "lv-aj",
            "value": 91
        },
        {
            "hc-key": "lv-en",
            "value": 92
        },
        {
            "hc-key": "lv-sl",
            "value": 93
        },
        {
            "hc-key": "lv-ap",
            "value": 94
        },
        {
            "hc-key": "lv-si",
            "value": 95
        },
        {
            "hc-key": "lv-mz",
            "value": 96
        },
        {
            "hc-key": "lv-ru",
            "value": 97
        },
        {
            "hc-key": "lv-kr",
            "value": 98
        },
        {
            "hc-key": "lv-sa",
            "value": 99
        },
        {
            "hc-key": "lv-al",
            "value": 100
        },
        {
            "hc-key": "lv-st",
            "value": 101
        },
        {
            "hc-key": "lv-rj",
            "value": 102
        },
        {
            "hc-key": "lv-do",
            "value": 103
        },
        {
            "hc-key": "lv-vd",
            "value": 104
        },
        {
            "hc-key": "lv-dr",
            "value": 105
        },
        {
            "hc-key": "lv-ll",
            "value": 106
        },
        {
            "hc-key": "lv-ie",
            "value": 107
        },
        {
            "hc-key": "lv-te",
            "value": 108
        },
        {
            "hc-key": "lv-vv",
            "value": 109
        },
        {
            "hc-key": "lv-pr",
            "value": 110
        },
        {
            "hc-key": "lv-vi",
            "value": 111
        },
        {
            "hc-key": "lv-cv",
            "value": 112
        },
        {
            "hc-key": "lv-ja",
            "value": 113
        },
        {
            "hc-key": "lv-dv",
            "value": 114
        },
        {
            "hc-key": "lv-rk",
            "value": 115
        },
        {
            "hc-key": "lv-lb",
            "value": 116
        },
        {
            "hc-key": "lv-vx",
            "value": 117
        },
        {
            "hc-key": "lv-sk",
            "value": 118
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="http://code.highcharts.com/mapdata/countries/lv/lv-all.js">Latvia</a>'
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        colorAxis: {
            min: 0
        },

        series : [{
            data : data,
            mapData: Highcharts.maps['countries/lv/lv-all'],
            joinBy: 'hc-key',
            name: 'Random data',
            states: {
                hover: {
                    color: '#BADA55'
                }
            },
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            }
        }]
    });
});
