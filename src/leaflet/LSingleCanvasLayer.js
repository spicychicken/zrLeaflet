import * as L from "leaflet"

const defaultOptions = {
    move: true,
    zoom: true
}

export class LSingleCanvasLayer extends L.Renderer {
    constructor(options) {
        super(L.extend({}, defaultOptions, options));
    }

    getEvents() {
        var events = L.Renderer.prototype.getEvents.call(this);
        events.moveend = this._onMoveEnd;

        if (this.options.move) {
            events.move = this._onMove;
        }

        if (this.options.zoom) {
            events.zoomanim = this._onAnimZoom;
        }

        return events;
    }

    _update() {
        if (this._map._animatingZoom && this._bounds) { return; }

        L.Renderer.prototype._update.call(this);

        this._adjustPositionAndSize(this._bounds.min, this._bounds.getSize());
    }

    _onAnimZoom(t) {
        L.Renderer.prototype._onAnimZoom.call(this, t);

        var zoomChanged = this._zoom !== t.target._zoom;

        this.refreshAllView(zoomChanged, "zoom");
    }

    _onMove(t) {
        if (this._map._animatingZoom && this._bounds) { return; }

        var zoomChanged = this._zoom !== t.target._zoom;

        this._update();

        this.refreshAllView(zoomChanged, "moveend");
    }

    _onMoveEnd(t) {
        if (this._map._animatingZoom && this._bounds) { return; }

        var zoomChanged = this._zoom !== t.target._zoom;

        this._update();

        this.refreshAllView(zoomChanged, "moveend");
    }
}