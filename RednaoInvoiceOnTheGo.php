<?php

use rniotg\api\gateways\PayPalGateWay;
use rniotg\api\InvoicesController;
use rniotg\api\ReminderProcessor;
use rniotg\api\ServicesController;
use rniotg\api\SettingsController;
use rniotg\api\SyncController;
use rniotg\api\UsersController;
use rniotg\lib\Authenticator;
use rniotg\lib\SettingsManager;
use rniotg\lib\UserManager;
use rniotg\templates\TemplateManager;


/**
 * Plugin Name: Invoice On The Go
 * Plugin URI: http://smartforms.rednao.com/getit
 * Description: For busy people, create invoices on your Cell Phone!
 * Author: RedNao
 * Author URI: http://rednao.com
 * Version: 1.0
 * Text Domain: RedNao PDF Invoice Builder
 * Domain Path: /languages/
 * Network: true
 * License: GPLv3
 * License URI: http://www.gnu.org/licenses/gpl-3.0
 * Slug: smartforms
 */



class RedNaoInvoiceOnTheGo  {
    public static $Version=1;
    public static $NAME;
    public static $DIR;
    public static $URL;
    public static $FILE_VERSION=1;
    public static $DBVERSION=30;
    public static $SERVICE_TABLE;
    public static $INVOICE_TABLE;
    public static $INVOICE_META_TABLE;
    public static $INVOICE_DETAIL_TABLE;
    public static $PAYMENT_TABLE;
    public static $SETTINGS_TABLE;
    public static $DELETE_LOG_TABLE;

    private $classPrefix='rniotg';

    public $api;
    public function __construct()
    {
        global $wpdb;
        add_shortcode('rniotg_payment',array($this,'GeneratePaymentPage'));
        self::$DELETE_LOG_TABLE=$wpdb->prefix.'rniotg_delete_log';
        self::$SETTINGS_TABLE=$wpdb->prefix.'rniotg_settings';
        self::$SERVICE_TABLE=$wpdb->prefix.'rniotg_service';
        self::$INVOICE_META_TABLE=$wpdb->prefix.'rniotg_invoice_meta';
        self::$INVOICE_TABLE=$wpdb->prefix.'rniotg_invoice';
        self::$INVOICE_DETAIL_TABLE=$wpdb->prefix.'rniotg_invoice_detail';
        self::$PAYMENT_TABLE=$wpdb->prefix.'rniotg_payment';
        self::$NAME=dirname(plugin_basename(__FILE__));
        self::$DIR=WP_PLUGIN_DIR.'/'.self::$NAME.'/';
        self::$URL=plugin_dir_url(__FILE__);
        $authenticator=new Authenticator();
        $authenticator->Start();
        $this->CreateHooks();


        add_role(
            'rniotg_customer',
            __( 'Invoice On The Go Customer' ),
            array(
                'read' => true, // true allows this capability
                'edit_posts' => false, // Allows user to edit their own posts
                'edit_pages' => false, // Allows user to edit pages
                'edit_others_posts' => false, // Allows user to edit others posts not just their own
                'create_posts' => false, // Allows user to create new posts
                'manage_categories' => false, // Allows user to manage post categories
                'publish_posts' => false, // Allows the user to publish, otherwise posts stays in draft mode
                'edit_themes' => false, // false denies this capability. User can’t edit your theme
                'install_plugins' => false, // User cant add new plugins
                'update_plugin' => false, // User can’t update any plugins
                'update_core' => false,
                'activate_plugins'=>false
            )
        );

    }

    public function GenerateInvoice(){
        $template=new TemplateManager();
        $template->LoadInvoiceTemplate();
        die();
    }

    public function GeneratePaymentPage(){
        $template=new TemplateManager();
        $template->LoadPaymentTemplate();
    }


