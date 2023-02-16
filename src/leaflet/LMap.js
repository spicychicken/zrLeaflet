import * as L from "leaflet"

const tileLayerMapOptions = {
    "openstreetmap": {
        'type': 'OpenStreetMap',
        'company': 'OpenStreetMap Community',
        'name': 'OSM',
        'link': 'http://osm.org/copyright',
        'url': 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
    }
};

class LeafletMapTileLayer extends L.TileLayer {
  getTileUrl(tilePoint) {
    var urlArgs, getUrlArgs = this.options.getUrlArgs;
    if (getUrlArgs) { 
        urlArgs = getUrlArgs(tilePoint);
    } else {
        urlArgs = {
            z: tilePoint.z,
            x: tilePoint.x,
            y: tilePoint.y
        };
    }
    return L.Util.template(this._url, L.extend(urlArgs, this.options, {
        s: this._getSubdomain(tilePoint)
    }));
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
    L.Map.prototype.initialize.call(this, id, options);

    this._setBaseMap(baseMap);

    if (options.mousePosition != false) {
        new MousePosition(options).addTo(this);
    }
  }

  _setBaseMap(baseMap) {
    var tileLayerOptions = typeof baseMap == 'object' ? baseMap : tileLayerMapOptions[baseMap];
    this.baseMap = new LeafletMapTileLayer(tileLayerOptions.url, tileLayerOptions).addTo(this);
  }
}
