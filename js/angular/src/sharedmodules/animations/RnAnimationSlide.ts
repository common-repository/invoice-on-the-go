import {animate, style, transition, trigger} from "@angular/animations";

export class RnAnimationSlide {
    public static Compile(): any {
        return trigger('AnimationSlide',[
                transition(':enter',[
                    style({height:0,overflow:'hidden','padding-top':0,'padding-bottom':0}),
                    animate('300ms')
                ]),
                transition(':leave',[
                    style({overflow:'hidden'}),
                    animate('300ms',style({height:0,'padding-top':0,'padding-bottom':0}))
                ]),
        ])

    }

}
