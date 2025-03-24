import * as turf from "@turf/turf"

import { View } from "./View"
import { GeoJsonParser } from "../geojson/GeoJsonParser"

export class GeoJsonView extends View {
    constructor(visual) {
        super(visual);

        const view = this;
        this._visual.prepareData && this._visual.prepareData(function(geoJson) {
            view._features = geoJson;
        });
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
        // west, south, east, north
        const box = [bbox.getWest(), bbox.getSouth(), bbox.getEast(), bbox.getNorth()];

        this._visual.beforeRender && this._visual.beforeRender(bbox, subView);

        for (var id in this._features) {
            const clipFeature = this._getClipFeatureByRange(this._features[id], box);
            // this.renderFeature(id, clipFeature, subView);
            this._visual.render && this._visual.render(clipFeature, subView);
        }

        this._visual.afterRender && this._visual.afterRender(bbox, subView);
    }
}