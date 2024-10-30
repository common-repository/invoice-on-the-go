import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {ToastService} from "./ToastService";
import {RequestHandler} from "./RequestHandler";

@Injectable()
export class WpAjaxPost{
    constructor(public http:HttpClient,public toast:ToastService)
    {


    }

    public Post<T>(action:string,data:any)
    {
        let dataToSend:FormData=new FormData();
        dataToSend.append('action',action);
        dataToSend.append('data',JSON.stringify(data));
        return new RequestHandler<T>(ajaxurl,dataToSend,this.http,this.toast).Execute();
    }
}




declare let ajaxurl:any;