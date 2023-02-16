import * as L from "leaflet"

export class GeoJsonParser {
    constructor() {
        this._typeCB = {};
    }

    _parserGeoJson(geoJson, parentProp = {}) {
        const childProp = geoJson.hasOwnProperty("properties") ? geoJson.properties : {};
        const properties = L.extend({}, parentProp, childProp);

        if (geoJson.type === 'Point') {
            this._callType('point', [geoJson.coordinates], properties);
        } else if (geoJson.type === 'MultiPoint') {
            this._callType('point', geoJson.coordinates, properties);
        } else if (geoJson.type === 'LineString') {
            this._callType('line', [geoJson.coordinates], properties);
        } else if (geoJson.type === 'MultiLineString') {
            this._callType('line', geoJson.coordinates, properties);
        } else if (geoJson.type === 'Polygon') {
            this._callType('polygon', [geoJson.coordinates], properties);
        } else if (geoJson.type === 'MultiPolygon') {
            this._callType('polygon', geoJson.coordinates, properties);
        } else if (geoJson.type === 'Feature') {
            this._parserGeoJson(geoJson.geometry, properties);
        } else if (geoJson.type === 'FeatureCollection') {
            this._parserFeatures(geoJson.features, properties);
        } else if (geoJson.type === 'GeometryCollection') {
            this._parserGeometries(geoJson.geometries, properties);
        }
    }

    forType(type, cb) {
        this._typeCB[type] = cb;
        return this;
    }

    _callType(type, params, properties) {
        if (this._typeCB.hasOwnProperty(type)) {
            this._typeCB[type](params, properties);
        }
    }

    _parserFeatures(features, properties) {
        features.forEach(feature => {
            this._parserGeoJson(feature, properties);
        }, this);
    }

    _parserGeometries(geometries, properties) {
        geometries.forEach(geometry => {
            this._parserGeoJson(geometry, properties);
        }, this);
    }

    parser(geoJson) {
        this._parserGeoJson(geoJson);
    }
}