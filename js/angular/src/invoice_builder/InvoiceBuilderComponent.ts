import {Component, ViewChild} from "@angular/core";
import {WpJsonApi} from "../sharedmodules/wp-elements/Services/WpJsonApi";
import {UserDialog} from "./dialogs/UserDialog";
import {ToastService} from "../sharedmodules/wp-elements/Services/ToastService";
import {FormHandlerBase} from "./FormHandlerBase";
import {InvoiceDetails} from "./InvoiceDetails";
import {Payments} from "./Payments/Payments";


@Component({
    selector:'app-root',
    template:`
        <user-dialog #UserDialog (UserCreated)="UserCreated($event)"></user-dialog>
        <form #form="ngForm">
            <div class="wrap rnbt4">
                <div style="margin:10px;">
                    <h1 class="wp-heading-inline" style="font-size: 23px;font-weight: 400;" *ngIf="InvoiceId==0">Create Invoice</h1>
                    <h1 class="wp-heading-inline" style="font-size: 23px;font-weight: 400;" *ngIf="InvoiceId!=0">Edit Invoice</h1>
                    <div class="row">
                        <div class="col-md-10">
                            <wp-panel Title="Invoice Data">
                                <h2 class="rnTitle" *ngIf="InvoiceId==0">New order information</h2>
                                <h2 class="rnTitle" *ngIf="InvoiceId!=0">Order {{InvoiceId}} information</h2>
                                <div style="margin-top: 10px;">
                                    <div class="row">
                                        <div class="col-md-4" >
                                            <label style="width: 100%">Client<span style="color:red">*</span></label>
                                            <div style="display: flex">
                                                <div style="flex-grow: 1;">
                                                    <select2 add-validation-message placeholder="Please Select A Customer" name="ClientId" [(ngModel)]="Invoice.ClientId" [styles]="{'width':'100%'}" required>
                                                        <option *ngFor="let user of Users" value="{{user.Id}}">{{user.Label}}</option>
                                                    </select2>
                                                </div>
                                                <a class="button" (click)="CreateUser()" title="Create Client"><i class="fas fa-user-plus"></i></a>
                                            </div>
                                        </div>
                                        <div class="col-md-4" >
                                            <label style="width: 100%">Creation Date<span style="color:red">*</span></label>
                                           <date-picker add-validation-message name="CreationDate" [(ngModel)]="Invoice.CreationDate" required></date-picker>
                                        </div>
                                        <div class="col-md-4" >
                                            <label style="width: 100%">Due Date<span style="color:red">*</span></label>
                                            <date-picker add-validation-message name="DueDate"  [(ngModel)]="Invoice.DueDate" required></date-picker>
                                        </div>
                                    </div>
                                </div>
                            </wp-panel>
            
                            <wp-panel Title="Invoice Detail">
                                <invoice-details [Invoice]="Invoice"></invoice-details>
                            </wp-panel>
                            <wp-panel Title="Payments" [IsOpen]="Invoice.Payments.length!=0">
                                <payments [Invoice]="Invoice"></payments>
                            </wp-panel>
                            <wp-panel Title="Terms & Conditions" [IsOpen]="false">
                                <wp-tinymce [Height]="200" name="TermsAndConditions" [(ngModel)]="Invoice.TermsAndConditions"></wp-tinymce>
                            </wp-panel>
                        </div>
                        <div class="col-md-2" style="padding:0;">
                            <wp-panel Title="Save">
                                <div class="row">
                                    <div class="col-sm-12">
                                        <label style="width: 100%"><strong>Status</strong></label>
                                        <select name="Status" [(ngModel)]="Invoice.Status" style="width: 100%;">
                                            <option value="0">Draft</option>
                                            <option value="1">Pending</option>
                                            <option value="2">Paid</option>
                                        </select>
    
                                        <div style="text-align: right;margin:10px -12px -12px -12px;align-items: center;display:flex;justify-content: flex-end;" id="major-publishing-actions">
                                            <span style="float:none;margin:0;" class="spinner is-active" *ngIf="IsSaving"></span>
                                            <input (click)="Save()" [disabled]="IsSaving" style="margin:0;margin-left:5px;" PreventDefault type="submit" class="button button-primary" name="save" value="Save Invoice"/>
                                        </div>
                                    </div>
                                </div>
                            </wp-panel>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    `,
    styles:[`
        .rnTitle{
            margin: 0;
            font-size: 21px;
            line-height: 1.2;
            text-shadow: 1px 1px 1px #fff;
            padding: 0;
            font-family: HelveticaNeue-Light,"Helvetica Neue Light","Helvetica Neue",sans-serif;
            font-weight: 400;
        }
    `]
})
export class InvoiceBuilderComponent extends FormHandlerBase{
    public InvoiceId=rnparams.invoice_id;
    public Users;
    public Settings:Settings;
    public Invoice:Invoice;
    public IsSaving=false;

    @ViewChild(InvoiceDetails) invoiceDetailComponent:InvoiceDetails;
    @ViewChild(Payments) paymentsComponent:Payments;
    @ViewChild('UserDialog') public dialog:UserDialog;


    constructor(private ajax:WpJsonApi,private toast:ToastService){
        super();
        let currentDate=new Date(rnparams.current_time*1000);
        let dueDate=new Date(rnparams.current_time*1000);
        dueDate.setMonth(dueDate.getMonth()+1);
        this.Users=rnparams.users;
        if(rnparams.invoice_data!=null)
            this.Invoice=rnparams.invoice_data;
        else
            this.Invoice={
                Ref:'',
                InvoiceId:0,
                FormattedInvoiceNumber:'',
                InvoiceNumber:0,
                ClientDisplayName:'',
                ClientId:null,
                CreationDate:currentDate.getTime(),
                Description:'',
                Discount:0,
                DueDate:dueDate.getTime(),
                Paid:0,
                Status:0,
                SubTotal:0,
                Tax:0,
                TermsAndConditions:rnparams.settings.InvoiceOptions.TermsAndConditions,
                TotalDue:0,
                Detail:[],
                Payments:[]
            }
    }

    public UserCreated(user:{Label:string,Id:number}){
        this.Users.push(user);
        this.Invoice.ClientId=user.Id;
        this.Invoice.ClientDisplayName=user.Label;

    }

    public CreateUser(){
        this.dialog.Open();
    }

    async Save() {

        this.invoiceDetailComponent.MarkAllAsDirty();
        this.paymentsComponent.MarkAllAsDirty();
        this.MarkAllFieldsAsDirty();
        if(!this.IsValid||!this.invoiceDetailComponent.IsValid||!this.paymentsComponent.IsValid)
            return;
        this.IsSaving=true;
        let tempItems=this.Invoice.Detail.slice();
        let tempPayments=this.Invoice.Payments.slice();
        let result= await this.ajax.Post<Invoice>('/invoices/save',{InvoiceData:this.Invoice});
        if(result==null)
            return;

        try{
            this.Invoice.InvoiceId=result.InvoiceId;
            for(let i=0;i<tempPayments.length;i++)
            {
                tempPayments[i].InvoiceId=result.Payments[i].InvoiceId;
                tempPayments[i].PaymentId=result.Payments[i].PaymentId;
            }

            for(let i=0;i<tempItems.length;i++)
            {
                tempItems[i].InvoiceId = result.Detail[i].InvoiceId;
                tempItems[i].InvoiceDetailId = result.Detail[i].InvoiceDetailId;

            }
        }catch(Exception)
        {
            window.location.reload();
        }

        this.IsSaving=false;

            this.toast.SendSuccess('Invoice Saved Successfully');


    }
}

