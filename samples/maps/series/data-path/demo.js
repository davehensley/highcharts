$(function () {

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Map with inline point paths'
        },

        colorAxis: {},

        legend: {
            align: 'left',
            floating: true,
            title: {
                text: 'Random data'
            }
        },

        series : [{
            data : [{
                name: "Northern Territory",
                value: 1,
                path: "M385,111,392,109,400,111,401,105,393,97,392,92,396,86,401,86,404,70,409,72,414,64,411,58,411,53,416,53,417,49,424,45,425,38,432,38,436,32,447,35,458,34,464,36,473,31,481,29,479,18,474,14,467,13,461,7,474,2,484,13,489,10,495,19,507,22,514,19,515,24,538,28,541,28,548,34,552,35,556,31,564,32,565,35,572,34,575,40,579,41,583,36,579,32,587,28,588,28,591,33,595,34,597,35,600,39,595,44,591,50,587,51,588,57,585,62,580,60,570,67,570,76,573,79,569,87,569,89,565,93,559,103,556,105,559,112,578,125,580,129,589,133,591,140,600,138,611,145,619,149,623,157,614,415,564,413,501,412,417,415,395,415zM407,24,417,26,425,22,433,25,444,18,448,12,448,6,442,5,428,10,418,7,414,9,410,15,410,17zM582,92,597,93,600,89,595,85,596,78,586,75,585,78,583,88z"
            }, {
                name: "Tasmania",
                value: 4,
                path: "M780,917,785,909,789,907,795,897,797,897,803,898,806,894,810,879,816,874,817,863,817,853,820,846C820,846,815,839,814,839,812,839,806,844,806,844L793,844,787,845,778,848,762,840,746,832,744,832,742,837,741,843,745,855,748,864,753,872,754,879,753,884,753,888,760,904,764,913,767,914,773,914,778,917zM811,813,815,810,816,810,820,815,822,820,822,826,818,827,814,822,812,816zM729,796,727,802,727,810,728,813,731,814,733,811,735,805,735,800,734,798,733,796z"
            }, {
                name: "Queensland",
                value: 2,
                path: "M628,159,635,162,646,166,653,171,658,181,667,185,677,193,685,191,694,190,700,182,706,171,712,162,717,147,718,137,725,120,722,112,724,98,723,92,720,86,724,78,728,72,727,61,732,58,736,54,729,48,740,30,745,13,746,8,752,5,757,0,759,1,759,5,765,10,765,32,769,35,773,38,769,45,777,55,777,59,780,67,778,85,782,98,784,107,790,110,797,104,805,103,807,111,818,121,823,125,822,140,825,152,824,159,823,167,835,191,839,198,838,209,834,217,841,220,840,232,839,237,846,246,857,253,868,254,870,260,872,267,884,269,889,280,893,276,901,284,899,290,904,303,910,315,912,335,912,345,919,346,921,349,922,337,927,340,938,353,943,361,940,377,952,394,960,396,964,403,966,411,975,418,977,425,980,431,984,435,983,444,987,451,986,454,983,459,984,479,983,484,979,483,982,490,986,500,985,513,973,514,963,510,947,518,946,526,940,525,938,525,933,530,931,531,932,526,928,522,925,518,919,516,912,516,909,510,897,513,889,508,882,511,875,518,795,510,751,505,691,501,685,501,691,419,618,415zM657,163,660,164,664,162,670,160,673,159,673,156,672,154,665,153,661,154,657,157,655,159,655,162zM987,432,989,439,992,440,997,434,999,425,993,421,990,423z",
                middleY: 0.7
            }, {
                name: "South Australia",
                value: 7,
                path: "M666,751,659,750,654,744,644,726,642,719,644,714,641,703,640,692,633,686,625,680,620,681,616,682,610,681,610,678,617,667,618,661,618,656,609,642,607,647,602,667,597,669,585,669,583,663,586,661,592,660,593,656,595,643,597,633,605,627,606,624,606,615,609,614,610,612,605,596,602,597,602,606,598,610,592,621,589,627,583,628,573,634,566,644,561,654,555,658,549,656,543,636,543,631,536,624,531,613,525,611,520,606,518,602,521,597,516,594,513,590,510,585,505,582,497,585,493,582,488,579,482,578,480,580,476,580,470,576,460,570,452,566,450,566,447,566,444,568,432,568,402,571,396,419,488,417,561,417,636,420,687,422,668,751zM577,678,577,684,581,687,586,687,600,686,606,681,600,675,595,675z",
                middleY: 0.3
            }, {
                name: "Western Australia",
                value: 3,
                path: "M380,107,364,104,357,102,341,87,333,84,326,80,320,80,316,83,318,88,314,90,312,88,301,92,296,104,291,101,279,106,274,113,280,119,278,119,274,121,275,130,268,128,260,135,259,139,260,144,262,148,258,154,259,158,249,157,243,155,239,157,240,161,238,168,246,176,244,181,241,178,239,192C239,192,234,190,233,188,231,185,223,167,223,167L223,165,219,167,209,179,203,187,202,195,205,203,208,211,204,216,194,225,189,244,182,253,166,262,161,266,147,269,143,273,129,270,124,278,122,281,106,285,103,288,99,294,89,297,78,296,69,297,62,301,52,313,42,326,28,333,22,338,19,354,15,357,11,357,9,341,5,342,0,362,6,370,7,376,5,390,2,399,2,412,9,420,13,430,24,442,31,450,31,462,24,458,9,444,8,450,16,459,21,466,10,464,12,469,28,487,34,498,36,506,52,526,61,539,63,552,64,561,70,574,85,596,89,605,91,627,93,639,92,645,90,654,86,655,79,652,79,658,80,670,83,675,89,673,100,677,108,685,116,688,130,688,145,687,159,681,164,677,171,667,179,665,184,662,186,654,196,648,218,645,231,642,243,645,263,641,266,641,271,642,280,638,286,629,289,616,292,613,303,611,332,592,341,591,360,592,371,586,388,576,398,572,380,109z"
            }, {
                name: "New South Wales",
                value: 9,
                path: "M686,505,760,511,815,516,876,523,884,515,890,514,895,515,906,515,910,517,913,518,918,519,922,522,924,524,928,528,928,533,932,534,936,532,939,527,943,530,949,530,951,525,950,520,963,515,968,516,973,519,986,516,985,529,979,542,973,557,966,572,966,582,962,592,956,605,951,611,947,617,944,624,926,636,912,653,907,664,901,674,897,689,890,696,881,706,876,718,872,731,869,749,866,752,832,730,833,723,831,717,831,709,822,705,811,706,801,704,789,704,776,699,767,695,759,697,759,700,759,703,758,704,754,702,749,692,742,686,734,681,732,677,728,672,730,664,725,661,716,658,711,662,708,654,707,649,698,642,693,641,688,643,678,639z",
                middleY: 0.4
            }, {
                name: "A.C.T.",
                value: 2,
                path: "M848,696,853,689,859,689,861,695,856,701,854,711,849,706,848,701z"
            }, {
                name: "Victoria",
                value: 3,
                path: "M677,643,670,753,683,762,689,758,698,761,711,769,722,777,744,766,749,762,755,753,758,758,755,765,754,769,766,776,774,780,776,784,795,780,811,765,825,761,842,760,858,761,864,755,829,732,828,728,829,722,827,720,826,712,822,710,816,709,811,711,804,709,800,707,794,710,789,708,774,703,769,701,763,701,762,706,759,708,754,707,749,700,745,692,737,686,730,684,726,677,726,669,724,664,719,663,715,662,711,665,707,659,704,656,704,651,695,646,691,647,685,646z",
                middleY: 0.6
            }],
            name: 'Random data',
            dataLabels: {
                enabled: true,
                format: '{point.name}',
                style: {
                    color: '#000000'
                }
            },
            states: {
                hover: {
                    color: '#BADA55'
                }
            }
        }]
    });
});