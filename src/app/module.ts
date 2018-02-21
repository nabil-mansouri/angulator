import { NgModule, NgZone, ApplicationModule, ModuleWithProviders } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NbGroup, } from './nbgroup';
import { NbModel } from './nbmodel';
import { ACCESSORS } from './accessor';
import { BrowserModule } from '@angular/platform-browser';


export * from "./annotations";
export * from "./validators";
export { NbGroup, NbModel, ACCESSORS };
@NgModule({
    declarations: [NbGroup, NbModel, ACCESSORS],
    imports: [ ],
    exports: [NbGroup, NbModel, ACCESSORS]
})
export class AngulatorModule {

}
