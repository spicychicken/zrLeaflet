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
            this._viewsMap[viewName].displayRangeChanged(false, "refresh");

            // redraw symbol in zrender due to canvas's position changed
            this.refreshZR(true);
        }
    }

    refreshAllView(zoomChanged, type) {
        for (var viewName in this._viewsMap) {
            if (this._viewsMap.hasOwnProperty(viewName)) {
                this._viewsMap[viewName].displayRangeChanged(zoomChanged, type);
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

    lengthToDistance(distance) {
        var length = 0;
        var latlng = this._layer._map.getCenter();

        var lng = latlng.lng,
        lat = latlng.lat,
        crs = this._layer._map.options.crs;

        if (crs.distance === L.CRS.Earth.distance) {
            var d = Math.PI / 180,
                latR = distance / L.CRS.Earth.R / d,
                top = this._layer._map.project([lat + latR, lng]),
                bottom = this._layer._map.project([lat - latR, lng]),
                p = top.add(bottom).divideBy(2),
                lat2 = this._layer._map.unproject(p).lat,
                lngR = Math.acos((Math.cos(latR * d) - Math.sin(lat * d) * Math.sin(lat2 * d)) /
                        (Math.cos(lat * d) * Math.cos(lat2 * d))) / d;

            if (isNaN(lngR) || lngR === 0) {
                lngR = latR / Math.cos(Math.PI / 180 * lat); // Fallback for edge case, #2425
            }

            length = isNaN(lngR) ? 0 : Math.max(Math.round(p.x - this._layer._map.project([lat2, lng - lngR]).x), 1);

        }

        return length;
    }
}