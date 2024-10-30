<?php
/**
 * Created by PhpStorm.
 * User: Edgar
 * Date: 4/11/2018
 * Time: 11:22 AM
 */
namespace rniotg\db\repo\core;
use Exception;
use function insert_blog;
use function is_a;
use function is_array;
use rniotg\db\DeleteLogDTO;
use rniotg\db\repo\DeleteLogRepo;
use stdClass;

abstract class BaseRepo{
    /** @var Mappings */
    public $Mappings;

    private $DBDictionary;

    public abstract function Configure(Mappings $mapping);
    /** @return string */
    public abstract function GetPrimaryKey();
    /** @return string */
    public abstract function GetTableName();


    public function __construct()
    {
        $this->Mappings=new Mappings();
        $this->Configure($this->Mappings);
    }

    public function RecordDeletion(){
        return false;
    }

    /**
     * @return MappingItem[]
     */
    public function GetDBDictionary(){
        if($this->DBDictionary==null)
        {
            foreach($this->Mappings->Items as $MapItem)
            {
                $this->DBDictionary[$MapItem->DBFieldName]=$MapItem;

            }
        }

        return $this->DBDictionary;

    }

    public function GetUniversalTableName(){
        return '';
    }


    public function DTOToDB($dto){
        $data=array();
        foreach($this->Mappings->Items as $mappingItem)
        {

            $dtoPropertyName=$mappingItem->DTOFieldName;
            if(!isset($dto->$dtoPropertyName))
                continue;
            if($mappingItem->FieldType=='date')
            {
                $value=intval($dto->$dtoPropertyName);
                if($value==0)
                    $data[$mappingItem->DBFieldName]=null;
                else
                    $data[$mappingItem->DBFieldName]=date("Y-m-d H:i:s", $value/1000);
            }else
            {
                $data[$mappingItem->DBFieldName] = $dto->$dtoPropertyName;
            }

        }
        return $data;
    }

    public function DBToDTO($db){
        if(is_array($db))
        {
            $rowList=array();
            foreach($db as $row)
            {
                $rowList[]=$this->DBToDTO($row);
            }
            return $rowList;
        }
        $data=array();
        $dbDictionary=$this->GetDBDictionary();

        foreach($db as $property=>$value)
        {
            if(!isset($dbDictionary[$property]))
            {
                $data[$property]=$value;
                continue;
            }

            $mappingItem=$dbDictionary[$property];
            $dbPropertyName=$mappingItem->DBFieldName;
            if($mappingItem->FieldType=='boolean')
            {
                $data[$mappingItem->DTOFieldName] = $db->$dbPropertyName == '1' ? true : false;
            }
            if($mappingItem->FieldType=='date')
            {
                if($db->$dbPropertyName=='')
                    $data[$mappingItem->DTOFieldName] ='';
                else
                    $data[$mappingItem->DTOFieldName]=strtotime($db->$dbPropertyName)*1000;
            }
            else
                $data[$mappingItem->DTOFieldName]=$db->$dbPropertyName;
        }

        return (object)$data;
    }

    public function Delete($idOrFilters)
    {
        $deleteParams=array();
        $idsToDelete=array();
        if(is_array($idOrFilters))
        {
            if($this->RecordDeletion())
                throw new Exception('Delete with parameters not able to synchronize yet');
            $deleteParams = $idOrFilters;
        }
        else{
            $idsToDelete[]=$idOrFilters;
            $deleteParams=array($this->GetPrimaryKey()=>$idOrFilters);
        }




        $deleteParams=$this->DTOToDB((object)$deleteParams);
        global $wpdb;
        $result=$wpdb->delete($this->GetTableName(),$deleteParams);
        if($result!==false)
        {
            $repo=new DeleteLogRepo();
            foreach($idsToDelete as $id)
            {
                /** @var DeleteLogDTO $log */
                $log=new stdClass();
                $log->TableName=$this->GetUniversalTableName();
                $log->Id=$id;
                $repo->Insert($log);

            }


        }

        return $result;



    }

    public function GetById($id)
    {
        $maker= $this->PrepareQuery();
        return $maker->AddCondition($this->GetPrimaryKey(),'=',$id)->GetFirst();

    }

    /**
     * @param array
     */
    public function GetList($condition){
        $maker= $this->PrepareQuery();
        foreach($condition as $key=>$value)
        {
            $maker->AddCondition($key,'=',$value);
        }

        return $maker->GetList();


    }

    public function PrepareQuery()
    {
        return new QueryMaker($this);
    }

    public function Insert(&$dto)
    {
        $primaryKey=$this->GetPrimaryKey();
        $db=$this->DTOToDB($dto);
        global $wpdb;
        $db['last_update']=date("Y-m-d H:i:s", current_time('timestamp',true));
        $result=$wpdb->insert($this->GetTableName(),$db);
        if($result===false)
            return false;

        $dto->$primaryKey=$wpdb->insert_id;
        return $wpdb->insert_id;

    }

    public function Update(&$dto)
    {
        $primaryKey=$this->GetPrimaryKey();
        $db=$this->DTOToDB($dto);
        global $wpdb;
        $dbPrimaryKey=$this->Mappings->Items[$primaryKey]->DBFieldName;
        $db['last_update']=date("Y-m-d H:i:s", current_time('timestamp',true));
        $result=$wpdb->update($this->GetTableName(),$db,array($dbPrimaryKey=>$dto->$primaryKey));
        if($result===false)
            return false;

        return $dto->$primaryKey;
    }

    public function Upsert(&$dto)
    {
        $primaryKey=$this->GetPrimaryKey();
        if($dto->$primaryKey=='0')
        {
            return $this->Insert($dto);
        }else{
            return $this->Update($dto);
        }
    }

}