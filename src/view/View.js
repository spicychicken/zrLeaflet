// View -> ID:ZRContainer -> ID:Object
// View -> ID: {ZRContainer, Object}

export class View {
    constructor(name) {
        this._name = name;
    }

    getName() {
        return this._name;
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
}