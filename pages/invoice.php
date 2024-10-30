<?php
/**
 * Created by PhpStorm.
 * User: Edgar
 * Date: 3/26/2018
 * Time: 9:36 PM
 */

use rniotg\api\InvoiceManager;
use rniotg\api\InvoicesController;
use rniotg\lib\SettingsManager;

if(!defined('ABSPATH'))
    die('Forbidden');
if(!current_user_can('manage_options'))
    die('Forbidden');


wp_enqueue_script( 'wp-api' );
wp_enqueue_script('jquery');
wp_enqueue_script('rniotg-tn',RedNaoInvoiceOnTheGo::$URL.'js/lib/tn/tn.js');
wp_enqueue_script('rniotg-bootstrap',RedNaoInvoiceOnTheGo::$URL.'js/lib/bootstrap.bundle.js',array('jquery'));
wp_enqueue_script('rniotg-bundle-inline',RedNaoInvoiceOnTheGo::$URL.'js/angular/dist/inline.bundle.js',array('jquery'),RedNaoInvoiceOnTheGo::$FILE_VERSION,true);
wp_enqueue_script('rniotg-bundle-polyfills',RedNaoInvoiceOnTheGo::$URL.'js/angular/dist/polyfills.bundle.js',array('rniotg-bundle-inline'),RedNaoInvoiceOnTheGo::$FILE_VERSION,true);
wp_enqueue_script('rniotg-bundle-vendor',RedNaoInvoiceOnTheGo::$URL.'js/angular/dist/vendor.bundle.js',array('rniotg-bundle-polyfills','wp-api'),RedNaoInvoiceOnTheGo::$FILE_VERSION,true);
wp_enqueue_script('rniotg-bundle-style',RedNaoInvoiceOnTheGo::$URL.'js/angular/dist/styles.bundle.js',array('rniotg-bundle-polyfills','wp-api'),RedNaoInvoiceOnTheGo::$FILE_VERSION,true);
$params=array(
    'url'=>RedNaoInvoiceOnTheGo::$URL,
    'settings'=>SettingsManager::GetSettings(),
    'jsonurl'=>rest_url().'rniotg/v1/',
    'nonce' => wp_create_nonce( 'wp_rest' ),
    'invoice_id'=>$_GET['invoice_id']
);
if(isset($_GET['invoice_id']))
{
    wp_enqueue_script('rniotg-bundle-main', RedNaoInvoiceOnTheGo::$URL . 'js/angular/dist/invoice_builder_main.bundle.js', array('rniotg-bundle-vendor'), RedNaoInvoiceOnTheGo::$FILE_VERSION, true);
    $args = array(
        'role'    => 'rniotg_customer',
        'orderby' => 'user_nicename',
        'order'   => 'ASC'
    );

    if($_GET['invoice_id']>0)
    {
        $invoiceManager=new InvoiceManager();
        $data=$invoiceManager->LoadInvoiceById($_GET['invoice_id']);
        $params['invoice_data']=$data;
    }

    /** @var WP_User[] $users */
    $users = get_users( $args );
    $params['users']=array();
    $params['current_time']=current_time('timestamp',true);
    global $wpdb;
    $params['services']=$wpdb->get_results('select name Name,rate Rate,taxable Taxable,tax_Rate TaxRate,notes Notes from '.RedNaoInvoiceOnTheGo::$SERVICE_TABLE,'ARRAY_A');
    foreach($users as $user)
    {
        $params['users'][]=array(
            'Id'=>$user->ID,
            'Label'=>$user->display_name
        );
    }
}else
{
    wp_enqueue_script('rniotg-bundle-main', RedNaoInvoiceOnTheGo::$URL . 'js/angular/dist/invoice_main.bundle.js', array('rniotg-bundle-vendor'), RedNaoInvoiceOnTheGo::$FILE_VERSION, true);

}
wp_enqueue_script('rniotg-fontawesome',RedNaoInvoiceOnTheGo::$URL.'js/lib/fontawesome-all.min.js');
wp_enqueue_media();

wp_enqueue_style('rniotg-bootstrap-style',RedNaoInvoiceOnTheGo::$URL.'css/bootstrap.css');

wp_localize_script('rniotg-bundle-main','rnparams',$params)

?>



<app-root></app-root>