<?php

namespace rniotg\lib;
use function get_site_option;
use function intval;
use rniotg\db\AppSettingsDTO;
use rniotg\db\BankTransferPaymentOptionsDTO;
use rniotg\db\BusinessOptionsDTO;
use rniotg\db\EmailOptionsDTO;
use rniotg\db\FromEmailOptions;
use rniotg\db\GeneralOptionsDTO;
use rniotg\db\InvoiceOptionsDTO;
use rniotg\db\PaymentOptionsDTO;
use rniotg\db\PayPalPaymentOptionsDTO;
use rniotg\db\PendingPaymentOptionsDTO;
use rniotg\db\ReminderOptionsDTO;
use rniotg\db\repo\SettingsRepo;
use rniotg\db\SettingsDTO;
use rniotg\db\TaxesOptionsDTO;

class SettingsManager{
    /**
     * @return SettingsRepo
     */

    private static $SettingsRepo=null;

    /**
     * @return SettingsRepo
     */
    private static function GetSettingsRepo(){
        if(SettingsManager::$SettingsRepo==null)
            SettingsManager::$SettingsRepo=new SettingsRepo();
        return SettingsManager::$SettingsRepo;
    }
    public static function GetSettings(){
        return (object)array(
            'GeneralOptions'=>self::GetGeneralOptions(),
            'BusinessOptions'=>self::GetBusinessOptions(),
            'EmailOptions'=>self::GetEmailOptions(),
            'TaxesOptions'=>self::GetTaxOptions(),
            'InvoiceOptions'=>self::GetInvoiceOptions(),
            'PaymentOptions'=>self::GetPaymentOptions(),
            'NextInvoiceNumber'=>self::GetNextInvoiceNumber()
        );
    }

    private static function GetOption($property,$default='')
    {
        $settingsRepo=SettingsManager::GetSettingsRepo();
        $value=$settingsRepo->GetSetting($property);
        if($value==null)
            return $default;

        return $value;
    }

    private static function UpdateOption($property,$value)
    {
        SettingsManager::GetSettingsRepo()->SetSetting($property,$value);
    }

    private static $GeneralOptionsCache=null;
    /**
     * @return GeneralOptionsDTO
     */
    public static function GetGeneralOptions(){
        if(SettingsManager::$GeneralOptionsCache!=null)
            return SettingsManager::$GeneralOptionsCache;
        $options=self::GetOption('RNIOTG_GeneralOptions',false);
        if($options===false)
        {
            $options=(object)array(
                'AdminEmail'=>get_site_option('admin_email'),
                'AdminName'=>get_site_option('blogname'),
                'Currency'=>'$',
                'CurrencyPosition'=>'left',
                'ThousandSeparator'=>',',
                'DecimalSeparator'=>'.',
                'NumberOfDecimals'=>'2'
            );

            SettingsManager::SetGeneralOptions($options);
        }
        SettingsManager::$GeneralOptionsCache=$options;
        return $options;
    }

    public static function SetGeneralOptions($options)
    {
        SettingsManager::$GeneralOptionsCache=$options;
        self::UpdateOption('RNIOTG_GeneralOptions',$options);
    }

    /**
     * @return BusinessOptionsDTO
     */
    public static function GetBusinessOptions(){
        $options=self::GetOption('RNIOTG_BusinessOptions',false);
        if($options===false)
        {
            $options=(object)array(
                'Logo'=>null,
                'BusinessName'=>SettingsManager::GetOption('blogname'),
                'BusinessAddress'=>'',
                'Phone'=>'',
                'Fax'=>'',
                'Email'=>SettingsManager::GetOption('admin_email'),
                'Website'=>get_site_url(),
                'Extra'=>''
            );

            SettingsManager::SetBusinessOptions($options);
        }
        return $options;
    }

    public static function SetBusinessOptions($options)
    {
        self::UpdateOption('RNIOTG_BusinessOptions',$options);
    }

    /**
     * @return EmailOptionsDTO
     */
    public static function GetEmailOptions(){

        return (object)array(
                'FromEmailOptions'=>self::GetFromEmailOptions(),
                'PendingPaymentOptions'=>self::GetPendingPaymentOptions(),
                'InvoicePaidOptions'=>self::GetInvoicePaidOptions(),
                'ReminderOptions'=>self::GetReminderOptions()
            );
    }

