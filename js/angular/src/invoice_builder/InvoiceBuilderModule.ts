import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {ControlsModule} from "../sharedmodules/controls/controls.module";

import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule} from "@angular/forms";
import {WpElementsModule} from "../sharedmodules/wp-elements/wp-elements.module";
import {InvoiceBuilderComponent} from "./InvoiceBuilderComponent";
import {UserDialog} from "./dialogs/UserDialog";
import {InvoiceDetails} from "./InvoiceDetails";
import {InvoiceDetailsItem} from "./InvoiceDetailsItem";
import {Payments} from "./Payments/Payments";
import {PaymentItem} from "./Payments/PaymentItem";
import {InvoiceBuilderEventManager} from "./utils/InvoiceBuilderEventManager";
import {LocalSharedModule} from "../localShared/LocalSharedModule";







@NgModule({
    declarations: [
        InvoiceBuilderComponent,UserDialog,InvoiceDetails,InvoiceDetailsItem,Payments,PaymentItem
    ],
    imports: [
        BrowserModule,BrowserAnimationsModule,ControlsModule,FormsModule,WpElementsModule,LocalSharedModule
    ],
    providers: [InvoiceBuilderEventManager],
    bootstrap: [InvoiceBuilderComponent]
})
export class InvoiceBuilderModule { }
