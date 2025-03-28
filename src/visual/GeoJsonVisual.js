import * as turf from "@turf/turf"
import { Visual } from "./Visual"
import { ShapeCreator } from "../shape/ShapeCreator"
import { GeoJsonParser } from "../geojson/GeoJsonParser"

export class GeoJsonVisual extends Visual {
    constructor(series) {
        super(series);
    }

    _toFeatureList(geoJson) {
        var features = {};

        var count = 0;
        new GeoJsonParser().forType("point", function(points, properties) {
            features[":Point" + count++] = turf.multiPoint(points, properties);
        }).forType("line", function(lines, properties) {
            features[":Line" + count++] = turf.multiLineString(lines, properties);
        }).forType("polygon", function(polygones, properties) {
            features[":Polygon" + count++] = turf.multiPolygon(polygones, properties);
        }).parser(geoJson);

        return features;
    }

    prepareData(callback) {
        callback(this._toFeatureList(this.getSeriesData()));
    }

    beforeRender(bbox, subView) {
        subView.removeAll();
    }

    render(feature, subView) {
        const render = this;

        new GeoJsonParser().forType("point", function(points, properties) {
            render._renderPoints(points, properties, subView);
        }).forType("line", function(lines, properties) {
            render._renderLines(lines, properties, subView);
        }).forType("polygon", function(polygones, properties) {
            render._renderPolygones(polygones, properties, subView);
        }).parser(feature);
    }

    _buildObject(type, shape, properties) {
        var shape = ShapeCreator.create(type, shape, properties);
        if (properties.hasOwnProperty("animation")) {
            properties["animation"](shape);
        }
        return shape;
    }

    _renderPoints(points, properties, subView) {
        points.forEach(p => {
            const pos = subView.latLonToContainerPosition(L.latLng(p[1], p[0]));
            const radius = properties.hasOwnProperty('radius') ? properties['radius'] : 5;
            const shape = {cx: pos.x, cy: pos.y, r: radius};
            subView.add(this._buildObject('point', shape, properties));
        });
    }

    _renderLines(lines, properties, subView) {
        lines.forEach(line => {
            const linePoints = line.map(p => {
                const pos = subView.latLonToContainerPosition(L.latLng(p[1], p[0]));
                return [pos.x, pos.y]
            })
            const shape = {points: linePoints};
            subView.add(this._buildObject('polyline', shape, properties));
        });
    }

    _renderPolygones(polygones, properties, subView) {
        polygones.forEach(polygon => {
            // [To-Do] inner polygon
            if (polygon.length > 0) {
                const polygonPoints = polygon.map(pg => {
                    return pg.map(point => {
                        const pos = subView.latLonToContainerPosition(L.latLng(point[1], point[0]));
                        return [pos.x, pos.y];
                    });
                })

                const shape = {points: polygonPoints};
                subView.add(this._buildObject('polygon', shape, properties));
            }
        });
    }
}

Visual.registerVisual("geojson", GeoJsonVisual);