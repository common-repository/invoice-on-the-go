<?php
/**
 * Created by PhpStorm.
 * User: Edgar
 * Date: 4/20/2018
 * Time: 1:33 PM
 */

namespace rniotg\api;


use function current_time;
use RedNaoInvoiceOnTheGo;
use rniotg\db\repo\InvoiceMetaRepo;
use rniotg\lib\SettingsManager;

class ReminderProcessor
{
    public function Start(){
        $options=SettingsManager::GetReminderOptions();
        if(!$options->Enable)
            return;

        $lastExecution=get_option('rniotg_last_reminder_execution',false);
        $currentExecutionTime=date('Y-m-d',current_time('timestamp',true));
        if($lastExecution!==false&&$lastExecution==$currentExecutionTime)
            return;
        $query='';
        global $wpdb;
        $preparedDate=$wpdb->prepare('%s',$currentExecutionTime);
        if($options->Reminder7DaysBefore)
            $this->CreateReminderQuery($query,$preparedDate,2,7,-7);
        if($options->Reminder1DaysBefore)
            $this->CreateReminderQuery($query,$preparedDate,1,1,-1);
        if($options->Reminder0DaysBefore)
            $this->CreateReminderQuery($query,$preparedDate,0,0,0);
        if($options->Reminder1DaysAfter)
            $this->CreateReminderQuery($query,$preparedDate,-1,-1,1);
        if($options->Reminder7DaysAfter)
            $this->CreateReminderQuery($query,$preparedDate,-7,-2,7);
        if($options->Reminder14DaysAfter)
            $this->CreateReminderQuery($query,$preparedDate,-14,-8,14);
        if($options->Reminder21DaysAfter)
            $this->CreateReminderQuery($query,$preparedDate,-21,-15,21);
        if($options->Reminder31DaysAfter)
            $this->CreateReminderQuery($query,$preparedDate,-31,-22,31);


        $results=$wpdb->get_results($query);
        foreach($results as $result )
        {
            $this->SendReminderIfNeeded($result->invoice_id,$result->type);
        }



    }

    private function CreateReminderQuery(&$query,$currentTime,$from,$to,$type)
    {
        if($query!='')
            $query.=' UNION ';


        $query.='select invoice.invoice_id,'.$type.' type from '.RedNaoInvoiceOnTheGo::$INVOICE_TABLE. ' invoice left join '.RedNaoInvoiceOnTheGo::$INVOICE_META_TABLE .' meta ';
        $query.='on meta.invoice_id=invoice.invoice_id ';
        $query.=' where status=1 and meta.invoice_id is null and ';
        if($from!=$to)
            $query .= 'due_date between date_add('.$currentTime.',interval ' . $from . ' day) and date_add('.$currentTime.',interval ' . $to . ' day) ';
        else
            $query .= 'due_date =date_add('.$currentTime.', interval '.$from.' day)';


    }

    private function SendReminderIfNeeded($invioce_id, $type)
    {
        $emailer=new Emailer();
        $emailer->LoadInvoiceDataById($invioce_id);
        $emailer->SendReminder();


        $invoiceMetaRepo=new InvoiceMetaRepo();
        $invoiceMetaRepo->UpdateMeta($invioce_id,'e'.$type,1);


    }

}