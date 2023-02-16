import * as zrender from "zrender"
import { Group } from "zrender"

export class ZRSubView {
    constructor(zrContainer, view) {
        this._zrContainer = zrContainer;
        this._view = view;

        this._visiable = false;
        this._group = new Group();

        this._shapeList = {};
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
                this.displayRangeChanged();
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

        this._shapeList[shape.getID()] = shape;
    }

    displayRangeChanged() {
        var bbox = this._zrContainer.getMapBounds();

        this._shapeList = {}
        this._group.removeAll();

        if (this._view.renderByRange) {
            this._view.renderByRange(bbox, this);
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
}