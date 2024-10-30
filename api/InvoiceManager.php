<?php
/**
 * Created by PhpStorm.
 * User: Edgar
 * Date: 4/14/2018
 * Time: 10:47 AM
 */

namespace rniotg\api;


use function json_encode;
use RedNaoInvoiceOnTheGo;
use rniotg\db\InvoiceDTO;
use rniotg\db\repo\InvoiceDetailRepo;
use rniotg\db\repo\InvoiceRepo;
use rniotg\db\repo\PaymentRepo;
use rniotg\lib\SettingsManager;
use function str_pad;
use const STR_PAD_LEFT;

class InvoiceManager
{
    /** @var InvoiceDTO */
    public $invoice;
    public function LoadInvoiceById($invoiceId){

        $invoiceRepo=new InvoiceRepo();
        /** @var InvoiceDTO invoice */
        $this->invoice=$invoiceRepo->GetById($invoiceId);

        if($this->invoice==null)
            return null;

        $invoiceDetailRepo=new InvoiceDetailRepo();
        $paymentRepo=new PaymentRepo();
        $this->invoice->Detail=$invoiceDetailRepo->GetList(array('InvoiceId'=>$this->invoice->InvoiceId));
        $this->invoice->Payments=$paymentRepo->GetList(array('InvoiceId'=>$this->invoice->InvoiceId));
        return $this->invoice;
    }

    public function LoadInvoiceByRef($invoiceRef)
    {
        $invoiceRepo=new InvoiceRepo();
        /** @var InvoiceDTO invoice */
        $this->invoice=$invoiceRepo->PrepareQuery()->AddCondition('Ref','=',$invoiceRef)->GetFirst();

        if($this->invoice==null)
            return null;

        $invoiceDetailRepo=new InvoiceDetailRepo();
        $paymentRepo=new PaymentRepo();
        $this->invoice->Detail=$invoiceDetailRepo->GetList(array('InvoiceId'=>$this->invoice->InvoiceId));
        $this->invoice->Payments=$paymentRepo->GetList(array('InvoiceId'=>$this->invoice->InvoiceId));
        return $this->invoice;
    }

        /**
     * @param $invoice InvoiceDTO
     * @return bool
     */
    public function SaveInvoice($invoice){
        $invoiceRepo=new InvoiceRepo();
        $this->invoice=$invoice;
        $previousStatus='';
        if($this->invoice->InvoiceId!=0)
        {
            $invoiceRepo=new InvoiceRepo();
            $previousStatus=$invoiceRepo->PrepareQuery()
                ->AddColumn('Status')
                ->AddCondition('InvoiceId','=',$this->invoice->InvoiceId)->GetVar();
        }else{
            $this->GenerateInvoiceNumber();
            $this->invoice->Ref=$this->invoice->InvoiceNumber.'_'.md5(uniqid($this->invoice->InvoiceNumber, true));
        }
        $result=$invoiceRepo->Upsert($invoice);
        if($result===false)
        {
            return false;
        }
        SettingsManager::SetNextInvoiceNumber($this->invoice->InvoiceNumber+1);
        $invoice->InvoiceId=$result;

        $serviceController=new ServicesController();
        $invoiceDetailRepo=new InvoiceDetailRepo();
        foreach($invoice->Detail as &$detail)
        {
            $detail->InvoiceId=$invoice->InvoiceId;
            if(!$detail->SaveItem)
            {
                $serviceController->SaveServiceToDb(0,$detail->Rate,$detail->Name,$detail->Taxable,$detail->TaxRate,$detail->Notes);
            }
            $result=$invoiceDetailRepo->Upsert($detail);
            if($result==false)
            {
                return false;
            }
            $detail->invoiceDetailId=$result;
        }

        $paymentRepo=new PaymentRepo();
        foreach($invoice->Payments as &$payment)
        {
            $payment->InvoiceId=$invoice->InvoiceId;
            $result=$paymentRepo->Upsert($payment);
            if($result==false)
            {
                return false;
            }

            $payment->PaymentId=$result;

        };

        global $wpdb;
        $deleteQuery='delete from '.RedNaoInvoiceOnTheGo::$INVOICE_DETAIL_TABLE.' where invoice_id=%s and invoice_detail_id not in(-1';
        $deleteQueryParams=array($invoice->InvoiceId);
        foreach($invoice->Detail as $detailItem)
        {
            $deleteQuery.=',%s';
            $deleteQueryParams[]=$detailItem->invoiceDetailId;
        }

        $deleteQuery.=')';

        $deleteQuery=$wpdb->prepare($deleteQuery,$deleteQueryParams);
        $result=$wpdb->query($deleteQuery);
        if($result===false)
            return false;





        $deleteQuery='delete from '.RedNaoInvoiceOnTheGo::$PAYMENT_TABLE.' where invoice_id=%s and payment_id not in(-1';
        $deleteQueryParams=array($invoice->InvoiceId);
        foreach($invoice->Payments as $payment)
        {

            $deleteQuery.=',%s';
            $deleteQueryParams[]=$payment->PaymentId;
        }

        $deleteQuery.=')';

        $deleteQuery=$wpdb->prepare($deleteQuery,$deleteQueryParams);
        $result=$wpdb->query($deleteQuery);
        if($result===false)
            return false;

        if($previousStatus!=$this->invoice->Status)
        {

            if($this->invoice->Status==1)
            {
                $emailer=new Emailer();
                $emailer->LoadInvoiceData($this->invoice);
                $emailer->SendPendingEmail();
            }

            
            if($this->invoice->Status==2)
            {
                $emailer=new Emailer();
                $emailer->LoadInvoiceData($this->invoice);
                $emailer->SendPaidEmail();
            }
        }
        return $invoice;

    }

    private function GenerateInvoiceNumber()
    {
        $this->invoice->InvoiceNumber=SettingsManager::GetNextInvoiceNumber();

        $invoiceOptions=SettingsManager::GetInvoiceOptions();
        if($invoiceOptions->Prefix!='')
            $this->invoice->FormattedInvoiceNumber=$invoiceOptions->Prefix;
        if($invoiceOptions->NumberOfDigits>0)
            $this->invoice->FormattedInvoiceNumber.=str_pad($this->invoice->InvoiceNumber,$invoiceOptions->NumberOfDigits,'0',STR_PAD_LEFT);
        if($invoiceOptions->Suffix!='')
            $this->invoice->FormattedInvoiceNumber.=$invoiceOptions->Suffix;
    }


}