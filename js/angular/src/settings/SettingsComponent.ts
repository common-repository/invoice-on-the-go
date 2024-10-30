import {Component} from "@angular/core";
import {WpAjaxPost} from "../sharedmodules/wp-elements/Services/WpAjaxPost";
import {ToastService} from "../sharedmodules/wp-elements/Services/ToastService";
import {WpJsonApi} from "../sharedmodules/wp-elements/Services/WpJsonApi";

@Component({
    selector:'app-root',
    template:`
        <div style="padding:10px;">
            <ladda-button [IsLoading]="Loading" BtnClass="button-primary" (click)="SaveOptions()"><i class="fas fa-cloud" ></i> Save</ladda-button>
            <wp-tab-group>
                <wp-tab Title="General" IconClass="fas fa-th">
                    <general-tab [(Options)]="Options.GeneralOptions"></general-tab>
                </wp-tab>
               <wp-tab Title="Business" IconClass="fas fa-briefcase">
                    <bussiness-tab  [(Options)]="Options.BusinessOptions"></bussiness-tab>
                </wp-tab>
                <wp-tab Title="Email" IconClass="fas fa-envelope">
                    <email-tab  [(Options)]="Options.EmailOptions"></email-tab>
                </wp-tab>
                <wp-tab Title="Taxes" IconClass="fas fa-book">
                    <tax-tab  [(Options)]="Options.TaxesOptions"></tax-tab>
                </wp-tab>
                <wp-tab Title="Invoice" IconClass="fas fa-file-alt">
                    <invoice-tab  [(Options)]="Options.InvoiceOptions" [Settings]="Options"></invoice-tab>
                </wp-tab>
                <wp-tab Title="Payment" IconClass="fas fa-dollar-sign">
                    <payment-tab  [(Options)]="Options.PaymentOptions"></payment-tab>
                </wp-tab>
            </wp-tab-group>
        </div>
        
    `
})
export class SettingsComponent{
    public Options:Settings=rnparams.settings;
    public Loading:boolean=false;
    public OriginalInvoiceNumber;

    constructor(private ajax:WpJsonApi, private toast:ToastService){

    }

    async SaveOptions() {
        this.Loading=true;
        let result=await this.ajax.Post('settings/save',{settings:this.Options,originalInvoiceNumber:rnparams.originalInvoiceNumber});
        this.Loading=false;
        if(result==null)
            return;
        this.toast.SendSuccess("Information saved successfully");
    }
}

declare let rnparams:any;