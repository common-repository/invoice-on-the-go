<?php
namespace rniotg\lib;
use function esc_html;
use rniotg\db\DeleteLogDTO;
use rniotg\db\repo\DeleteLogRepo;
use stdClass;
use function strval;

class UserManager{
    public function AddUserBoxes($userId){?>
        <h2>Invoice On The Go Client Information</h2>
        <table class="form-table">
            <tbody>
                <tr>
                    <th>Business Name</th>
                    <td>
                        <?php $this->AddBox($userId,'rniotg_business_name')?>
                    </td>
                </tr>
                <tr>
                    <th>Address</th>
                    <td>
                        <?php $this->AddBox($userId,'rniotg_address')?>
                    </td>
                </tr>
                <tr>
                    <th>Phone</th>
                    <td>
                        <?php $this->AddBox($userId,'rniotg_phone')?>
                    </td>
                </tr>
                    <th>Fax</th>
                    <td>
                        <?php $this->AddBox($userId,'rniotg_fax')?>
                    </td>
                <tr>
                    <th>Website</th>
                    <td>
                        <?php $this->AddBox($userId,'rniotg_website')?>
                    </td>
                </tr>
                <tr>
                    <th>Extra info (like VAT number)</th>
                    <td>
                        <?php $this->AddTextArea($userId,'rniotg_extra')?>
                    </td>
                </tr>
            </tbody>
        </table>

<?php

    }

    public function Save($user_id)
    {
        if ( !current_user_can( 'edit_user', $user_id ) )
            return false;

        if(isset($_POST['rniotg_business_name']))
        {
            update_user_meta( $user_id, 'rniotg_business_name', strval($_POST['rniotg_business_name']) );
        }

        if(isset($_POST['rniotg_address']))
        {
            update_user_meta( $user_id, 'rniotg_address',strval($_POST['rniotg_address']) );
        }
        if(isset($_POST['rniotg_phone']))
        {
            update_user_meta( $user_id, 'rniotg_phone', strval($_POST['rniotg_phone']) );
        }
        if(isset($_POST['rniotg_fax']))
        {
            update_user_meta( $user_id, 'rniotg_fax', strval($_POST['rniotg_fax'] ));
        }

        if(isset($_POST['rniotg_website']))
        {
            update_user_meta( $user_id, 'rniotg_website', strval($_POST['rniotg_website'] ));
        }

        if(isset($_POST['rniotg_extra']))
        {
            update_user_meta( $user_id, 'rniotg_extra', strval($_POST['rniotg_extra'] ));
        }

        update_user_meta( $user_id, 'rniotg_modified_date',current_time('timestamp',true));

    }

    private function AddBox($userId,$metaId)
    {
        $value=get_user_meta($userId,$metaId,true);
        echo "<input  name=\"".$metaId."\" type=\"text\" value=\"".esc_attr($value)."\" class=\"regular-text\">";
    }

    private function AddTextArea($userId,$metaId)
    {
        $value=get_user_meta($userId,$metaId,true);
        echo "<textarea style=\"height:100px\"  name=\"".$metaId."\" type=\"text\" class=\"regular-text\">".esc_html($value)."</textarea>";
    }

    public function Delete($userId)
    {
        $user_meta=get_userdata($userId);
        if($user_meta===false)
            return;
        $user_roles=$user_meta->roles;
        if ( in_array( 'rniotg_customer', (array) $user_meta->roles ) ) {
            /** @var DeleteLogDTO $deleteData */
            $deleteData=new stdClass();
            $deleteData->TableName='Client';
            $deleteData->Id=$userId;

            $deleteRepo=new DeleteLogRepo();
            $deleteRepo->Insert($deleteData);

        }


    }
}