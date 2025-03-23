import { BasicShape } from "../shape/BasicShape"

export class ZRUtils {
    static createBasicShape(type, shape, style = {}) {
        return new BasicShape(type, shape, style);
    }
}