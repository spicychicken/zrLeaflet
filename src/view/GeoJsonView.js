import * as turf from "@turf/turf"

import { View } from "./View"
import { ZRUtils } from "../zrender/ZRUtils"
import { GeoJsonParser } from "../geojson/GeoJsonParser"

export class GeoJsonView extends View {
    constructor(name, data) {
        super(name);

        this.setData(data);
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

    setData(geoJson) {
        this._features = this._toFeatureList(geoJson);

        this.invalidate();
    }

    _getClipFeatureByRange(feature, box) {
        if (feature.geometry.type == "Point") {
            // returns {FeatureCollection<Point>} points that land within at least one polygon
            return turf.within(feature, turf.bboxPolygon(box));
        }
        else if (feature.geometry.type == "MultiPoint") {
            // returns {FeatureCollection<Point>} points that land within at least one polygon
            return turf.within(turf.points(feature.geometry.coordinates, feature.properties), turf.bboxPolygon(box));
        }
        else {
            // returns {Feature<LineString|MultiLineString|Polygon|MultiPolygon>} clipped Feature
            return turf.bboxClip(feature, box);
        }
    }

    renderByRange(bbox, subView, zoomChanged, type) {
        subView.removeAll();

        // west, south, east, north
        const box = [bbox.getWest(), bbox.getSouth(), bbox.getEast(), bbox.getNorth()];

        for (var id in this._features) {
            const clipFeature = this._getClipFeatureByRange(this._features[id], box);
            this.renderFeature(id, clipFeature, subView);
        }
    }

    _buildObject(id, type, shape, properties) {
        var shape = ZRUtils.createBasicShape(id, type, shape, properties);
        if (properties.hasOwnProperty("animation")) {
            properties["animation"](shape);
        }
        return shape;
    }

    _renderPoints(id, points, properties, subView) {
        points.forEach(p => {
            const pos = subView.latLonToContainerPosition(L.latLng(p[1], p[0]));
            const radius = properties.hasOwnProperty('radius') ? properties['radius'] : 5;
            const shape = {cx: pos.x, cy: pos.y, r: radius};
            subView.add(this._buildObject(id, 'point', shape, properties));
        });
    }

    _renderLines(id, lines, properties, subView) {
        lines.forEach(line => {
            const linePoints = line.map(p => {
                const pos = subView.latLonToContainerPosition(L.latLng(p[1], p[0]));
                return [pos.x, pos.y]
            })
            const shape = {points: linePoints};
            subView.add(this._buildObject(id, 'polyline', shape, properties));
        });
    }

    _renderPolygones(id, polygones, properties, subView) {
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
                subView.add(this._buildObject(id, 'polygon', shape, properties));
            }
        });
    }

    renderFeature(id, feature, subView) {
        const render = this;

        new GeoJsonParser().forType("point", function(points, properties) {
            render._renderPoints(id, points, properties, subView);
        }).forType("line", function(lines, properties) {
            render._renderLines(id, lines, properties, subView);
        }).forType("polygon", function(polygones, properties) {
            render._renderPolygones(id, polygones, properties, subView);
        }).parser(feature);
    }
    
}