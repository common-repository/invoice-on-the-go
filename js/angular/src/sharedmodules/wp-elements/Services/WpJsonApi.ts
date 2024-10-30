import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {ToastService} from "./ToastService";
import {RequestHandler} from "./RequestHandler";

@Injectable()
export class WpJsonApi{

    constructor(private http:HttpClient,private toast:ToastService)
    {


    }

    public Post<T>(action:string,data:any)
    {
        if(action[0]=='/')
            action=action.substr(1);
        return new RequestHandler<T>(rnparams.jsonurl+action,data,this.http,this.toast)
            .setHeaders({'X-WP-Nonce':rnparams.nonce}).Execute();
    }


}




declare let rnparams:any;