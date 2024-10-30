import {Component, EventEmitter, forwardRef, Input, Output} from "@angular/core";
import {ControlValueAccessor, DefaultValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {Select2} from "../../../controls/select2/Select2";

@Component({
    selector:'wp-image-holder',
    providers:[{
        provide:NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => WpImageHolder),
        multi:true
    }],
    template:`
        <div [ngStyle]="{'width':Width,'height':Height,'border':'1px solid #dfdfdf','cursor':'pointer'}" (click)="UploadFile()">
            <div *ngIf="Source==null; else imagePreview" style="width:100%;height: 100%;text-align: center;    display: flex;flex-direction: column;align-items: center;justify-content: center;">
                <i class="fas fa-upload"></i>
                <p>Click here to upload</p>
            </div>
        </div>
        
        <ng-template #imagePreview>
            <div style="width:100%;height: 100%;display: flex;justify-content: center;align-items: center;position: relative;">
                <div style="position: absolute;top:1px;right: 0px;" (click)="ClearImage($event)"><i class="fas fa-times-circle deleteIcon" ></i></div>
                <img style="max-width: 100%;max-height: 100%;" [src]="Source.url"/>
            </div>
        </ng-template>
    `,
    styles:[`
        .deleteIcon:hover{
            color:red;
        }
    `]
})
export class WpImageHolder implements ControlValueAccessor{

    @Input() Width:string='150px';
    @Input() Height:string='150px';

    private Source:WpImageHolderSource;
    private _onChange:any;
    //endregion

    UploadFile(){
        let frame:any=wp.media({
            title:'Select or upload your image',
            button:{
                text:'Use this image'
            },
            multiple:false
        });

        frame.on('select',()=>{
            let attachment = frame.state().get('selection').first().toJSON();
            console.log(attachment);
            this.Source={
                attachmentId:attachment.id,
                url:attachment.url
            }
            this._onChange(this.Source);
        });

        frame.open();
    }

    ClearImage(event) {
        event.stopImmediatePropagation();
        this.Source=null;
        this._onChange(this.Source);
    }

    writeValue(obj: WpImageHolderSource): void {
        this.Source=obj;
    }

    registerOnChange(fn: any): void {
        this._onChange=fn;
    }

    registerOnTouched(fn: any): void {
    }
}


declare let wp:any;
export interface WpImageHolderSource{
    attachmentId:string;
    url:string;
}