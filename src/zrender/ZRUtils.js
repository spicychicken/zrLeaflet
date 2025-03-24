import { BasicShape } from "../shape/BasicShape"
import { Group } from "zrender"

export class ZRUtils {
    static createBasicShape(type, bound, style = {}) {
        return new BasicShape(type, bound, style);
    }

    static createGroup() {
        return new Group();
    }
}