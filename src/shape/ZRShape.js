import { Group } from "zrender"

export class ZRShape extends Group {
    constructor() {
        super();
    }

    getGeoCoord() {
        return this._coord;
    }

    // coord: array[lat, lng]
    setGeoCoord(coord) {
        this._coord = coord;
        return this;
    }

    setAttr(attr) {
        this.attr(attr);
        return this;
    }

    setPosition(position) {
        this.attr('position', position);
        return this;
    }

    setSize(size) {
        this.attr("scale", size);
        return this;
    }

    setRotation(rotate) {
        this.attr("rotation", rotate * Math.PI / 180 || 0);
        return this;
    }
}