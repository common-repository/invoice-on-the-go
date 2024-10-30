import {Component, Input} from "@angular/core";

@Component({
    selector:'autocomplete-item',
    template:''
})
export class AutoCompleteItem{
    @Input() public Label:string;
    @Input() public Value:any;
}