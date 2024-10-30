import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {InvoiceComponent} from "./InvoiceComponent";
import {ControlsModule} from "../sharedmodules/controls/controls.module";

import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule} from "@angular/forms";
import {WpElementsModule} from "../sharedmodules/wp-elements/wp-elements.module";
import {LocalSharedModule} from "../localShared/LocalSharedModule";





@NgModule({
    declarations: [
        InvoiceComponent
    ],
    imports: [
        BrowserModule,BrowserAnimationsModule,ControlsModule,FormsModule,WpElementsModule,LocalSharedModule
    ],
    providers: [],
    bootstrap: [InvoiceComponent]
})
export class InvoiceModule { }
