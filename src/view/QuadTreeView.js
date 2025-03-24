import { View } from "./View"
import { Quadtree, Line, Circle, Rectangle } from '@timohausmann/quadtree-ts';
import { ArrayDiffer } from '../utils/ArrayDiffer'

export class QuadTreeView extends View {
    constructor(visual) {
        super(visual);

        this._geoQuadTree = new Quadtree({x: -180, y: -90 , width: 360, height: 180});

        const view = this;
        this._visual.prepareData && this._visual.prepareData(function(params) {
            if (params[0] == "circle") {
                view._geoQuadTree.insert(new Circle(params[1]));
            }
            else if (params[0] == "rectangle") {
                view._geoQuadTree.insert(new Rectangle(params[1]));
            }
            else {
                view._geoQuadTree.insert(new Line(params[1]));
            }
        });

        this._oldElements = []
    }

    renderByRange(bbox, subView, zoomChanged, type) {
        this._visual.beforeRender && this._visual.beforeRender(bbox, subView);

        const area = new Rectangle({x: bbox.getWest(), y: bbox.getSouth(),
            width: bbox.getEast() - bbox.getWest(), height: bbox.getNorth() - bbox.getSouth()});

        const elements = this._geoQuadTree.retrieve(area);

        var seriesView = this;
        new ArrayDiffer().add(function (newIdx) {
            var shape = seriesView._visual.newShape(elements[newIdx]["data"]["index"], subView);
            elements[newIdx]["data"]["shape"] = shape;
            subView.add(shape);
        })
        .update(function (oldIdx, newIdx) {
            seriesView._visual.updateShape && seriesView._visual.updateShape(elements[newIdx]["data"]["shape"], subView);
        })
        .remove(function (oldIdx) {
            var shape = seriesView._oldElements[oldIdx]["data"]["shape"];
            seriesView._visual.removeShape && seriesView._visual.removeShape(shape, subView);
            delete seriesView._oldElements[oldIdx]["data"]["shape"];
            subView.remove(shape);
        })
        .execute(this._oldElements, elements, function (element) {
            return element["data"]["index"];
        });

        this._visual.afterRender && this._visual.afterRender(bbox, subView);

        this._oldElements = elements;
    }
}