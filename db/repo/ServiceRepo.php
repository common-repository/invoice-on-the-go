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

class ServiceRepo extends BaseRepo
{

    public function Configure(Mappings $mapping)
    {
        $mapping->AddMapping('ServiceId','service_id');
        $mapping->AddMapping('Name','name');
        $mapping->AddMapping('Rate','rate');
        $mapping->AddMapping('Taxable','taxable','boolean');
        $mapping->AddMapping('TaxRate','tax_rate');
        $mapping->AddMapping('Notes','notes');
        $mapping->AddMapping('LastUpdate','last_update','date');
    }

    /** @return string */
    public function GetPrimaryKey()
    {
        return 'ServiceId';
    }

    /** @return string */
    public function GetTableName()
    {
       return RedNaoInvoiceOnTheGo::$SERVICE_TABLE;
    }

    public function RecordDeletion()
    {
        return true;
    }

    public function GetUniversalTableName()
    {
        return 'Service';
    }


}