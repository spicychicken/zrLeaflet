// View -> ID:ZRContainer -> ID:Object
// View -> ID: {ZRContainer, Object}

export class View {
    constructor(visual) {
        this._visual = visual;
    }

    getName() {
        return this._visual.getName();
    }

    show() {
        if (this._lLayer) {
            this._lLayer.showView(this);
        }
    }

    hide() {
        if (this._lLayer) {
            this._lLayer.hideView(this);
        }
    }

    getLayer() {
        return this._lLayer;
    }

    setLayer(lLayer) {
        this._lLayer = lLayer;
        return this;
    }

    invalidate() {
        if (this._lLayer) {
            this._lLayer.refreshView(this);
        }
    }

    renderByRange(bbox, subView, zoomChanged, type) {
        this._visual.beforeRender && this._visual.beforeRender(bbox, subView);

        this._visual.render && this._visual.render([], subView);

        this._visual.afterRender && this._visual.afterRender(bbox, subView);
    }
}