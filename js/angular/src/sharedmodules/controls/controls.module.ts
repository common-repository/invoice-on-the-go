import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {DatePicker} from "./inputs/DatePicker";
import {LaddaButton} from "./LaddaButton/LaddaButton";

import {Select2} from "./select2/Select2";
import {TaggedBox} from "./TaggedBox/TaggedBox";
import {TaggedBoxItem} from "./TaggedBox/TaggedBoxItem";
import {FormsModule} from "@angular/forms";
import {PreventDefault} from "./Directives/PreventDefault";
import {BasicDialog} from "./Dialog/BasicDialog";
import {AddValidationMessage} from "./Validations/AddValidationMessage";
import {BasicValidation} from "./Validations/BasicValidation";
import {DialogServices} from "./Services/Dialogs/DialogServices";
import {AutoComplete} from "./AutoComplete/AutoComplete";
import {AutoCompleteItem} from "./AutoComplete/AutoCompleteItem";


@NgModule({
  imports: [
      CommonModule,FormsModule
  ],
    entryComponents:[BasicValidation],
    providers:[DialogServices],
  declarations: [DatePicker,LaddaButton,Select2,TaggedBox,TaggedBoxItem,PreventDefault,BasicDialog,AddValidationMessage,BasicValidation,AutoComplete,AutoCompleteItem],
    exports:[DatePicker,LaddaButton,Select2,TaggedBox,TaggedBoxItem,PreventDefault,BasicDialog,AddValidationMessage,AutoComplete,AutoCompleteItem]
})
export class ControlsModule { }
