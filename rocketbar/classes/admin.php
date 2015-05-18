<?php

namespace rocketbar;

/**
 * Class admin
 *
 * @package rocketbar
 */
class admin {
	/**
	 * Adds the RocketBar page to the Tools menu
	 */
	public static function initialize() {
		add_management_page('RocketBar', 'RocketBar', 'manage_options', 'rocketbar', 'rocketbar\admin_page::page');
	}

	/**
	 * Saves the admin menus into the database
	 */
	public static function get_all_pages() {
		global $menu, $submenu;

		$cached_menu = get_site_option('rocketbar_menu_cache', array());

		update_site_option('rocketbar_menu_cache', $menu);
		update_site_option('rocketbar_submenu_cache', $submenu);

		if($menu !== $cached_menu) bar::gather();
	}
}