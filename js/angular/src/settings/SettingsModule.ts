import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {SettingsComponent} from "./SettingsComponent";
import {WpElementsModule} from "../sharedmodules/wp-elements/wp-elements.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {GeneralTabComponent} from "./GeneralTabComponent";
import {ControlsModule} from "../sharedmodules/controls/controls.module";
import {BusinessTabComponent} from "./BusinessTabComponent";
import {EmailTabComponent} from "./EmailTabComponent";
import {TaxTabComponent} from "./TaxTabComponent";
import {InvoiceTabComponent} from "./InvoiceTabComponent";
import {PaymentTabComponent} from "./PaymentTabComponent";
import {FormsModule} from "@angular/forms";
import {BankAccountsComponent} from "./BankAccountsComponent";


@NgModule({
    declarations: [
        SettingsComponent,GeneralTabComponent,BusinessTabComponent,EmailTabComponent,TaxTabComponent,InvoiceTabComponent,PaymentTabComponent,BankAccountsComponent
    ],
    imports: [
        BrowserModule,WpElementsModule,BrowserAnimationsModule,ControlsModule,FormsModule
    ],
    providers: [],
    bootstrap: [SettingsComponent]
})
export class SettingsModule { }
