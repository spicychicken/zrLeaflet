import { Line, Polyline, Circle, Sector, Rect, Arc, BezierCurve, Droplet, Ellipse, Heart, Isogon, Ring, Rose, Star, Trochoid } from "zrender"
import { Polygon, Triangle, Arrow } from "./CustomShape"

export const ShapeCreator = {
    _shapeProxy: {
        'point': new Circle(),          // 圆形
        'circle': new Circle(),
        'sector': new Sector(),         // 扇形
        'line': new Line(),             // 直线
        'polyline': new Polyline(),
        'polygon': new Polygon(),       // 多边形
        'rect': new Rect(),             // 矩形
        'triangle': new Triangle(),     // 三角形
        'arrow': new Arrow(),           // 箭头
        'arc': new Arc(),               // 圆弧
        'bezier': new BezierCurve(),    // 贝塞尔曲线
        'droplet': new Droplet(),       // 水滴形状
        'ellipse': new Ellipse(),       // 椭圆形状
        'heart': new Heart(),           // 心形
        'isogon': new Isogon(),         // 正多边形
        'ring': new Ring(),             // 圆环
        'rose': new Rose(),             // 玫瑰线
        'star': new Star(),             // n角星（n>3）
        'trochoid': new Trochoid()      // 内外旋轮曲线
    },

    // ----------------------------------------------------------------
    point: function(bound) {
        return {cx: bound[0], cy: bound[1], r: bound[2]};
    },

    circle: function(bound) {
        // bound: [x, y, r]
        return {cx: bound[0], cy: bound[1], r: bound[2]};
    },

    sector: function(bound){
        // bound: [x, y, r0, r1, startAngle, endAngle, clockwise]
        return {cx: bound[0], cy: bound[1], r0: bound[2], r: bound[3], 
            startAngle: bound[4] * Math.PI / 180, endAngle: bound[5] * Math.PI / 180, clockwise: true};
    },

    line: function(bound) {
        return {x1: bound[0][0], y1: bound[0][1], x2: bound[1][0], y2: bound[1][1]};
    },

    polyline: function(bound) {
        return {points: bound};
    },

    polygon: function(bound) {
        return {points: bound};
    },
    
    rect: function(bound) {
        return {x: bound[0], y: bound[1], width: bound[2], height: bound[3], r: bound[4]};
    },

    triangle: function(bound) {
        // bound: [x, y, w, h]
        return {cx: bound[0] + bound[2] / 2, cy: bound[1] + bound[3] / 2, width: bound[2], height: bound[3]};
    },

    arrow: function(bound) {
        return {cx: bound[0], cy: bound[1], width: bound[2], height: bound[3]};
    },

    arc: function(bound) {
        // bound: [x, y, r, startAngle, endAngle, clockwise]
        return {cx: bound[0], cy: bound[1], r: bound[2], 
            startAngle: bound[3] * Math.PI / 180, endAngle: bound[4] * Math.PI / 180, clockwise: true};
    },

    bezier: function(bound) {
        return {x1: bound[0], y1: bound[1], x2: bound[2], y2: bound[3], cpx1: bound[4], cpx2: bound[5]};
    },

    droplet: function(bound) {
        return {cx: bound[0], cy: bound[1], width: bound[2], height: bound[3]};
    },

    ellipse: function(bound) {
        return {cx: bound[0], cy: bound[1], rx: bound[2], ry: bound[3]};
    },

    heart: function(bound) {
        return {cx: bound[0], cy: bound[1], width: bound[2], height: bound[3]};
    },

    isogon: function(bound) {
        return {x: bound[0], y: bound[1], r: bound[2], n: bound[3]};
    },

    ring: function(bound) {
        return {cx: bound[0], cy: bound[1], r: bound[2], r0: bound[3]};
    },

    rose: function(bound) {
        return {cx: bound[0], cy: bound[1], r: bound[2], k: bound[3], n: bound[4]};
    },

    star: function(bound) {
        return {cx: bound[0], cy: bound[1], n: bound[2], r: bound[3], r0: bound[4]};
    },

    trochoid: function(bound) {
        return {cx: bound[0], cy: bound[1], r: bound[2], r0: bound[3], d: bound[4]};
    },

    // ----------------------------------------------------------------
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