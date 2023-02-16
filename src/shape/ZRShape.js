import { Group } from "zrender"

export class ZRShape extends Group {
    constructor() {
        super();
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