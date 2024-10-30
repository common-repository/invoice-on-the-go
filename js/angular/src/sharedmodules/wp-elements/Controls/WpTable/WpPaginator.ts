import {Component, EventEmitter, Input, Output} from "@angular/core";

@Component({
    selector:'wp-paginator',
    template:`
        <div class="tablenav-pages">
            <span class="displaying-num">{{Count}} items</span>
            <span class="pagination-links">
                <span (click)="MoveTo(0)" class="tablenav-pages-navspan paginatorButton" [ngClass]="{'disabled':Disabled==true||CurrentPage<1}" aria-hidden="true">«</span>
                <span  (click)="MoveTo(CurrentPage-1)" class="tablenav-pages-navspan paginatorButton" [ngClass]="{'disabled':Disabled==true||CurrentPage<1}" aria-hidden="true">‹</span>
                <span class="paging-input">
                    <label for="current-page-selector" class="screen-reader-text">Current Page</label>
                    {{CurrentPageToShow}}
                    <span class="tablenav-paging-text"> 
                        of <span class="total-pages">{{NumberOfPages}}</span>
                    </span>
                </span>
                <a class="next-page" href="http://localhost/smartforms/wp-admin/edit.php?post_type=shop_order&amp;paged=2">
                    <span class="screen-reader-text">Next page</span>
                    
                </a>
                <span (click)="MoveTo(CurrentPage+1)" class="tablenav-pages-navspan paginatorButton" [ngClass]="{'disabled':Disabled==true||CurrentPage+1>=NumberOfPages}" aria-hidden="true">›</span>
                <span (click)="MoveTo(NumberOfPages-1)" class="tablenav-pages-navspan paginatorButton" [ngClass]="{'disabled':Disabled==true||CurrentPage+1>=NumberOfPages}" aria-hidden="true">»</span>
            </span>
        </div>
    `,
    styles:[`
        .paginatorButton{
            background-color:#f7f7f7; 
            cursor:pointer;
        }

        .paginatorButton:hover{
            background-color:#00a0d2;
            color:white;
        }

        .paginatorButton.disabled{
            pointer-events: none;
            cursor:auto;
            background-color:#e5e5e5;
        }
    `]
})
export class WpPaginator {
    @Input() public Count:number=0;
    @Input() public NumberOfPages:number=0;
    @Input() public CurrentPage:number=0;
    @Input() public Disabled:boolean=false;
    @Output() public PageChanged=new EventEmitter<Number>();

    public get CurrentPageToShow(){
        return this.Count==0?0:this.CurrentPage+1;
    }

    MoveTo(pageNumber: number) {
        this.PageChanged.emit(pageNumber);
    }
}