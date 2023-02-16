import { LSingleCanvasLayer } from "./leaflet/LSingleCanvasLayer"
import { ZRSingleContainer } from "./zrender/ZRSingleContainer"

const defaultOptions = {
    padding: 0.1,
    extra: 0.2
}

export class ZLSingleLayer extends LSingleCanvasLayer {
    constructor(options) {
        super(L.extend({}, defaultOptions, options));
    }

    getType() {
        return "single";
    }

    _initContainer() {
        this._zrContainer = new ZRSingleContainer(this);
        this._container = this._zrContainer.create();
    }

    _destroyContainer() {
        this.removeAllView();
        this._zrContainer.release();
        L.DomUtil.remove(this._container);
        delete this._zrContainer;
    }

    _adjustPositionAndSize(position, size) {
        this._zrContainer._adjustPositionAndSize(position, size);
    }

    _adjustContainerZRToSize(size) {
        this._zrContainer._adjustContainerZRToSize(size.x, size.y);
    }

    addView(view, visiable) {
        this._zrContainer.addView(view, visiable);
    }

    removeView(view) {
        this._zrContainer.hideView(view);
    }

    removeAllView() {
        this._zrContainer.removeAllView();
    }

    showView(view) {
        this._zrContainer.setViewVisiable(view, true);
    }

    hideView(view) {
        this._zrContainer.setViewVisiable(view, false);
    }

    refreshView(view) {
        this._zrContainer.refreshView(view);
    }

    refreshAllView(zoomChanged, type) {
        this._zrContainer.refreshAllView(zoomChanged, type);
    }

    latLngToContainerPoint(latLng) {
        var pos = this._map.latLngToLayerPoint(latLng);
        return pos.subtract(this._bounds.min);
    }
}