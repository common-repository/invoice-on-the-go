<?php

namespace rniotg\templates;

use function get_user_meta;
use function get_userdata;
use RedNaoInvoiceOnTheGo;
use rniotg\api\Formatter;
use rniotg\api\InvoiceManager;
use rniotg\db\PaymentTabOptions;
use rniotg\lib\SettingsManager;
use rniotg\templates\classes\BankTransfer;
use rniotg\templates\classes\PaypalPayment;
use Twig_Autoloader;
use Twig_Environment;
use Twig_Loader_Filesystem;
use Twig_SimpleFilter;
use Twig_SimpleFunction;
use function wp_enqueue_style;

class TemplateManager
{
    /** @var Twig_Environment */
    public $twig;
    public function __construct()
    {
        require_once RedNaoInvoiceOnTheGo::$DIR.'vendor/twig/twig/lib/Twig/Autoloader.php';
        Twig_Autoloader::register();
        $loader=new Twig_Loader_Filesystem(RedNaoInvoiceOnTheGo::$DIR.'templates');
        $this->twig=new Twig_Environment($loader,array('cache'=>false));

        $formatDate=new Twig_SimpleFunction('FormatDate',function($date){
            return Formatter::FormatDate($date);
        });

        $formatNumber=new Twig_SimpleFunction('FormatNumber',function($number){
            return Formatter::FormatNumber($number);
        });

        $formatIntNumber=new Twig_SimpleFunction('FormatIntNumber',function($number){
            return Formatter::FormatIntNumber($number);
        });

        $this->twig->addFunction($formatDate);
        $this->twig->addFunction($formatNumber);
        $this->twig->addFunction($formatIntNumber);
    }


    public function LoadInvoiceTemplate()
    {
        $invoiceManager=new InvoiceManager();
        $taxOptions=SettingsManager::GetTaxOptions();
        $invoiceOptions=SettingsManager::GetInvoiceOptions();
        $paymentOptions=SettingsManager::GetPaymentOptions();
        $paymentUrl='';
        if($paymentOptions->PayPalPaymentOptions->Enable||$paymentOptions->BankTransferOptions->Enable)
            $paymentUrl=SettingsManager::GetPaymentUrl();
        if(!isset($_GET['invoice'])||$invoiceManager->LoadInvoiceByRef($_GET['invoice'])==null)
            $this->LoadTemplate('invalid_invoice.html');
        else
            $this->LoadTemplate('invoice.html',
                array(
                    'invoice'=>$invoiceManager->invoice,
                    'clientInfo'=>$this->GetClientInfo($invoiceManager->invoice->ClientId),
                    'business'=>SettingsManager::GetBusinessOptions(),
                    'homeUrl'=>home_url(),
                    'baseUrl'=>RedNaoInvoiceOnTheGo::$URL,
                    'IsTax'=>$taxOptions->Enable,
                    'TaxLabel'=>$taxOptions->TaxName,
                    'Terms'=>$invoiceOptions->TermsAndConditions,
                    'Footer'=>$invoiceOptions->Footer,
                    'PaymentURL'=>$paymentUrl.'?invoice='.$invoiceManager->invoice->Ref
                ));

    }

    private function LoadTemplate($templateName,$params=array())
    {
        wp_enqueue_style('rniotb_bootstrap',RedNaoInvoiceOnTheGo::$URL.'css/bootstrap.css');
        echo $this->twig->render($templateName,$params);
    }

    private function GetClientInfo($ClientId)
    {
        $client=get_userdata($ClientId);
        return array(
            'BusinessName'=>get_user_meta($ClientId,'rniotg_business_name',true),
            'BusinessAddress'=>get_user_meta($ClientId,'rniotg_address',true),
            'Phone'=>get_user_meta($ClientId,'rniotg_phone',true),
            'Fax'=>get_user_meta($ClientId,'rniotg_fax',true),
            'Email'=>$ClientId,$client->user_email,
            'Website'=>get_user_meta($ClientId,'rniotg_website',true),
            'Extra'=>get_user_meta($ClientId,'rniotg_extra',true)
        );

    }

    public function LoadPaymentTemplate()
    {
        wp_enqueue_script('rniotb_bootstrap_script',RedNaoInvoiceOnTheGo::$URL.'js/lib/bootstrap.bundle.js');
        wp_enqueue_script('rniotb_fontawesomet',RedNaoInvoiceOnTheGo::$URL.'js/lib/fontawesome-all.min.js');
        $taxOptions=SettingsManager::GetTaxOptions();
        $invoiceManager=new InvoiceManager();
        $paymentOptions=$this->GetPaymentOptions();
        if(!isset($_GET['invoice'])||$invoiceManager->LoadInvoiceByRef($_GET['invoice'])==null)
            $this->LoadTemplate('invalid_invoice.html');
        else
            $this->LoadTemplate('payment.html',
                array(
                    'invoice'=>$invoiceManager->invoice,
                    'IsTax'=>$taxOptions->Enable,
                    'TaxLabel'=>$taxOptions->TaxName,
                    'PaymentOptions'=>$paymentOptions,
                    'BaseUrl'=>RedNaoInvoiceOnTheGo::$URL
                ));
    }

    private function GetPaymentOptions()
    {
        $paymentOptions=SettingsManager::GetPaymentOptions();
        $optionsToReturn=array();


        if($paymentOptions->PayPalPaymentOptions->Enable)
        {
            $paypalPayment=new PaypalPayment();
            $paypalPayment->title='Paypal';
            $paypalPayment->icon='fab fa-paypal';
            $paypalPayment->templateName='payment/paypal.html';
            $paypalPayment->Email=$paymentOptions->PayPalPaymentOptions->PayPalEmail;
            $paypalPayment->Currency=$paymentOptions->PayPalPaymentOptions->Currency;
            if($paymentOptions->PayPalPaymentOptions->Sandbox)
                $paypalPayment->URL='https://www.sandbox.paypal.com/cgi-bin/webscr';
            else
                $paypalPayment->URL='https://www.paypal.com/cgi-bin/webscr';
            $paypalPayment->NotificationURL= admin_url('admin-ajax.php').'?action=rniotg_paypal_received';
            $optionsToReturn[]=$paypalPayment;

        }

        if($paymentOptions->BankTransferOptions->Enable)
        {
            $bankTransfer=new BankTransfer();
            $bankTransfer->title='BankTransfer';
            $bankTransfer->icon='fas fa-university';
            $bankTransfer->templateName='payment/bank_transfer.html';
            $bankTransfer->Accounts=$paymentOptions->BankTransferOptions->BankAccounts;

            foreach($paymentOptions->BankTransferOptions->BankAccounts as $account)
            {
                if(trim($account->AccountName)!='')
                    $bankTransfer->ShowAccountName=true;
                if(trim($account->AccountNumber)!='')
                    $bankTransfer->ShowAccountNumber=true;
                if(trim($account->BankName)!='')
                    $bankTransfer->ShowBankName=true;
                if(trim($account->SortCode)!='')
                    $bankTransfer->ShowSortCode=true;
                if(trim($account->IBAN)!='')
                    $bankTransfer->ShowIBAN=true;
                if(trim($account->BICSWIFT)!='')
                    $bankTransfer->ShowBankName=true;
            }

            $optionsToReturn[]=$bankTransfer;
        }

        return $optionsToReturn;

    }
}