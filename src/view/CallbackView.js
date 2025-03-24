import { View } from "./View"

export class CallbackView extends View {
    constructor(visual, callback) {
        super(visual);

        this._callback = callback;
    }

    renderByRange(bbox, subView, zoomChanged, type) {
        this._callback(bbox, subView);
    }
}