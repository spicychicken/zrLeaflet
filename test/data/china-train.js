function calculateCircleCenterAndRadius(x1, y1, x2, y2, thetaRadians) {
    // 计算弦长 L
    const dx = x2 - x1;
    const dy = y2 - y1;
    const L = Math.sqrt(dx * dx + dy * dy);

    // 计算半径 R
    const R = L / (2 * Math.sin(thetaRadians / 2));

    // 弦中点 M
    const Mx = (x1 + x2) / 2;
    const My = (y1 + y2) / 2;

    // 垂直平分线方向单位向量
    const perpDirX = -dy / L; // 垂直方向的分量
    const perpDirY = dx / L;

    // 圆心到弦中点的距离 d
    const d = R * Math.cos(thetaRadians / 2);

    // 圆心坐标（两种可能，需根据实际需求选择符号）
    const x0 = Mx + d * perpDirX; // 或 Mx - d * perpDirX
    const y0 = My + d * perpDirY; // 或 My - d * perpDirY

    return {
        center: { x: x0, y: y0 },
        radius: R
    };
}

class TrainPath extends ZL.Shape {
    constructor(data) {
        super();

        this._left = ZL.createShape("circle", {cx: 0, cy: 0, r: 3});
        this._left.setStyle({
            fill: "rgba(30,144,255,0.5)",
            shadowColor: "rgba(30,144,255,0.5)",
            shadowBlur : 3
        });
        this.add(this._left);

        this._right = ZL.createShape("circle", {cx: 0, cy: 0, r: 3});
        this._right.setColor("rgba(30,144,255,1)");
        this.add(this._right);

        this._line = ZL.createShape("bezier", {});
        this._line.setColor(data[2]);
        this.add(this._line);

        this._moveDot = ZL.createShape("point", {cx: 0, cy: 0, r: 2});
        this._moveDot.setStyle({
            fill: "#fff",
            shadowColor: "rgba(30,144,255,0.5)",
            shadowBlur : 1
        });
        this._moveDot.zlevel = 10;
        this.add(this._moveDot);
    
        this._data          = data;
    }

    updateLayout(zrView) {
        var posLeft = zrView.latLonToContainerPosition([this._data[0][1], this._data[0][0]]);
        var posRight = zrView.latLonToContainerPosition([this._data[1][1], this._data[1][0]]);

        var result = calculateCircleCenterAndRadius(posLeft.x, posLeft.y, posRight.x, posRight.y, Math.PI / 6);

        this._left.setPosition([posLeft.x, posLeft.y]);
        this._right.setPosition([posRight.x, posRight.y]);

        var curveness = 0.2;
        var cpx1 = (posLeft.x + posRight.x) / 2 -  (posLeft.y - posRight.y) * curveness;
        var cpy1 = (posLeft.y + posRight.y) / 2 -  (posRight.x - posLeft.x) * curveness;

        var newShape = {
            x1: posLeft.x,
            y1: posLeft.y,
            cpx1: cpx1,
            cpy1: cpy1,
            x2: posRight.x,
            y2: posRight.y
        };

        this._line.setShape(newShape);
        this._line.dirty(true);

        if (!this._moveDotAnimator) {
            this._moveDotAnimator = this._moveDot.moveAlong(this._line, 3000, true);
            this._moveDot.dirty(true);
        }
    }
}

class TrainVisual extends ZL.Visual {
    constructor(series) {
        super(series);
    }

    prepareData(callback) {
        var data = this._series["data"];
        for (var i = 0; i < data.length; ++i) {
            callback(["line", {x1: data[i][0][0], y1: data[i][0][1], x2: data[i][1][0], y2: data[i][1][1], data: {"index": i}}]);
        }
    }

    newShape(index, zrView) {
        var data = this.getSeriesData()[index];
        var shape = new TrainPath(data);

        shape.updateLayout(zrView);
        return shape;
    }

    updateShape(shape, zrView) {
        shape.updateLayout(zrView);
    }
}

ZL.Visual.registerVisual("train", TrainVisual);

