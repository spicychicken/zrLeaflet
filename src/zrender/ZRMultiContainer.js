import * as zrender from "zrender"
import { ZRContainer } from "./ZRContainer"

export class ZRMultiContainer extends ZRContainer {
    constructor(layer) {
        super(layer);
    }

    getCoord() {
        return this._coord;
    }

    getKey() {
        return this._key;
    }

    mapToContainerPosition(position) {
        const size = this._layer.getTileSize();
        var nwPoint = this._coord.scaleBy(size);

        return {x: position.x - nwPoint.x + size.x * this._layer.options.padding,
            y: position.y - nwPoint.y + size.y * this._layer.options.padding};
    }

    create(key, coord) {
        this._key = key;
        this._coord = coord;

        const bounds = this.getBounds();

        // by default, GridLayer will ingore pointer event (CSS) cursor: pointer; pointer-events: auto;
        var container = L.DomUtil.create('div');
        container.style['cursor'] = 'pointer';
        container.style['pointer-events'] = 'auto';
        container.id = this._key;

        this._adjustElementPosAndSize(container, bounds.min, bounds.getSize());
        this._zr = zrender.init(container);
        this._container = container.firstChild;
        this._adjustPositionAndSize(bounds.min, bounds.getSize());

        // 
        return container;
    }

    getBounds() {
        var p = this._layer.options.padding,
            size = this._layer.getTileSize(),
            min = size.multiplyBy(-p).round();

        return new L.Bounds(min, min.add(size.multiplyBy(1 + p * 2)).round());
    }

    getMapBounds() {
        var origionBounds = this._layer._tileCoordsToBounds(this._coord);
        return origionBounds.pad(this._layer.options.extra);
    }
}