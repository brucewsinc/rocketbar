<?php

namespace rocketbar;

class admin {
	public static function initialize() {
		add_management_page('RocketBar Preferences', 'RocketBar', 'manage_options', 'rocketbar', 'rocketbar\admin_page::page');
	}

	public static function get_all_pages() {
		global $menu, $submenu;

		// TODO save the menu and submenu globals here, in a way that can be referenced later.
		//var_dump($menu);
	}
}