function getChinaTrainData() {
    var geoCoord = {
        '阿拉山口':[82.5757,45.1706],
        '包头':[109.8403,40.6574],
        '北京':[116.4075,39.9040],
        '成都':[104.0665,30.5723],
        '大连':[121.6147,38.9140],
        '大同':[113.3001,40.0768],
        '德州':[116.3575,37.4341],
        '福州':[119.2965,26.0745],
        '广州':[113.2644,23.1292],
        '贵阳':[106.6302,26.6477],
        '哈尔滨':[126.5363,45.8023],
        '邯郸':[114.5391,36.6256],
        '杭州':[120.1551,30.2741],
        '合肥':[117.2272,31.8206],
        '侯马':[111.3720,35.6191],
        '怀化':[109.9985,27.5550],
        '淮安':[119.0153,33.6104],
        '黄骅':[117.3300,38.3714],
        '济南':[117.1205,36.6510],
        '焦作':[113.2418,35.2159],
        '九江':[116.0019,29.7051],
        '九龙红磡':[114.1870,22.3076],
        '昆明':[102.8329,24.8801],
        '拉萨':[91.1409,29.6456],
        '兰州':[103.8343,36.0611],
        '黎塘':[109.1363,23.2066],
        '连云港':[119.2216,34.5967],
        '临汾':[111.5190,36.0880],
        '柳州':[109.4160,24.3255],
        '龙口':[120.4778,37.6461],
        '洛阳':[112.4540,34.6197],
        '满洲里':[117.3787,49.5978],
        '南昌':[115.8581,28.6832],
        '南京':[118.7969,32.0603],
        '南宁':[108.3661,22.8172],
        '南阳':[112.5283,32.9908],
        '宁波':[121.5440,29.8683],
        '启东':[121.6574,31.8082],
        '秦皇岛':[119.6005,39.9354],
        '青岛':[120.3826,36.0671],
        '日照':[119.5269,35.4164],
        '厦门':[118.0894,24.4798],
        '上海':[121.4737,31.2304],
        '深圳':[114.0579,22.5431],
        '神木':[110.4871,38.8610],
        '沈阳':[123.4315,41.8057],
        '台前':[115.8717,35.9701],
        '太原':[112.5489,37.8706],
        '汤阴':[114.3572,35.9218],
        '天津':[117.2010,39.0842],
        '铜陵':[117.8121,30.9454],
        '瓦塘':[109.7600,23.3161],
        '温州':[120.6994,27.9943],
        '乌鲁木齐':[87.6168,43.8256],
        '武汉':[114.3054,30.5931],
        '西安':[108.9402,34.3416],
        '新乡':[113.9268,35.3030],
        '信阳':[114.0913,32.1470],
        '烟台':[121.4479,37.4638],
        '兖州':[116.7838,35.5531],
        '月山':[113.0550,35.2104],
        '湛江':[110.3594,21.2707],
        '长治':[113.1163,36.1954],
        '郑州':[113.6254,34.7466],
        '重庆':[106.5516,29.5630]
    };

    // 八纵通道
    var eight_row = [
        [{name:'北京'}, {name:'哈尔滨'}],
        [{name:'哈尔滨'}, {name:'满洲里'}],
        
        [{name:'沈阳'}, {name:'大连'}],
        [{name:'大连'}, {name:'烟台'}],
        [{name:'烟台'}, {name:'青岛'}],
        [{name:'青岛'}, {name:'淮安'}],
        [{name:'淮安'}, {name:'上海'}],
        [{name:'上海'}, {name:'杭州'}],
        [{name:'杭州'}, {name:'宁波'}],
        [{name:'宁波'}, {name:'温州'}],
        [{name:'温州'}, {name:'福州'}],
        [{name:'福州'}, {name:'厦门'}],
        [{name:'厦门'}, {name:'广州'}],
        [{name:'广州'}, {name:'湛江'}],
        
        [{name:'北京'}, {name:'天津'}],
        [{name:'天津'}, {name:'济南'}],
        [{name:'济南'}, {name:'南京'}],
        [{name:'南京'}, {name:'上海'}],
        
        [{name:'北京'}, {name:'南昌'}],
        [{name:'南昌'}, {name:'深圳'}],
        [{name:'深圳'}, {name:'九龙红磡'}],
        
        [{name:'北京'}, {name:'郑州'}],
        [{name:'郑州'}, {name:'武汉'}],
        [{name:'武汉'}, {name:'广州'}],
        
        [{name:'大同'}, {name:'太原'}],
        [{name:'太原'}, {name:'焦作'}],
        [{name:'焦作'}, {name:'洛阳'}],
        [{name:'洛阳'}, {name:'柳州'}],
        [{name:'柳州'}, {name:'湛江'}],
        
        [{name:'包头'}, {name:'西安'}],
        [{name:'西安'}, {name:'重庆'}],
        [{name:'重庆'}, {name:'贵阳'}],
        [{name:'贵阳'}, {name:'柳州'}],
        [{name:'柳州'}, {name:'南宁'}],
        
        [{name:'兰州'}, {name:'成都'}],
        [{name:'成都'}, {name:'昆明'}]
    ];

    // 八横通道
    var eight_column = [
        [{name:'北京'}, {name:'兰州'}],
        [{name:'兰州'}, {name:'拉萨'}],
        
        [{name:'大同'}, {name:'秦皇岛'}],
        
        [{name:'神木'}, {name:'黄骅'}],
        
        [{name:'太原'}, {name:'德州'}],
        [{name:'德州'}, {name:'龙口'}],
        [{name:'龙口'}, {name:'烟台'}],
        
        [{name:'太原'}, {name:'德州'}],
        [{name:'德州'}, {name:'济南'}],
        [{name:'济南'}, {name:'青岛'}],
        
        [{name:'长治'}, {name:'邯郸'}],
        [{name:'邯郸'}, {name:'济南'}],
        [{name:'济南'}, {name:'青岛'}],
        
        [{name:'瓦塘'}, {name:'临汾'}],
        [{name:'临汾'}, {name:'长治'}],
        [{name:'长治'}, {name:'汤阴'}],
        [{name:'汤阴'}, {name:'台前'}],
        [{name:'台前'}, {name:'兖州'}],
        [{name:'兖州'}, {name:'日照'}],
        
        [{name:'侯马'}, {name:'月山'}],
        [{name:'月山'}, {name:'新乡'}],
        [{name:'新乡'}, {name:'兖州'}],
        [{name:'兖州'}, {name:'日照'}],
        
        [{name:'连云港'}, {name:'郑州'}],
        [{name:'郑州'}, {name:'兰州'}],
        [{name:'兰州'}, {name:'乌鲁木齐'}],
        [{name:'乌鲁木齐'}, {name:'阿拉山口'}],
        
        [{name:'西安'}, {name:'南阳'}],
        [{name:'南阳'}, {name:'信阳'}],
        [{name:'信阳'}, {name:'合肥'}],
        [{name:'合肥'}, {name:'南京'}],
        [{name:'南京'}, {name:'启东'}],
        
        [{name:'重庆'}, {name:'武汉'}],
        [{name:'武汉'}, {name:'九江'}],
        [{name:'九江'}, {name:'铜陵'}],
        [{name:'铜陵'}, {name:'南京'}],
        [{name:'南京'}, {name:'上海'}],
        
        [{name:'上海'}, {name:'怀化'}],
        [{name:'怀化'}, {name:'重庆'}],
        [{name:'重庆'}, {name:'成都'}],
        [{name:'成都'}, {name:'贵阳'}],
        [{name:'贵阳'}, {name:'昆明'}],
        
        [{name:'昆明'}, {name:'南宁'}],
        [{name:'南宁'}, {name:'黎塘'}],
        [{name:'黎塘'}, {name:'湛江'}]
    ];

    var getRandom = function(min, max) {
        var range = max - min;   
        var rand = Math.random();   
        return(min + Math.round(rand * range));
    };
    var colors =  ['aqua', 'lime', 'orange', 'yellow'];

    var results = [];
    for (var i = 0; i < eight_row.length; i++) {
        var fromCoord = geoCoord[eight_row[i][0]["name"]];
        var toCoord = geoCoord[eight_row[i][1]["name"]];
        results.push([fromCoord, toCoord, colors[getRandom(0, colors.length - 1)], true]);
    }

    for (var i = 0; i < eight_column.length; i++) {
        var fromCoord = geoCoord[eight_column[i][0]["name"]];
        var toCoord = geoCoord[eight_column[i][1]["name"]];
        results.push([fromCoord, toCoord, colors[getRandom(0, colors.length - 1)], false]);
    }

    return results;
}

function loadChainTrainData() {
    var train_data = getChinaTrainData();

    return {
        name: 'china',
        type: 'train',
        data: train_data
    };
}