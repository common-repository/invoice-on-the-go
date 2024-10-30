import {Injectable} from "@angular/core";
import * as toastr from 'toastr';
import 'toastr/build/toastr.css';

@Injectable()
export class ToastService{
    public SendErrorMessage(message:string){
        toastr["error"](message);
    }

    public SendSuccess(message:string){
        toastr["success"](message);
    }
}