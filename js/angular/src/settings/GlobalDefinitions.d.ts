interface Settings{
    GeneralOptions:GeneralOptions;
    BusinessOptions:BusinessOptions;
    EmailOptions:EmailOptions;
    TaxesOptions:TaxesOptions;
    InvoiceOptions:InvoiceOptions;
    PaymentOptions:PaymentOptions;
    NextInvoiceNumber:number;

}

interface GeneralOptions{
    AdminEmail:string;
    AdminName:string;
    Currency:string;
    CurrencyPosition:string;
    ThousandSeparator:string;
    DecimalSeparator:string;
    NumberOfDecimals:number;
}

interface BusinessOptions{
    Logo:{attachmentId:number, url:string};
    BusinessName:string;
    BusinessAddress:string;
    Phone:string;
    Fax:string;
    Email:string;
    Website:string;
    Extra:string;
}

interface EmailOptions{
    FromEmailOptions:FromEmailOptions;
    PendingPaymentOptions:PendingPaymentOptions;
    InvoicePaidOptions:InvoicePaidOptions;
    ReminderOptions:ReminderOptions;

}

interface FromEmailOptions{
    Email:string;
    Name:string;
}

interface PendingPaymentOptions{
    Enable:boolean;
    Subject:string;
    Content:string;
    SendMeACopy:string;
}

interface InvoicePaidOptions{
    Enable:boolean;
    Subject:string;
    Content:string;
    SendMeACopy:string;
}

interface ReminderOptions{
    Enable:boolean;
    Subject:string;
    Content:string;
    SendMeACopy:string;
    Reminder7DaysBefore:boolean;
    Reminder1DaysBefore:boolean;
    Reminder0DaysBefore:boolean;
    Reminder1DaysAfter:boolean;
    Reminder7DaysAfter:boolean;
    Reminder14DaysAfter:boolean;
    Reminder21DaysAfter:boolean;
    Reminder31DaysAfter:boolean;
    PayButtonText:string;
}

interface TaxesOptions{
    Enable:boolean;
    TaxType:'itemized'|'general';
    TaxRate:number;
    TaxName:string;
}

interface InvoiceOptions{
    Prefix:string;
    Suffix:string;
    NumberOfDigits:number;
    TermsAndConditions:string;
    Footer:string;
}

interface PaymentOptions{
    PayPalPaymentOptions:PayPalPaymentOptions;
    BankTransferOptions:BankTransferOptions;
}

interface BankTransferOptions{
    Enable:boolean;
    BankAccounts:BankAccount[];
}

interface BankAccount{
    AccountName;
    AccountNumber;
    BankName;
    SortCode;
    IBAN;
    BICSWIFT;
}

interface PayPalPaymentOptions{
    Enable:boolean;
    PayPalEmail:string;
    Sandbox:boolean;
    Currency:string;
}