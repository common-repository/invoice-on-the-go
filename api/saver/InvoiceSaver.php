<?php

namespace rniotg\api\saver;
use rniotg\db\InvoiceDTO;

class InvoiceSaver{
    /** @var InvoiceDTO */
    public $invoice;
    public function __construct($invoice)
    {
        $this->invoice=$invoice;
    }

    public function Execute()
    {
    }

}