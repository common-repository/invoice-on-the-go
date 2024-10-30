import {Component, Input} from "@angular/core";

@Component({
    selector:'tagged-box-item',
    template:''
})
export class TaggedBoxItem{
    @Input() Label:string;
    @Input() Code:string;
}