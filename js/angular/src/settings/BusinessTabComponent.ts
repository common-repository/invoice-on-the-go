import {Component, EventEmitter, Input, Output} from "@angular/core";

@Component({
    selector:'bussiness-tab',
    template:`
        <h3>Business Info</h3>
        <table class="form-table">
            <tr>
                <th>Logo</th>
                <td>
                   <wp-image-holder [(ngModel)]="Options.Logo"></wp-image-holder>
                </td>
            </tr>
            <tr>
                <th>Business Name</th>
                <td>
                    <input [(ngModel)]="Options.BusinessName" class="regular-text"/>
                </td>
            </tr>
            <tr>
                <th>Business Address</th>
                <td>
                    <input class="regular-text" [(ngModel)]="Options.BusinessAddress"/>
                </td>
            </tr>
            <tr>
                <th>Phone</th>
                <td>
                    <input class="regular-text" [(ngModel)]="Options.Phone"/>
                </td>
            </tr>
            <tr>
                <th>Fax</th>
                <td>
                    <input class="regular-text" [(ngModel)]="Options.Fax"/>
                </td>
            </tr>
            <tr>
                <th>Email</th>
                <td>
                    <input type="email" class="regular-text" [(ngModel)]="Options.Email"/>
                </td>
            </tr>
            <tr>
                <th>Website</th>
                <td>
                    <input class="regular-text" [(ngModel)]="Options.Website"/>
                </td>
            </tr>
            <tr>
                <th>Extra info (like VAT number)</th>
                <td>
                    <textarea style="height: 100px;" class="regular-text" [(ngModel)]="Options.Extra"></textarea>
                </td>
            </tr>
            
        </table>
        
        
    `
})
export class BusinessTabComponent{
    //region Options Property
    private _options: BusinessOptions = null;
    @Output() OptionsChange = new EventEmitter<BusinessOptions>();

    @Input() get Options(): BusinessOptions {
        return this._options;
    }

    set Options(value: BusinessOptions) {
        let previousValue = this._options;
        this._options = value;
        if (value != previousValue)
            this.OptionsChange.emit(value);
    }

    //endregion
    UploadFile() {

    }
}
