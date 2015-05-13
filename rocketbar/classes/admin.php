<?php

namespace rocketbar;

class admin {
	public static function initialize() {
		add_management_page('RocketBar Preferences', 'RocketBar', 'manage_options', 'rocketbar', 'rocketbar\admin_page::page');
	}

	public static function get_all_pages() {
		global $menu, $submenu;

		global $_wp_real_parent_file, $_wp_submenu_nopriv, $_registered_pages, $_parent_pages;
	}
}