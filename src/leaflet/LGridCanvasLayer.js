import * as L from "leaflet"

export class LGridCanvasLayer extends L.GridLayer {
    constructor(options) {
        super();

        this.options = L.extend({}, this.options, options);

        this.on('tileunload', this.removeTile);
    }

    createTile(coord) {
        return this._createContainer(coord);
    }

    removeTile(e) {
        return this._removeContainer(e.coords);
    }

    // by re-write this two _retain function, disable cache canvas in previous zoom level
    _retainChildren(x, y, z, maxZoom) {
    }

    _retainParent(x, y, z, minZoom) {
    }

    _abortLoading() {
    }

    _onMoveEnd(t) {
        var zoomChanged = this._zoom !== t.target._zoom;

        if (!this._map || this._map._animatingZoom) { return; }

        L.GridLayer.prototype._onMoveEnd.call(this);

        this._refreshGridCanvasLayer(zoomChanged);
    }

    _getTileRange() {
        var center = this._map.getCenter();
        var pxBounds = this._getTiledPixelBounds(center);
        return this._pxBoundsToTileRange(pxBounds);
    }

    _tileRangeToCoords(tileRange) {
        var coords = [];

        for (var j = tileRange.min.y; j <= tileRange.max.y; j++) {
            for (var i = tileRange.min.x; i <= tileRange.max.x; i++) {
                var coord = new L.Point(i, j);
                coord.z = this._tileZoom;

                coords.push(coord);
            }
        }

        return coords;
    }

    _removeAllTiles() {
        this._destroyAllContainer();

        L.GridLayer.prototype._removeAllTiles.call(this);
    }
}