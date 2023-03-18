import { LMap } from "./leaflet/LMap"
import { ZLSingleLayer } from "./ZLSingleLayer"
import { ZLMultiLayer } from "./ZLMultiLayer"

export class ZLMapContainer {
    constructor(id, mapType, options = {}) {
        this._leafletMap = new LMap(id, mapType, options);

        this._idLayerMap = {}
    }

    getMap() {
        return this._leafletMap;
    }

    getLayer(id) {
        return this._idLayerMap[id];
    }

    addLayer(id, options = {}) {
        if (this._idLayerMap.hasOwnProperty(id) == false) {
            if (options.hasOwnProperty("type") && options["type"] == "grid") {
                this._idLayerMap[id] = new ZLMultiLayer(options);
            }
            else {
                this._idLayerMap[id] = new ZLSingleLayer(options);
            }
            this._leafletMap.addLayer(this._idLayerMap[id]);
        }

        return this._idLayerMap[id];
    }

    removeLayer(id) {
        if (this._idLayerMap.hasOwnProperty(id) == true) {
            this._leafletMap.removeLayer(this._idLayerMap[id]);
            delete this._idLayerMap[id];
        }
    }
}