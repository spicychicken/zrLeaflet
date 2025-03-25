export class ArrayDiffer {
    constructor() {
    }

    add(func) {
        this._add = func;
        return this;
    }

    update(func) {
        this._update = func;
        return this;
    }

    remove(func) {
        this._remove = func;
        return this;
    }

    execute(oldData, newData, keyGetter) {
        var oldKeyIndexMap = {};
        var newKeyIndexMap = {};

        for (var i = 0; i < oldData.length; i++) {
            oldKeyIndexMap[keyGetter(oldData[i])] = i;
        }
        for (var i = 0; i < newData.length; i++) {
            newKeyIndexMap[keyGetter(newData[i])] = i;
        }

        for (i = 0; i < oldData.length; i++) {
            var key = keyGetter(oldData[i]);
            var idx = newKeyIndexMap[key];

            if (idx != null) {
                this._update && this._update(i, idx);      // update new (new and old both exist)
            }
            else {
                this._remove && this._remove(i);      // remove old
            }
        }

        for (var i = 0; i < newData.length; i++) {
            var key = keyGetter(newData[i]);
            var idx = oldKeyIndexMap[key];

            if (idx == null) {
                this._add && this._add(i);            // add new
            }
        }
    }
}