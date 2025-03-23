class Sector extends ZL.Shape {
    SECTOR_SHOW_SIZE = 50

    constructor(data, size) {
        super();

        this.setGeoCoord([data[0], data[1]]);

        this._azimuths = data[2];
        this._size = size;

        this.__buildBts();
    }

    __buildBts() {
        this._site = ZL.createBasicShape("circle", "grey", [0, 0, 0.125, 0.125]);
        this._site.setSize([this._size, this._size]);
        this._site.setAttr({
            style: {
                strokeNoScale: true,
                stroke: "white",
                lineWidth: 2
            },
            z: this._azimuths.length
        });
        this.add(this._site);

        this.updateSectorGroup();
    }

    __initalSectorGroup(sectorShape, series, api) {
        var azimuthMap = {};

        var onMouseoverSector = function(e) {
            e.target.setAttr({style: {stroke: 'blue'}});
        };

        var onMouseoutSector = function(e) {
            e.target.setAttr({style: {stroke: 'white'}});
        };

        for (var i = 0; i < _azimuths.length; i++) {
            var azimuth = parseInt(_azimuths[i][0]);
            if (!isNaN(azimuth) && azimuth >= 0 && azimuth <= 360) {
                if (azimuth === 360) {
                    azimuth = 0;
                }

                if (azimuthMap.hasOwnProperty(azimuth)) {
                    azimuthMap[azimuth] = azimuthMap[azimuth] + 1;
                }
                else {
                    azimuthMap[azimuth] = 0;
                }

                // x + w / 2, y: acme, [x + w|y + h, x|y + h]
                var sector = ZL.createBasicShape("sector", "grey", [0, azimuthMap[azimuth] * 0.5 + 0.2, 0, 1, 75, 105]);
                sector.setAttr({
                    style: {
                        strokeNoScale: true,
                        stroke: "white",
                        lineWidth: 2
                    },
                    z2: 99,
                    z: _azimuths.length - (i + 1),
                    scale: [0.5, 0.5],
                    rotation: (180 - azimuth) * Math.PI / 180,
                    sectorIndex: i
                });

                sector.on('mouseover', onMouseoverSector).on('mouseout', onMouseoutSector);
                this.sectorGroup.add(sector);
            }
        }
    }

    updateSectorGroup() {
        if (this._size > this.SECTOR_SHOW_SIZE) {
            if (!this.sectorGroup) {
                this.sectorGroup = new Group();
                this.add(this.sectorGroup);
                this.sectorGroup.attr({scale: [this._size, this._size]});
            }
            if (this.sectorGroup.childCount() === 0) {
                this.__initalSectorGroup(this, series, this._api);
            }
         }
        else {
            if (this.sectorGroup) {
                this.sectorGroup.removeAll();
            }
        }
    }
}

function loadSectorData() {
    var getRandom = function(min, max) {
        var range = max - min;   
        var rand = Math.random();   
        return(min + Math.round(rand * range));
    };

    var sector_data = [
        [11.593516,49.985202],
        [13.163393,52.543724],
        [9.870317,51.477249],
        [13.233432,52.429967],
        [13.267365,52.399959],
        [13.246117,52.399168],
        [10.640204,52.271617],
        [10.901405,49.909524],
        [8.722759,52.109029],
        [8.809202,52.163507],
        [8.77898,52.139673],
        [13.297468,52.577423],
        [11.478448,53.874263],
        [12.289631,51.637917],
        [11.943471,50.887979],
        [13.858256,51.164365],
        [13.846283,51.159064],
        [13.456161,52.338488],
        [9.889346,49.810795],
        [13.768405,51.172834],
        [9.768229,52.364673],
        [9.793002,49.772211]
    ];

    var AzimuthList = [0, 20, 110, 140, 150, 230, 360];
    for (var i = 0; i < sector_data.length; i++) {
        sector_data[i].push([]);
        for (var j = 0; j < 6; j++) {
            var index = getRandom(0, 6);
            sector_data[i][2].push([AzimuthList[index], getRandom(20000, 40000), getRandom(10, 30), getRandom(1, 30), getRandom(500, 3000)]);
        }
    }

    var series = {
        name: 'MCC 262',
        type: 'sector',
        data: sector_data,
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
                return new Sector(data, size);
            }
        }
    };

    return series;
}
