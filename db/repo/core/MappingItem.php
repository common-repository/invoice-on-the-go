<?php
/**
 * Created by PhpStorm.
 * User: Edgar
 * Date: 4/12/2018
 * Time: 7:19 AM
 */

namespace rniotg\db\repo\core;


class MappingItem
{
    /** @var string */
    public $DTOFieldName;
    /** @var string */
    public $DBFieldName;
    /**
     * @var string
     */
    public $FieldType;

    public function __construct($dtoFieldName, $dbFieldName,$fieldType='string')
    {
        $this->DTOFieldName = $dtoFieldName;
        $this->DBFieldName = $dbFieldName;
        $this->FieldType = $fieldType;
    }


}