class Bts extends ZL.Shape {
    SECTOR_SHOW_SIZE = 50

    constructor(data, size) {
        super();

        setGeoCoordinate(data[0], data[1]);
        this._azimutsh = data[2];
        this._size = size;

        this.__buildBts()
    }

    __buildBts() {
        this._site = ZL.createBasicShape("circle", "grey", [0, 0, 0.125, 0.125]);
        this._site.setSize([this._size, this._size]);
        this._site.setAttr({
            style: {
                strokeNoScale: true,
                stroke: series.getStyleByName('siteBorderColor'),
                lineWidth: 2
            },
            z: this._azimuths.length
        });
        this.add(this._site);

        updateSectorGroup();
    }

    __initalSectorGroup(sectorShape, series, api) {
        var azimuthMap = {};

        var onMouseoverSector = function(e) {
            e.target.setAttr({style: {stroke: 'blue'}});
        };

        var onMouseoutSector = function(e) {
            e.target.setAttr({style: {stroke: 'white'}});
        };

        for (var i = 0; i < sectorValue.length; i++) {
            var azimuth = _azimuths[i];
            if ((series.type === 'sector') && !isNaN(azimuth) && (parseFloat(azimuth) >= 0) && (parseFloat(azimuth) <= 360)) {
                if (parseFloat(azimuth) === parseFloat(360)) {
                    azimuth = 0;
                }
                if (azimuthMap.hasOwnProperty(parseInt(azimuth))) {
                    azimuthMap[parseInt(azimuth)] = azimuthMap[parseInt(azimuth)] + 1;
                }
                else {
                    azimuthMap[parseInt(azimuth)] = 0;
                }

                var sectorColor = series.getStyleByName('sectorColor');
                var groupName = '';
                for (var groupIndex = 0; groupIndex < dataGroupIndex.length; groupIndex++) {
                    var value = dataGroupIndex[groupIndex];
                    if (groupName !== ''){
                        groupName = groupName + '.' + sectorValue[i][value];
                    } else {
                        groupName = sectorValue[i][value];
                    }
                }

                var color = dataGroupColor[groupName];
                if (color !== undefined) {
                    sectorColor = color;
                }

                // x + w / 2, y: acme, [x + w|y + h, x|y + h]
                var sector = ShapeUtils.createShape(series.getStyleByName('sectorType'), sectorColor, 
                    [0, azimuthMap[parseInt(azimuth)] * 0.5 + 0.2, 0, 1, 75, 105]);
                sector.setAttr({
                    style: {
                        strokeNoScale: true,
                        stroke: series.getStyleByName('sectorBorderColor'),
                        lineWidth: 2
                    },
                    z2: 99,
                    z: sectorValue.length - (i + 1),
                    scale: [0.5, 0.5],
                    rotation: (180 - parseFloat(azimuth)) * Math.PI / 180,
                    sectorIndex: i
                });

                sector.on('mouseover', onMouseoverSector).on('mousemove', onMousemoveSector).on('mouseout', onMouseoutSector);
                sectorShape.sectorGroup.add(sector);
            }
        }
    }

    updateSectorGroup() {
        if (this._size > SECTOR_SHOW_SIZE) {
            if (!this.sectorGroup) {
                this.sectorGroup = new Group();
                this.add(this.sectorGroup);
                this.sectorGroup.attr({scale: [this._size, this._size]});
            }
            if (this.sectorGroup.childCount() === 0) {
                __initalSectorGroup(this, series, this._api);
            }
         }
        else {
            if (this.sectorGroup) {
                this.sectorGroup.removeAll();
            }
        }
    }
}

