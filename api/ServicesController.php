<?php
/**
 * Created by PhpStorm.
 * User: Edgar
 * Date: 4/1/2018
 * Time: 1:05 PM
 */
namespace rniotg\api;
use RedNaoInvoiceOnTheGo;
use rniotg\db\repo\ServiceRepo;
use WP_REST_Request;

class ServicesController extends Base{
    public function __construct()
    {
        parent::__construct();
        $this->RegisterAdminRoute('/service/getlist','POST',array($this,'GetList'));
        $this->RegisterAdminRoute('/service/save','POST',array($this,'Save'));
        $this->RegisterAdminRoute('/service/delete','POST',array($this,'Delete'));

    }

    public function GetList(WP_REST_Request $request){

        $page=$this->GetStringParam($request,'Page');
        $size=$this->GetStringParam($request,'Size');
        $filter=$this->GetStringParam($request,'Filter');


        global $wpdb;
        $where="name like '%";
        $where.=$wpdb->esc_like($filter)."%' order by name ";
        $q="select service_id ServiceId,name Name,rate Rate,taxable Taxable,tax_rate TaxRate,notes Notes from ".RedNaoInvoiceOnTheGo::$SERVICE_TABLE." where ".$where;
        $q.=$wpdb->prepare('limit %d offset %d',$size,$page*$size);

        $result=$wpdb->get_results($q);
        if($result===false)
            $this->GenerateErrorMessage('An error occurred, please try again.');
        foreach($result as &$row)
            $row->Taxable=intval($row->Taxable);

        $count=$wpdb->get_var('select count(*) from '.RedNaoInvoiceOnTheGo::$SERVICE_TABLE.' where '.$where);
        return $this->GenerateSuccess(array(
            'rows'=>$result,
            'count'=>$count
        ));

    }

    public function Save(WP_REST_Request $request){

        $serviceId=$this->GetStringParam($request,'ServiceId',null);
        $rate=$this->GetStringParam($request,'Rate',0);
        $name=$this->GetStringParam($request,'Name',null);
        $taxable=$this->GetNumericParam($request,'Taxable',false);
        $taxRate=$this->GetNumericParam($request,'TaxRate',0);
        $notes=$this->GetStringParam($request,'Notes','');

        return $this->SaveServiceToDb($serviceId,$rate,$name,$taxable,$taxRate,$notes);
    }

    public function SaveServiceToDb($serviceId,$rate,$name,$taxable,$taxRate,$notes)
    {
        if($taxable==false)
            $taxRate=0;

        global $wpdb;

        $name=trim($name);
        $lastUpdate=date("Y-m-d H:i:s", current_time('timestamp',true));
        if($serviceId==0)
        {
            $count = $wpdb->get_var($wpdb->prepare('select count(*) from ' . RedNaoInvoiceOnTheGo::$SERVICE_TABLE . ' where name=%s', $name));
            if ($count > 0)
            {
                return $this->GenerateErrorMessage('Service name already exists');
            }


            $result = $wpdb->insert(RedNaoInvoiceOnTheGo::$SERVICE_TABLE, array(
                'name' => $name,
                'rate' => $rate,
                'taxable' =>intval($taxable),
                'tax_rate' => $taxRate,
                'notes'=>$notes,
                'last_update'=>$lastUpdate
            ));
            $serviceId=$wpdb->insert_id;
        }else{
            $result=$wpdb->update(RedNaoInvoiceOnTheGo::$SERVICE_TABLE, array(
                'name' => $name,
                'rate' => $rate,
                'taxable' => intval($taxable),
                'tax_rate' => $taxRate,
                'notes'=>$notes,
                'last_update'=>$lastUpdate
            ),array('service_id'=>$serviceId));
        }

        if($result===false)
        {
            return $this->GenerateErrorMessage('An error occurred while saving the service. Please try again.');
        }

        return $this->GenerateSuccess(array(
            'ServiceId'=>$serviceId,
            'Name'=>$name,
            'Rate'=>$rate,
            'Taxable'=>$taxable,
            'TaxRate'=>$taxRate,
            'Notes'=>$notes,
            'LastUpdate'=>$lastUpdate
        ));


    }

    public function Delete(WP_REST_Request $request){

        $serviceId=$this->GetStringParam($request,'ServiceId',null);
        global $wpdb;

        $serviceRepo=new ServiceRepo();
        $result=$serviceRepo->Delete($serviceId);
        if($result===false)
            return $this->GenerateErrorMessage('An error ocurred while trying to delete the service, please try again');
        return $this->GenerateSuccess(array());

    }

}