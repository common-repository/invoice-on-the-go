<?php
/**
 * Created by PhpStorm.
 * User: Edgar
 * Date: 4/12/2018
 * Time: 7:25 PM
 */

namespace rniotg\db\repo\core;


use Exception;
use function intval;
use function substr;

class QueryMaker
{
    /** @var MappingItem[]  */
    public $items;
    /**
     * @var BaseRepo
     */
    private $repo;
    private $columns='';
    private $where='';


    public function __construct(BaseRepo $repo)
    {
        $this->repo = $repo;
        $this->items=$repo->Mappings->Items;
    }

    public function AddColumn($fieldName)
    {
        if(!isset($this->items[$fieldName]))
            throw new Exception("Column not found ".$fieldName);
        if($this->columns!='')
            $this->columns.=',';
        $this->columns.=$this->items[$fieldName]->DBFieldName;
        return $this;
    }

    /**
     * @param $columns array
     * @throws Exception
     */
    public function AddColumns($fieldNames)
    {
        foreach($fieldNames as $column)
        {
            $this->AddColumn($column);
        }
        return $this;
    }

    public function AddCondition($fieldName,$comparison,$value,$join='and')
    {
        if(!isset($this->items[$fieldName]))
            throw new Exception("Column not found ".$fieldName);

        if($this->items[$fieldName]->FieldType=='date')
        {
            $value=intval($value);
            $value=date("Y-m-d H:i:s", $value/1000);
        }
       if($this->where!='')
           $this->where.=' '.$join.' ';
       global $wpdb;
       $this->where.=$this->items[$fieldName]->DBFieldName.$comparison.$wpdb->prepare('%s',$value);
        return $this;
    }
    private function PrepareColumns()
    {
        if($this->columns=='')
        {
            foreach ($this->items as $item)
            {
                $this->columns.= ',' . $item->DBFieldName;
            }
            $this->columns=substr($this->columns,1);
        }



    }

    public function GetList(){
        $this->PrepareColumns();
        global $wpdb;
        $results=$wpdb->get_results('select '.$this->columns.' from '.$this->repo->GetTableName().' where '.$this->where);
        if($results==null)
            return array();
        return $this->repo->DBToDTO($results);
    }

    public function GetFirst(){
        $this->PrepareColumns();
        global $wpdb;
        $results=$wpdb->get_row('select '.$this->columns.' from '.$this->repo->GetTableName().' where '.$this->where);
        if($results==null)
            return null;
        return $this->repo->DBToDTO($results);
    }

    public function GetVar(){
        $this->PrepareColumns();
        global $wpdb;
        $result= $wpdb->get_var('select '.$this->columns.' from '.$this->repo->GetTableName().' where '.$this->where);
        return $result;

    }




}
