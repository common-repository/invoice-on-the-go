import * as Ladda from 'ladda';
import 'ladda/dist/spin.min';
import 'ladda/dist/ladda.min.css'
import 'ladda/dist/ladda-themeless.min.css'
import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from "@angular/core";

@Component({
    selector:'ladda-button',
    template:`<button (click)="LaddaClick()" #button [ngClass]="'btn'+' '+BtnClass" data-style="{{Style}}"><i style="margin-right:5px;" *ngIf="IconClass!=''" [ngClass]="IconClass"></i><ng-content></ng-content></button>`
})
export class LaddaButton implements OnInit{

    @Input() BtnClass:string='btn-default';
    @Input() IconClass:string='';
    @Input() Style:string='expand-left';
    @ViewChild('button') button:ElementRef;
    @Output() Click=new EventEmitter<void>();
    public ladda:any;

    constructor()
    {

    }

    ngOnInit(): void {
        this.ladda=Ladda.create(this.button.nativeElement);
    }

    @Input() set IsLoading(value:boolean){
        if(this.ladda==null)
            return;
        if(value)
            this.ladda.start();
        else
            this.ladda.stop();
    }


    LaddaClick() {
        this.Click.emit();
    }
}

