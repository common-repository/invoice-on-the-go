import {Component, Input} from "@angular/core";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
    selector:'wp-panel',
    template:`
        <div class="rnPanel" style="border: 1px solid #e5e5e5;box-shadow: 0 1px 1px rgba(0,0,0,.04);margin-bottom: 10px;">
            <div [ngStyle]="{'background-color':TitleBackgroundColor}"  class="title" style="position: relative;border-bottom: 1px solid #eee;">
                <h2 style="font-size: 14px;padding: 8px 12px;margin:0;">{{Title}}</h2>
                <div [ngClass]="{open:IsOpen}" (click)="Toggle()" class="rnCarret" style="position: absolute; right: 10px;font-size: 20px;top:50%;margin-top:-10px;cursor:pointer;">
                    <i class="fas fa-caret-up"></i>
                </div>
            </div>
            <div style="background-color:white;" class="rnPanelContainer" [@AnimationOpen]="IsOpen">
                <div style="padding:12px;">
                    <ng-content></ng-content>    
                </div>
            </div>

        </div>
    `,
    styles:[`
        .rnCarret{
            transition: transform ease-in-out 300ms;
        }
        
        .rnCarret.open{
            transform:rotate(180deg);
        }
        
        .rnPanelContainer.ng-animating{
            overflow: hidden;
        }
    `],
    animations:[
        trigger('AnimationOpen',[
            state('true',style({
                height:'*'
            })),
            state('false',style({
                height:0,
                display:'none'
            })),
            transition('*=>*',[
                animate('0.3s ease-in-out')
            ])
        ])
        ]

})
export class WpPanel {
    @Input() public Title:string;
    @Input() public Icon:string;
    @Input() public IsOpen:boolean=true;
    @Input() public TitleBackgroundColor:string='white';

    Toggle() {
        this.IsOpen=!this.IsOpen;
    }
}