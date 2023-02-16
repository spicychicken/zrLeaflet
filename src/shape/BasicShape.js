import * as L from "leaflet"
import { Line, Polyline, Circle, Sector, Rect, Path } from "zrender"
import { Polygon } from "./Polygon"

var _shapeCreator = {
    'circle': new Circle(),
    'point': new Circle(),
    'sector': new Sector(),
    'line': new Line(),
    'polyline': new Polyline(),
    'polygon': new Polygon(),
    'rect': new Rect()
};

function createShapeOptions(type, shape, style) {
    const hasType = _shapeCreator.hasOwnProperty(type);

    return {
        type: type,
        shape: hasType ? L.extend({}, _shapeCreator[type].shape, shape) : shape,
        style: hasType ? L.extend({}, _shapeCreator[type].style, style) : style,
    };
}

export class BasicShape extends Path {
    constructor(id, type, shape, style) {
        super(createShapeOptions(type, shape, style));

        this._id = id;
    }

    buildPath(ctx, shape, closePath) {
        if (_shapeCreator.hasOwnProperty(this.type)) {
            _shapeCreator[this.type].buildPath(ctx, shape, closePath);
        }
    }

    getID() {
        return this._id;
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
}