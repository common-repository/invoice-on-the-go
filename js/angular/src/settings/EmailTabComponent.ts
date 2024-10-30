import {Component, EventEmitter, Input, Output} from "@angular/core";

@Component({
    selector:'email-tab',
    template:`
        <table class="form-table">
            <tr>
                <th>Email Name</th>
                <td><input style="margin:0" class="regular-text"   [(ngModel)]="Options.FromEmailOptions.Name"/></td>
            </tr>
            <tr>
                <th>Email Address</th>
                <td><input placeholder="Default (recommended)" style="margin:0"  class="regular-text" [(ngModel)]="Options.FromEmailOptions.Email"/></td>
            </tr>
        </table>
        <wp-tab-group>
            <wp-tab Title="Pending Payment">
                <table class="form-table">
                    <tr>
                        <th>Enable</th>
                        <td><input style="margin:0" type="checkbox" [(ngModel)]="Options.PendingPaymentOptions.Enable"/></td>
                    </tr>
                    <tr>
                        <th>Subject</th>
                        <td>
                            <tagged-box [disabled]="!Options.PendingPaymentOptions.Enable" style="margin:0"  class="regular-text" [(ngModel)]="Options.PendingPaymentOptions.Subject">
                                <tagged-box-item Label="Invoice Number" Code="{%Invoice_Number%}"></tagged-box-item>
                                <tagged-box-item Label="Invoice Date" Code="{%Invoice_Date%}"></tagged-box-item>
                                <tagged-box-item Label="Invoice Due Date" Code="{%Invoice_Due_Date%}"></tagged-box-item>
                                <tagged-box-item Label="Invoice Total" Code="{%Invoice_Total%}"></tagged-box-item>
                                <tagged-box-item Label="Invoice URL" Code="{%Invoice_URL%}"></tagged-box-item>
                                <tagged-box-item Label="Client First Name" Code="{%Client_First_Name%}"></tagged-box-item>
                                <tagged-box-item Label="Client Last Name" Code="{%Client_Last_Name%}"></tagged-box-item>
                                <tagged-box-item Label="Client Business" Code="{%Client_Business%}"></tagged-box-item>
                                <tagged-box-item Label="Client Email" Code="{%Client_Email%}"></tagged-box-item>
                                <tagged-box-item Label="Payment URL" Code="{%Payment_URL%}"></tagged-box-item>
                            </tagged-box>
                        </td>
                    </tr>
                    
                    
                    <tr>
                        <th style="padding-bottom:10px;">Content</th>
                    </tr>
                    <tr>
                        <td colspan="2" style="padding:0 10px 0 10px;">
                            <wp-tinymce [disabled]="!Options.PendingPaymentOptions.Enable" [(ngModel)]="Options.PendingPaymentOptions.Content">
                                <wp-tiny-item Label="Invoice Number" Code="{%Invoice_Number%}"></wp-tiny-item>
                                <wp-tiny-item Label="Invoice Date" Code="{%Invoice_Date%}"></wp-tiny-item>
                                <wp-tiny-item Label="Invoice Due Date" Code="{%Invoice_Due_Date%}"></wp-tiny-item>
                                <wp-tiny-item Label="Invoice Total" Code="{%Invoice_Total%}"></wp-tiny-item>
                                <wp-tiny-item Label="Invoice URL" Code="{%Invoice_URL%}"></wp-tiny-item>
                                <wp-tiny-item Label="Client First Name" Code="{%Client_First_Name%}"></wp-tiny-item>
                                <wp-tiny-item Label="Client Last Name" Code="{%Client_Last_Name%}"></wp-tiny-item>
                                <wp-tiny-item Label="Client Business" Code="{%Client_Business%}"></wp-tiny-item>
                                <wp-tiny-item Label="Client Email" Code="{%Client_Email%}"></wp-tiny-item>
                                <wp-tiny-item Label="Payment URL" Code="{%Payment_URL%}"></wp-tiny-item>
                            </wp-tinymce>
                        </td>
                    </tr>
                    <tr>
                        <th>Send me a copy of this email</th>
                        <td><input [disabled]="!Options.PendingPaymentOptions.Enable"  style="margin:0" type="checkbox" [(ngModel)]="Options.PendingPaymentOptions.SendMeACopy"/></td>
                    </tr>
                    
                </table>
            </wp-tab>
            <wp-tab Title="Invoice Paid">
                <table class="form-table">
                    <tr>
                        <th>Enable</th>
                        <td><input [(ngModel)]="Options.InvoicePaidOptions.Enable" style="margin:0" type="checkbox"/></td>
                    </tr>
                    <tr>
                        <th>Subject</th>
                        <td>
                            <tagged-box [disabled]="!Options.InvoicePaidOptions.Enable"  style="margin:0"  class="regular-text" [(ngModel)]="Options.InvoicePaidOptions.Subject">
                                <tagged-box-item Label="Invoice Number" Code="{%Invoice_Number%}"></tagged-box-item>
                                <tagged-box-item Label="Invoice Date" Code="{%Invoice_Date%}"></tagged-box-item>
                                <tagged-box-item Label="Invoice Due Date" Code="{%Invoice_Due_Date%}"></tagged-box-item>
                                <tagged-box-item Label="Invoice Total" Code="{%Invoice_Total%}"></tagged-box-item>
                                <tagged-box-item Label="Invoice URL" Code="{%Invoice_URL%}"></tagged-box-item>
                                <tagged-box-item Label="Client First Name" Code="{%Client_First_Name%}"></tagged-box-item>
                                <tagged-box-item Label="Client Last Name" Code="{%Client_Last_Name%}"></tagged-box-item>
                                <tagged-box-item Label="Client Business" Code="{%Client_Business%}"></tagged-box-item>
                                <tagged-box-item Label="Client Email" Code="{%Client_Email%}"></tagged-box-item>
                                <tagged-box-item Label="Payment URL" Code="{%Payment_URL%}"></tagged-box-item>
                            </tagged-box>
                        </td>
                    </tr>

                    <tr>
                        <th style="padding-bottom:10px;">Content</th>
                    </tr>
                    <tr>
                        <td colspan="2" style="padding:0 10px 0 10px;">
                            <wp-tinymce [disabled]="!Options.InvoicePaidOptions.Enable" [(ngModel)]="Options.InvoicePaidOptions.Content">
                                <wp-tiny-item Label="Invoice Number" Code="{%Invoice_Number%}"></wp-tiny-item>
                                <wp-tiny-item Label="Invoice Date" Code="{%Invoice_Date%}"></wp-tiny-item>
                                <wp-tiny-item Label="Invoice Due Date" Code="{%Invoice_Due_Date%}"></wp-tiny-item>
                                <wp-tiny-item Label="Invoice Total" Code="{%Invoice_Total%}"></wp-tiny-item>
                                <wp-tiny-item Label="Invoice URL" Code="{%Invoice_URL%}"></wp-tiny-item>
                                <wp-tiny-item Label="Client First Name" Code="{%Client_First_Name%}"></wp-tiny-item>
                                <wp-tiny-item Label="Client Last Name" Code="{%Client_Last_Name%}"></wp-tiny-item>
                                <wp-tiny-item Label="Client Business" Code="{%Client_Business%}"></wp-tiny-item>
                                <wp-tiny-item Label="Client Email" Code="{%Client_Email%}"></wp-tiny-item>
                                <wp-tiny-item Label="Payment URL" Code="{%Payment_URL%}"></wp-tiny-item>
                            </wp-tinymce>
                        </td>
                    </tr>
                    <tr>
                        <th>Send me a copy of this email</th>
                        <td><input [disabled]="!Options.InvoicePaidOptions.Enable" style="margin:0" type="checkbox" [(ngModel)]="Options.InvoicePaidOptions.SendMeACopy"/></td>
                    </tr>

                </table>
                
            </wp-tab>
            <wp-tab Title="Reminder">
                <table class="form-table">
                    <tr>
                        <th>Enable</th>
                        <td><input style="margin:0" type="checkbox" [(ngModel)]="Options.ReminderOptions.Enable" /></td>
                    </tr>
                    <tr>
                        <th>Reminder Schedule</th>
                        <td>
                            <div>
                                <input [disabled]="!Options.ReminderOptions.Enable" style="margin:0" type="checkbox" id="7beforeduedate" [(ngModel)]="Options.ReminderOptions.Reminder7DaysBefore"/>
                                <label for="7beforeduedate">7 days before due date</label>
                            </div>
                            <div>
                                <input [disabled]="!Options.ReminderOptions.Enable" style="margin:0" type="checkbox" id="1beforeduedate" [(ngModel)]="Options.ReminderOptions.Reminder1DaysBefore"/>
                                <label for="1beforeduedate">1 day before due date</label>
                            </div>
                            <div>
                                <input [disabled]="!Options.ReminderOptions.Enable" style="margin:0" type="checkbox" id="0beforeduedate" [(ngModel)]="Options.ReminderOptions.Reminder0DaysBefore"/>
                                <label for="0beforeduedate">On due date</label>
                            </div>
                            <div>
                                <input [disabled]="!Options.ReminderOptions.Enable" style="margin:0" type="checkbox" id="1afterduedate" [(ngModel)]="Options.ReminderOptions.Reminder1DaysAfter"/>
                                <label for="1afterduedate">1 day after due date</label>
                            </div>
                            <div>
                                <input [disabled]="!Options.ReminderOptions.Enable" style="margin:0" type="checkbox" id="7afterduedate" [(ngModel)]="Options.ReminderOptions.Reminder7DaysAfter"/>
                                <label for="7afterduedate">7 days after due date</label>
                            </div>
                            <div>
                                <input [disabled]="!Options.ReminderOptions.Enable" style="margin:0" type="checkbox" id="14afterduedate" [(ngModel)]="Options.ReminderOptions.Reminder14DaysAfter"/>
                                <label for="14afterduedate">14 days after due date</label>
                            </div>
                            <div>
                                <input [disabled]="!Options.ReminderOptions.Enable" style="margin:0" type="checkbox" id="21afterduedate" [(ngModel)]="Options.ReminderOptions.Reminder21DaysAfter"/>
                                <label for="21afterduedate">21 days after due date</label>
                            </div>
                            <div>
                                <input [disabled]="!Options.ReminderOptions.Enable" style="margin:0" type="checkbox" id="31afterduedate" [(ngModel)]="Options.ReminderOptions.Reminder31DaysAfter"/>
                                <label for="31afterduedate">31 days after due date</label>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th>Subject</th>
                        <td>
                            <tagged-box [disabled]="!Options.ReminderOptions.Enable" style="margin:0"  class="regular-text" [(ngModel)]="Options.ReminderOptions.Subject">
                                <tagged-box-item Label="Invoice Number" Code="{%Invoice_Number%}"></tagged-box-item>
                                <tagged-box-item Label="Invoice Date" Code="{%Invoice_Date%}"></tagged-box-item>
                                <tagged-box-item Label="Invoice Due Date" Code="{%Invoice_Due_Date%}"></tagged-box-item>
                                <tagged-box-item Label="Invoice Total" Code="{%Invoice_Total%}"></tagged-box-item>
                                <tagged-box-item Label="Invoice URL" Code="{%Invoice_URL%}"></tagged-box-item>
                                <tagged-box-item Label="Client First Name" Code="{%Client_First_Name%}"></tagged-box-item>
                                <tagged-box-item Label="Client Last Name" Code="{%Client_Last_Name%}"></tagged-box-item>
                                <tagged-box-item Label="Client Business" Code="{%Client_Business%}"></tagged-box-item>
                                <tagged-box-item Label="Client Email" Code="{%Client_Email%}"></tagged-box-item>
                                <tagged-box-item Label="Payment URL" Code="{%Payment_URL%}"></tagged-box-item>
                            </tagged-box>
                        </td>
                    </tr>
                    <tr>
                        <th style="padding-bottom:10px;">Content</th>
                    </tr>
                    <tr>
                        <td colspan="2" style="padding:0 10px 0 10px;">
                            <wp-tinymce [disabled]="!Options.ReminderOptions.Enable" [(ngModel)]="Options.ReminderOptions.Content">
                                <wp-tiny-item Label="Invoice Number" Code="{%Invoice_Number%}"></wp-tiny-item>
                                <wp-tiny-item Label="Invoice Date" Code="{%Invoice_Date%}"></wp-tiny-item>
                                <wp-tiny-item Label="Invoice Due Date" Code="{%Invoice_Due_Date%}"></wp-tiny-item>
                                <wp-tiny-item Label="Invoice Total" Code="{%Invoice_Total%}"></wp-tiny-item>
                                <wp-tiny-item Label="Invoice URL" Code="{%Invoice_URL%}"></wp-tiny-item>
                                <wp-tiny-item Label="Client First Name" Code="{%Client_First_Name%}"></wp-tiny-item>
                                <wp-tiny-item Label="Client Last Name" Code="{%Client_Last_Name%}"></wp-tiny-item>
                                <wp-tiny-item Label="Client Business" Code="{%Client_Business%}"></wp-tiny-item>
                                <wp-tiny-item Label="Client Email" Code="{%Client_Email%}"></wp-tiny-item>
                                <wp-tiny-item Label="Payment URL" Code="{%Payment_URL%}"></wp-tiny-item>
                            </wp-tinymce>
                        </td>
                    </tr>
                    <tr>
                        <th>Send me a copy of this email</th>
                        <td><input [disabled]="!Options.ReminderOptions.Enable" style="margin:0" type="checkbox" [(ngModel)]="Options.ReminderOptions.SendMeACopy"/></td>
                    </tr>

                </table>
            </wp-tab>
        </wp-tab-group>
        
    `
})
export class EmailTabComponent{
    //region Options Property
    private _options: EmailOptions = null;
    @Output() OptionsChange = new EventEmitter<EmailOptions>();

    @Input() get Options(): EmailOptions {
        return this._options;
    }

    set Options(value: EmailOptions) {
        let previousValue = this._options;
        this._options = value;
        if (value != previousValue)
            this.OptionsChange.emit(value);
    }

    //endregion
}

