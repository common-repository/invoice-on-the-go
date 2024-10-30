import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {WpElementsModule} from "../sharedmodules/wp-elements/wp-elements.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ControlsModule} from "../sharedmodules/controls/controls.module";
import {FormsModule} from "@angular/forms";
import {ServicesComponent} from "./ServicesComponent";
import {ServiceDialogComponent} from "./ServiceDialogComponent";
import {LocalSharedModule} from "../localShared/LocalSharedModule";


@NgModule({
    declarations: [
        ServicesComponent,ServiceDialogComponent
    ],
    imports: [
        BrowserModule,WpElementsModule,BrowserAnimationsModule,ControlsModule,FormsModule,LocalSharedModule
    ],
    exports:[ServiceDialogComponent],
    providers: [],
    bootstrap: [ServicesComponent]
})
export class ServicesModule { }
