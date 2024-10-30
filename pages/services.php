<?php
/**
 * Created by PhpStorm.
 * User: Edgar
 * Date: 3/26/2018
 * Time: 9:36 PM
 */

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
wp_enqueue_script('rniotg-bundle-main',RedNaoInvoiceOnTheGo::$URL.'js/angular/dist/services_main.bundle.js',array('rniotg-bundle-vendor'),RedNaoInvoiceOnTheGo::$FILE_VERSION,true);
wp_enqueue_script('rniotg-fontawesome',RedNaoInvoiceOnTheGo::$URL.'js/lib/fontawesome-all.min.js');
wp_enqueue_media();

wp_enqueue_style('rniotg-bootstrap-style',RedNaoInvoiceOnTheGo::$URL.'css/bootstrap.css');

wp_localize_script('rniotg-bundle-main','rnparams',array(
        'url'=>RedNaoInvoiceOnTheGo::$URL,
        'settings'=>SettingsManager::GetSettings(),
        'jsonurl'=>rest_url().'rniotg/v1/',
        'nonce' => wp_create_nonce( 'wp_rest' )
))

?>

<app-root></app-root>