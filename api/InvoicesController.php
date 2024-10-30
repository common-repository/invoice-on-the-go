<?php
/**
 * Created by PhpStorm.
 * User: Edgar
 * Date: 4/1/2018
 * Time: 1:05 PM
 */
namespace rniotg\api;
use Exception;
use RedNaoInvoiceOnTheGo;
use rniotg\api\saver\InvoiceSaver;

use rniotg\db\InvoiceDTO;
use rniotg\db\repo\InvoiceDetailRepo;
use rniotg\db\repo\InvoiceRepo;
use rniotg\db\repo\PaymentRepo;
use WP_REST_Request;

class InvoicesController extends Base{
    public function __construct()
    {
        parent::__construct();
        $this->RegisterAdminRoute('/invoices/getId','POST',array($this,'GetById'));
        $this->RegisterAdminRoute('/invoices/getlist','POST',array($this,'GetList'));
        $this->RegisterAdminRoute('/invoices/save','POST',array($this,'Save'));
        $this->RegisterAdminRoute('/invoices/delete','POST',array($this,'Delete'));


    }

    public function GetById(WP_REST_Request $request){
        $invoiceId=$this->GetStringParam($request,'InvoiceId');
        $invoiceManager=new InvoiceManager();
        $data=$invoiceManager->LoadInvoiceById($invoiceId);
        return $this->GenerateSuccess(array('invoice'=>$data));
    }

    public function Delete(WP_REST_Request $request)
    {
        $invoiceId=$this->GetStringParam($request,'InvoiceId');

        $paymentRepo=new PaymentRepo();
        $invoiceDetailRepo=new InvoiceDetailRepo();
        $invoiceRepo=new InvoiceRepo();

        $paymentRepo->Delete(array('InvoiceId'=>$invoiceId));
        $invoiceDetailRepo->Delete(array('InvoiceId'=>$invoiceId));
        $invoiceRepo->Delete($invoiceId);
        return $this->GenerateSuccess();



    }

    public function GetList(WP_REST_Request $request){

        $page=$this->GetStringParam($request,'Page');
        $size=$this->GetStringParam($request,'Size');
        $filter=$this->GetStringParam($request,'Filter');
        $filterStatus=$this->GetNumericParam($request,'FilterStatus','-1');


        global $wpdb;

        $where="(display_name like '%".$wpdb->esc_like($filter)."%' or ";
        $where.="formatted_invoice_number like '%".$wpdb->esc_like($filter)."%') ";

        if($filterStatus!=-1)
        {
            $where.=$wpdb->prepare(' status =%s',$filterStatus);
        }

        $where.=' order by formatted_invoice_number';

        $q="select invoice_id,formatted_invoice_number,client_id,status,creation_date,due_date,total_due,user.display_name ClientDisplayName from ".RedNaoInvoiceOnTheGo::$INVOICE_TABLE;
        $q.=' join '.$wpdb->prefix.'users user on user.id=wp_rniotg_invoice.client_id where '. $where;
        $q.=$wpdb->prepare(' limit %d offset %d',$size,$page*$size);

        $result=$wpdb->get_results($q);
        if($result===false)
            $this->GenerateErrorMessage('An error occurred, please try again.');

        $invoiceRepo=new InvoiceRepo();
        $result=$invoiceRepo->DBToDTO($result);

        $count=$wpdb->get_var('select count(*) from '.RedNaoInvoiceOnTheGo::$SERVICE_TABLE.' where '.$where);
        return $this->GenerateSuccess(array(
            'rows'=>$result,
            'count'=>$count
        ));

    }

    public function Save(WP_REST_Request $request){
        /** @var InvoiceDTO $invoice */
        $invoice=$this->GetObjectParam($request,'InvoiceData');
        $invoiceManager=new InvoiceManager();
        $invoice=$invoiceManager->SaveInvoice($invoice);
        if($invoice===false)
            return $this->GenerateErrorMessage('Could\'t create the invoice, please try again');

        return $this->GenerateSuccess($invoice);

    }



}