    private function CreateHooks()
    {

        add_action('admin_menu',array($this,'CreateMenu'));
        add_action('rest_api_init',array($this,'RegisterRoutes'));
        add_action( 'show_user_profile', array($this,'AddITGSectionToUserArea'));
        add_action( 'edit_user_profile', array($this,'AddITGSectionToUserArea'));
        add_action( 'user_new_form', array($this,'AddITGSectionToUserArea'));
        add_action('admin_init',array($this,'UpdateDBIfNeeded'));

        add_action( 'edit_user_profile_update', array($this,'SaveUserData'));
        add_action( 'personal_options_update', array($this,'SaveUserData'));
        add_action( 'delete_user', array($this,'DeleteUser') );

        add_action( 'wp_ajax_nopriv_rniotg',array($this,'GenerateInvoice'));
        add_action( 'wp_ajax_rniotg',array($this,'GenerateInvoice'));
        add_action( 'wp_ajax_nopriv_rniotg_paypal_received',array($this,'PaypalNotificationReceived'));
        add_action( 'rniotg_process_reminders',array($this,'ProcessReminders'));

        register_activation_hook(__FILE__, array($this,'AddSchedule'));
        register_deactivation_hook(__FILE__, array($this,'RemoveSchedule'));
    }

    public function AddSchedule(){
        $this->UpdateDBIfNeeded();
        SettingsManager::GetSettings();
        if(! wp_next_scheduled ( 'rniotg_process_reminders' ))
            wp_schedule_event(time(), 'daily', 'rniotg_process_reminders');
        //wp_schedule_event(strtotime(date("y-m-d", time()). ' +1 day'), 'daily', 'rniotg_process_reminders');
    }

    public function ProcessReminders(){

        $reminder=new ReminderProcessor();
        $reminder->Start();
    }

    public function RemoveSchedule(){
        wp_clear_scheduled_hook('rniotg_process_reminders');
    }

    public function PaypalNotificationReceived(){
        $gateway=new PayPalGateWay();
        $gateway->ProcessRequest();
    }

    public function AddITGSectionToUserArea($user){
        $userManager=new UserManager();
        $userManager->AddUserBoxes($user->ID);
    }

    public function SaveUserData($user_id){
        $userManager=new UserManager();
        $userManager->Save($user_id);
    }

    public function DeleteUser($userId){
        $userManager=new UserManager();
        $userManager->Delete($userId);
    }
    public function CreateMenu(){
        add_menu_page('Invoice On The Go','Invoice On The Go','manage_options','rednao_invoice_on_the_go',array($this,'Invoices'),plugin_dir_url(__FILE__).'images/menu_icon.png');
        add_submenu_page("rednao_invoice_on_the_go",'Invoices','Invoices','manage_options','rednao_invoice_on_the_go', array($this,'Invoices'));
        add_submenu_page("rednao_invoice_on_the_go",'Services','Services','manage_options',__FILE__.'services', array($this,'Services'));
        add_submenu_page("rednao_invoice_on_the_go",'Settings','Settings','manage_options',__FILE__.'settings', array($this,'Settings'));

    }

    public function UpdateDBIfNeeded(){
        $dbversion=get_site_option("RNIOTG_LATEST_DB_VERSION");
        if($dbversion<self::$DBVERSION)
        {
            require_once(ABSPATH . 'wp-admin/includes/upgrade.php');

            $sql = "CREATE TABLE " . self::$SERVICE_TABLE . " (
                service_id INT AUTO_INCREMENT,
                name VARCHAR(200) NOT NULL,
                rate DECIMAL(19,4),                
                taxable TINYINT(1),
                tax_rate DECIMAL(19,4),     
                notes MEDIUMTEXT,           
                last_update DATETIME,        
                PRIMARY KEY  (service_id)
                ) COLLATE utf8_general_ci;";
            dbDelta($sql);

            $sql = "CREATE TABLE " . self::$INVOICE_TABLE . " (
                invoice_id INT UNSIGNED AUTO_INCREMENT,
                invoice_number INT NOT NULL,
                ref VARCHAR(50),
                formatted_invoice_number VARCHAR(100) NOT NULL,
                client_id BIGINT UNSIGNED,
                description MEDIUMTEXT,
                status TINYINT NOT NULL,
                creation_date DATETIME NOT NULL,
                due_date DATETIME,
                terms_and_conditions MEDIUMTEXT,
                sub_total DECIMAL(19,4) NOT NULL,
                tax DECIMAL(19,4) NOT NULL,
                discount DECIMAL(19,4) NOT NULL,
                paid DECIMAL(19,4) NOT NULL,
                total_due DECIMAL(19,4) NOT NULL,            
                last_update DATETIME,                       
                PRIMARY KEY  (invoice_id)
                ) COLLATE utf8_general_ci;";
            dbDelta($sql);

