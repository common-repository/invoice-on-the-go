import {
    AfterViewInit, Component, ContentChildren, ElementRef, forwardRef, Input, QueryList,
    ViewChild
} from "@angular/core";
import {WpTinyItem} from "./WpTinyItem";
import {Select2} from "../../../controls/select2/Select2";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

tinymce.baseURL = rnparams.url+'js/lib/tn';
@Component({
    selector:'wp-tinymce',
    providers:[{
            provide:NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => WpTinyMCE),
            multi:true
        }],
    template:`
        <ng-container *ngIf="items.length<=0;else tinyWithItems">
            <textarea #textarea></textarea>    
        </ng-container>
        <ng-template #tinyWithItems>
            <div class="rnbt4">
                <table width="100%">
                    <tr>
                        <td style="padding:0;margin:0;width:80%;display: inline-block;">
                            <textarea #textarea></textarea>
                        </td>
                        <td style="padding:0;margin:0;vertical-align: top;width: 20%;display: inline-block;">
                            <div [ngStyle]="{'max-height':Height+32+'px','overflow-y':'auto'}">
                                <ul class="list-group">
                                    <li style="padding: 1px;text-align: center;" class="list-group-item"><strong>Smart Tags</strong></li>
                                    <li  (click)="InsertCode($event,item.Code)" *ngFor="let item of items" style="text-align: center;margin:0;"><a  style="box-shadow: none;" href="#" class="list-group-item list-group-item-action">{{item.Label}}</a></li>
                                </ul>
                            </div>
                        </td>
                    </tr>
                </table>
               
                
            </div>
        </ng-template>
        `
})
export class WpTinyMCE implements AfterViewInit,ControlValueAccessor{

    @ViewChild('textarea') textArea:ElementRef;
    @ContentChildren(WpTinyItem) items: QueryList<WpTinyItem>;
    private editor;
    private _OnChange:any;
    private initialIsDisabled=false;
    private _initialValue:any='';
    private _editorInitialize:boolean=false;
    @Input() Height:number=400;

    ngAfterViewInit(): void {
        tinymce.init({
            forced_root_blocks: false,
            target:this.textArea.nativeElement,
            statusbar:false,
            menubar:false,
            height:this.Height,
            init_instance_callback:()=>{
                this._editorInitialize=true;
                this.editor.setContent(this._initialValue);
                if(this.initialIsDisabled)
                    this.setDisabledState(this.initialIsDisabled);
            },
            setup:  (editor) =>{
                this.editor=editor;
                this.editor.on('change',()=>{
                    this._OnChange(this.editor.getContent());
                });
            }
        })
    }

    InsertCode(event,code: string) {
        event.preventDefault();
        this.editor.execCommand('mceInsertContent',false,code);
    }

    writeValue(obj: any): void {
        if(!this._editorInitialize)
            this._initialValue=obj;
        else {
            this.editor.setContent(obj);
        }
    }

    setDisabledState?(isDisabled): void
    {
        if(this.editor==null) {
            this.initialIsDisabled=isDisabled;
            return;
        }
        if(isDisabled) {
            this.editor.setMode('readonly');
            this.editor.getBody().style.backgroundColor='#dfdfdf';
        }
        else {
            this.editor.setMode('design');
            this.editor.getBody().style.backgroundColor='white';
        }

    }


    registerOnChange(fn: any): void {
        this._OnChange=fn;
    }

    registerOnTouched(fn: any): void {
    }
}

declare let tinymce:any;
declare let rnparams:any;