import {Component, Input, OnInit, QueryList, ViewChildren} from "@angular/core";
import {DeleteDialog} from "../sharedmodules/controls/NonAngularDialogs/DeleteDialog";
import {InvoiceBuilderEventManager} from "./utils/InvoiceBuilderEventManager";
import {InvoiceDetailsItem} from "./InvoiceDetailsItem";

@Component({
    selector:'invoice-details',
    template:`
        <div>
            <invoice-details-item (TotalRecalculated)="TotalRecalculated()" (RemoveItem)="RemoveItem($event)" [Data]="detail" *ngFor="let detail of Invoice.Detail" ></invoice-details-item>
            <div class="row">
                <div class="col-sm-4" style="margin-top:5px;">
                    <a PreventDefault (click)="AddItem()" class="button-secondary"><i class="fas fa-plus"></i> Add Item</a>    
                </div>
                
                <div class="col-sm-4 offset-sm-4 rnSubTotalBox" >
                    <div style="margin-top:5px;border: 1px solid #e1e1e1;">
                        <h3 style="font-size: 14px;font-weight: 600;border-bottom: 1px solid #e1e1e1;padding:10px;text-align: right;">Invoice Totals</h3>
                        <div class="rnSubTotalItem">
                            <span class="rnSubTotalLabel">Sub Total</span>
                            <span class="rnSubTotalValue">{{Invoice.SubTotal | formatCurrency}}</span>
                        </div>
                        <div class="rnSubTotalItem" *ngIf="TaxEnable">
                            <span class="rnSubTotalLabel">{{TaxLabel}}</span>
                            <span class="rnSubTotalValue">{{Invoice.Tax | formatCurrency}}</span>
                        </div>
                        <div class="rnSubTotalItem">
                            <span class="rnSubTotalLabel">Paid</span>
                            <span class="rnSubTotalValue">{{Invoice.Paid | formatCurrency}}</span>
                        </div>
                        <div class="rnSubTotalItem rnTotalDue">
                            <span class="rnSubTotalLabel">Total Due</span>
                            <span class="rnSubTotalValue">{{Invoice.TotalDue | formatCurrency}}</span>
                        </div>
                    </div>
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
export class InvoiceDetails implements OnInit{
    @Input() public Invoice:Invoice;
    @ViewChildren(InvoiceDetailsItem) detailItems:QueryList<InvoiceDetailsItem>;
    public TaxLabel=rnparams.settings.TaxesOptions.TaxName;
    public TaxEnable=rnparams.settings.TaxesOptions.Enable;
    constructor(private eventManager:InvoiceBuilderEventManager)
    {

        this.eventManager.UpdateTotals.subscribe(()=>this.TotalRecalculated());
    }

    public Services=rnparams.services;


    public ItemSelected(item:{Text:string,Value:Service})
    {
        if(item.Value!=null)
        {

        }
    }

    public MarkAllAsDirty(){
        this.detailItems.forEach(item=>item.MarkAllFieldsAsDirty());
    }

    public get IsValid(){

        let isValid=true;
        this.detailItems.forEach(item=>{
            if(!item.IsValid)
                isValid=false;
        });

        return isValid;
    }

    public async RemoveItem(row:InvoiceDetail)
    {
        if(row.Name.trim()==''||await DeleteDialog.Show(row.Name) ) {
            this.Invoice.Detail.splice(this.Invoice.Detail.indexOf(row), 1);
            this.TotalRecalculated();
        }



    }

    public TotalRecalculated(){
        debugger;

        let subTotal=0;
        let tax=0;
        let total=0;
        let paid=0;
        debugger;
        for(let item of this.Invoice.Detail)
        {
            subTotal+=item.SubTotal;
            tax+=item.TaxTotal;
            total+=item.Total;
        }


        for(let item of this.Invoice.Payments)
        {
            paid+=parseFloat(item.Amount.toString());
        }
        this.Invoice.Paid=paid*-1;
        this.Invoice.Tax=tax;
        this.Invoice.SubTotal=subTotal;
        this.Invoice.TotalDue=subTotal+tax-paid;
    }

    AddItem() {
        this.Invoice.Detail.push({
            Rate:0,
            InvoiceDetailId:0,
            InvoiceId:0,
            Name:'',
            Notes:'',
            Qty:1,
            Taxable:false,
            TaxRate:0,
            Total:0,
            SaveItem:false,
            SubTotal:0,
            TaxTotal:0
        });
        this.TotalRecalculated();

    }



    ngOnInit(): void {
        if(this.Invoice.InvoiceId==0||this.Invoice.Detail.length==0)
            this.AddItem();
    }

}