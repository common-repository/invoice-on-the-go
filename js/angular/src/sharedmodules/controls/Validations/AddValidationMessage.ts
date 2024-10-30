import {
    ComponentFactoryResolver, Directive, ElementRef, OnInit, ViewContainerRef
} from "@angular/core";
import {NgModel} from "@angular/forms";
import {BasicValidation} from "./BasicValidation";

@Directive({
    selector:'[add-validation-message]',
    providers:[NgModel],


})
export class AddValidationMessage implements OnInit{

    constructor(private resolver: ComponentFactoryResolver,public viewRef:ViewContainerRef,el:ElementRef,public ngModel:NgModel)
    {

    }

    ngOnInit(): void {
        let componentRef=this.viewRef.createComponent(this.resolver.resolveComponentFactory(BasicValidation));
        (componentRef as any).instance.Data=this.ngModel;
    }



}