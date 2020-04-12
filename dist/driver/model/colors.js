"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const led_module_1 = require("../../module/led/led-module");
class Colors {
    constructor() {
        this.red = { value: 0, vp: 0 };
        this.green = { value: 0, vp: 0 };
        this.blue = { value: 0, vp: 0 };
        this.coldWhite = { value: 0, vp: 0 };
        this.warmWhite = { value: 0, vp: 0 };
        this.ledState = 0;
        this.ledMode = led_module_1.LedModule.MANUAL_MODE_CODE;
    }
}
exports.Colors = Colors;
//# sourceMappingURL=colors.js.map