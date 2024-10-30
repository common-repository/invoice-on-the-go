import {EventEmitter, Injectable} from "@angular/core";

@Injectable()
export class InvoiceBuilderEventManager {
    public UpdateTotals=new EventEmitter<void>();
}