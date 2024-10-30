import {Component, Input} from "@angular/core";
import {BasicConfirmDialog} from "../sharedmodules/controls/NonAngularDialogs/BasicConfirmDialog";
import {DeleteDialog} from "../sharedmodules/controls/NonAngularDialogs/DeleteDialog";

@Component({
    selector:'bank-accounts',
    template:`
        <table class="form-table">
            <tr>
                <th>Enable</th>
                <td><input type="checkbox" style="margin:0" class="regular-text" [(ngModel)]="Options.Enable"/></td>
            </tr>
        </table>
        <div class="rnbt4">
            <table class="table">
                <thead>
                    <tr>
                        <th>Account Name</th>
                        <th>Account Number</th>
                        <th>Bank Name</th>
                        <th>Sort Code</th>
                        <th>IBAN</th>
                        <th>BIC/Swift</th>
                    </tr>
                </thead>
                <tr *ngFor="let bankAccount of Options.BankAccounts">
                    <td style="padding:0"><input [disabled]="!Options.Enable" [(ngModel)]="bankAccount.AccountName" style="width: 100%"/></td>
                    <td style="padding:0"><input [disabled]="!Options.Enable" [(ngModel)]="bankAccount.AccountNumber" style="width: 100%"/></td>
                    <td style="padding:0"><input [disabled]="!Options.Enable" [(ngModel)]="bankAccount.BankName" style="width: 100%"/></td>
                    <td style="padding:0"> <input [disabled]="!Options.Enable" [(ngModel)]="bankAccount.SortCode" style="width: 100%"/></td>
                    <td style="padding:0"><input [disabled]="!Options.Enable" [(ngModel)]="bankAccount.IBAN"  style="width: 100%"/></td>
                    <td style="padding:0"><input [disabled]="!Options.Enable" [(ngModel)]="bankAccount.BICSWIFT" style="width: 100%"/></td>
                    <td style="padding:0;border:none;"><div style="padding:3px" (click)="RemoveItem(bankAccount)" class="bankRemove"><i class="fas fa-trash" title="Remove"></i></div></td>
                    
                </tr>
            </table>
        </div>
    `,
    styles:[`
        .bankRemove{
            cursor:pointer;
        }
        .bankRemove:hover{
            color:red;
        }
    `]
})
export class BankAccountsComponent {
    @Input() Options:BankTransferOptions;


    public async RemoveItem(bankAccount:BankAccount)
    {
        if(!this.Options.Enable)
            return;
        if(await DeleteDialog.Show(bankAccount.AccountName))
        {
            this.Options.BankAccounts.splice(this.Options.BankAccounts.indexOf(bankAccount),1);
        }

    }
}