function loadDemo1Data() {
    var getRandom = function(min, max) {
        var range = max - min;   
        var rand = Math.random();   
        return(min + Math.round(rand * range));
    };

    var germany_data = [
        [11.593516,49.985202,'1094m','up','WCDMA'],
        [13.163393,52.543724,'2369m','error','GSM'],
        [9.870317,51.477249,'597m','up','GSM'],
        [13.233432,52.429967,'1201m','down','GSM'],
        [13.267365,52.399959,'1549m','up','GSM'],
        [13.246117,52.399168,'1118m','up','GSM'],
        [10.640204,52.271617,'862m','up','GSM'],
        [10.901405,49.909524,'170m','warning','GSM'],
        [8.722759,52.109029,'891m','up','GSM'],
        [8.809202,52.163507,'918m','up','GSM'],
        [8.77898,52.139673,'106m','up','GSM'],
        [13.297468,52.577423,'340m','up','WCDMA'],
        [11.478448,53.874263,'1248m','up','LTE'],
        [12.289631,51.637917,'2872m','up','GSM'],
        [11.943471,50.887979,'959m','up','GSM'],
        [13.858256,51.164365,'278m','up','GSM'],
        [13.846283,51.159064,'326m','up','GSM'],
        [13.456161,52.338488,'1196m','up','LTE'],
        [9.889346,49.810795,'1945m','error','GSM'],
        [13.768405,51.172834,'2026m','up','GSM'],
        [9.768229,52.364673,'400m','up','GSM'],
        [9.793002,49.772211,'2084m','up','GSM'],
        [10.088693,53.223911,'2726m','up','GSM'],
        [10.123336,53.214304,'1838m','up','GSM'],
        [10.086607,53.240546,'1180m','up','GSM'],
        [9.883784,51.479317,'2809m','up','LTE'],
        [9.870908,51.467942,'2062m','up','GSM'],
        [11.019411,49.321793,'648m','up','GSM'],
        [11.010756,49.321701,'1985m','up','GSM'],
        [10.976051,49.313627,'557m','up','GSM'],
        [11.015532,49.321247,'2009m','warning','GSM'],
        [11.015893,49.322024,'591m','up','GSM'],
        [11.049319,49.394576,'370m','up','LTE'],
        [10.998127,49.284636,'1979m','up','GSM'],
        [10.901545,49.918681,'2316m','up','LTE'],
        [10.885629,49.915182,'2761m','up','GSM'],
        [11.032059,49.412524,'792m','up','GSM'],
        [10.991906,49.416974,'337m','up','GSM'],
        [11.0194,49.415331,'334m','warning','GSM'],
        [11.007555,49.404161,'705m','up','GSM'],
        [11.057551,49.404615,'2863m','up','GSM'],
        [11.033892,49.431364,'2985m','down','GSM'],
        [9.410189,49.334336,'1219m','up','GSM'],
        [9.400004,49.310578,'2367m','up','GSM'],
        [9.401874,49.312306,'2568m','up','LTE'],
        [9.485874,49.281936,'1975m','up','GSM'],
        [9.420833,49.358131,'1337m','up','GSM'],
        [9.254747,49.054678,'1368m','up','GSM'],
        [9.271686,49.060456,'2540m','up','GSM'],
        [9.237832,49.014869,'2787m','up','GSM'],
        [9.548778,54.497449,'2215m','up','GSM'],
        [9.566412,54.496118,'2596m','up','GSM'],
        [9.78395,53.647962,'1520m','warning','GSM'],
        [9.752818,53.666822,'380m','up','LTE'],
        [8.908899,50.150115,'1969m','up','GSM'],
        [13.657414,51.088908,'2546m','up','GSM'],
        [13.679233,51.077837,'2204m','warning','GSM'],
        [13.679149,51.072244,'651m','up','GSM'],
        [13.673584,51.079486,'529m','down','GSM'],
        [13.6948,51.089143,'883m','up','GSM'],
        [13.693147,51.086102,'490m','up','GSM'],
        [13.690678,51.07366,'2627m','up','GSM'],
        [13.67051,51.086052,'2995m','up','GSM'],
        [13.707586,51.090539,'1570m','up','GSM'],
        [13.702858,51.089641,'2475m','up','GSM'],
        [13.649134,51.083706,'2152m','up','GSM'],
        [13.657355,51.049236,'1846m','down','GSM'],
        [7.347317,51.451694,'1963m','up','LTE'],
        [7.635981,51.505468,'2645m','up','GSM'],
        [7.564682,51.920369,'2447m','up','GSM'],
        [13.667377,51.076173,'651m','up','GSM'],
        [7.585338,51.906133,'2830m','up','GSM'],
        [7.584308,51.89805,'2948m','up','GSM'],
        [7.520553,51.865743,'542m','up','GSM'],
        [13.8391,52.26575,'2740m','up','GSM'],
        [10.159498,54.323243,'409m','up','GSM'],
        [10.173961,54.337666,'705m','up','GSM'],
        [10.151304,54.351293,'2691m','up','GSM'],
        [10.160805,54.326689,'392m','up','GSM'],
        [10.15946,54.32164,'2371m','up','GSM'],
        [10.163842,54.328575,'2663m','down','GSM'],
        [10.152159,54.360047,'2258m','up','GSM'],
        [10.155349,54.333622,'2004m','up','GSM'],
        [10.173517,54.325783,'785m','up','GSM'],
        [10.146497,54.354285,'1328m','up','GSM'],
        [10.157496,54.320437,'2029m','up','GSM'],
        [10.14555,54.338535,'1148m','error','GSM'],
        [10.111766,54.312054,'2109m','up','GSM'],
        [10.147388,54.308392,'2811m','error','GSM'],
        [10.120104,54.331243,'2948m','warning','GSM'],
        [10.121931,54.363163,'945m','up','GSM'],
        [10.114003,54.340016,'572m','up','LTE'],
        [10.134322,54.312716,'2177m','up','GSM'],
        [10.121235,54.350394,'1215m','up','GSM'],
        [10.179788,54.326785,'2515m','up','GSM'],
        [10.13782,54.300222,'2257m','up','GSM'],
        [10.137181,54.304811,'1912m','up','GSM'],
        [10.133738,54.304617,'1240m','warning','GSM'],
        [10.147445,54.315591,'2435m','up','GSM'],
        [10.11487,54.306062,'2485m','up','GSM'],
        [6.608545,51.731429,'613m','up','GSM'],
        [6.612656,51.744346,'1273m','up','GSM'],
        [13.677745,51.081026,'1277m','up','GSM'],
        [13.710136,51.076655,'448m','warning','GSM'],
        [7.895089,52.243826,'2994m','up','GSM'],
        [13.278855,52.31001,'948m','up','GSM'],
        [9.706555,49.756809,'2877m','up','GSM'],
        [7.2606,51.2749,'782m','up','GSM'],
        [7.2244,51.2376,'802m','up','GSM'],
        [7.2411,51.2748,'2850m','warning','GSM'],
        [13.720136,51.159063,'610m','up','GSM'],
        [13.732139,51.135204,'922m','up','GSM'],
        [7.663027,51.523509,'2744m','up','GSM'],
        [13.33885,52.374445,'1910m','up','GSM'],
        [13.276067,52.364913,'759m','up','GSM'],
        [13.303106,52.36529,'1664m','up','GSM'],
        [7.2606,51.2749,'1069m','up','GSM'],
        [7.2606,51.2749,'989m','up','GSM'],
        [7.2489,51.2996,'1907m','up','GSM'],
        [13.783049,51.093229,'626m','up','GSM'],
        [13.75089,51.093208,'703m','up','GSM'],
        [13.738858,51.089307,'2542m','up','GSM'],
        [13.720285,51.082179,'1758m','up','GSM'],
        [13.717419,51.050057,'949m','up','GSM'],
        [13.718801,51.049027,'2329m','up','GSM'],
        [13.706382,51.047956,'2967m','up','GSM'],
        [13.734088,51.083896,'1124m','up','GSM'],
        [13.750888,51.081831,'2853m','up','GSM'],
        [7.2299,51.2874,'224m','up','GSM'],
        [13.825043,51.170407,'1735m','up','GSM'],
        [13.836269,51.167476,'2630m','up','GSM'],
        [13.787419,51.155307,'210m','up','GSM'],
        [13.839027,51.181837,'663m','warning','GSM'],
        [13.867737,51.173843,'2754m','up','GSM'],
        [13.827135,51.155297,'2869m','up','GSM'],
        [13.818457,51.154699,'2034m','up','GSM'],
        [13.75153,51.154636,'2988m','warning','GSM'],
        [7.331312,51.434908,'744m','down','GSM'],
        [7.327808,51.442439,'1041m','up','GSM'],
        [7.331717,51.436134,'416m','up','GSM'],
        [7.329574,51.440708,'681m','up','GSM'],
        [7.277644,51.410889,'2166m','up','GSM'],
        [7.328057,51.443271,'2815m','up','GSM'],
        [7.357113,51.444138,'739m','up','GSM'],
        [13.73291,51.113468,'1407m','down','GSM'],
        [13.777844,51.145195,'2761m','error','GSM'],
        [7.324065,51.441291,'1258m','up','GSM'],
        [7.359048,51.445412,'1805m','warning','GSM'],
        [9.499786,54.555777,'101m','up','GSM'],
        [9.500764,54.547619,'1100m','up','GSM'],
        [9.584357,54.493781,'1303m','up','GSM'],
        [8.556898,49.794769,'1204m','up','GSM'],
        [9.166878,48.958231,'1940m','up','GSM'],
        [13.714777,51.055758,'1265m','up','GSM'],
        [13.711548,51.06514,'1529m','up','GSM'],
        [13.768923,51.062911,'1079m','up','GSM'],
        [7.86081,48.040557,'1551m','up','GSM'],
        [13.826387,51.154943,'1757m','up','GSM'],
        [13.822859,51.146117,'849m','up','GSM'],
        [13.823926,51.155658,'427m','up','GSM'],
        [13.749865,51.075968,'904m','up','GSM'],
        [7.2235,51.1535,'2712m','up','GSM'],
        [7.2145,51.1421,'864m','up','GSM'],
        [13.738164,51.100864,'1248m','up','GSM'],
        [7.086451,52.376859,'2108m','up','GSM'],
        [7.093143,52.348033,'2751m','up','GSM'],
        [13.55973,52.34241,'1641m','up','GSM'],
        [13.712445,51.049657,'2533m','warning','GSM']
    ];

    for (var i = 0; i < germany_data.length; i++) {
        germany_data[i].push([]);
        for (var j = 0; j < 6; j++) {
            germany_data[i][5].push([getRandom(20000, 40000), getRandom(10, 30), getRandom(1, 30), getRandom(500, 3000)]);
        }
    }

    var series = {
        name: 'MCC 262',
        type: 'bts',
        data: germany_data,
        draw: {
            size: 0,

            maxBoundingBox(data) {
                return ["rectangle", {x: data[0], y: data[1], width: 0.05, height: 0.05}];
            },

            beforeDraw(zrView) {
                var DEFAULT_SECTOR_SIZE_COVERAGE = '5km';
                var MAX_SIZE_OF_SECTOR = 70;
                var MIN_SIZE_OF_SECTOR = 40;

                size = zrView.lengthToDistance(DEFAULT_SECTOR_SIZE_COVERAGE);
                size = size > MAX_SIZE_OF_SECTOR ? MAX_SIZE_OF_SECTOR : size;
                size = size < MIN_SIZE_OF_SECTOR ? MIN_SIZE_OF_SECTOR : size;
            },

            createShape(data) {
                return new Bts(data);
            }
        }
    };

    return series;
}
