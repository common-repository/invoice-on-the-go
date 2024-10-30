import {Component, OnInit, ViewChild} from "@angular/core";
import {WpJsonApi} from "../sharedmodules/wp-elements/Services/WpJsonApi";
import {RnAnimationSlide} from "../sharedmodules/animations/RnAnimationSlide";
import {ToastService} from "../sharedmodules/wp-elements/Services/ToastService";
import {WpPaginator} from "../sharedmodules/wp-elements/Controls/WpTable/WpPaginator";
import {DeleteDialog} from "../sharedmodules/controls/NonAngularDialogs/DeleteDialog";
import {ServiceDialogComponent} from "./ServiceDialogComponent";

@Component({
    selector:'app-root',
    template:`
        <service-dialog  (SavingEnded)="ServiceSaved($event)" #CreateDialog></service-dialog>
        <div class="wrap">
            <h1 class="wp-heading-inline">Services</h1>
            <a href="#" PreventDefault (click)="CreateService()" class="page-title-action">Add New</a>
            <hr class="wp-header-end">
            <div style="margin-bottom: 5px;float:left;">
                <input class="post-search-input" [disabled]="IsLoading" placeholder="Service Name" [(ngModel)]="Filter"/>  
                <button  class="button" (click)="FilterBox()">Filter</button>
                <span *ngIf="IsLoading==true" style="float:none;display: inline-block;margin:0;padding:0;padding-bottom:5px;position: static;" class="spinner is-active"></span>
            </div>
            <wp-paginator [Disabled]="IsLoading" (PageChanged)="PageChanged($event)" #topPaginator style="float: right"></wp-paginator>
            <wp-table [Data]="Data">
                <wp-table-column Header="Name" DataField="Name">
                    <wp-table-column-template>
                        <ng-template let-row>
                            <a PreventDefault href="#" (click)="EditService(row)">{{row.Name}}</a>
                        </ng-template>
                    </wp-table-column-template>
                    <wp-table-column-action (Click)="EditService($event)" Label="Edit"></wp-table-column-action>
                    <wp-table-column-action (Click)="DeleteService($event)"  Label="Delete"></wp-table-column-action>
                </wp-table-column>
                <wp-table-column Header="Cost" DataField="Rate">
                    <wp-table-column-template>
                        <ng-template let-row>
                            <span>{{row.Rate| formatCurrency}}</span>
                        </ng-template>
                    </wp-table-column-template>
                </wp-table-column>
                <wp-table-column Header="Taxable" DataField="Taxable" *ngIf="Taxable">
                    <wp-table-column-template>
                        <ng-template let-row>
                            <div style="padding-left: 20px;" *ngIf="row.Taxable==true">
                                <i class="fas fa-check" ></i>
                            </div>
                        </ng-template>
                    </wp-table-column-template>
                </wp-table-column>
                <wp-table-column Header="TaxRate" DataField="TaxRate" *ngIf="Taxable&&TaxType=='itemized'">
                    <wp-table-column-template>
                        <ng-template let-row>
                            <span>{{row.TaxRate| formatCurrency}}</span>
                        </ng-template>
                    </wp-table-column-template>
                </wp-table-column>
            </wp-table>
            <wp-paginator [Disabled]="IsLoading" (PageChanged)="PageChanged($event)" #bottomPaginator style="float:right;"></wp-paginator>
        </div>
    `,
    animations:[RnAnimationSlide.Compile()]
})
export class ServicesComponent implements OnInit{
    @ViewChild('bottomPaginator') private bottomPaginator:WpPaginator;
    @ViewChild('topPaginator') private topPaginator:WpPaginator;
    @ViewChild('CreateDialog') private _createDialog:ServiceDialogComponent;

    public IsLoading=false;
    public Filter:string='';
    public FilterToUse:string='';
    public RowBeingEdited:Service=null;
    public CurrentPage:number=0;
    public Taxable=rnparams.settings.TaxesOptions.Enable;
    public TaxType=rnparams.settings.TaxesOptions.TaxType!=null?rnparams.settings.TaxesOptions.TaxType:'';


    public Data:any[]=[

    ];
    constructor(public ajax:WpJsonApi,public toast:ToastService){

    }


    private CreateDialogIsOpen:boolean;


    EditService(row:Service) {
        this.RowBeingEdited=row;
        this._createDialog.Open({
            ServiceId:row.ServiceId,
            Name:row.Name,
            Taxable:row.Taxable,
            Rate:row.Rate,
            TaxRate:row.TaxRate,
            Notes:row.Notes
        });

    }

    async DeleteService(row:Service) {
        if(await DeleteDialog.Show(row.Name))
        {
            this.IsLoading=true;
            let result=await this.ajax.Post('/service/delete',{ServiceId:row.ServiceId});
            this.IsLoading=false;
            if(result!=null)
            {
                this.Data.splice(this.Data.indexOf(row),1);
            }
        }
    }

    CreateService() {

        this.RowBeingEdited=null;
        this._createDialog.Open({
            TaxRate:0,
            Rate:0,
            Taxable:false,
            Name:'',
            ServiceId:0,
            Notes:''
        });
    }

    ServiceSaved(service:Service) {
        if(service==null)
            return;
        if(this.RowBeingEdited!=null)
        {
            this.RowBeingEdited.TaxRate=service.TaxRate;
            this.RowBeingEdited.Taxable=service.Taxable;
            this.RowBeingEdited.Name=service.Name;
            this.RowBeingEdited.Rate=service.Rate;
            this.RowBeingEdited.Notes=service.Notes;
        }else
            this.Data.push(service);

    }



    ngOnInit(): void {
        this.ExecuteSearch(0);
    }

    private async ExecuteSearch(pageNumber:number) {
        this.IsLoading=true;
        let result=await this.ajax.Post<{count:number,rows:any[]}>('service/getlist',{
            Page:pageNumber,
            Filter:this.FilterToUse,
            Size:20,
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



}