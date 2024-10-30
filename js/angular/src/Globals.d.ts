
interface Service{
    ServiceId:number;
    Name:string;
    Rate:number;
    Taxable:boolean;
    TaxRate:number;
    Notes:string;
}

interface Invoice{
    InvoiceId:number,
    Ref:string;
    InvoiceNumber:number;
    FormattedInvoiceNumber:string;
    ClientId:number;
    Description:string;
    Status:number;
    CreationDate:number;
    DueDate:number;
    TermsAndConditions:string;
    SubTotal:number;
    Tax:number;
    Discount:number;
    Paid:number;
    TotalDue:number;
    ClientDisplayName:string;
    Detail:InvoiceDetail[];
    Payments:Payment[]
}


interface InvoiceDetail{
    Name:string;
    Rate:number;
    Taxable:boolean;
    TaxRate:number;
    Notes:string;
    Qty:number;
    SubTotal:number;
    TaxTotal:number;
    Total:number;
    InvoiceId:number;
    InvoiceDetailId:number;
    SaveItem:boolean;
}


interface Payment{
    PaymentId:number;
    InvoiceId:number;
    Date:number;
    Amount:number;
    PaymentMethod:'cash'|'paypal';
    Reference:string;
    Status:number,
    Comments:string;
}

/**
 Pending=0,
 Completed=1,
 Failed=2
 Refunded=3
 Cancelled=4
 */