import {AfterContentChecked, Component, ContentChildren, OnInit, QueryList} from "@angular/core";
import {WpTab} from "./WpTab";
import {debug} from "util";
import {RnAnimationSwitchComponentsWithOpacity} from "../../../animations/RnAnimationSwitchComponentsWithOpacity";
import {animate, keyframes, style, transition, trigger} from "@angular/animations";

@Component({
    selector:'wp-tab-group',
    template:`
        <div class="nav-tab-wrapper">
            <a style="box-shadow: none;" [ngClass]="{'nav-tab-active':tab.Active,'rednao-wp-tab':true}" href="#" class="nav-tab" *ngFor="let tab of tabs" (click)="SelectTab(tab)">
                <i *ngIf="tab.IconClass!=''" [class]="tab.IconClass"></i>
                {{tab.Title}}
            </a>
        </div>
        <div style="background: white;padding:10px;border-left:1px solid #ccc;border-bottom:1px solid #ccc;border-right:1px solid #ccc;" [@AnimateTabContent]="SelectedTab" >
            <wp-tab-body *ngFor="let tab of tabs;" [Tab]="tab"  [ngClass]="{active:tab==SelectedTab}"></wp-tab-body>    
        </div>
        
        
    `,
    styles:[`
        .rednao-wp-tab.nav-tab-active{
            background-color:white;
            border-bottom-color: white;
        }
        wp-tab-body.active{
            display:block;
        }
        
        wp-tab-body{
            display: none;
        }
    `],
    animations:[trigger('AnimateTabContent',[
        transition('*=>*',[
            style({opacity:0}),
            animate('400ms')
        ])
    ])]
})
export class WpTabGroup implements AfterContentChecked{

    @ContentChildren(WpTab) tabs: QueryList<WpTab>;



    ngAfterContentChecked(): void {
        if(this.tabs.filter(x=>x.Active).length==0)
            this.tabs.first.Active=true;

        this.tabs.forEach((item,index)=>{item.Index=index});
    }

    SelectTab(tab:WpTab)
    {
        let previousSelected=this.tabs.find(x=>x.Active);
        if(previousSelected!=null)
            previousSelected.Active=false;
        tab.Active=true;
    }


    get SelectedTab():WpTab{
        return this.tabs.find(x=>x.Active);
    }

}