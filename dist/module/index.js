"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const led_module_1 = require("./led/led-module");
const module_timed_light_settings_api_1 = require("./timed-lighting/module-timed-light-settings-api");
const auth_module_1 = require("./auth/auth-module");
const effector_module_1 = require("./effector/effector-module");
var led_module_2 = require("./led/led-module");
exports.LedModule = led_module_2.LedModule;
var module_timed_light_settings_api_2 = require("./timed-lighting/module-timed-light-settings-api");
exports.TimedLightSettingsApi = module_timed_light_settings_api_2.TimedLightSettingsApi;
var auth_module_2 = require("./auth/auth-module");
exports.AuthModule = auth_module_2.AuthModule;
var effector_module_2 = require("./effector/effector-module");
exports.EffectorModule = effector_module_2.EffectorModule;
exports.Modules = {
    LedModule: led_module_1.LedModule,
    TimedLightSettingsApi: module_timed_light_settings_api_1.TimedLightSettingsApi,
    AuthModule: auth_module_1.AuthModule,
    EffectorModule: effector_module_1.EffectorModule,
};
//# sourceMappingURL=index.js.map