<?php
/**
 * Created by PhpStorm.
 * User: Edgar
 * Date: 4/1/2018
 * Time: 1:05 PM
 */
namespace rniotg\api;
use function intval;
use rniotg\db\repo\DeleteLogRepo;
use rniotg\db\repo\ServiceRepo;
use rniotg\db\repo\SettingsRepo;
use rniotg\lib\SettingsManager;
use WP_Error;
use WP_REST_Request;

class SyncController extends Base{
    public function __construct()
    {
        parent::__construct();
        $this->RegisterAdminRoute('/sync/settings','POST',array($this,'SyncSettings'));
        $this->RegisterAdminRoute('/sync/service','POST',array($this,'SyncServices'));
        $this->RegisterAdminRoute('/sync/clients','POST',array($this,'SyncClients'));

    }

    public function SyncSettings(WP_REST_Request $request){
        $date=$this->GetStringParam($request,'Date',null);
        $repo=new SettingsRepo();
        $result=$repo->PrepareQuery()->AddCondition('LastUpdate','>',$date)->AddCondition('SettingKey','!=','RNIOTG_AUTH_TOKEN')->GetList();
        return $this->GenerateSuccess(array('rows'=>$result,'lastUpdate'=>current_time('timestamp',true)*1000));

    }

    public function SyncServices(WP_REST_Request $request){
        $date=$this->GetStringParam($request,'Date',null);
        $repo=new ServiceRepo();
        $result=$repo->PrepareQuery()->AddCondition('LastUpdate','>',$date)->GetList();


        $deleteRepo=new DeleteLogRepo();
        $deletedServices=$deleteRepo->PrepareQuery()
            ->AddColumn('Id')
            ->AddCondition('LastUpdate','>',$date)
            ->AddCondition('TableName','=','Service')->GetList();
        return $this->GenerateSuccess(array('rows'=>$result,'lastUpdate'=>current_time('timestamp',true)*1000,'deleted'=>$deletedServices));

    }

    public function SyncClients(WP_REST_Request $request){
        $date=$this->GetStringParam($request,'Date',null);
        if($date!=null)
            $date=intval($date)/1000;
        global $wpdb;
        $query="select users.id UserId,users.display_name DisplayName,metabusiness.meta_value BusinessName,metafirstname.meta_value FirstName,metalastname.meta_value LastName,metaaddress.meta_value Address,metaphone.meta_value Phone,
                  metafax.meta_value Fax,metawebsite.meta_value WebSite,metaextra.meta_value Extra,metalastmodified.meta_value*1000 LastUpdate,user_email Email,user_nicename UserName
                from ".$wpdb->users." users
                join ".$wpdb->usermeta." metacapability
                on users.ID=metacapability.user_id and metacapability.meta_key='wp_capabilities' and metacapability.meta_value like '%\"rniotg_customer\"%'
                left join ".$wpdb->usermeta." metabusiness
                on users.ID=metabusiness.user_id and metabusiness.meta_key='rniotg_business_name'
                left join ".$wpdb->usermeta." metafirstname
                on users.ID=metafirstname.user_id and metafirstname.meta_key='first_name'
                left join ".$wpdb->usermeta." metalastname
                on users.ID=metalastname.user_id and metalastname.meta_key='last_name'
                left join ".$wpdb->usermeta." metaaddress
                on users.ID=metaaddress.user_id and metaaddress.meta_key='rniotg_address'
                left join ".$wpdb->usermeta." metaphone
                on users.ID=metaphone.user_id and metaphone.meta_key='rniotg_phone'
                left join ".$wpdb->usermeta." metafax
                on users.ID=metafax.user_id and metafax.meta_key='rniotg_fax'
                left join ".$wpdb->usermeta." metawebsite
                on users.ID=metawebsite.user_id and metawebsite.meta_key='rniotg_website'
                left join ".$wpdb->usermeta." metaextra
                on users.ID=metaextra.user_id and metaextra.meta_key='rniotg_extra'
                left join ".$wpdb->usermeta." metalastmodified
                on users.ID=metalastmodified.user_id and metalastmodified.meta_key='rniotg_modified_date'
                where metalastmodified.meta_value>=%s";

        $results=$wpdb->get_results($wpdb->prepare($query,$date));

        $deleteRepo=new DeleteLogRepo();
        $deletedServices=$deleteRepo->PrepareQuery()
            ->AddColumn('Id')
            ->AddCondition('LastUpdate','>',$date*1000)
            ->AddCondition('TableName','=','Client')->GetList();

        return $this->GenerateSuccess(array('rows'=>$results,'lastUpdate'=>current_time('timestamp',true)*1000,'deleted'=>$deletedServices));

    }

    public function Authenticate(WP_REST_Request $request){
        $usr=$this->GetStringParam($request,'Usr');
        $pwd=$this->GetStringParam($request,'Pwd');
        $user = wp_authenticate( $usr, $pwd);
        if(is_wp_error($user))
        {
            return $this->GenerateErrorMessage('invalid_user_or_password');
        }

        if(!is_super_admin($user->ID))
            return $this->GenerateErrorMessage("not_super_admin");


        $authToken=$token = bin2hex(openssl_random_pseudo_bytes(16));
        SettingsManager::SetAuthToken($authToken);
        return $this->GenerateSuccess($authToken);
    }

}