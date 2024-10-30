<?php
/**
 * Created by PhpStorm.
 * User: Edgar
 * Date: 4/11/2018
 * Time: 11:22 AM
 */
namespace rniotg\db\repo;
use RedNaoInvoiceOnTheGo;
use rniotg\api\Base;
use rniotg\db\repo\core\BaseRepo;
use rniotg\db\repo\core\Mappings;

class InvoiceRepo extends BaseRepo{




    public function Configure(Mappings $mapping)
    {
        $mapping->AddMapping('InvoiceId','invoice_id');
        $mapping->AddMapping('InvoiceNumber','invoice_number');
        $mapping->AddMapping('FormattedInvoiceNumber','formatted_invoice_number');
        $mapping->AddMapping('ClientId','client_id');
        $mapping->AddMapping('Description','description');
        $mapping->AddMapping('Status','status');
        $mapping->AddMapping('CreationDate','creation_date','date');
        $mapping->AddMapping('DueDate','due_date','date');
        $mapping->AddMapping('TermsAndConditions','terms_and_conditions');
        $mapping->AddMapping('SubTotal','sub_total');
        $mapping->AddMapping('Tax','tax');
        $mapping->AddMapping('Discount','discount');
        $mapping->AddMapping('Paid','paid');
        $mapping->AddMapping('TotalDue','total_due');
        $mapping->AddMapping('Ref','ref');
        $mapping->AddMapping('LastUpdate','last_update','date');
    }

    public function GetPrimaryKey()
    {
        return "InvoiceId";
    }

    public function GetTableName()
    {
        return RedNaoInvoiceOnTheGo::$INVOICE_TABLE;
    }
}