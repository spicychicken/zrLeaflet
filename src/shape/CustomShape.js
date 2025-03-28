import * as L from "leaflet"
import { Path, Polygon as ZRPolygon } from "zrender"

const polygonShape = {
    points: null,
    smooth: false,
    smoothConstraint: null
};

export class Polygon extends Path {
    constructor(opts) {
        super(opts);

        this.shape = L.extend({}, polygonShape, this.shape);
        this._proxy = new ZRPolygon();
    }

    buildPath(ctx, shape, closePath) {
        var polygons = shape.points;

        polygons.forEach(polygon => {
            shape.points = polygon;
            this._proxy.buildPath(ctx, shape, false);
        });

        shape.points = polygons;
    }
}

const triangleShape = {
    cx: 0,
    cy: 0,
    width: 0,
    height: 0
};

export class Triangle extends Path {
    constructor(opts) {
        super(opts);

        this.shape = L.extend({}, triangleShape, this.shape);
    }

    buildPath(ctx, shape, closePath) {
        var width = shape.width / 2;
        var height = shape.height / 2;
        ctx.moveTo(shape.cx, shape.cy - height);
        ctx.lineTo(shape.cx + width, shape.cy + height);
        ctx.lineTo(shape.cx - width, shape.cy + height);
        ctx.closePath();
    }
}

const arrowShape = {
    cx: 0,
    cy: 0,
    width: 0,
    height: 0
};

export class Arrow extends Path {
    constructor(opts) {
        super(opts);

        this.shape = L.extend({}, arrowShape, this.shape);
    }

    buildPath(ctx, shape, closePath) {
        ctx.moveTo(shape.cx, shape.cy);
        ctx.lineTo(shape.cx, shape.cy + shape.height);
        ctx.lineTo(shape.cx - shape.width / 2, shape.cy + shape.height);
        ctx.lineTo(shape.cx, shape.cy + Math.sin(60 * Math.PI / 180) * shape.width + shape.height);
        ctx.lineTo(shape.cx + shape.width / 2, shape.cy + shape.height);
        ctx.lineTo(shape.cx, shape.cy + shape.height);
    }
}

const arcLine = {
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
    smooth: false
};
