import {Component, Input, OnInit, QueryList, ViewChildren} from "@angular/core";
import {DeleteDialog} from "../../sharedmodules/controls/NonAngularDialogs/DeleteDialog";
import {InvoiceBuilderEventManager} from "../utils/InvoiceBuilderEventManager";
import {PaymentItem} from "./PaymentItem";


@Component({
    selector:'payments',
    template:`
        <div>
            <payment-item (RemoveItem)="RemoveItem($event)" [Data]="detail" *ngFor="let detail of Invoice.Payments" ></payment-item>
            <div class="row">
                <div class="col-sm-4" style="margin-top:5px;">
                    <a PreventDefault (click)="AddItem()" class="button-secondary"><i class="fas fa-plus"></i> Add Payment</a>
                </div>
            </div>

        </div>
    `,
    styles:[`
        .rnSubTotalBox .rnSubTotalValue{
            float:right;
        }

        .rnSubTotalItem{
            padding:7px 12px;
        }

        .rnTotalDue{
            background: #f8f8f8 none repeat scroll 0 0;
            font-weight: bold;
            border-top: 1px solid #e1e1e1;
            padding:7px 12px;
        }
    `]
})
export class Payments implements OnInit{
    @Input() public Invoice:Invoice;
    @ViewChildren(PaymentItem) paymentItemsComponent:QueryList<PaymentItem>;
    constructor(public eventManager:InvoiceBuilderEventManager)
    {

    }


    public Services=rnparams.services;

    public MarkAllAsDirty(){
        this.paymentItemsComponent.forEach(item=>item.MarkAllFieldsAsDirty());
    }

    public get IsValid(){
        let isValid=true;
        this.paymentItemsComponent.forEach(item=>{
            if(!item.IsValid)
                isValid=false;
        });

        return isValid;
    }
    public ItemSelected(item:{Text:string,Value:Service})
    {
        if(item.Value!=null)
        {

        }
    }

    public async RemoveItem(row:Payment)
    {
        if(await DeleteDialog.Show(row.Date.toLocaleString()) ) {
            this.Invoice.Payments.splice(this.Invoice.Payments.indexOf(row), 1);
            this.eventManager.UpdateTotals.emit();
        }



    }


    AddItem() {
        this.Invoice.Payments.push({
            Amount:0,
            Comments:'',
            Date:rnparams.current_time*1000,
            InvoiceId:this.Invoice.InvoiceId,
            PaymentId:0,
            PaymentMethod:'cash',
            Status:0,
            Reference:''
        });
        this.eventManager.UpdateTotals.emit();

    }

    public CalculateTotals(){

    }

    ngOnInit(): void {

    }

}

