import { LGridCanvasLayer } from "./leaflet/LGridCanvasLayer"
import { View } from "./view/View";
import { ZRMultiContainer } from "./zrender/ZRMultiContainer"

const defaultOptions = {
    padding: 0,
    extra: 0.1
}

export class ZLMultiLayer extends LGridCanvasLayer {
    constructor(options) {
        super(L.extend({}, defaultOptions, options));

        this._containersMap = {};
        this._viewsMap = {};
    }

    getType() {
        return "grid";
    }

    _ifContainerCreated(coord) {
        if (this._containersMap.hasOwnProperty(coord.z)) {
            var key = this._tileCoordsToKey(coord);
            if (this._containersMap[coord.z].hasOwnProperty(key)) {
                return true;
            }
        }

        return false;
    }

    _addToContainersMap(coord, zrContainer) {
        if (!this._containersMap.hasOwnProperty(coord.z)) {
            this._containersMap[coord.z] = {};
        }

        var key = this._tileCoordsToKey(coord);
        this._containersMap[coord.z][key] = zrContainer;
    }

    _createContainer(coord) {
        // in every level, every coords only create once
        var zrContainer = new ZRMultiContainer(this);
        var container = zrContainer.create(this._tileCoordsToKey(coord), coord);

        this._addToContainersMap(coord, zrContainer);

        return container;
    }

    _removeContainer(coord) {
        // when zoom in/out animation stop
        if (this._ifContainerCreated(coord)) {
            var key = this._tileCoordsToKey(coord);
            this._containersMap[coord.z][key].release();
            delete this._containersMap[coord.z][key];
        }
    }

    _destroyAllContainer() {
        this.removeAllView();

        for (var z in this._containersMap) {
            for (var key in this._containersMap[z]) {
                this._containersMap[z][key].release();
                delete this._containersMap[z][key];
            }
            delete this._containersMap[z];
        }

        for (var viewName in this._viewsMap) {
            delete this._viewsMap[viewName];
        }
    }

    _adjustZRenderContainerSize(size) {
        console.log("_adjustZRenderContainerSize");
    }

    _refreshZRenderContainer(zoomChanged, type) {
        console.log("_refreshZRenderContainer");
    }

    _getContainersByCoords(coords) {
        var containers = [];

        for (var i = 0; i < coords.length; i++) {
            var coord = coords[i];

            if (this._ifContainerCreated(coord)) {
                var key = this._tileCoordsToKey(coord);
                containers.push(this._containersMap[coord.z][key]);
            }
        }

        return containers;
    }

    getTileRangeContainers() {
        var coords = this._tileRangeToCoords(this._getTileRange());
        return this._getContainersByCoords(coords);
    }

    getAllContainers() {
        var containers = [];

        for (var z in this._containersMap) {
            for (var key in this._containersMap[z]) {
                containers.push(this._containersMap[z][key]);
            }
        }

        return containers;
    }

    _refreshGridCanvasLayer(zoomChanged) {
        const viewsMap = this._viewsMap;
        const containers = this.getTileRangeContainers();
        containers.forEach(container => {
            for (var viewName in viewsMap) {
                const view = viewsMap[viewName].view;
                const visiable = viewsMap[viewName].visiable;

                container.addView(view, visiable);
            }
        });
    }

    addSeries(series, visiable) {
        // this.addView(new SeriesView(series), visiable)
    }

    addView(view, visiable) {
        const containers = this.getTileRangeContainers();
        containers.forEach(container => {
            container.addView(view, visiable);
        });
        this._viewsMap[view.getName()] = { view: view, visiable: visiable };
    }

    removeView(view) {
        const containers = this.getAllContainers();
        containers.forEach(container => {
            container.removeView(view);
        });
        delete this._viewsMap[view.getName()];
    }

    removeAllView() {
        for (var viewName in this._viewsMap) {
            this.removeView(this._viewsMap[viewName].view);
        }
    }

    showView(view) {
        const containers = this.getTileRangeContainers();
        containers.forEach(container => {
            container.setViewVisiable(view, true);
        });
        this._viewsMap[view.getName()].visiable = true;
    }

    hideView(view) {
        const containers = this.getTileRangeContainers();
        containers.forEach(container => {
            container.setViewVisiable(view, false);
        });
        this._viewsMap[view.getName()].visiable = false;
    }

    refreshView(view) {
        const containers = this.getTileRangeContainers();
        containers.forEach(container => {
            container.refreshView(view);
        });
    }

    refreshAllView(zoomChanged, type) {
        const containers = this.getTileRangeContainers();
        containers.forEach(container => {
            container.refreshAllView(zoomChanged, type);
        });
    }

    latLngToContainerPoint(latLng, container) {
        var position = this._map.project(latLng, container.getCoord().z)._round();

        return container.mapToContainerPosition(position);
    }
}