            $sql = "CREATE TABLE " . self::$INVOICE_META_TABLE . " (
                invoice_meta_id INT UNSIGNED AUTO_INCREMENT,
                invoice_id  INT UNSIGNED NOT NULL,
                meta_key VARCHAR(255),
                meta_value MEDIUMTEXT,      
                last_update DATETIME,                             
                PRIMARY KEY  (invoice_meta_id)
                ) COLLATE utf8_general_ci;";
            dbDelta($sql);

            $sql = "CREATE TABLE " . self::$INVOICE_DETAIL_TABLE . " (
                invoice_detail_id INT UNSIGNED AUTO_INCREMENT,
                invoice_id  INT UNSIGNED NOT NULL,
                name MEDIUMTEXT,
                rate DECIMAL(19,4) NOT NULL,
                taxable TINYINT(1),
                qty DECIMAL(19,4),
                tax_rate DECIMAL(19,4) NOT NULL,
                tax_total DECIMAL(19,4) NOT NULL,
                sub_total DECIMAL(19,4) NOT NULL,
                total DECIMAL(19,4) NOT NULL, 
                last_update DATETIME,       
                notes MEDIUMTEXT,  
                PRIMARY KEY  (invoice_detail_id)
                ) COLLATE utf8_general_ci;";
            dbDelta($sql);


            $sql = "CREATE TABLE " . self::$PAYMENT_TABLE . " (
                payment_id INT UNSIGNED AUTO_INCREMENT,
                invoice_id  INT UNSIGNED NOT NULL,
                date DATETIME,
                amount decimal(19,4) NOT NULL,
                payment_method VARCHAR(10) NOT NULL,                
                status TINYINT NOT NULL,
                comments MEDIUMTEXT,     
                reference MEDIUMTEXT,     
                last_update DATETIME,
                PRIMARY KEY  (payment_id)
                ) COLLATE utf8_general_ci;";
            dbDelta($sql);

            $sql = "CREATE TABLE " . self::$SETTINGS_TABLE . " (
                setting_id INT UNSIGNED AUTO_INCREMENT,
                setting_key VARCHAR(255) NOT NULL,
                value MEDIUMTEXT,     
                last_update DATETIME,
                PRIMARY KEY  (setting_id)
                ) COLLATE utf8_general_ci;";
            dbDelta($sql);

            $sql = "CREATE TABLE " . self::$DELETE_LOG_TABLE . " (
                delete_log_id INT UNSIGNED AUTO_INCREMENT,
                table_name VARCHAR(255) NOT NULL,
                id INT UNSIGNED,     
                last_update DATETIME,    
                PRIMARY KEY  (delete_log_id)            
                ) COLLATE utf8_general_ci;";
            dbDelta($sql);
            update_site_option("RNIOTG_LATEST_DB_VERSION",self::$DBVERSION);
        }
    }

    public function Invoices(){
        require_once self::$DIR.'pages/invoice.php';
    }

    public function Services(){
        require_once self::$DIR.'pages/services.php';
    }

    public function Clients(){

    }

    public function Reports(){

    }

    public function Settings(){
        require_once self::$DIR.'pages/settings.php';
    }

    public function RegisterRoutes(){
        new SettingsController();
        new ServicesController();
        new InvoicesController();
        new UsersController();
        new SyncController();
    }




}


spl_autoload_register('RedNaoInvoiceOnTheGoLoader');
function RedNaoInvoiceOnTheGoLoader($className)
{
    if(strpos($className,'rniotg\\')!==false)
    {
        $path=substr($className,7);
        $path=str_replace('\\','/', $path);
        require_once RedNaoInvoiceOnTheGo::$DIR.$path.'.php';
    }
}


new RedNaoInvoiceOnTheGo();


