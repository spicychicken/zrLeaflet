class Sector extends ZL.Shape {
    SECTOR_SHOW_SIZE = 50

    constructor(data, options = {}) {
        super();

        this.setGeoCoord([data[1], data[0]]);
        this._azimuths = data[2];
        this._converage = data[3];
        this._options = options;

        this.__createSectorShape();
        
        this.rippleGroup = new ZL.Z.Group();
        this.add(this.rippleGroup);
    }

    __createSectorShape() {
        this._site = ZL.createShape("circle", {cx: 0, cy: 0, r: 0.125});
        this._site.setColor("grey");
        this._site.setAttr({
            style: {
                strokeNoScale: true,
                stroke: "white",
                lineWidth: 2
            },
            z: this._azimuths.length
        });
        this.add(this._site);
    }

    __initalSectorGroup() {
        var azimuthMap = {};

        var onMouseoverSector = function(e) {
            e.target.setAttr({style: {stroke: 'blue'}});
        };

        var onMouseoutSector = function(e) {
            e.target.setAttr({style: {stroke: 'white'}});
        };

        for (var i = 0; i < this._azimuths.length; i++) {
            var azimuth = parseInt(this._azimuths[i][0]);
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
                var sector = ZL.createShape("sector", {cx: 0, cy: azimuthMap[azimuth] * 0.5 + 0.2, r0: 0, r: 1, 
                                    startAngle: 75 * Math.PI / 180, endAngle: 105 * Math.PI / 180});
                sector.setColor("grey");
                sector.setAttr({
                    style: {
                        strokeNoScale: true,
                        stroke: "white",
                        lineWidth: 2
                    },
                    z2: 99,
                    z: this._azimuths.length - (i + 1),
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
                this.sectorGroup = new ZL.Z.Group();
                this.add(this.sectorGroup);
                this.sectorGroup.attr({scale: [this._size, this._size]});
            }
            if (this.sectorGroup.childCount() === 0) {
                this.__initalSectorGroup();
            }
         }
        else {
            if (this.sectorGroup) {
                this.sectorGroup.removeAll();
            }
        }
    }

    calcSize(zrView) {
        var DEFAULT_SECTOR_SIZE_COVERAGE = '5km';
        var MAX_SIZE_OF_SECTOR = 70;
        var MIN_SIZE_OF_SECTOR = 40;

        var size = zrView.lengthToDistance(DEFAULT_SECTOR_SIZE_COVERAGE);
        size = size > MAX_SIZE_OF_SECTOR ? MAX_SIZE_OF_SECTOR : size;
        size = size < MIN_SIZE_OF_SECTOR ? MIN_SIZE_OF_SECTOR : size;
        return size;
    }

    updateLayout(zrView) {
        var pos = zrView.latLonToContainerPosition(this.getGeoCoord());
        this.setPosition([pos.x, pos.y]);

        this._size = this.calcSize(zrView);
        this._site.setSize([this._size, this._size]);
        this.updateSectorGroup();

        // update ripple
        if (this._options["converage"]) {
            this.updateRipple();
        }
    }

    updateRipple() {
        var effectCfg = {};

        effectCfg.rippleScale = this._converage / this._size;
        effectCfg.brushType = this._options['rippleEffect']["brushType"];
        effectCfg.period = this._options['rippleEffect']["period"] * 1000;
        effectCfg.color = "lime";

        this.off('mouseover').off('mouseout').off('emphasis').off('normal');

        if (!this._effectCfg) {
            this.startEffectAnimation(effectCfg);
        }

        this._effectCfg = effectCfg;
    }

    startEffectAnimation(effectCfg) {
        var EFFECT_RIPPLE_NUMBER = 1;
        var rippleGroup = this.rippleGroup;

        var getRandom = function(min, max) {
            var range = max - min;   
            var rand = Math.random();   
            return(min + Math.round(rand * range));
        };

        for (var i = 0; i < EFFECT_RIPPLE_NUMBER; i++) {
            var ripplePath = ZL.createShape("circle", {cx: 0, cy: 0, r: 2});
            ripplePath.setColor(effectCfg.color)
            ripplePath.attr({
                style: {
                    strokeNoScale: true,
                    stroke: effectCfg.brushType === 'stroke' ? effectCfg.color : null,
                    fill: effectCfg.brushType === 'fill' ? effectCfg.color : null,
                    shadowColor: "rgba(30,144,255,0.5)",
                    shadowBlur : 10
                },
                zlevel: 10,
                z2: 99,
                silent: true,
                scale: [0.5, 0.5]
            });

            // + random offset
            var delay = -i / EFFECT_RIPPLE_NUMBER * effectCfg.period + getRandom(500, 1000);
            ripplePath.animate('', true)
                .when(effectCfg.period, {
                    scale: [effectCfg.rippleScale, effectCfg.rippleScale]
                })
                .delay(delay)
                .start();
            ripplePath.animateStyle(true)
                .when(effectCfg.period, {
                    opacity: 0
                })
                .delay(delay)
                .start();

            rippleGroup.add(ripplePath); 
        }
    }

    stopEffectAnimation() {
        this.rippleGroup.removeAll();
    };
}

class SectorVisual extends ZL.Visual {
    constructor(series) {
        super(series);

        this.options = series["options"];
    }

    prepareData(callback) {
        var data = this._series["data"];
        for (var i = 0; i < data.length; ++i) {
            callback(["rectangle", {x: data[i][0], y: data[i][1], width: 0.05, height: 0.05, data: {"index": i}}]);
        }
    }

    newShape(index, zrView) {
        var data = this.getSeriesData()[index];
        var shape = new Sector(data, this.options);

        shape.updateLayout(zrView);
        return shape;
    }

    updateShape(shape, zrView) {
        shape.updateLayout(zrView);
    }
}

ZL.Visual.registerVisual("sector", SectorVisual);

function getSectorData() {
    var getRandom = function(min, max) {
        var range = max - min;   
        var rand = Math.random();   
        return(min + Math.round(rand * range));
    };

    // lng, lat
    var sector_data = [
        [111.593516,29.985202],
        [113.163393,32.543724],
        [109.870317,31.477249],
        [113.233432,32.429967],
        [113.267365,32.399959],
        [113.246117,32.399168],
        [110.640204,32.271617],
        [110.901405,29.909524],
        [108.722759,32.109029],
        [108.809202,32.163507],
        [108.77898,32.139673],
        [113.297468,32.577423],
        [111.478448,33.874263],
        [112.289631,31.637917],
        [111.943471,30.887979],
        [113.858256,31.164365],
        [113.846283,31.159064],
        [113.456161,32.338488],
        [109.889346,29.810795],
        [113.768405,31.172834],
        [109.768229,32.364673],
        [109.793002,29.772211]
    ];

    var AzimuthList = [0, 20, 110, 140, 150, 230, 360];
    for (var i = 0; i < sector_data.length; i++) {
        sector_data[i].push([]);
        for (var j = 0; j < 6; j++) {
            var index = getRandom(0, 6);
            sector_data[i][2].push([AzimuthList[index], getRandom(20000, 40000), getRandom(10, 30), getRandom(1, 30), getRandom(500, 3000)]);
        }
        sector_data[i].push(getRandom(500, 3000));
    }
    return sector_data;
}

function loadSectorData() {
    var sector_data = getSectorData();

    return {
        name: 'sector',
        type: 'sector',
        data: sector_data
    };
}

function loadSectorDataWithConverage() {
    var sector_data = getSectorData();

    return {
        name: 'sector',
        type: 'sector',
        data: sector_data,

        options: {
            converage: true,
            // from echats
            rippleEffect: {
                period: 4,
                // Brush type can be fill or stroke
                brushType: 'stroke'
            }
        }
    };
}