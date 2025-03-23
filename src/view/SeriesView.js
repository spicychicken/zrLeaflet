import { View } from "./View"
import { Quadtree, Line, Circle, Rectangle } from '@timohausmann/quadtree-ts';
import { ArrayDiffer } from '../utils/ArrayDiffer'

export class SeriesView extends View {
    constructor(series) {
        super(series["name"]);
        this._draw = series["draw"]
        this._data = series["data"]
        this._style = series["style"]
        this._oldElements = []

        this._geoQuadTree = new Quadtree({x: -90, y: -180 , width: 180, height: 360});

        for (var i = 0; i < this._data.length; ++i) {
            var boundingBox = this._draw.maxBoundingBox(this._data[i]);
            boundingBox[1]["data"] = {"index": i};
            if (boundingBox[0] == "circle") {
                this._geoQuadTree.insert(new Circle(boundingBox[1]));
            }
            else if (boundingBox[0] == "rectangle") {
                this._geoQuadTree.insert(new Rectangle(boundingBox[1]));
            }
            else {
                this._geoQuadTree.insert(new Line(boundingBox[1]));
            }
        }
    }

    renderByRange(bbox, subView, zoomChanged, type) {
        const area = new Rectangle({x: bbox.getWest(), y: bbox.getSouth(), width: bbox.getEast() - bbox.getWest(), height: bbox.getNorth() - bbox.getSouth()});
        const elements = this._geoQuadTree.retrieve(area);

        if (this._draw.hasOwnProperty("beforeDraw")) {
            this._draw.beforeDraw(subView);
        }

        var seriesView = this;
        new ArrayDiffer().add(function (newIdx) {
            var data = seriesView._data[elements[newIdx]["data"]["index"]];
            var symbolEl = seriesView._draw.createShape(data);
            var pos = subView.latLonToContainerPosition(symbolEl.getGeoCoord());
            symbolEl.setPosition([pos.x, pos.y]);
            elements[newIdx]["data"]["object"] = symbolEl;
            subView.add(symbolEl);
        })
        .update(function (oldIdx, newIdx) {

        })
        .remove(function (oldIdx) {

        })
        .execute(this._oldElements, elements, function (element) {
            return element["data"]["index"];
        });

        if (this._draw.hasOwnProperty("endDraw")) {
            this._draw.endDraw(subView);
        }

        this._oldElements = elements;
    }
}