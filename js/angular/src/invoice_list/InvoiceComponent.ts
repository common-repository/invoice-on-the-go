import {Component, ViewChild} from "@angular/core";
import {WpPaginator} from "../sharedmodules/wp-elements/Controls/WpTable/WpPaginator";
import {DeleteDialog} from "../sharedmodules/controls/NonAngularDialogs/DeleteDialog";
import {WpJsonApi} from "../sharedmodules/wp-elements/Services/WpJsonApi";


@Component({
    selector:'app-root',
    template:`
        <div class="wrap">
            <h1 class="wp-heading-inline">Invoices</h1>
            <a href="#" PreventDefault (click)="CreateInvoice()" class="page-title-action">Add New</a>
            <hr class="wp-header-end">
            <div style="margin-bottom: 5px;float:left;">
                <input class="post-search-input" [disabled]="IsLoading" placeholder="Client Name/Invoice Number"
                       [(ngModel)]="Filter" style="width: 200px;"/>
                <select [(ngModel)]="FilterStatus">
                    <option selected="selected" value="-1">All</option>
                    <option value="0">Pending</option>
                    <option value="1">Completed</option>
                    <option value="2">Failed</option>
                    <option value="3">Refunded</option>
                    <option value="4">Cancelled</option>
                </select>
                <button class="button" (click)="FilterBox()">Filter</button>
                <span *ngIf="IsLoading==true"
                      style="float:none;display: inline-block;margin:0;padding: 0 0 5px;position: static;" class="spinner is-active"></span>
            </div>
           
            <wp-paginator [Disabled]="IsLoading" (PageChanged)="PageChanged($event)" #topPaginator
                          style="float: right"></wp-paginator>
            <wp-table [Data]="Data">
                <wp-table-column Header="Invoice Number" DataField="FormattedInvoiceNumber">
                    <wp-table-column-template>
                        <ng-template let-row>
                            <a PreventDefault href="#" (click)="EditInvoice(row)">{{row.FormattedInvoiceNumber}}</a>
                        </ng-template>
                    </wp-table-column-template>
                    <wp-table-column-action (Click)="EditInvoice($event)" Label="Edit"></wp-table-column-action>
                    <wp-table-column-action (Click)="DeleteInvoice($event)" Label="Delete"></wp-table-column-action>
                </wp-table-column>
                <wp-table-column Header="Client" DataField="ClientDisplayName"></wp-table-column>
                <wp-table-column Header="Creation Date" DataField="CreationDate">
                    <wp-table-column-template>
                        <ng-template let-row>
                            <span>{{row.CreationDate| formatDate}}</span>
                        </ng-template>
                    </wp-table-column-template>
                </wp-table-column>
                <wp-table-column Header="Due Date" DataField="CreationDate">
                    <wp-table-column-template>
                        <ng-template let-row>
                            <span>{{row.DueDate |formatDate}}</span>
                        </ng-template>
                    </wp-table-column-template>
                </wp-table-column>
                <wp-table-column Header="Total Due" DataField="TotalDue">
                    <wp-table-column-template>
                        <ng-template let-row>
                            <span>{{row.TotalDue| formatCurrency}}</span>
                        </ng-template>
                    </wp-table-column-template>
                </wp-table-column>
            </wp-table>
            <wp-paginator [Disabled]="IsLoading" (PageChanged)="PageChanged($event)" #bottomPaginator
                          style="float:right;"></wp-paginator>
        </div>
    `
})
export class InvoiceComponent{
    IsLoading:boolean=false;
    Filter:string='';
    FilterStatus:string='-1';
    FilterToUse:string='';
    Data:Invoice[];
    CurrentPage=0;
    @ViewChild('bottomPaginator') private bottomPaginator:WpPaginator;
    @ViewChild('topPaginator') private topPaginator:WpPaginator;

    constructor(private ajax:WpJsonApi){

    }

    ngOnInit(): void {
        this.ExecuteSearch(0);
    }

    private async ExecuteSearch(pageNumber:number) {
        this.IsLoading=true;
        let result=await this.ajax.Post<{count:number,rows:any[]}>('invoices/getlist',{
            Page:pageNumber,
            Filter:this.FilterToUse,
            Size:20,
            FilterStatus:this.FilterStatus
        });
        this.IsLoading=false;
        if(result!=null) {
            this.Data = result.rows;
            this.CurrentPage=pageNumber;
            this.SetPaginatorData(result.count,(result.count>0?Math.floor(result.count/20)+1:0),this.CurrentPage);

        }else{
            this.Data=[];
            this.SetPaginatorData(0,0,0);
        }

    }



    private SetPaginatorData(count:number,numberOfPages:number,currentPage:number)
    {
        this.bottomPaginator.Count=count;
        this.bottomPaginator.CurrentPage=currentPage;
        this.bottomPaginator.NumberOfPages=numberOfPages;

        this.topPaginator.Count=count;
        this.topPaginator.CurrentPage=currentPage;
        this.topPaginator.NumberOfPages=numberOfPages;
    }

    private PageChanged(pageNumber:number)
    {
        this.ExecuteSearch(pageNumber);
    }

    FilterBox() {
        this.FilterToUse=this.Filter;
        this.ExecuteSearch(0);

    }

    CreateInvoice() {
        window.location.href='?page=rednao_invoice_on_the_go&invoice_id=0';

    }

    EditInvoice(row:Invoice) {
        window.location.href='?page=rednao_invoice_on_the_go&invoice_id='+row.InvoiceId;
    }

    async DeleteInvoice(row:Invoice) {
        if(await DeleteDialog.Show(row.FormattedInvoiceNumber))
        {
            this.IsLoading=true;
            let result=await this.ajax.Post('/invoices/delete',{InvoiceId:row.InvoiceId});
            this.IsLoading=false;
            if(result!=null)
            {
                this.Data.splice(this.Data.indexOf(row),1);
            }
        }
    }



}