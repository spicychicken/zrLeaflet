import * as L from "leaflet"

// see Leaflet.ChineseTmsProviders
const tileLayerMapOptions = {
    "openstreetmap": {
        'type': 'OpenStreetMap',
        'url': 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
    },
    "gaodenormal": {
        "type": "GaoDe Normal",
        "url": "https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
        "subdomains": ["1", "2", "3", "4"]
    },
    "tencentnormal": {
        "type": "Tencent Normal",
        "url": "http://rt{s}.map.gtimg.com/tile?z={z}&x={x}&y={-y}&type=vector&styleid=3",
        "subdomains": "0123"
    },
    "tencentterrain": {
        "type": "Tencent Terrain",
        "url": "http://p{s}.map.gtimg.com/demTiles/{z}/{sx}/{sy}/{x}_{-y}.jpg",
        "subdomains": "0123"
    }
};

class LeafletMapTileLayer extends L.TileLayer {
    getTileUrl(tilePoint) {
        var urlArgs = {
            s: this._getSubdomain(tilePoint),
            x: tilePoint.x,
            y: tilePoint.y,
            z: this._getZoomForUrl(),
        };

        if (this._map && !this._map.options.crs.infinite) {
            var invertedY = this._globalTileRange.max.y - tilePoint.y;
            if (this.options.tms) {
                    urlArgs['y'] = invertedY;
            }
            urlArgs['-y'] = invertedY;
        }

        urlArgs.sx = urlArgs.x >> 4
        urlArgs.sy = ((1 << urlArgs.z) - urlArgs.y) >> 4
        return L.Util.template(this._url, L.Util.extend(urlArgs, this.options));
    }
}

class MousePosition extends L.Control {
    onAdd(map) {
        this._container = L.DomUtil.create('div', 'leaflet-control-mouseposition');
        L.DomEvent.disableClickPropagation(this._container);
        map.on('mousemove', this._onMouseMove, this);
        this._container.innerHTML = this.options.emptyString;
        return this._container;
    }
    
    onRemove(map) {
        map.off('mousemove', this._onMouseMove)
    }
    
    _onMouseMove(e) {
        var lng = this.options.lngFormatter ? this.options.lngFormatter(e.latlng.lng) : L.Util.formatNum(e.latlng.lng, this.options.numDigits);
        var lat = this.options.latFormatter ? this.options.latFormatter(e.latlng.lat) : L.Util.formatNum(e.latlng.lat, this.options.numDigits);
        var value = this.options.lngFirst ? 'Lng:' + lng + this.options.separator + 'Lat:' + lat : 'Lat:' + lat + this.options.separator + 'Lng:' + lng;
        var prefixAndValue = this.options.prefix + ' ' + value;
        this._container.innerHTML = prefixAndValue;
    }
}

const defaultLeafletConfiguration = {
    // options for Map
    mousePosition: 'bottomright',
    zoom: 6,
    center: [30.58, 104.08],     // Lat, Lng
    minZoom: 1,
    maxZoom: 18,
    zoomControl: true,
    doubleClickZoom: true,

    // options for MousePosition
    position: 'bottomright',
    separator: ' : ',
    emptyString: 'Unavailable',
    lngFirst: false,
    numDigits: 5,
    lngFormatter: undefined,
    latFormatter: undefined,
    prefix: ''
};

export class LMap extends L.Map {
    initialize(id, baseMap, options) {
        /** zoom: [0 - 18] 
        * [5000km, 3000km, 2000km, 1000km, 500km, 300km, 100km, 50km, 30km, 
        * 10km, 5km, 3km, 2km, 1km, 500m, 200m, 100m, 50m, 30m]
        **/
        options = L.extend({}, defaultLeafletConfiguration, options);
        var tileLayerOptions = typeof baseMap == 'object' ? baseMap : tileLayerMapOptions[baseMap];
        // special for baidu
        if ("crs" in tileLayerOptions) {
            options["crs"] = tileLayerOptions["crs"]
        }

        L.Map.prototype.initialize.call(this, id, options);

        this.baseMap = new LeafletMapTileLayer(tileLayerOptions.url, tileLayerOptions).addTo(this);

        if (options.mousePosition != false) {
            new MousePosition(options).addTo(this);
        }
    }
}
