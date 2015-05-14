<?php

namespace rocketbar;

class admin {
	public static function initialize() {
		add_management_page('RocketBar Preferences', 'RocketBar', 'manage_options', 'rocketbar', 'rocketbar\admin_page::page');
	}

	public static function get_all_pages() {
		global $menu, $submenu;

		update_site_option(get_current_blog_id(), 'rocketbar_menu_cache', $menu);
		update_site_option(get_current_blog_id(), 'rocketbar_submenu_cache', $submenu);
	}
}