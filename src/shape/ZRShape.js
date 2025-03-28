import { Group } from "zrender"
import { mixinShapeTemplate } from "./BasicShape"

var ZLGroup = mixinShapeTemplate(Group);

export class ZRShape extends ZLGroup {
    constructor(options) {
        super(options);
    }

    getGeoCoord() {
        return this._coord;
    }

    // coord: array[lat, lng]
    setGeoCoord(coord) {
        this._coord = coord;
        return this;
    }
}