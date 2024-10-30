<?php
/**
 * Created by PhpStorm.
 * User: Edgar
 * Date: 4/29/2018
 * Time: 1:56 PM
 */

namespace rniotg\lib;


class Authenticator
{
    public function Start(){
      //  add_filter( 'determine_current_user', array($this,'Authentication'), 20 );

      //  add_filter( 'rest_authentication_errors',array($this,'Errors') );
    }

    public function Authentication( $user ) {

        // Don't authenticate twice
        if ( ! empty( $user ) ) {
            return $user;
        }

        if(strpos($_SERVER['REQUEST_URI'],'/wp-json/rniotg/v1/')===false)
            return $user;

        // Check that we're trying to authenticate
        if ( !isset( $_SERVER['PHP_AUTH_USER'] ) ) {
            return $user;
        }
        $username = $_SERVER['PHP_AUTH_USER'];
        $password = $_SERVER['PHP_AUTH_PW'];
        /**
         * In multi-site, wp_authenticate_spam_check filter is run on authentication. This filter calls
         * get_currentuserinfo which in turn calls the determine_current_user filter. This leads to infinite
         * recursion and a stack overflow unless the current function is removed from the determine_current_user
         * filter during authentication.
         */
        remove_filter( 'determine_current_user', 'json_basic_auth_handler', 20 );
        $user = wp_authenticate( $username, $password );
        add_filter( 'determine_current_user', 'json_basic_auth_handler', 20 );
        if ( is_wp_error( $user ) ) {
            $wp_json_basic_auth_error = $user;
            return null;
        }
        $wp_json_basic_auth_error = true;
        return $user->ID;
    }

    public function Errors( $error ) {
        // Passthrough other errors
        if ( ! empty( $error ) ) {
            return $error;
        }
        global $wp_json_basic_auth_error;
        return $wp_json_basic_auth_error;
    }
}