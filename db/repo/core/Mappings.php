<?php
/**
 * Created by PhpStorm.
 * User: Edgar
 * Date: 4/12/2018
 * Time: 7:18 AM
 */

namespace rniotg\db\repo\core;


class Mappings
{
    /** @var MappingItem[] */
    public $Items=[];

    /**
     * @param $dtoFieldName string
     * @param $dbFieldName string
     * @param string $type
     * @return MappingItem
     */
    public function AddMapping($dtoFieldName,$dbFieldName,$type='string')
    {
        $this->Items[$dtoFieldName]=new MappingItem($dtoFieldName,$dbFieldName,$type);
        return $this->Items[$dtoFieldName];
    }




}