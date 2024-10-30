import {Component, EventEmitter, Input, Output} from "@angular/core";

@Component({
    selector:'payment-tab',
    template:`
        <h3>Payment</h3>
        <wp-tab-group>
            <wp-tab Title="Paypal" IconClass="fab fa-paypal">
                <table class="form-table">
                    <tr>
                        <th>Enable</th>
                        <td><input type="checkbox" style="margin:0" class="regular-text" [(ngModel)]="Options.PayPalPaymentOptions.Enable"/></td>
                    </tr>
                    <tr>
                        <th>Paypal Email</th>
                        <td><input [disabled]="!Options.PayPalPaymentOptions.Enable" style="margin:0" class="regular-text" [(ngModel)]="Options.PayPalPaymentOptions.PayPalEmail"/></td>
                    </tr>
                    <tr>
                        <th>Currency</th>
                        <td>
                            <select [disabled]="!Options.PayPalPaymentOptions.Enable" [(ngModel)]="Options.PayPalPaymentOptions.Currency">
                                <option value="USD">USD</option><option value="AUD">AUD</option><option value="BRL">BRL</option><option value="GBP">GBP</option><option value="CAD">CAD</option><option value="CZK">CZK</option><option value="DKK">DKK</option><option value="EUR">EUR</option><option value="HKD">HKD</option><option value="HUF">HUF</option><option value="ILS">ILS</option><option value="JPY">JPY</option><option value="MXN">MXN</option><option value="TWD">TWD</option><option value="NZD">NZD</option><option value="NOK">NOK</option><option value="PHP">PHP</option><option value="PLN">PLN</option><option value="SGD">SGD</option><option value="SEK">SEK</option><option value="CHF">CHF</option><option value="THB">THB</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <th>Enable Paypal Sandbox</th>
                        <td>
                            <input [disabled]="!Options.PayPalPaymentOptions.Enable" style="margin:0" type="checkbox" [(ngModel)]="Options.PayPalPaymentOptions.Sandbox"/>
                            <p><strong>Important:</strong> Set this to true only for testing and only if you want to use the paypal sandbox.</p>
                            <p>While this box is checked you won't be able to receive real payments through paypal.</p>
                        </td>
                    </tr>
                </table>
            </wp-tab>
            <wp-tab Title="Bank Transfer" IconClass="fas fa-university">
                <bank-accounts [Options]="Options.BankTransferOptions"></bank-accounts>
                <a [ngClass]="{'disabled':!Options.BankTransferOptions.Enable}" PreventDefault class="button-secondary" (click)="AddBankAccount()"> <i class="fas fa-plus"></i> Add Item</a>
            </wp-tab>
            
        </wp-tab-group>
        
    `
})
export class PaymentTabComponent{
//region Options Property
    private _options: PaymentOptions = null;
    @Output() OptionsChange = new EventEmitter<PaymentOptions>();

    @Input() get Options(): PaymentOptions {
        return this._options;

    }

    set Options(value: PaymentOptions) {
        let previousValue = this._options;
        this._options = value;
        if (value != previousValue)
            this.OptionsChange.emit(value);
    }

//endregion
    AddBankAccount() {
        if(!this._options.BankTransferOptions.Enable)
            return;
        this.Options.BankTransferOptions.BankAccounts.push({
            AccountName:'',
            AccountNumber:'',
            BankName:'',
            BICSWIFT:'',
            IBAN:'',
            SortCode:''
        })
    }
}