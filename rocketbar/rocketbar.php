<?php
/**
 * Plugin Name: RocketBar by Jinx
 * Author: Code by Jinx
 * Author URI: http://byjinx.com/
 * Description: The quicker page switcher!? Keyboard shortcuts for your WordPress Dashboard.
 * Version: 000000-dev
 */

$GLOBALS['wp_php_rv'] = '5.3';
if(require(dirname(__FILE__).'/includes/wp-php-rv/check.php'))
	require dirname(__FILE__).'/includes/rocketbar.inc.php';
else wp_php_rv_notice();