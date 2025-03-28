export class Visual {
    constructor(series) {
        this._series = series;
    }

    getName() {
        return this._series["name"];
    }

    getSeries() {
        return this._series;
    }

    getSeriesData() {
        return this._series["data"];
    }

    static _visualTypes = {}
    static registerVisual(type, visual) {
        Visual._visualTypes[type] = visual;
    }

    static newVisual(type, series) {
        if (Visual._visualTypes.hasOwnProperty(type)) {
            return new Visual._visualTypes[type](series);
        }
        return undefined;
    }
}