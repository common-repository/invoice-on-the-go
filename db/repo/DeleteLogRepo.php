<?php
/**
 * Created by PhpStorm.
 * User: Edgar
 * Date: 5/4/2018
 * Time: 9:55 AM
 */

namespace rniotg\db\repo;


use RedNaoInvoiceOnTheGo;
use rniotg\db\repo\core\BaseRepo;
use rniotg\db\repo\core\Mappings;

class DeleteLogRepo extends BaseRepo
{

    public function Configure(Mappings $mapping)
    {
        $mapping->AddMapping('DeleteLogId','delete_log_id');
        $mapping->AddMapping('TableName','table_name');
        $mapping->AddMapping('Id','id');
        $mapping->AddMapping('LastUpdate','last_update','date');
    }

    /** @return string */
    public function GetPrimaryKey()
    {
        return 'DeleteLogId';
    }

    /** @return string */
    public function GetTableName()
    {
       return RedNaoInvoiceOnTheGo::$DELETE_LOG_TABLE;
    }
}