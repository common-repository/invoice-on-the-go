<?php
/**
 * Created by PhpStorm.
 * User: Edgar
 * Date: 4/18/2018
 * Time: 9:11 PM
 */

namespace rniotg\api;


use function floatval;
use rniotg\lib\SettingsManager;
use function round;

class Formatter
{

    public static function FormatDate($CreationDate)
    {
        $ticks=intval($CreationDate);
        if($ticks<=0)
            return '';

        $ticks=$ticks/1000;
        return date('M/d/Y',$ticks);



    }

    public static function FormatNumber($value)
    {
        $number=floatval($value);
        $options=SettingsManager::GetGeneralOptions();

        $number=number_format($number,$options->NumberOfDecimals,$options->DecimalSeparator,$options->ThousandSeparator);
        switch($options->CurrencyPosition)
        {
            case 'left':
                return $options->Currency.$number;
            case 'left_space':
                return $options->Currency.' '.$number;
            case 'right':
                return $number.$options->Currency;
            case 'right_space':
                return $number.' '.$options->Currency;
        }

        return 'Invalid number format';

    }

    public static function FormatIntNumber($value)
    {
        $floatValue=floatval($value);
        if($floatValue===round($floatValue))
        {
            return round($floatValue,0);
        }else{
            return round($floatValue,2);
        }

    }

    public static function FormatUrl($url)
    {
        return '<a href="'.$url.'">'.$url.'</a>';
    }
}