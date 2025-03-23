import { View } from "./View"

export class CallbackView extends View {
    constructor(name, callback) {
        super(name);

        this._callback = callback;
    }

    renderByRange(bbox, subView, zoomChanged, type) {
        this._callback(bbox, subView);
    }
}