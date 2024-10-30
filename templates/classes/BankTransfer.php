<?php
/**
 * Created by PhpStorm.
 * User: Edgar
 * Date: 4/19/2018
 * Time: 9:41 AM
 */

namespace rniotg\templates\classes;


use rniotg\db\BankAccountDTO;

class BankTransfer extends TemplatePaymentBase
{
    /** @var BankAccountDTO */
    public $Accounts=[];
    public $ShowAccountName=false;
    public $ShowAccountNumber=false;
    public $ShowBankName=false;
    public $ShowSortCode=false;
    public $ShowIBAN=false;
    public $ShowBicSwift=false;

}