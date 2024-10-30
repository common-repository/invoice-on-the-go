import {Component, ContentChildren, EventEmitter, Input, Output, QueryList} from "@angular/core";
import {WpTab} from "../WpTabs/WpTab";

@Component({
    selector:'wp-table-column-action',
    template:`
        
    `

})
export class WpTableColumnAction{
    @Input() Label:string;
    @Output() public Click=new EventEmitter<any>();
}