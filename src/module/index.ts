import { SystemModule } from './system/system-module';
import { LedModule } from "./led/led-module";
import { TimedLightSettingsApi } from "./timed-lighting/module-timed-light-settings-api";
import { AuthModule } from "./auth/auth-module";
import { EffectorModule } from "./effector/effector-module";
import { OpenpixelModule } from './openpixel/openpixel-module';

export { SystemModule } from './system/system-module';
export { LedModule } from "./led/led-module";
export { TimedLightSettingsApi } from "./timed-lighting/module-timed-light-settings-api";
export { AuthModule } from "./auth/auth-module";
export { EffectorModule } from "./effector/effector-module";
export { OpenpixelModule } from './openpixel/openpixel-module';

export const Modules: any = {
    AuthModule,
    LedModule,
    TimedLightSettingsApi,
    EffectorModule,
    SystemModule,
    OpenpixelModule,
}