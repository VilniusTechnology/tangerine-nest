import { LedModule } from "../../module/led/led-module";

export class Colors {

    public red = {value: 0, pv: 0};
    public green = {value: 0, pv: 0};
    public blue = {value: 0, pv: 0};

    public coldWhite = {value: 0, pv: 0};
    public warmWhite = {value: 0, pv: 0};

    public ledState = 0;
    public ledMode = LedModule.MANUAL_MODE_CODE;

}