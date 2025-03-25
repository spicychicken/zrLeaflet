import * as L from "leaflet"
import { Path } from "zrender"
import { ShapeCreator } from "./ShapeCreator"

export class BasicShape extends Path {
    constructor(type, bound, style) {
        super(ShapeCreator.create(type, bound, style));
    }

    buildPath(ctx, shape, closePath) {
        ShapeCreator.build(this.type, ctx, shape, closePath);
    }

    setColor(color) {
        if (this.type === 'line') {
            this.style.stroke = color;
        }
        else {
            this.style.fill && (this.style.fill = color);
            this.style.stroke && (this.style.stroke = color);
        }
        this.dirty(false);
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

    setStroke(color) {
        return this.setStyle({"stroke": color});
    }

    setFill(color) {
        return this.setStyle({"fill": color});
    }

    setOpacity(opacity) {
        return this.setStyle({"opacity": opacity});
    }

    setStyle(style) {
        this.attr({style: style});
        return this;
    }

    setAttr(attr) {
        this.attr(attr);
        return this;
    }
}