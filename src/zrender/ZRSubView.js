import * as zrender from "zrender"
import { Group } from "zrender"

export class ZRSubView {
    constructor(zrContainer, view) {
        this._zrContainer = zrContainer;
        this._view = view;

        this._visiable = false;
        this._group = new Group();
    }

    getView() {
        return this._view;
    }

    getVisiable() {
        return this._visiable;
    }

    setVisiable(visiable) {
        if (this._visiable != visiable) {
            if (visiable) {
                this._zrContainer._zr.add(this._group);
                this.displayRangeChanged(false, "visiable");
            }
            else {
                this._zrContainer._zr.remove(this._group);
            }
            this._visiable = visiable;
        }
    }

    add(shape) {
        shape._subView = this;
        this._group.add(shape);
    }

    remove(shape) {
        shape._subView = undefined;
        this._group.remove(shape);
    }

    removeAll() {
        // this._shapeList = {}
        this._group.removeAll();
    }

    displayRangeChanged(zoomChanged, type) {
        if (this._view.renderByRange) {
            var bbox = this._zrContainer.getMapBounds();

            this._view.renderByRange(bbox, this, zoomChanged, type);
        }
    }

    getMapBounds() {
        return this._zrContainer.getMapBounds();
    }

    getMapZoomLevel() {
        return this._zrContainer.getMapZoomLevel();
    }

    latLonToContainerPosition(latLon) {
        return this._zrContainer.latLonToContainerPosition(latLon);
    }

    lengthToDistance(length) {
        if (length.match(/^\d+$/)) {
            return parseInt(length)
        }
        else {
            var type = length.substr(length.length - 2, 2);
            if (type === 'px') {
                return parseInt(length);
            }
            else {
                length = parseInt(length);
                if (type === 'km') {
                    length = length * 1000;
                }
                return this._zrContainer.lengthToDistance(length);
            }
        }
    }
}