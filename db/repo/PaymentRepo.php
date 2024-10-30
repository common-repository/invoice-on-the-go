<?php
/**
 * Created by PhpStorm.
 * User: Edgar
 * Date: 4/11/2018
 * Time: 11:22 AM
 */
namespace rniotg\db\repo;
use RedNaoInvoiceOnTheGo;
use rniotg\db\repo\core\BaseRepo;
use rniotg\db\repo\core\Mappings;

class PaymentRepo extends BaseRepo{



    public function Configure(Mappings $mapping)
    {
        $mapping->AddMapping('PaymentId','payment_id');
        $mapping->AddMapping('InvoiceId','invoice_id');
        $mapping->AddMapping('Date','date','date');
        $mapping->AddMapping('Amount','amount');
        $mapping->AddMapping('PaymentMethod','payment_method');
        $mapping->AddMapping('Status','status');
        $mapping->AddMapping('Comments','comments');
        $mapping->AddMapping('Reference','reference');
        $mapping->AddMapping('LastUpdate','last_update','date');
    }

    /** @return string */
    public function GetPrimaryKey()
    {
        return 'PaymentId';
    }

    /** @return string */
    public function GetTableName()
    {
        return RedNaoInvoiceOnTheGo::$PAYMENT_TABLE;
    }
}