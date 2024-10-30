<?php
namespace rniotg\api;
use rniotg\db\SettingsDTO;
use rniotg\lib\SettingsManager;
use WP_REST_Request;

/**
 * Created by PhpStorm.
 * User: Edgar
 * Date: 4/1/2018
 * Time: 1:05 PM
 */

class SettingsController extends Base{
    public function __construct()
    {
        parent::__construct();
        $this->RegisterAdminRoute('/settings/save','POST',array($this,'SaveSettings'));

    }

    public function SaveSettings(WP_REST_Request $request){

        /** @var SettingsDTO $params */
        $params=$this->GetObjectParam($request,'settings');
        $originalInvoiceNumber=$this->GetStringParam($request,'originalInvoiceNumber');

        SettingsManager::SetGeneralOptions($params->GeneralOptions);
        SettingsManager::SetBusinessOptions($params->BusinessOptions);
        SettingsManager::SetEmailOptions($params->EmailOptions);
        SettingsManager::SetTaxOptions($params->TaxesOptions);
        SettingsManager::SetInvoiceOptions($params->InvoiceOptions);
        SettingsManager::SetPayPalPaymentOptions($params->PaymentOptions->PayPalPaymentOptions);
        SettingsManager::SetBankTransferPaymentOptions($params->PaymentOptions->BankTransferOptions);

        if($params->NextInvoiceNumber!=$originalInvoiceNumber)
            SettingsManager::SetNextInvoiceNumber($params->NextInvoiceNumber);
        return $this->GenerateSuccess();
    }

}