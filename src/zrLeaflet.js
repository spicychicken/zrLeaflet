import { ZLMapContainer } from "./ZLMapContainer"
import { View as ZLView } from "./view/View"
import { GeoJsonView as ZLGeoJsonView } from "./view/GeoJsonView"
import { ZRUtils } from "./zrender/ZRUtils"
import { ZRShape } from "./shape/ZRShape"

import { color } from "zrender"

export var MapContainer = ZLMapContainer;
export var View = ZLView;
export var GeoJsonView = ZLGeoJsonView;
export var Shape = ZRShape;

export function createBasicShape(type, shape, style) {
    return ZRUtils.createBasicShape(type, shape, style);
}

export var Utils = {
    "color": color
}