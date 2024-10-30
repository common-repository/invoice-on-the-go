<?php
namespace rniotg\db;
class SettingsDTO{
    /** @var GeneralOptionsDTO */
    public $GeneralOptions;
    /** @var BusinessOptionsDTO */
    public $BusinessOptions;
    /** @var EmailOptionsDTO */
    public $EmailOptions;
    /** @var TaxesOptionsDTO */
    public $TaxesOptions;
    /** @var InvoiceOptionsDTO */
    public $InvoiceOptions;
    /** @var PaymentOptionsDTO */
    public $PaymentOptions;
    public $NextInvoiceNumber;
}


class AppSettingsDTO{
    public $SettingId;
    public $SettingKey;
    public $Value;
    public $LastUpdate;
}

class GeneralOptionsDTO{
  public $AdminEmail;
  public $AdminName;
  public $Currency;
  public $CurrencyPosition;
  public $ThousandSeparator;
  public $DecimalSeparator;
  public $NumberOfDecimals;
}

class InvoiceMetaDTO{
    public $InvoiceMetaId;
    public $InvoiceId;
    public $MetaKey;
    public $MetaValue;
    public $LastUpdate;
}

class BusinessOptionsDTO{
    /**
     * @var AttachmentInfoDTO
     */
    public $Logo;
    public $BusinessName;
    public $BusinessAddress;
    public $Phone;
    public $Fax;
    public $Email;
    public $Website;
    public $Extra;
}

class AttachmentInfoDTO{
    public $attachmentId;
    public $url;
}

class EmailOptionsDTO{

    /** @var FromEmailOptions */
    public $FromEmailOptions;
    /**
     * @var PendingPaymentOptionsDTO
     */

    public $PendingPaymentOptions;
    /**
     * @var InvoicePaidOptionsDTO
     */
    public $InvoicePaidOptions;
    /**
     * @var ReminderOptionsDTO;
     */
    public $ReminderOptions;
}

class FromEmailOptions{
    public $Email;
    public $Name;
}

class EmailBaseOptions{
    public $Enable;
    public $Subject;
    public $Content;
    public $SendMeACopy;
}
class PendingPaymentOptionsDTO extends EmailBaseOptions {

}

class InvoicePaidOptionsDTO extends EmailBaseOptions {

}

class ReminderOptionsDTO extends  EmailBaseOptions {
    public $Reminder7DaysBefore;
    public $Reminder1DaysBefore;
    public $Reminder0DaysBefore;
    public $Reminder1DaysAfter;
    public $Reminder7DaysAfter;
    public $Reminder14DaysAfter;
    public $Reminder21DaysAfter;
    public $Reminder31DaysAfter;
}

class TaxesOptionsDTO{
    public $Enable;
    public $TaxType;
    public $TaxRate;
    public $TaxName;
}

class InvoiceOptionsDTO{
    public $Prefix;
    public $Suffix;
    public $NumberOfDigits;
    public $TermsAndConditions;
    public $Footer;
}

class PaymentOptionsDTO{
    /**
     * @var PayPalPaymentOptionsDTO
     */
    public $PayPalPaymentOptions;
    /** @var BankTransferPaymentOptionsDTO */
    public $BankTransferOptions;

}


class BankTransferPaymentOptionsDTO{
    /**
     * @var PayPalPaymentOptionsDTO
     */
    public $Enable;
    /** @var BankAccountDTO[] */
    public $BankAccounts;

}

class BankAccountDTO{
   public $AccountName;
   public $AccountNumber;
   public $BankName;
   public $SortCode;
   public $IBAN;
   public $BICSWIFT;
}

class PayPalPaymentOptionsDTO{
    public $Enable;
    public $PayPalEmail;
    public $Sandbox;
    public $Currency;
}

class InvoiceDTO{
    public $Ref;
    public $InvoiceId;
    public $InvoiceNumber;
    public $FormattedInvoiceNumber;
    public $ClientId;
    public $Description;
    public $Status;
    public $CreationDate;
    public $DueDate;
    public $TermsAndConditions;
    public $SubTotal;
    public $Tax;
    public $Discount;
    public $Paid;
    public $TotalDue;
    public $ClientDisplayName;
    /** @var InvoiceDetailDTO[] */
    public $Detail;
    /** @var PaymentDTO[] */
    public $Payments;
    public $LastUpdate;
}

class InvoiceDetailDTO{
    public $Name;
    public $Rate;
    public $Taxable;
    public $TaxRate;
    public $Notes;
    public $Qty;
    public $SubTotal;
    public $TaxTotal;
    public $Total;
    public $InvoiceId;
    public $invoiceDetailId;
    public $SaveItem;
    public $LastUpdate;
}


class PaymentDTO{
    public $PaymentId;
    public $InvoiceId;
    public $Date;
    public $Amount;
    public $PaymentMethod;
    public $Reference;
    public $Status;
    public $Comments;
    public $LastUpdate;
}

class DeleteLogDTO{
    public $DeleteLogId;
    public $TableName;
    public $Id;
    public $LastUpdate;
}

