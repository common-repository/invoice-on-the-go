import {HttpClient} from "@angular/common/http";
import {ToastService} from "./ToastService";

export class RequestHandler<T>{
    public headers:any=undefined;
    constructor(public url:string,public data:FormData,public http:HttpClient,public toast:ToastService)
    {

    }

    public setHeaders(headers:any){
        this.headers=headers;
        return this;
    }


    public Execute():Promise<T>{
        return new Promise<T>((resolve,reject)=>{
            return this.http.post(this.url,this.data,(this.headers!=undefined?{headers:this.headers}:undefined)).toPromise()
                .then((result:ResponseData<T>)=>{
                    if(!result.success)
                    {
                        this.toast.SendErrorMessage(result.errorMessage);
                        resolve(null);

                    }else
                    {
                        resolve(result.result);
                    }
                }).catch(()=>{
                    this.toast.SendErrorMessage('An unexpected error occurred, please try again');
                    resolve(null);
                })
        });
    }
}



interface ResponseData<T>{
    success:boolean;
    errorMessage:string;
    result:T;

}