import {Component, EventEmitter, Input, Output} from "@angular/core";
import {RnAnimationSlide} from "../../sharedmodules/animations/RnAnimationSlide";
import {InvoiceBuilderEventManager} from "../utils/InvoiceBuilderEventManager";
import {FormHandlerBase} from "../FormHandlerBase";


@Component({
    selector:'payment-item',
    template:`
        <wp-panel [Title]="Title" TitleBackgroundColor="#f1f1f1">
            <form  #form="ngForm">
                <div style="position: relative;">
                    <div class="row" style="margin-bottom: 15px;">
                        <div class="col-sm-6">
                            <label style="width: 100%"><strong>Date<span style="color:red">*</span></strong></label>
                            <date-picker name="date" [(ngModel)]="Data.Date" required add-validation-message></date-picker>
                        </div>
                        <div class="col-sm-2">
                            <label style="width: 100%"><strong>Amount<span style="color:red">*</span></strong></label>
                            <formatted-input-number name="amount" type="number" (change)="RecalculateTotal()" style="width:100%;" [(ngModel)]="Data.Amount" required  add-validation-message></formatted-input-number>
                        </div>
                        <div class="col-sm-2">
                            <label style="width: 100%"><strong>Payment Method<span style="color:red">*</span></strong></label>
                            <select name="paymentMethod" [(ngModel)]="Data.PaymentMethod" style="width: 100%" required add-validation-message>
                                <option value="cash">Cash</option>
                                <option value="paypal">Paypal</option>
                            </select>
                        </div>
                        <div class="col-sm-2">
                            <label style="width: 100%"><strong>Status<span style="color:red">*</span></strong></label>
                            <select name="status" [(ngModel)]="Data.Status" style="width: 100%" required add-validation-message>
                                <option value="1">Completed</option>
                                <option value="0">Pending</option>
                                <option value="2">Failed</option>
                                <option value="3">Refunded</option>
                                <option value="4">Cancelled</option>
                            </select>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-6">
                            <label style="width: 100%"><strong>Comments</strong></label>
                            <textarea name="comments" style="width: 100%;height:70px" [(ngModel)]="Data.Comments"></textarea>
                        </div>
                    </div>
                    <a PreventDefault (click)="Remove()" style="bottom:2px;right: 2px;position: absolute;" class="button-secondary"><i class="fas fa-trash"></i> Remove Item</a>
                    
                </div>
            </form>
        </wp-panel>
    `,
    animations:[RnAnimationSlide.Compile()]
})
export class PaymentItem  extends FormHandlerBase{
    @Input() Data:Payment=null;
    @Output() public RemoveItem = new EventEmitter<Payment>();
    public Services=rnparams.services;
    public ShowSaveItemBox:boolean=false;

    constructor(public eventManager:InvoiceBuilderEventManager)
    {
        super();
    }



    public get Title(){
        if(this.Data.Date!=null)
            return "Payment ("+new Date(this.Data.Date).toLocaleDateString()+")";
        return 'New Payment';
    }

    public Remove(){
        this.RemoveItem.emit(this.Data);
    }


    RecalculateTotal() {

        this.eventManager.UpdateTotals.emit();
    }
}


