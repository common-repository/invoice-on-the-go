import {Component, ContentChild, ContentChildren, Input, QueryList} from "@angular/core";
import {WpTab} from "../WpTabs/WpTab";
import {WpTableColumnAction} from "./WpTableColumnAction";
import {WpTableColumnTemplate} from "./WpTableColumnTemplate";

@Component({
    selector:'wp-table-column',
    template:`
        
    `

})
export class WpTableColumn{
    @Input() Header:string;
    @Input() DataField:string;
    @ContentChildren(WpTableColumnAction)public Actions:QueryList<WpTableColumnAction>;
    @ContentChild(WpTableColumnTemplate)public ColumnTemplate:WpTableColumnTemplate;

}