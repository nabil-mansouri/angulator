import { InjectionToken } from "@angular/core";
import { NbModel } from "./nbmodel";

export const NB_CONTROL_RENDERER_TOKEN = new InjectionToken('NB_CONTROL_RENDERER_TOKEN');
export const NB_CONTROL_RENDERER_I18_TOKEN = new InjectionToken('NB_CONTROL_RENDERER_I18_TOKEN');

export interface I18ControlProvider {
    text(model: NbModel, key: string): string;
}
export interface ControlRenderer {
    unbind(model: NbModel);
    bind(model: NbModel);
    onValidationChange(model: NbModel);
    onValueChange(model: NbModel);
}