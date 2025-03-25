import { ZLMapContainer } from "./ZLMapContainer"
import { View as ZLView } from "./view/View"
import { GeoJsonView as ZLGeoJsonView } from "./view/GeoJsonView"
import { ZRUtils } from "./zrender/ZRUtils"
import { ZRShape } from "./shape/ZRShape"
import { Visual as ZLVisual } from "./visual/Visual"

import { color } from "zrender"

export var MapContainer = ZLMapContainer;
export var View = ZLView;
export var GeoJsonView = ZLGeoJsonView;
export var Shape = ZRShape;
export var Visual = ZLVisual;

export function createBasicShape(type, bound, style) {
    return ZRUtils.createBasicShape(type, bound, style);
}

export function createGroup() {
    return ZRUtils.createGroup();
}

export var Utils = {
    "color": color
}