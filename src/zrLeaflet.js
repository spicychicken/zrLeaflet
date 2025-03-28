import * as zrender from "zrender"
import * as leaflet from "leaflet"
import { ZLMapContainer } from "./ZLMapContainer"
import { View as ZLView } from "./view/View"
import { ZRShape } from "./shape/ZRShape"
import { Visual as ZLVisual } from "./visual/Visual"
import { ShapeCreator } from "./shape/ShapeCreator"


export var MapContainer = ZLMapContainer;
export var View = ZLView;
export var Shape = ZRShape;
export var Visual = ZLVisual;
export var Z = zrender;
export var L = leaflet;
export var createShape = ShapeCreator.create;