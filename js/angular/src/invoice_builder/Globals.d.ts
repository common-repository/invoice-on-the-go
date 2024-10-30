
declare let rnparams:{
    url:string;
    jsonurl:string;
    nonce:string;
    invoice_id:number;
    users:{Label:string,Id:number}[]
    current_time:number
    services:Service[];
    settings:Settings;
    invoice_data:Invoice;
};

interface CreateUserModel{
    Username:string;
    Email:string;
    BusinessName:string;
    Address:string;
    Phone:string;
    Fax:string;
    FirstName:string;
    LastName:string;
    Website:string;
    ShowPassword:boolean;
    Password:string;
    Extra:string;

}