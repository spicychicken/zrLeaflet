import * as zrender from "zrender"
import { ZRContainer } from "./ZRContainer"

export class ZRSingleContainer extends ZRContainer {
    constructor(layer) {
        super(layer);

        this._viewsMap = {};
    }

    create() {
        const bounds = this.getBounds();

        this._container = L.DomUtil.create('div');
        this._adjustElementPosAndSize(this._container, bounds.min, bounds.getSize());
        this._zr = zrender.init(this._container);

        this._zr.configLayer(10, {
            motionBlur: true,
            lastFrameAlpha: 0.95});

        return this._container;
    }

    getBounds() {
        var p = this._layer.options.padding,
            size = this._layer._map.getSize(),
            min = this._layer._map.containerPointToLayerPoint(size.multiplyBy(-p)).round();

        return new L.Bounds(min, min.add(size.multiplyBy(1 + p * 2)).round());
    }

    getMapBounds() {
        var origionBounds = this._layer._map.getBounds();
        return origionBounds.pad(this._layer.options.extra);
    }
}