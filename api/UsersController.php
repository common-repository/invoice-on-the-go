<?php
/**
 * Created by PhpStorm.
 * User: Edgar
 * Date: 4/1/2018
 * Time: 1:05 PM
 */
namespace rniotg\api;
use rniotg\lib\SettingsManager;
use WP_Error;
use WP_REST_Request;

class UsersController extends Base{
    public function __construct()
    {
        parent::__construct();
        $this->RegisterAdminRoute('/users/create','POST',array($this,'CreateUser'));
        $this->RegisterPublicRoute('/users/authenticate','POST',array($this,'Authenticate'));
    }

    public function CreateUser(WP_REST_Request $request){
        $userName=$this->GetStringParam($request,'UserName',null);
        $email=$this->GetStringParam($request,'Email',null);
        $password=$this->GetStringParam($request,'Password','');
        $businessName=$this->GetStringParam($request,'BusinessName','');
        $firstName=$this->GetStringParam($request,'FirstName','');
        $lastName=$this->GetStringParam($request,'LastName','');
        $address=$this->GetStringParam($request,'Address','');
        $phone=$this->GetStringParam($request,'Phone','');
        $fax=$this->GetStringParam($request,'Fax','');
        $website=$this->GetStringParam($request,'Website','');
        $extra=$this->GetStringParam($request,'Extra','');

        $result=wp_create_user($userName,trim($password),$email);
        if($result instanceof WP_Error)
        {
            return $this->GenerateErrorMessage($result->get_error_message());
        }

        $lastUpdate=current_time('timestamp',true);
        update_user_meta($result,'rniotg_business_name',$businessName);
        update_user_meta($result,'rniotg_address',$address);
        update_user_meta($result,'rniotg_phone',$phone);
        update_user_meta($result,'rniotg_fax',$fax);
        update_user_meta($result,'rniotg_website',$website);
        update_user_meta($result,'rniotg_extra',$extra);
        update_user_meta( $result, 'rniotg_modified_date',$lastUpdate);

        wp_update_user((object)array('ID'=>$result, 'first_name' => $firstName, 'last_name' => $lastName,'role'=>'rniotg_customer') );

        return $this->GenerateSuccess(array('Id'=>$result,'Label'=>$userName,'LastUpdate'=>1000));

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