import {Component, EventEmitter, Input, Output} from "@angular/core";

@Component({
    selector:'invoice-tab',
    template:`
        <h3>Invoice</h3>
        <table class="form-table">
            <tr>
                <th>Prefix</th>
                <td>
                    <input class="regular-text" [(ngModel)]="Options.Prefix"/>
                </td>
            </tr>
            <tr>
                <th>Suffix</th>
                <td>
                    <input class="regular-text" [(ngModel)]="Options.Suffix"/>
                </td>
            </tr>
            <tr>
                <th>Next Number</th>
                <td>
                    <input type="number" style="width: 100px;" [(ngModel)]="Settings.NextInvoiceNumber"/>
                </td>
            </tr>
            <tr>
                <th>Number of Digits</th>
                <td>
                    <input type="number" style="width: 100px;" [(ngModel)]="Options.NumberOfDigits"/>
                </td>
            </tr>
            <tr>
                <th style="padding-bottom:10px;">Terms and conditions</th>
            </tr>
            <tr>
                <td colspan="2" style="padding:0 10px 0 10px;">
                    <wp-tinymce Height="200" [(ngModel)]="Options.TermsAndConditions"></wp-tinymce>
                </td>
            </tr>

            <tr>
                <th style="padding-bottom:10px;">Footer</th>
            </tr>
            <tr>
                <td colspan="2" style="padding:0 10px 0 10px;" >
                    <wp-tinymce Height="200" [(ngModel)]="Options.Footer"></wp-tinymce>
                </td>
            </tr>
            
        </table>
    `

})
export class InvoiceTabComponent{
    //region Options Property
    private _options: InvoiceOptions = null;
    @Output() OptionsChange = new EventEmitter<InvoiceOptions>();
    @Input() Settings:Settings;

    @Input() get Options(): InvoiceOptions {
        return this._options;
    }

    set Options(value: InvoiceOptions) {
        let previousValue = this._options;
        this._options = value;
        if (value != previousValue)
            this.OptionsChange.emit(value);
    }

    //endregion
}