import { LedModule } from "./led/led-module";
import { TimedLightSettingsApi } from "./timed-lighting/module-timed-light-settings-api";
import { AuthModule } from "./auth/auth-module";
import { EffectorModule } from "./effector/effector-module";

export { LedModule } from "./led/led-module";
export { TimedLightSettingsApi } from "./timed-lighting/module-timed-light-settings-api";
export { AuthModule } from "./auth/auth-module";
export { EffectorModule } from "./effector/effector-module";

export const Modules: any = {
    LedModule,
    TimedLightSettingsApi,
    AuthModule,
    EffectorModule,
}