    /**
     * @param $options EmailOptionsDTO
     */
    public static function SetEmailOptions($options)
    {
        self::SetFromEmailOptions($options->FromEmailOptions);
        self::SetPendingPaymentOptions($options->PendingPaymentOptions);
        self::SetInvoicePaidOptions($options->InvoicePaidOptions);
        self::SetReminderOptions($options->ReminderOptions);
    }

    /**
     * @return FromEmailOptions
     */
    public static function GetFromEmailOptions(){
        $options=self::GetOption('RNIOTG_FROM_EMAIL_OPTIONS',false);
        if($options===false)
        {
            $options=(object)array(
                'Email'=>'',
                'Name'=>get_site_option('blogname')
            );

            SettingsManager::SetFromEmailOptions($options);
        }

        return $options;
    }

    public static function SetFromEmailOptions($options){
        self::UpdateOption('RNIOTG_FROM_EMAIL_OPTIONS',$options);

    }

    /**
     * @return PendingPaymentOptionsDTO
     */
    public static function GetPendingPaymentOptions(){
        $options=self::GetOption('RNIOTG_PENDING_PAYMENT_OPTIONS',false);
        if($options==false)
        {
            $options=(object)array(
                'Enable'=>true,
                'Subject'=>'New invoice {%Invoice_Number%}',
                '$SendMeACopy'=>true,
                'Content'=>"<p>Hi {%Client_First_Name%}</p>
                    <p>You have a new invoice available</p>       
                    <p>You can view it here:{%Invoice_URL%}</p>                               
                ",
                'PayButtonText'=>'Pay Now'
            );
            self::SetPendingPaymentOptions($options);
        }
        return $options;


    }

    public static function SetPendingPaymentOptions($options){
        self::UpdateOption('RNIOTG_PENDING_PAYMENT_OPTIONS',$options);
    }

    public static function GetInvoicePaidOptions(){
        $options=self::GetOption('RNIOTG_INVOICE_PAID_OPTIONS',false);
        if($options==false)
        {
            $options=(object)array(
                'Enable'=>true,
                'Subject'=>'Thanks for your payment (Invoice {%Invoice_Number%})',
                '$SendMeACopy'=>true,
                'Content'=>"<p>Hi {%Client_First_Name%}</p>
                    <p>Your payment for invoice {%Invoice_Number%} was recorded!</p>       
                    <p>You can view your invoice here:{%Invoice_URL%}</p>                               
                "
            );
            self::SetInvoicePaidOptions($options);
        }
        return $options;


    }

    public static function SetInvoicePaidOptions($options){
        self::UpdateOption('RNIOTG_INVOICE_PAID_OPTIONS',$options);
    }

    /**
     * @return ReminderOptionsDTO
     */
    public static function GetReminderOptions(){
        $options=self::GetOption('RNIOTG_REMINDER_OPTIONS',false);
        if($options==false)
        {
            $options=(object)array(
                'Enable'=>true,
                'Subject'=>'A friendly reminder, your invoice  {%Invoice_Number%} due date is {%Invoice_Due_Date%}',
                '$SendMeACopy'=>false,
                'Content'=>"<p>Hi {%Client_First_Name%}</p>
                    <p>Just a friendly reminder </p>                           
                    <p>You can view it here:{%Invoice_URL%}</p>                               
                ",
                'PayButtonText'=>'Pay Now',
                'Reminder7DaysBefore'=>true,
                'Reminder1DaysBefore'=>false,
                'Reminder0DaysBefore'=>true,
                'Reminder1DaysAfter'=>false,
                'Reminder7DaysAfter'=>false,
                'Reminder14DaysAfter'=>true,
                'Reminder21DaysAfter'=>false,
                'Reminder31DaysAfter'=>true
            );
            self::SetReminderOptions($options);
        }
        return $options;


    }

    public static function SetReminderOptions($options){
        self::UpdateOption('RNIOTG_REMINDER_OPTIONS',$options);
    }

    /**
     * @return TaxesOptionsDTO
     */
    public static function GetTaxOptions(){
        $options=self::GetOption('RNIOTG_TAX_OPTIONS',false);
        if($options==false)
        {
            $options=(object)array(
                'Enable'=>false,
                'TaxType'=>'general',
                'TaxRate'=>'10',
                'TaxName'=>'Tax'
            );
            self::SetTaxOptions($options);
        }
        return $options;


    }

