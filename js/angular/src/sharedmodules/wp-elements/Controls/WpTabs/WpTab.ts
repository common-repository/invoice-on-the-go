import {Component, Input, TemplateRef, ViewChild} from "@angular/core";
import {animate, keyframes, style, transition, trigger} from "@angular/animations";

@Component({
    selector:'wp-tab',
    template:`<ng-template><ng-content></ng-content></ng-template>`
})
export class WpTab{
    @Input() public Title:string;
    @Input() public Active:boolean;
    @ViewChild(TemplateRef) Content: TemplateRef<any>;
    @Input() public IconClass:string='';
    public Index:number;
}