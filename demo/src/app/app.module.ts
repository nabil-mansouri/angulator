import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule, NgZone, ApplicationModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'
import { FormsModule } from '@angular/forms'; import { HttpModule } from '@angular/http';

import {
  AngulatorModule
} from "angulator";
import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, ApplicationModule, AngulatorModule 
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
