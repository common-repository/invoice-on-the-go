<?php
/**
 * Created by PhpStorm.
 * User: Edgar
 * Date: 4/11/2018
 * Time: 11:22 AM
 */
namespace rniotg\db\repo;
use function json_decode;
use function json_encode;
use RedNaoInvoiceOnTheGo;
use rniotg\db\AppSettingsDTO;
use rniotg\db\repo\core\BaseRepo;
use rniotg\db\repo\core\Mappings;
use stdClass;

class SettingsRepo extends BaseRepo{



    public function Configure(Mappings $mapping)
    {
        $mapping->AddMapping('SettingId','setting_id');
        $mapping->AddMapping('SettingKey','setting_key');
        $mapping->AddMapping('Value','value');
        $mapping->AddMapping('LastUpdate','last_update','date');
    }

    /** @return string */
    public function GetPrimaryKey()
    {
        return 'SettingId';
    }



    /** @return string */
    public function GetTableName()
    {
        return RedNaoInvoiceOnTheGo::$SETTINGS_TABLE;
    }


    public function GetSetting($key)
    {

        $value= $this->PrepareQuery()->AddColumn('Value')->AddCondition('SettingKey','=',$key)->GetVar();
        $jsonValue=json_decode($value);
        if($jsonValue==null)
            return $value;

        return $jsonValue;
    }


    public function SetSetting($key,$value)
    {
        if($value instanceof stdClass)
            $value=json_encode($value);
        /** @var AppSettingsDTO $row */
        $row= $this->PrepareQuery()->AddCondition('SettingKey','=',$key)->GetFirst();

        if($row==null)
        {
            $row=new stdClass();
            $row->SettingId=0;
            $row->SettingKey=$key;
            $row->Value=$value;
            $this->Insert($row);
        }else{
            $row->Value=$value;
            $this->Upsert($row);
        }

    }

}