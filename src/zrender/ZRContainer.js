import * as zrender from "zrender"
import * as L from "leaflet"
import { ZRSubView } from "./ZRSubView"

export class ZRContainer {
    constructor(layer) {
        this._layer = layer;
        this._viewsMap = {}     // { view: , visiable: , group: }
    }

    _adjustElementPosAndSize(container, position, size) {
        L.DomUtil.setPosition(container, position);

        if (container.width !== size.x || container.height !== size.y) {
            container.width = size.x;
            container.style.width = size.x+ 'px';
            container.height = size.y;
            container.style.height = size.y + 'px';
        }
    }

    _adjustZRenderToSize(size) {
        if (this._zr) {
            if (this._zr.getWidth() !== size.x || this._zr.getHeight() !== size.y) {
                this._zr.resize({width: size.x, height: size.y});
            }
        }
    }

    _adjustPositionAndSize(position, size) {
        this._adjustElementPosAndSize(this._container, position, size);
        this._adjustZRenderToSize(size);
    }

    getMapZoomLevel() {
        return this._layer._map.getZoom();
    }

    addView(view, visiable) {
        const viewName = view.getName();
        if (this._viewsMap.hasOwnProperty(viewName) == false) {
            view.setLayer(this._layer);
            this._viewsMap[viewName] = new ZRSubView(this, view);
        }
        else {
            console.log(viewName + " alread exist");
        }

        this.setViewVisiable(view, visiable);
    }

    removeView(view) {
        const viewName = view.getName();
        if (this._viewsMap.hasOwnProperty(viewName)) {
            this.setViewVisiable(view, false);      // hide view
            view.setLayer(null);
            delete this._viewsMap[viewName];
        }
    }

    removeAllView() {
        for (var viewName in this._viewsMap) {
            var view = this._viewsMap[viewName].getView();

            this.removeView(view);
        }
    }

    setViewVisiable(view, visiable) {
        this._viewsMap[view.getName()].setVisiable(visiable);
    }

    refreshView(view) {
        const viewName = view.getName();
        if (this._viewsMap.hasOwnProperty(viewName)) {
            this._viewsMap[viewName].displayRangeChanged();

            // redraw symbol in zrender due to canvas's position changed
            this.refreshZR(true);
        }
    }

    refreshAllView(zoomChanged, type) {
        for (var viewName in this._viewsMap) {
            var view = this._viewsMap[viewName].getView();

            if (this._viewsMap.hasOwnProperty(viewName)) {
                this._viewsMap[viewName].displayRangeChanged();
            }
        }

        // redraw symbol in zrender due to canvas's position changed
        this.refreshZR(true);
    }

    release() {
        zrender.dispose(this._zr);
    }

    refreshZR(immediately) {
        if (immediately) {
            this._zr.refreshImmediately();
        }
        else {
            this._zr.refresh();
        }
    }

    latLonToContainerPosition(latLon) {
        return this._layer.latLngToContainerPoint(latLon, this);
    }
}