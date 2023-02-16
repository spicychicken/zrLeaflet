import { BasicShape } from "../shape/BasicShape"

export class ZRUtils {
    static createBasicShape(id, type, shape, style = {}) {
        return new BasicShape(id, type, shape, style);
    }
}