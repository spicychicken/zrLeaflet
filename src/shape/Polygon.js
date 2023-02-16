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