    public static function SetTaxOptions($options){
        self::UpdateOption('RNIOTG_TAX_OPTIONS',$options);
    }

    /**
     * @return InvoiceOptionsDTO
     */
    public static function GetInvoiceOptions(){
        $options=self::GetOption('RNIOTG_INVOICE_OPTIONS',false);
        if($options==false)
        {
            $options=(object)array(
                'Prefix'=>'INV-',
                'Suffix'=>'',
                'NumberOfDigits'=>'5',
                'TermsAndConditions'=>'Payment is due within 30 days from date of invoice. Late payment is subject to fees of 5% per month.',
                'Footer'=>'Thanks for choosing <a href="'.get_site_url().">".get_site_option('blogname').'</a>'
            );
            self::SetInvoiceOptions($options);
        }
        return $options;


    }

    public static function SetInvoiceOptions($options){
        self::UpdateOption('RNIOTG_INVOICE_OPTIONS',$options);
    }

    public static function GetNextInvoiceNumber(){
        $invoiceNumber=self::GetOption('RNIOTG_NEXT_INVOICE_NUMBER',false);
        if($invoiceNumber===false)
        {
            $invoiceNumber=1;
            self::SetNextInvoiceNumber($invoiceNumber);
        }

        return intval($invoiceNumber);

    }

    public static function SetNextInvoiceNumber($invoiceNumber){
        self::UpdateOption('RNIOTG_NEXT_INVOICE_NUMBER',$invoiceNumber);
    }


    /**
     * @return PaymentOptionsDTO
     */
    public static function GetPaymentOptions(){
        return (object)array(
            'PayPalPaymentOptions'=>self::GetPayPalPaymentOptions(),
            'BankTransferOptions'=>self::GetBankTransferPaymentOptions()
        );

    }

    /**
     * @return PayPalPaymentOptionsDTO
     */
    public static function GetPayPalPaymentOptions(){
        $options=self::GetOption('RNIOTG_PAYPAL_PAYMENT_OPTIONS',false);
        if($options==false)
        {
            $options=(object)array(
                'Enable'=>false,
                'PayPalEmail'=>'',
                'Sandbox'=>'',
                'Currency'=>'USD'

            );
            self::SetTaxOptions($options);
        }
        return $options;


    }

    public static function SetAuthToken($token){
        self::UpdateOption('RNIOTG_AUTH_TOKEN',$token);
    }


    public static function GetAuthToken(){
        return self::GetOption('RNIOTG_AUTH_TOKEN',false);
    }


    public static function SetPayPalPaymentOptions($options){
        self::UpdateOption('RNIOTG_PAYPAL_PAYMENT_OPTIONS',$options);
    }

    /**
     * @return BankTransferPaymentOptionsDTO
     */
    public static function GetBankTransferPaymentOptions(){
        $options=self::GetOption('RNIOTG_BANK_TRANSFER_PAYMENT_OPTIONS',false);
        if($options==false)
        {
            $options=(object)array(
                'Enable'=>false,
                'BankAccounts'=>array()
            );
            self::SetTaxOptions($options);
        }
        return $options;


    }

    public static function SetBankTransferPaymentOptions($options){
        self::UpdateOption('RNIOTG_BANK_TRANSFER_PAYMENT_OPTIONS',$options);
    }


    public static function GetInvoicePageUrl(){
        return admin_url('admin-ajax.php').'?action=rniotg';
    }

    public static function GetPaymentUrl(){
        $pageId=self::GetOption('rniotg_get_invoice_payment_url',false);
        $url=get_permalink($pageId);
        if($pageId===false||$url===false)
        {
            $pageId=self::CreatePage('rniotg_get_invoice_payment_url','Payment','[rniotg_payment]');
            return get_permalink($pageId);
        }else
            return $url;



    }


    public static function CreatePage($propertyName,$title,$shortCode)
    {
        $post = array(
            'post_content'   => $shortCode,
            'post_name'      => $title,
            'post_title'     => $title,
            'post_status'    => 'publish',
            'post_type'      => 'page',
            'ping_status'    => 'closed',
            'comment_status' => 'closed'
        );
        $page_id = wp_insert_post( $post );
        self::UpdateOption($propertyName,$page_id);
        return $page_id;
    }



}