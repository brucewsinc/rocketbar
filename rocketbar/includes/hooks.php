<?php

//add_action('admin_init', 'rocketbar\bar::initialize');
add_action('admin_menu', 'rocketbar\admin::initialize');
add_action('admin_menu', 'rocketbar\admin::get_all_pages', PHP_INT_MAX);