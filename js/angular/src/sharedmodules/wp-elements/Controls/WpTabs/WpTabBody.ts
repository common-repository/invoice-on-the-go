import {Component, Input, TemplateRef} from "@angular/core";
import {WpTab} from "./WpTab";
import {animate, keyframes, style, transition, trigger} from "@angular/animations";

@Component({
    selector:'wp-tab-body',
    template:`
        <div [class]="'tab_'+Tab.Index">
            <ng-container *ngTemplateOutlet="Tab.Content"></ng-container>
        </div>
    `

})
export class WpTabBody{
    @Input() Tab:WpTab;
}