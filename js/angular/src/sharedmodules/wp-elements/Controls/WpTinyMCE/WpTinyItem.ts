import {Component, Input} from "@angular/core";

@Component({
    selector:'wp-tiny-item',
    template:''
})
export class WpTinyItem{
    @Input() Label:string='';
    @Input() Code:string='';
}