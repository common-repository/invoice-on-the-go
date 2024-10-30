import {Component, EventEmitter, Input, Output} from "@angular/core";

@Component({
    selector:'general-tab',
    template:`
        <h3>General Options</h3>
        <table class="form-table">
            <tr>
                <th>Admin Email</th>
                <td>
                    <input [(ngModel)]="Options.AdminEmail" class="regular-text"/>
                </td>
            </tr>
            <tr>
                <th>Admin Name</th>
                <td>
                    <input [(ngModel)]="Options.AdminName" class="regular-text"/>
                </td>
            </tr>
        </table>
        <h3>Currency And Date Options</h3>
        <table class="form-table">
            <tr>
                <th>Currency Symbol</th>
                <td>
                    <input class="regular-text" [(ngModel)]="Options.Currency"/>
                </td>
            </tr>
            <tr>
                <th>Currency Position</th>
                <td>
                    <select class="regular-text" [(ngModel)]="Options.CurrencyPosition">
                        <option value="left"  selected='selected'>Left ($99.99)</option>
                        <option value="right" >Right (99.99$)</option>
                        <option value="left_space" >Left with space ($ 99.99)</option>
                        <option value="right_space" >Right with space (99.99 $)</option>
                    </select>
                </td>
            </tr>
            <tr>
                <th>Thousand Separator</th>
                <td>
                    <input style="width: 50px;" [(ngModel)]="Options.ThousandSeparator"/>
                </td>
            </tr>
            <tr>
                <th>Decimal Separator</th>
                <td>
                    <input style="width: 50px;" [(ngModel)]="Options.DecimalSeparator"/>
                </td>
            </tr>
            <tr>
                <th>Number of Decimals</th>
                <td>
                    <input style="width: 50px;" [(ngModel)]="Options.NumberOfDecimals"/>
                </td>
            </tr>
        </table>
       
    `
})
export class GeneralTabComponent{
    //region Options Property
    private _options: GeneralOptions = null;
    @Output() OptionsChange = new EventEmitter<GeneralOptions>();

    @Input() get Options(): GeneralOptions {
        return this._options;
    }

    set Options(value: GeneralOptions) {
        let previousValue = this._options;
        this._options = value;
        if (value != previousValue)
            this.OptionsChange.emit(value);
    }

    //endregion
}