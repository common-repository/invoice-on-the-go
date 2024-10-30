import {Component, Input} from "@angular/core";
import {RnAnimationSlide} from "../../animations/RnAnimationSlide";

@Component({
    template:`        
            <div class="InvalidMessage" *ngIf="Data.invalid && Data.dirty&&Data.errors.required" [@AnimationSlide]>
                Required field
            </div>
            <div class="InvalidMessage" *ngIf="Data.invalid && Data.dirty&&Data.errors.email" [@AnimationSlide]>
                Invalid email
            </div>
        `,
    animations:[RnAnimationSlide.Compile()]

})
export class BasicValidation{
    @Input() public Data:any;
}