"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const color_1 = require("./color");
class Colors {
    constructor() {
        this.ledState = 0;
        this.red = new color_1.Color();
        this.green = new color_1.Color();
        this.blue = new color_1.Color();
        this.coldWhite = new color_1.Color();
        this.warmWhite = new color_1.Color();
        this.uv = new color_1.Color();
    }
}
exports.Colors = Colors;
//# sourceMappingURL=colors.js.map