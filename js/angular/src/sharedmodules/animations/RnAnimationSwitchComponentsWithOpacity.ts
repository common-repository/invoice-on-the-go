import {AnimationBase} from "./AnimationBase";
import {animate, keyframes, query, style, transition, trigger} from "@angular/animations";

export class RnAnimationSwitchComponentsWithOpacity extends AnimationBase{
    Compile(): any {
        return trigger('AnimationSwitchComponentsWithOpacity',[
                transition(':enter',[
                    animate('300ms',keyframes([
                        style({opacity:0,transform:'scaleY(0) scaleX(0)',offset:0}),
                        style({offset:.5}),
                        style({opacity:1,transform:'scaleY(1) scaleX(1)',offset:1})
                    ]))
                ]),
                transition(':leave',[
                    animate('300ms',keyframes([
                        style({opacity:1,display:'scaleY(1) scaleX(1)',offset:0}),
                        style({opacity:0,display:'scaleY(0) scaleX(0)',offset:.5})
                    ]))
                ])
        ])

    }

}