<?php
/**
 * Created by PhpStorm.
 * User: Edgar
 * Date: 4/11/2018
 * Time: 11:22 AM
 */
namespace rniotg\db\repo;
use RedNaoInvoiceOnTheGo;
use rniotg\db\InvoiceMetaDTO;
use rniotg\db\repo\core\BaseRepo;
use rniotg\db\repo\core\Mappings;
use stdClass;

class InvoiceMetaRepo extends BaseRepo{



    public function Configure(Mappings $mapping)
    {
        $mapping->AddMapping('InvoiceMetaId','invoice_meta_id');
        $mapping->AddMapping('InvoiceId','invoice_id');
        $mapping->AddMapping('MetaKey','meta_key');
        $mapping->AddMapping('MetaValue','meta_value');
        $mapping->AddMapping('LastUpdate','last_update','date');
    }

    /** @return string */
    public function GetPrimaryKey()
    {
        return 'InvoiceMetaId';
    }

    /** @return string */
    public function GetTableName()
    {
        return RedNaoInvoiceOnTheGo::$INVOICE_META_TABLE;
    }

    public function GetByKey($invoiceId,$key)
    {
        return $this->PrepareQuery()
            ->AddColumn('MetaValue')
            ->AddCondition('InvoiceId','=',$invoiceId)
            ->AddCondition('MetaKey','=',$key)
            ->GetVar();

    }

    public function UpdateMeta($invoiceId,$key,$value)
    {
        $this->Delete(array('InvoiceId'=>$invoiceId,'MetaKey'=>$key));

        /** @var InvoiceMetaDTO $dto */
        $dto=new stdClass();
        $dto->InvoiceId=$invoiceId;
        $dto->MetaKey=$key;
        $dto->MetaValue=$value;
        $this->Insert($dto);
    }
}