import {AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild} from "@angular/core";

@Component({
    selector:'basic-dialog',
    template:`
        <div class="rnbt4">
            <div #modal class="modal fade" data-backdrop="static" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered" role="document" [ngStyle]="{'max-width': 'none','width':Width}">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLongTitle" [innerHtml]="Title"></h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <ng-content></ng-content>
                        </div>
                        <div class="modal-footer">
                            <div *ngIf="IsLoading">
                            <i class="fas fa-spinner fa-spin" ></i>
                            </div>
                            <button [disabled]="IsLoading" *ngIf="CancelText!=''" type="button" class="btn btn-secondary" data-dismiss="modal" [innerHtml]="CancelIcon+'&nbsp;'+CancelText"></button>
                            <button [disabled]="IsLoading" (click)="Apply()" *ngIf="ApplyText!=''" type="button" class="btn btn-primary" [innerHtml]="ApplyIcon+'&nbsp;'+ApplyText"></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class BasicDialog implements AfterViewInit{
    @ViewChild('modal') private _modal:ElementRef;
    @Input() Width='500px';
    @Input() Title='Title ';
    @Input() ApplyIcon='<i class="fas fa-check"></i>';
    @Input() ApplyText='Apply';
    @Input() CancelText='Cancel';
    @Input() CancelIcon='<i class="fas fa-times"></i>';
    @Input() public  IsLoading=false;

    private $modal:any=null;

    @Output() public OnApply=new EventEmitter<void>();


    ngAfterViewInit(): void {
        this.$modal=(jQuery(this._modal.nativeElement) as any);
        this.$modal.modal('hide');
    }

    private Apply() {
        this.OnApply.emit();
    }

    Open(){

        this.$modal.modal('show');
    }

    Close(){
        this.$modal.modal('hide');
    }
}

declare let jQuery:any;