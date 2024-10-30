import {
    AfterViewInit,
    Component,
    ElementRef,
    forwardRef, ViewChild
} from "@angular/core";

import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

require('style-loader!bootstrap-datepicker/dist/css/bootstrap-datepicker3.css');
require('bootstrap-datepicker');
@Component({
    selector:'date-picker',
    providers:[{
        provide:NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => DatePicker),
        multi:true
    }],
    template:'<div style="position: relative"><input  style="width:100%" #input/></div>'
})
export class DatePicker implements AfterViewInit, ControlValueAccessor{

    @ViewChild('input') input:ElementRef;

    private _onChange:any;
    private lastValue:any;
    constructor()
    {

    }




    ngAfterViewInit(): void {
        (jQuery(this.input.nativeElement) as any).datepicker(
            {
                format:'M/dd/yyyy',
                autoclose: true,
                container:this.input.nativeElement.parentNode
            });

        (jQuery(this.input.nativeElement) as any).on('change',(e)=>{
            if(this._onChange!=null)
            {

                let value=(jQuery(this.input.nativeElement) as any).datepicker('getDate').getTime();
                if(value!=this.lastValue)
                    this._onChange(value);
                this.lastValue=value;
            }

        });
    }

    registerOnChange(fn: any): void {
        this._onChange=fn;
    }

    registerOnTouched(fn: any): void {
    }

    setDisabledState(isDisabled: boolean): void {
    }

    writeValue(obj: any): void {
        this.lastValue=obj;
        if(obj==0||obj==null)
            (jQuery(this.input.nativeElement) as any).datepicker('setDate','');
        else
            (jQuery(this.input.nativeElement) as any).datepicker('setDate',new Date(parseInt(obj)));

    }
}
declare let require:any;
declare let jQuery:any;