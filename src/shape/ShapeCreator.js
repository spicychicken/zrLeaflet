import { Line, Polyline, Circle, Sector, Rect } from "zrender"
import { Polygon } from "./Polygon"
import { point } from "leaflet";

export const ShapeCreator = {
    _shapeProxy: {
        'circle': new Circle(),
        'point': new Circle(),
        'sector': new Sector(),
        'line': new Line(),
        'polyline': new Polyline(),
        'polygon': new Polygon(),
        'rect': new Rect()
    },

    point: function(bound) {
        return {cx: bound[0], cy: bound[1], r: bound[2]};
    },

    circle: function(bound) {
        // bound: [x, y, r]
        return {cx: bound[0], cy: bound[1], r: bound[2]};
    },

    triangle: function(bound) {
        // bound: [x, y, w, h]
        return {cx: bound[0] + bound[2] / 2, cy: bound[1] + bound[3] / 2, width: bound[2], height: bound[3]};
    },

    sector: function(bound){
        // bound: [x, y, r0, r1, startAngle, endAngle, clockwise]
        return {cx: bound[0], cy: bound[1], r0: bound[2], r: bound[3], 
            startAngle: bound[4] * Math.PI / 180, endAngle: bound[5] * Math.PI / 180, clockwise: true};
    },

    arrow: function(bound) {
        return {cx: bound[0], cy: bound[1], width: bound[2], height: bound[3]};
    },

    line: function(bound) {
        return {x1: bound[0][0], y1: bound[0][1], x2: bound[1][0], y2: bound[1][1]};
    },

    polygon: function(bound) {
        return {points: bound};
    },

    polyline: function(bound) {
        return {points: bound};
    },
    
    rect: function(bound) {
        return {x: bound[0], y: bound[1], width: bound[2], height: bound[3], r: bound[4]};
    },

    create: function(type, bound, style = {}) {
        const hasType = ShapeCreator._shapeProxy.hasOwnProperty(type);
        
        return {
            type: type,
            shape: hasType ? L.extend({}, ShapeCreator._shapeProxy[type].shape, ShapeCreator[type](bound)) : shape,
            style: hasType ? L.extend({}, ShapeCreator._shapeProxy[type].style, style) : style,
        };
    },

    build: function(type, ctx, shape, closePath) {
        if (ShapeCreator._shapeProxy.hasOwnProperty(type)) {
            ShapeCreator._shapeProxy[type].buildPath(ctx, shape, closePath);
        }
    }
}