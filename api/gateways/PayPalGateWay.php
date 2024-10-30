<?php
/**
 * Created by PhpStorm.
 * User: Edgar
 * Date: 4/20/2018
 * Time: 10:13 AM
 */

namespace rniotg\api\gateways;


use function floatval;
use RedNaoInvoiceOnTheGo;
use rniotg\api\Emailer;
use rniotg\api\InvoiceManager;
use rniotg\db\InvoiceDTO;
use rniotg\db\PaymentDTO;
use rniotg\db\repo\InvoiceRepo;
use rniotg\db\repo\PaymentRepo;
use rniotg\lib\SettingsManager;
use stdClass;
use function strval;

class PayPalGateWay
{
    public function ProcessRequest(){
        if(!$this->IsValid())
            return;

        if($this->IsDuplicate())
            return;

        if(isset($_POST['payment_status'])&&$_POST['payment_status']=='Completed')
            $this->RecordPayment();
    }

    private function IsValid()
    {
        if(!isset($_POST['txn_id'])||$_POST['txn_id']=='')
            return false;
        $args=array();
        $args['headers']=Array
        (
            'Content-Type'=>'application/x-www-form-urlencoded;',
            'Method'=>'Post'
        );

        $req = "cmd=_notify-validate";
        $args['body']=array('cmd'=>"_notify-validate");
        foreach ($_POST as $key => $value)
        {
            $args['body'][$key]=stripslashes($value);
            $value = urlencode(stripslashes($value));
            $req .= "&$key=$value";
        }

        $paypalOptions=SettingsManager::GetPayPalPaymentOptions();
        $url="https://www.paypal.com/cgi-bin/webscr";
        if($paypalOptions->Sandbox)
            $url="https://www.sandbox.paypal.com/cgi-bin/webscr";
        $res=wp_remote_post($url,$args);
        $res['body'];
        return $res['body']=='VERIFIED';
    }

    private function IsDuplicate()
    {
        $txnId='';
        if(isset($_POST['txn_id']))
            $txnId=strval($_POST['txn_id']);
        $transactionId=$txnId;
        global $wpdb;
        $q='select 1 from '.RedNaoInvoiceOnTheGo::$INVOICE_TABLE.' invoice '.
            'join '.RedNaoInvoiceOnTheGo::$PAYMENT_TABLE.' payment '.
            'on invoice.invoice_id=payment.invoice_id '.
            'where ref=%s and reference=%s limit 1';

        $custom='';
        if(isset($_POST['custom']))
            $custom=strval($_POST['custom']);

        $result=$wpdb->get_results($wpdb->prepare($q,$custom,$transactionId));
        return count($result)>0;


    }

    private function RecordPayment()
    {
        $invoiceManager=new InvoiceManager();
        $custom='';
        if(isset($_POST['custom']))
            $custom=strval($_POST['custom']);
        $invoice=$invoiceManager->LoadInvoiceByRef($custom);

        /** @var PaymentDTO $newPayment */
        $newPayment=new stdClass();

        $newPayment->InvoiceId=$invoice->InvoiceId;
        $newPayment->Date=current_time('timestamp',true)*1000;

        $gross=0;
        if(isset($_POST['mc_gross']))
            $gross=floatval($_POST['mc_gross']);
        $newPayment->Amount=$gross;
        $newPayment->PaymentMethod='paypal';
        $reference='';
        if(isset($_POST['txn_id']))
            $reference=strval($_POST['txn_id']);
        $newPayment->Reference=$reference;
        $newPayment->Status=1;

        $paymentRepo=new PaymentRepo();
        $paymentRepo->Insert($newPayment);

        $invoice->Payments[]=$newPayment;

        $this->RecalculateTotals($invoice);

        if($invoice==null)
            return;
    }

    /**
     * @param $invoice InvoiceDTO
     */
    private function RecalculateTotals($invoice)
    {
        $paidTotal=0;
        foreach($invoice->Payments as $payment)
        {
            $paidTotal+=floatval($payment->Amount);
        }

        $totalToPay=floatval($invoice->SubTotal)+floatval($invoice->Tax);
        $invoice->Paid=$paidTotal;
        $invoice->TotalDue=$totalToPay-$invoice->Paid;

        $previousStatus=$invoice->Status;
        if($invoice->TotalDue<=0)
            $invoice->Status=2;

        $invoiceRepo=new InvoiceRepo();
        $invoiceRepo->Update($invoice);

        if($previousStatus!=$invoice->Status&&$invoice->Status==2)
        {
            $emailer=new Emailer();
            $emailer->LoadInvoiceData($invoice);
            $emailer->SendPaidEmail();
        }

    }
}