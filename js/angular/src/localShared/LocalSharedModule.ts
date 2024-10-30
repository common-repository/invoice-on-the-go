import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {ControlsModule} from "../sharedmodules/controls/controls.module";

import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule} from "@angular/forms";
import {WpElementsModule} from "../sharedmodules/wp-elements/wp-elements.module";
import {FormatDatePipe} from "./Pipes/FormatDatePipe";
import {FormatCurrency} from "./Pipes/FormatCurrency";
import {FormattedInputNumber} from "./Controls/FormattedInputNumber";





@NgModule({
    declarations: [
        FormatDatePipe,FormatCurrency,FormattedInputNumber
    ],
    imports: [
        BrowserModule,BrowserAnimationsModule,ControlsModule,FormsModule,WpElementsModule
    ],
    providers: [],
    bootstrap: [],
    exports:[FormatDatePipe,FormatCurrency,FormattedInputNumber]
})
export class LocalSharedModule { }
