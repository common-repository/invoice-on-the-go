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


class InvoiceDetailRepo extends BaseRepo{
    public $Mappings=array(
        'InvoiceDetailId'=>'invoice_detail_id',
        'InvoiceId'=>'invoice_id',
        'Name'=>'name',
        'Rate'=>'rate',
        'Taxable'=>'taxable',
        'Qty'=>'qty',
        'TaxRate'=>'tax_rate',
        'Total'=>'total',
        'Notes'=>'notes',
        'TaxTotal'=>'tax_total',
        'SubTotal'=>'sub_total'
    );




    public function Configure(Mappings $mapping)
    {
        $mapping->AddMapping('InvoiceDetailId','invoice_detail_id');
        $mapping->AddMapping('InvoiceId','invoice_id');
        $mapping->AddMapping('Name','name');
        $mapping->AddMapping('Rate','rate');
        $mapping->AddMapping('Taxable','taxable','boolean');
        $mapping->AddMapping('Qty','qty');
        $mapping->AddMapping('TaxRate','tax_rate');
        $mapping->AddMapping('Total','total');
        $mapping->AddMapping('Notes','notes');
        $mapping->AddMapping('TaxTotal','tax_total');
        $mapping->AddMapping('SubTotal','sub_total');
        $mapping->AddMapping('LastUpdate','last_update','date');
    }

    public function GetPrimaryKey()
    {
        return 'InvoiceDetailId';
    }

    public function GetTableName()
    {
        return RedNaoInvoiceOnTheGo::$INVOICE_DETAIL_TABLE;
    }
}