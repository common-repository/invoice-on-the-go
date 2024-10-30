import {Directive, ElementRef} from "@angular/core";

@Directive({
    selector: '[PreventDefault]'
})
export class PreventDefault {
    constructor(el:ElementRef) {

        el.nativeElement.addEventListener('click',(event)=>{
            event.preventDefault()
        });
    }
}