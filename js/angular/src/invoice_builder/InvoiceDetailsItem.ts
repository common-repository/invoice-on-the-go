import {Component, EventEmitter, Input, Output} from "@angular/core";
import {RnAnimationSlide} from "../sharedmodules/animations/RnAnimationSlide";
import {FormHandlerBase} from "./FormHandlerBase";

@Component({
    selector:'invoice-details-item',
    template:`
        <wp-panel [Title]="Title" TitleBackgroundColor="#f1f1f1">
            <form  #form="ngForm">
                <div style="position: relative;">
                    <div class="row" style="margin-bottom: 15px;">
                        <div class="col-sm-6">
                            <label style="width: 100%"><strong>Name<span style="color:red">*</span></strong></label>
                            <autocomplete add-validation-message style="width:100%" class="regular-text" (ItemSelected)="ItemSelected($event)" name="name" [(ngModel)]="Data.Name" required>
                                <autocomplete-item  *ngFor="let service of Services" [Label]="service.Name" [Value]="service"></autocomplete-item>
                            </autocomplete>
                        </div>
                        <div class="col-sm-2">
                            <label style="width: 100%"><strong>Qty<span style="color:red">*</span></strong></label>
                            <formatted-input-number [NumberOfDecimals]="2" add-validation-message  (change)="RecalculateTotal()" style="width:100%;" name="qty" [(ngModel)]="Data.Qty" required></formatted-input-number>
                        </div>
                        <div class="col-sm-2">
                            <label style="width: 100%"><strong>Rate/Price<span style="color:red">*</span></strong></label>
                            <formatted-input-number type="number" add-validation-message (change)="RecalculateTotal()" name="rate" style="width:100%;" [(ngModel)]="Data.Rate" required></formatted-input-number>
                        </div>
                        <div class="col-sm-2" style="text-align: right;">
                            <label style="width: 100%;text-align: right;"><strong>Total</strong></label>
                            <span style="text-align: right">{{Data.Total|formatCurrency}}</span>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-6">
                            <label style="width: 100%"><strong>Description</strong></label>
                            <textarea style="width: 100%;height:70px" name="notes" [(ngModel)]="Data.Notes"></textarea>
                        </div>
                        <div class="col-sm-6" *ngIf="TaxIsEnabled">
                            <div class="row">
                                <div style="display: inline-block;vertical-align: top;text-align: center;">
                                    <label><strong>Taxable</strong></label>
                                    <div>
                                        <input (change)="RecalculateTotal()" name="taxable" [(ngModel)]="Data.Taxable" type="checkbox"/>
                                    </div>
                                    
                                </div>
                                <div style="display: inline-block;vertical-align: top;margin-left: 10px;" [@AnimationSlide] *ngIf="Data.Taxable==true&&IsItemized==true">
                                    <label style="width: 100%"><strong>Tax Rate</strong></label>
                                    <formatted-input-number [Styles]="{'width':'100px'}"  (change)="RecalculateTotal()" name="taxrate"   [(ngModel)]="Data.TaxRate"></formatted-input-number>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                    <div class="row" style="margin-top:5px;" *ngIf="ShowSaveItemBox" [@AnimationSlide]>
                        <div class="col-sm-12">
                            <input type="checkbox" name="saveitem" id="saveItemForFutore" [(ngModel)]="Data.SaveItem"/>
                            <label for="saveItemForFutore" style="margin:0 0 0 2px;"><strong>Save this item for future invoices? </strong></label>
    
                        </div>


                </div>
                <a PreventDefault (click)="Remove()" style="bottom:2px;right: 2px;position: absolute;" class="button-secondary"><i class="fas fa-trash"></i> Remove Item</a>
            </div>
            </form>
            
        </wp-panel>
    `,
    animations:[RnAnimationSlide.Compile()]
})
export class InvoiceDetailsItem extends FormHandlerBase {
    @Input() Data:InvoiceDetail=null;
    @Output() public RemoveItem = new EventEmitter<InvoiceDetail>();
    @Output() public TotalRecalculated = new EventEmitter<void>();
    public Services=rnparams.services;
    public TaxIsEnabled;
    public IsItemized;
    public ShowSaveItemBox:boolean=false;

    constructor(){
        super();
        debugger;
        this.TaxIsEnabled=rnparams.settings.TaxesOptions.Enable;
        this.IsItemized=rnparams.settings.TaxesOptions.TaxType=='itemized';
    }

    public ItemSelected(item:{Text:string,Value:Service})
    {

        if(item.Value!=null)
        {
            this.ShowSaveItemBox=false;
            this.Data.TaxRate=item.Value.TaxRate;
            this.Data.Taxable=item.Value.Taxable;
            this.Data.Rate=item.Value.Rate;
            this.Data.Notes=item.Value.Notes;
            this.Data.SaveItem=false;
        }else{
            this.ShowSaveItemBox=true;
        }
        this.RecalculateTotal();
    }

    public get Title(){
        return this.Data.Name==''?'New Item':this.Data.Name;
    }

    public Remove(){
        this.RemoveItem.emit(this.Data);
    }


    RecalculateTotal() {
        let total=this.Data.Qty*this.Data.Rate;
        this.Data.SubTotal=total;
        debugger;
        if(this.Data.Taxable) {
            if (rnparams.settings.TaxesOptions.TaxType == "itemized")
                this.Data.TaxTotal = ((this.Data.TaxRate / 100) * total);
            else
                this.Data.TaxTotal = ((rnparams.settings.TaxesOptions.TaxRate / 100) * total);
        }else
            this.Data.TaxTotal=0;
        this.Data.Total=this.Data.SubTotal+this.Data.TaxTotal;
        this.TotalRecalculated.emit();
    }
}