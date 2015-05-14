<?php

namespace rocketbar;

class admin {
	public static function initialize() {
		add_management_page('RocketBar Preferences', 'RocketBar', 'manage_options', 'rocketbar', 'rocketbar\admin_page::page');
	}

	public static function get_all_pages() {
		global $menu, $submenu;

		update_site_option('rocketbar_menu_cache', $menu);
		update_site_option('rocketbar_submenu_cache', $submenu);
	}
}