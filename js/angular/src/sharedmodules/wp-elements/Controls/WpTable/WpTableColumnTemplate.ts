import {Component, ContentChild, ElementRef, TemplateRef, ViewChild} from "@angular/core";

@Component({
    selector:'wp-table-column-template',
    template:`
        <ng-content></ng-content>
    `
})
export class WpTableColumnTemplate{
    @ContentChild(TemplateRef)public Template: TemplateRef<any>;
}