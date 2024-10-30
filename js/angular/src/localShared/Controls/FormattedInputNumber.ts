import {Component, forwardRef, Input, OnInit} from "@angular/core";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {DatePicker} from "../../sharedmodules/controls/inputs/DatePicker";

@Component({
    selector:'formatted-input-number',
    providers:[{
        provide:NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => FormattedInputNumber),
        multi:true
    }],
    template:'<input style="width:100%"  [ngStyle]="Styles" [disabled]="IsDisabled" type="number" [ngModel]="value" (ngModelChange)="InputChanged($event)" (change)="FormatNumber()"  (click)="$event.target.select()" />'
})
export class FormattedInputNumber implements ControlValueAccessor{
    private _numberOfDecimals=-1;
    @Input() public set NumberOfDecimals(value){
        this._numberOfDecimals=value;
        this.decimals=parseInt(value);
    }
    @Input() name:string;
    public IsDisabled:boolean=false;
    private _onChange:any;
    public value:string;
    public decimals=NaN;
    @Input() public Styles=null;

    registerOnChange(fn: any): void {
        this._onChange=fn;
    }

    registerOnTouched(fn: any): void {
    }

    setDisabledState(isDisabled: boolean): void {
        this.IsDisabled=isDisabled;
    }

    writeValue(obj: any): void {
        this.value=obj;
        this.FormatNumber();
    }

    InputChanged($event) {
        this.value=$event;
        this._onChange(parseFloat($event));
    }

    FormatNumber(){
        if(isNaN(this.decimals))
        {
            this.decimals=parseInt(rnparams.settings.GeneralOptions.NumberOfDecimals.toString());
            if(isNaN(this.decimals))
                this.decimals=0;

        }

        this.value=parseFloat(this.value).toFixed(this.decimals);
    }

}