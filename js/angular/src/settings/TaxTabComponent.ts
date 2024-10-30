import {Component, EventEmitter, Input, Output} from "@angular/core";
import {RnAnimationSlide} from "../sharedmodules/animations/RnAnimationSlide";

@Component({
    selector:'tax-tab',
    template:`
        <h3>Tax</h3>
        <table class="form-table">
            <tr>
                <th>Enable</th>
                <td><input style="margin:0" type="checkbox" [(ngModel)]="Options.Enable"/></td>
            </tr>
            <tr>
                <th>Tax Type</th>
                <td>
                    <select [disabled]="!Options.Enable" class="regular-text" [(ngModel)]="Options.TaxType">
                        <option value="general">General (recommended, all taxable items will have the same tax rate)</option>
                        <option value="itemized">Itemized (each taxable item can have a different tax rate)</option>
                        
                    </select>
                </td>
            </tr>
            <tr>
                <th>Tax Name</th>
                <td>
                    <input style="border-width:1px;border-style: solid;border-color:rgb(221,221,221);" [disabled]="!Options.Enable" class="regular-text"  [(ngModel)]="Options.TaxName"/>
                </td>
            </tr>
            <tr *ngIf="Options.TaxType=='general'">
                <th>Tax Percentage</th>
                <td>
                    <input [disabled]="!Options.Enable"  type="number" class="small-text"  [(ngModel)]="Options.TaxRate"/>
                </td>
            </tr>
            
        </table>
    `,
    animations:[RnAnimationSlide.Compile()]
})
export class TaxTabComponent{
//region Options Property
    private _options: TaxesOptions = null;
    @Output() OptionsChange = new EventEmitter<TaxesOptions>();

    @Input() get Options(): TaxesOptions {
        return this._options;
    }

    set Options(value: TaxesOptions) {
        let previousValue = this._options;
        this._options = value;
        if (value != previousValue)
            this.OptionsChange.emit(value);
    }

//endregion

}