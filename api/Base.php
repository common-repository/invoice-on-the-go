<?php

namespace rniotg\api;
use Exception;
use function is_array;
use rniotg\lib\SettingsManager;
use WP_REST_Controller;
use WP_REST_Request;

class Base extends WP_REST_Controller {
    public $namespace='rniotg/v1';
    public $param=null;
    public function __construct()
    {
        add_action( 'rest_api_init', function () {
            register_rest_route( 'myplugin/v1', '/author/(?P<id>\d+)', array(
                'methods' => 'GET',
                'callback' => 'my_awesome_func',
            ) );
        } );
    }

    public function RegisterAdminRoute($pattern,$method,$callback)
    {
        register_rest_route( $this->namespace, $pattern, array(
            array(
                'methods'         => $method,
                'callback'        => $callback,
                'permission_callback' => array($this,'IsAdmin')
                )
            ));

    }

    public function RegisterPublicRoute($pattern,$method,$callback)
    {
        register_rest_route( $this->namespace, $pattern, array(
            array(
                'methods'         => $method,
                'callback'        => $callback
            )
        ));

    }

    public function IsAdmin(){
        if(get_current_user_id()==0)
        {
            $token=SettingsManager::GetAuthToken();
            return $_SERVER['HTTP_TOKEN']==$token;
        }
        return current_user_can('administrator');
    }

    public function GenerateSuccess($data=''){
        return array(
            'success'=>true,
            'result'=>$data
        );
    }

    public function GenerateErrorMessage($message){
        return array(
            'success'=>false,
            'errorMessage'=>$message
        );

    }

    public function GetParams(WP_REST_Request $request){
        if($this->param==null)
            $this->param=$this->ToObject($request->get_json_params());

        return $this->param;
    }

    private function ToObject($params)
    {
        foreach($params as $key=>$value)
        {
            if(is_array($value))
                $params[$key]=$this->ToObject($params[$key]);
        }
        if(is_array($params)&&array_keys($params) !== range(0, count($params) - 1))
            return (object)$params;
        return $params;
    }

    public function GetStringParam(WP_REST_Request $request,$paramName,$defaultValue='')
    {
        $params=$this->GetParams($request);
        if(!isset ($params->$paramName))
            if($defaultValue===null)
            {
                throw new Exception('Reqiured parameter ' . $paramName . ' not found.');
            }else{
                return $defaultValue;
            }

        return $params->$paramName;
    }

    public function GetObjectParam(WP_REST_Request $request,$paramName,$defaultValue='')
    {
        $params=$this->GetParams($request);
        if($paramName=='')
            return $params;
        if(isset($params->InvoiceData))
            return (object)$params->InvoiceData;
        if(isset($params->$paramName))
            return $params->$paramName;
        else
            if($defaultValue==null)
                throw new Exception('Reqiured parameter ' . $paramName . ' not found.');
            else
                return $defaultValue;
    }

    public function GetNumericParam(WP_REST_Request $request,$paramName,$defaultValue='')
    {
        $param=$this->GetStringParam($request,$paramName,$defaultValue);
        return floatval($param);
    }


}