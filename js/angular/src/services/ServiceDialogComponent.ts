import {Component, EventEmitter, Output, ViewChild} from "@angular/core";
import {BasicDialog} from "../sharedmodules/controls/Dialog/BasicDialog";
import {WpJsonApi} from "../sharedmodules/wp-elements/Services/WpJsonApi";
import {NgForm} from "@angular/forms";
import {ToastService} from "../sharedmodules/wp-elements/Services/ToastService";

@Component({
    selector:'service-dialog',
    template:`
        <basic-dialog #dialog (OnApply)="SaveNewService()" Title="Create New Service" ApplyText="Save">
            <form #dialogNgForm="ngForm">
                <table class="form-table">
                    <tbody>
                    <tr>
                        <th>Name</th>
                        <td><input name="Name" add-validation-message [(ngModel)]="ServiceToEditOrCreate.Name" #data="ngModel" class="regular-text" required/>

                        </td>
                    </tr>
                    <tr>
                        <th>Cost</th>
                        <td><input name="Rate" add-validation-message required type="number" [(ngModel)]="ServiceToEditOrCreate.Rate" style="width:150px;text-align: right;" class="regular-text"/></td>
                    </tr>
                    <tr>
                        <th>Notes</th>
                        <td><textarea style="width: 100%;height: 150px;" name="Notes" [(ngModel)]="ServiceToEditOrCreate.Notes"></textarea></td>
                    </tr>
                    <tr *ngIf="Taxable">
                        <th>Taxable</th>
                        <td><input name="Taxable" type="checkbox" [(ngModel)]="ServiceToEditOrCreate.Taxable" /></td>
                    </tr>
                    <tr  *ngIf="Taxable&&TaxType=='itemized'">
                        <th style="padding-top: 0;padding-bottom: 0;"><div style="padding-top:20px;padding-bottom:20px;" *ngIf="ServiceToEditOrCreate.Taxable" [@AnimationSlide]>TaxRate</div></th>
                        <td style="padding-top: 0;padding-bottom: 0;"><div style="padding-top:20px;padding-bottom:20px;" *ngIf="ServiceToEditOrCreate.Taxable" [@AnimationSlide]><input name="TaxRate" style="width:150px;text-align: right;" [(ngModel)]="ServiceToEditOrCreate.TaxRate" class="regular-text" type="number"/></div></td>
                    </tr>
                    </tbody>
                </table>
            </form>
        </basic-dialog>
    `
})
export class ServiceDialogComponent {
    @ViewChild('dialog') public dialog:BasicDialog;
    @Output() public SavingStarted = new EventEmitter<void>();
    @Output() public SavingEnded = new EventEmitter<Service>();
    @ViewChild('dialogNgForm') private _formDialog:NgForm;
    public Taxable=rnparams.settings.TaxesOptions.Enable;
    public TaxType=rnparams.settings.TaxesOptions.TaxType!=null?rnparams.settings.TaxesOptions.TaxType:'';

    constructor(public ajax:WpJsonApi,public toast:ToastService){

    }

    public ServiceToEditOrCreate:Service={
        ServiceId:0,
        Rate:0,
        Name:'',
        Taxable:false,
        TaxRate:0,
        Notes:''

    };

    public Open(service:Service){
        this.UndirtyFields();
        this.ServiceToEditOrCreate=service;
        this.dialog.Open();
    }




    async SaveNewService() {
        this.MarkAllFieldsAsDirty();
        if(this._formDialog.valid) {
            this.dialog.IsLoading = true;
            let result:Service=await this.ajax.Post<Service>('service/save',this.ServiceToEditOrCreate);
            this.dialog.IsLoading=false;
            if(result!=null) {
                this.dialog.Close();
                this.toast.SendSuccess('Service saved successfully');
                this.SavingEnded.emit(result);
            }else{
                this.SavingEnded.emit(null);
            }
        }


    }

    private UndirtyFields(){
        for(let property in this._formDialog.controls)
        {
            this._formDialog.controls[property].markAsPristine();
        }
    }

    private MarkAllFieldsAsDirty() {
        for(let property in this._formDialog.controls)
        {
            this._formDialog.controls[property].markAsDirty();
        }
    }
}