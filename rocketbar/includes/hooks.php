<?php
// Admin Menu and Data Retrieval
if(is_multisite()) $hook = 'network_admin_menu';
else $hook = 'admin_menu';

add_action($hook, 'rocketbar\admin::initialize');
add_action($hook, 'rocketbar\admin::get_all_pages', PHP_INT_MAX);

// The Bar
add_action('wp_enqueue_scripts', 'rocketbar\bar::initialize');
add_action('admin_enqueue_scripts', 'rocketbar\bar::initialize');

// Builds the cache
if(!wp_next_scheduled('rocketbar_gather_data'))
	wp_schedule_event(time(), 'hourly', 'rocketbar\bar::gather');

if(!get_site_option('rocketbar_cache', FALSE))
	add_action('admin_init', 'rocketbar\bar::gather');

// Builds dynamic JavaScript file
add_action('plugins_loaded', 'rocketbar\bar::build_js_file');

// Dynamic Commands
add_action('plugins_loaded', function () {
	new rocketbar\commands_rest;
});
add_action('wp_head', 'rocketbar\commands::initialize');
add_action('admin_head', 'rocketbar\commands::initialize');