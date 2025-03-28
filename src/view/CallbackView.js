import { View } from "./View"

export class CallbackView extends View {
    constructor(visual) {
        super(visual);

        this._callback = visual.getSeries()["cb"];
    }

    renderByRange(bbox, subView, zoomChanged, type) {
        this._callback(bbox, subView);
    }
}