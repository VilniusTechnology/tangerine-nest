import {Color} from './color';

export class Colors {
    public red: Color;
    public green: Color;
    public blue: Color;
    public coldWhite: Color;
    public warmWhite: Color;
    public uv: Color;
    public ledState: number = 0;

    constructor() {
        this.red = new Color();
        this.green = new Color();
        this.blue = new Color();
        this.coldWhite = new Color();
        this.warmWhite = new Color();
        this.uv = new Color();
    }
}
