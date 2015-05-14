<?php
// Admin Menu and Data Retrieval
if(is_multisite()) $hook = 'network_admin_menu';
else $hook = 'admin_menu';

add_action($hook, 'rocketbar\admin::initialize');
add_action($hook, 'rocketbar\admin::get_all_pages', PHP_INT_MAX);

// The Bar
add_action('wp_enqueue_scripts', 'rocketbar\bar::initialize');
add_action('admin_enqueue_scripts', 'rocketbar\bar::initialize');