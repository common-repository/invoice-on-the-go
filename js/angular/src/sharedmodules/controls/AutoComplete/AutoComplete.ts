import {
    AfterViewInit,
    Component,
    ContentChildren,
    ElementRef,
    EventEmitter, forwardRef,
    Input, Output,
    QueryList,
    ViewChild
} from "@angular/core";
let autoComplete=require('js-autocomplete/auto-complete');
import 'js-autocomplete/auto-complete.css';
import {AutoCompleteItem} from "./AutoCompleteItem";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
    selector:'autocomplete',
    providers:[{
        provide:NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => AutoComplete),
        multi:true
    }],
    template:'<input style="width: 100%;" #input  [class]="class" type="text" autocomplete="off" (change)="TextChanged($event)"/>'
})
export class AutoComplete implements AfterViewInit,ControlValueAccessor {
    @Input() class:string;
    @ViewChild('input') element:ElementRef;
    @ContentChildren(AutoCompleteItem) items: QueryList<AutoCompleteItem>;
    @Output() public ItemSelected = new EventEmitter<{Text:string,Value:any}>();
    private _onChange:any;
    private lastSelectedItem:{Text:string,Value:any}=null;
    ngAfterViewInit(): void {
        new autoComplete({
            selector:this.element.nativeElement,
            delay:0,
            minChars:0,
            source:(term,response)=>{

                term=term.toLowerCase().trim();
                let result=this.items.toArray().filter(x=>{
                    let label=x.Label.toLowerCase().trim();

                    return label.startsWith(term)&&label.length!=term.length;}).map(x=>x.Label);
                response(result);
            },
            onSelect:(event,term,item)=>
            {
                let selectedItem=this.items.find(x=>x.Label==term);
                this.lastSelectedItem={Text:term,Value:selectedItem.Value};
                if(selectedItem!=null)
                    this.ItemSelected.emit(this.lastSelectedItem);
                if(this._onChange!=null)
                    this._onChange(term);

            }
        });
    }


    TextChanged(event) {
        if(this.lastSelectedItem!=null&&this.lastSelectedItem.Text==this.element.nativeElement.value)
            return;
        if(this._onChange!=null)
            this._onChange(this.element.nativeElement.value);

        let Value=this.items.find(x=>x.Label.toLowerCase()==this.element.nativeElement.value);
        if(Value!=null)
            Value=Value.Value;
        this.lastSelectedItem={
            Text:this.element.nativeElement.value,
            Value:Value
        };

        this.ItemSelected.emit(this.lastSelectedItem);
    }

    registerOnChange(fn: any): void {
        this._onChange=fn;
    }

    registerOnTouched(fn: any): void {
    }

    setDisabledState(isDisabled: boolean): void {
    }

    writeValue(obj: any): void {
        if(this.element!=null)
            this.element.nativeElement.value=obj;
    }
}

declare let require:any;