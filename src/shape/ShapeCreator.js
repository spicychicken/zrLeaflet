import { Line, Polyline, Circle, Sector, Rect, Arc, BezierCurve, Droplet, Ellipse, Heart, Isogon, Ring, Rose, Star, Trochoid } from "zrender"
import { Polygon, Triangle, Arrow } from "./CustomShape"
import { mixinShapeTemplate } from "./BasicShape"

export const ShapeCreator = {
    _shapeProxy: {
        'point': mixinShapeTemplate(Circle),                // 圆形
        'circle': mixinShapeTemplate(Circle),
        'sector': mixinShapeTemplate(Sector),               // 扇形
        'line': mixinShapeTemplate(Line),                   // 直线
        'polyline': mixinShapeTemplate(Polyline),
        'polygon': mixinShapeTemplate(Polygon),             // 多边形
        'rect': mixinShapeTemplate(Rect),                   // 矩形
        'triangle': mixinShapeTemplate(Triangle),           // 三角形
        'arrow': mixinShapeTemplate(Arrow),                 // 箭头
        'arc': mixinShapeTemplate(Arc),                     // 圆弧
        'bezier': mixinShapeTemplate(BezierCurve),          // 贝塞尔曲线
        'droplet': mixinShapeTemplate(Droplet),             // 水滴形状
        'ellipse': mixinShapeTemplate(Ellipse),             // 椭圆形状
        'heart': mixinShapeTemplate(Heart),                 // 心形
        'isogon': mixinShapeTemplate(Isogon),               // 正多边形
        'ring': mixinShapeTemplate(Ring),                   // 圆环
        'rose': mixinShapeTemplate(Rose),                   // 玫瑰线
        'star': mixinShapeTemplate(Star),                   // n角星（n>3）
        'trochoid': mixinShapeTemplate(Trochoid)            // 内外旋轮曲线
    },

    create: function(type, shape, style = {}) {
        const hasType = ShapeCreator._shapeProxy.hasOwnProperty(type);

        if (hasType) {
            return new ShapeCreator._shapeProxy[type]({type: type, shape: shape, style: style});
        }
        return undefined;
    },
}