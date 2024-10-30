import {
    Component, ContentChildren, ElementRef, forwardRef, Input, QueryList,
    ViewChild
} from "@angular/core";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {TaggedBoxItem} from "./TaggedBoxItem";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
    selector:'tagged-box',
    template:`
        <div style="position: relative" [ngClass]="class">
            <input [disabled]="disabled" [(ngModel)]="value" #input style="width: 100%;padding-right: 25px;" (change)="Change()"/>
            <div  [ngClass]="{'disabled':disabled}"  (click)="OpenSmartTag()" class="rnSmartTag" style="cursor:pointer;position:absolute;top:50%;margin-top:-6px;right: 1px;font-size:12px;line-height:12px">
                <i title="Insert Smart Tag"  class="fas fa-tags"></i>
            </div>
            <div [@AnimateDropDown]="DropDownStatus" [ngClass]="{'rnTaggedBoxDropDown':true,'rnOpen':DropDownStatus=='open',rnbt4:true}"  style="z-index: 10000;position: absolute;width:100%;top:calc(100% - 1px);left:0;border: 1px #999 solid;background-color:white;overflow-y: auto;">
                <div class="list-group">
                    <a *ngFor="let item of items" style="cursor: pointer" (click)="ItemSelected(item)" class="list-group-item list-group-item-action">{{item.Label}}</a>
                </div>
            </div>
        </div>
    `,
    providers:[{
        provide:NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => TaggedBox),
        multi:true
    }],
    styles:[`
        .rnSmartTag:hover{
            color:red;
        }
        
        .rnTaggedBoxDropDown .list-group a{
            margin:0;
            border-left:none;
            border-right: none;
        }

        .rnSmartTag.disabled{
            color:#dfdfdf;
            
        }
      
    `],animations:[trigger('AnimateDropDown',[
        state('open',style({
            'max-height':'150px',
            display:'block'
        })),
        state('closed',style({
            'max-height':'0',
            display:'none'
        })),
        transition('*=>*',animate('300ms ease-in-out'))
    ])]
})
export class TaggedBox implements ControlValueAccessor{
    //region ngModel Property
    public value:string;
    public _onChange:any;
    @Input() public disabled:boolean=false;

    @Input() class:string;
    @ContentChildren(TaggedBoxItem) items: QueryList<TaggedBoxItem>;
    @ViewChild('input') input:ElementRef;
    public DropDownStatus:'open'|'closed'='closed';
    OpenSmartTag() {
        this.DropDownStatus="open";
        let dropDownFunction=(event:MouseEvent)=>{
            this.DropDownStatus='closed';
            document.removeEventListener('mousedown',dropDownFunction);
        };
        document.addEventListener('mousedown',dropDownFunction);
    }

    Change(){
        this._onChange(this.value);
    }

    ItemSelected(item:TaggedBoxItem) {
       let position=this.input.nativeElement.selectionStart;
       this.value=this.value.slice(0,position)+item.Code+this.value.slice(position);
        this._onChange(this.value);
    }

    writeValue(obj:string): void {
        this.value=obj;
    }

    registerOnChange(fn: any): void {
        this._onChange=fn;
    }

    registerOnTouched(fn: any): void {
    }

    setDisabledState(isDisabled:boolean):void{
        this.disabled=isDisabled;
    }
}
