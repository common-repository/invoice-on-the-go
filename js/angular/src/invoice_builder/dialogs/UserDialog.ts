import {Component, EventEmitter, Output, ViewChild} from "@angular/core";
import {BasicDialog} from "../../sharedmodules/controls/Dialog/BasicDialog";
import {NgForm} from "@angular/forms";
import {WpJsonApi} from "../../sharedmodules/wp-elements/Services/WpJsonApi";

@Component({
    selector:'user-dialog',
    template:`
        <basic-dialog #dialog (OnApply)="SaveClient()" Title="Create New Client" Width="600px" ApplyText="Save">
            <form #dialogNgForm="ngForm">
                <div>
                    <table class="form-table">
                        <tbody>
                            <tr>
                                <th>Username*</th>
                                <td>
                                    <input name="UserName" add-validation-message [(ngModel)]="ClientToEditOrCreate.Username" #data="ngModel" class="regular-text" required/>
                                </td>
                            </tr>
                            <tr>
                                <th>Email*</th>
                                <td>
                                    <input email type="email" name="Email" add-validation-message [(ngModel)]="ClientToEditOrCreate.Email" #data="ngModel" class="regular-text" required/>
                                </td>
                            </tr>
                            <tr>
                                <th>Password</th>
                                <td>
                                    <input type="password" placeholder="Auto Generate" name="Password" add-validation-message [(ngModel)]="ClientToEditOrCreate.Password" #data="ngModel" class="regular-text"/>
                                </td>
                            </tr>
                            <tr>
                                <th>Business/Client Name</th>
                                <td>
                                    <input name="BusinessName" [(ngModel)]="ClientToEditOrCreate.BusinessName" #data="ngModel" class="regular-text"/>
                                </td>
                            </tr>
                            <tr>
                                <th>Account First Name</th>
                                <td>
                                    <input name="FirstName" [(ngModel)]="ClientToEditOrCreate.FirstName" #data="ngModel" class="regular-text" />
                                </td>
                            </tr>
                            <tr>
                                <th>Account Last Name</th>
                                <td>
                                    <input name="LastName" [(ngModel)]="ClientToEditOrCreate.LastName" #data="ngModel" class="regular-text" />
                                </td>
                            </tr>
                            <tr>
                                <th>Address</th>
                                <td>
                                    <input name="Address" [(ngModel)]="ClientToEditOrCreate.Address" #data="ngModel" class="regular-text"/>
                                </td>
                            </tr>
                            <tr>
                                <th>Phone</th>
                                <td>
                                    <input name="Phone" [(ngModel)]="ClientToEditOrCreate.Phone" #data="ngModel" class="regular-text"/>
                                </td>
                            </tr>
                            <tr>
                                <th>Fax</th>
                                <td>
                                    <input name="Fax"  [(ngModel)]="ClientToEditOrCreate.Fax" #data="ngModel" class="regular-text" />
                                </td>
                            </tr>
                            <tr>
                                <th>Website</th>
                                <td>
                                    <input name="Website" [(ngModel)]="ClientToEditOrCreate.Website" #data="ngModel" class="regular-text"/>
                                </td>
                            </tr>
                            <tr>
                                <th>Extra info (like VAT number)</th>
                                <td>
                                    <textarea style="height: 100%;" name="Extra" [(ngModel)]="ClientToEditOrCreate.Extra" #data="ngModel" class="regular-text"></textarea>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </form>
        </basic-dialog>
    `
})
export class UserDialog {
    @ViewChild('dialog') dialog:BasicDialog;
    @ViewChild('dialogNgForm') private _formDialog:NgForm;
    @Output() public UserCreated = new EventEmitter<{Label:string,Id:number}>();
    public ClientToEditOrCreate:CreateUserModel={
        Address:'',
        BusinessName:'',
        Email:'',
        FirstName:'',
        LastName:'',
        Password:'',
        ShowPassword:false,
        Username:'',
        Website:'',
        Fax:'',
        Phone:'',
        Extra:''
    };

    constructor(public ajax:WpJsonApi)
    {

    }

    async SaveClient() {
        this.MarkAllFieldsAsDirty();
        this.dialog.IsLoading=true;
        let result=await this.ajax.Post<{Label:string,Id:number}>('/users/create',this._formDialog.value);
        this.dialog.IsLoading=false;
        if(result!=null)
        {
            this.UserCreated.emit(result);
            this.dialog.Close();
        }


    }

    public Open(){
        this.ClientToEditOrCreate={
            Address:'',
            BusinessName:'',
            Email:'',
            FirstName:'',
            LastName:'',
            Password:'',
            ShowPassword:false,
            Username:'',
            Website:'',
            Fax:'',
            Phone:'',
            Extra:''
        };
        this.UndirtyFields();
        this.dialog.Open();
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