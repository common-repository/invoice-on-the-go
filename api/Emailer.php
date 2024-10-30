<?php
/**
 * Created by PhpStorm.
 * User: Edgar
 * Date: 4/15/2018
 * Time: 8:02 PM
 */

namespace rniotg\api;


use function floatval;
use function get_user_metavalues;
use function get_userdata;
use function intval;
use function number_format;
use const PREG_SET_ORDER;
use rniotg\db\EmailBaseOptions;
use rniotg\db\InvoiceDTO;
use rniotg\db\repo\InvoiceRepo;
use rniotg\lib\SettingsManager;
use function str_replace;
use function switch_theme;
use WP_User;

class Emailer
{
    /** @var InvoiceDTO */
    private $invoice;
    /** @var WP_User */
    private $clientData;


    public function SendPendingEmail(){

        $this->SendEmail(SettingsManager::GetPendingPaymentOptions());
    }

    public function SendPaidEmail(){

        $this->SendEmail(SettingsManager::GetInvoicePaidOptions());

    }

    public function LoadInvoiceData($invoice)
    {
        $this->invoice=$invoice;
    }

    public function SendReminder()
    {
        $this->SendEmail(SettingsManager::GetReminderOptions());
    }

    /**
     * @param $emailOptions EmailBaseOptions
     */
    private function SendEmail($emailOptions)
    {
        if(!$emailOptions->Enable)
            return;
        $this->clientData=get_userdata($this->invoice->ClientId);
        if( $this->clientData==false)
            return;

        $fromEmailOptions=SettingsManager::GetFromEmailOptions();

        $subject=$this->ProcessContent($emailOptions->Subject);
        $content=$this->ProcessContent($emailOptions->Content);

        $fromEmail=$fromEmailOptions->Email;
        if($fromEmail=='')
        {
            $sitename = strtolower( $_SERVER['SERVER_NAME'] );
            if ( substr( $sitename, 0, 4 ) == 'www.' ) {
                $sitename = substr( $sitename, 4 );
            }
            $fromEmail = apply_filters('wp_mail_from', "wordpress@" . $sitename);
        }

        $headers=array();
        $headers[]='From: '.$fromEmailOptions->Name.' <'.$fromEmail.'>';
        $headers[]='Content-Type:text/html;charset=UTF-8';
        if($emailOptions->SendMeACopy)
        {
            $headers[]='bcc:'.SettingsManager::GetGeneralOptions()->AdminEmail;
        }
        $result=wp_mail($this->clientData->user_email,$subject,$content,$headers);
        $result=true;






    }

    private function ProcessContent($content)
    {
        preg_match_all('/{%([^%]*)%}/',$content, $matches, PREG_SET_ORDER);
        foreach($matches as $match)
        {
            $value='';
            switch($match[1])
            {
                case 'Invoice_Number':
                    $value= $this->invoice->FormattedInvoiceNumber;
                    break;
                case 'Invoice_Date':
                    $value= Formatter::FormatDate($this->invoice->CreationDate);
                    break;
                case 'Invoice_Total':
                    $value=Formatter::FormatNumber($this->invoice->TotalDue);
                    break;
                case 'Invoice_Due_Date':
                    $value= Formatter::FormatDate($this->invoice->DueDate);
                    break;
                case 'Invoice_URL':
                    $value=Formatter::FormatUrl(SettingsManager::GetInvoicePageUrl().'&invoice='.$this->invoice->Ref);
                    break;
                case 'Client_First_Name':
                    $value=$this->clientData->first_name;
                    break;
                case 'Client_Last_Name':
                    $value=$this->clientData->last_name;
                    break;
                case 'Client_Business':
                    $value=get_user_meta($this->invoice->ClientId,'rniotg_business_name',true);
                    break;
                case 'Client_Email':
                    $value=$this->clientData->user_email;
                    break;
                case 'Payment_URL':
                    $value=Formatter::FormatUrl(SettingsManager::GetPaymentUrl().'?invoice='.$this->invoice->Ref);
                    break;
                default:
                    continue;

            }

            $content=str_replace($match[0],$value,$content);

        }

        return $content;

    }

    public function LoadInvoiceDataById($invioce_id)
    {
        $invoiceRepo=new InvoiceRepo();
        $this->invoice=$invoiceRepo->GetById($invioce_id);
    }




}