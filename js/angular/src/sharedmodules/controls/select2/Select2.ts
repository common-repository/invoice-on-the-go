import {
    AfterContentInit, AfterViewChecked,
    AfterViewInit, Component, ElementRef, forwardRef, Input, OnInit, ViewChild
} from "@angular/core";
import 'select2/dist/js/select2.full';
import 'select2/dist/css/select2.css';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
@Component({
    selector:'select2',
    providers:[{
        provide:NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => Select2),
        multi:true
    }],
    template:`    
        <select #select [class]="class"  [ngStyle]="styles">
            <option></option>
            <ng-content></ng-content>
        </select>
    `
})
export class Select2 implements AfterViewInit,ControlValueAccessor{

    private _onChange:any;

    @ViewChild('select') select:ElementRef;
    @Input() class:string;
    @Input() placeholder:string='Select an item';
    @Input() styles;
    @Input() name;


    public initialized:boolean=false;



    ngAfterViewInit(): void {
        (jQuery(this.select.nativeElement) as any).select2({placeholder: this.placeholder}).on('change',()=>{

            if(this._onChange!=null){
                this._onChange((jQuery(this.select.nativeElement)as any).select2('val'));
            }


        });
    }

    writeValue(obj: any): void {

        if(this.select!=null&&jQuery(this.select.nativeElement).data('select2')!=null)
        {
            (jQuery(this.select.nativeElement) as any).val(obj);
            (jQuery(this.select.nativeElement) as any).trigger('change.select2');
        }
    }

    registerOnChange(fn: any): void {
        this._onChange=fn;
    }

    registerOnTouched(fn: any): void {
    }




}

declare let jQuery:any;