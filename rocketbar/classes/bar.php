<?php

namespace rocketbar;

class bar {
	/**
	 * Initializes Client-side code for the RocketBar
	 */
	public static function initialize() {
		if(!current_user_can('manage_options')) return;

		wp_enqueue_script('fuzzy-matching', plugin()->url . '/client-s/js/fuzzy-matching.min.js', TRUE);
		wp_enqueue_script('rocketbar-cache', site_url('/wp-load.php?_rocketbar_cache=1'), TRUE);
		wp_enqueue_script('rocketbar', plugin()->url . '/client-s/js/rocketbar.min.js', array('jquery'), TRUE);

		wp_enqueue_style('dashicons');
		wp_enqueue_style('rocketbar', plugin()->url . '/client-s/css/rocketbar.min.css');
	}

	/**
	 * Retrieves and caches all information that's used by the RocketBar
	 */
	public static function gather() {
		$page_ids = get_all_page_ids();
		$pages    = array();

		foreach($page_ids as $id)
			$pages[$id] = array(
				'title' => get_the_title($id),
				'link'  => get_page_link($id)
			);

		$taxs       = get_terms('category', array('fields' => 'id=>name', 'hide_empty' => TRUE));
		$taxonomies = array();

		foreach($taxs as $id => $name)
			$taxonomies[$id] = array(
				'title' => $name,
				'link'  => get_term_link($id)
			);

		$menu      = get_site_option('rocketbar_menu_cache', array());
		$submenu   = get_site_option('rocketbar_submenu_cache', array());
		$admin_url = admin_url();

		$cache = compact('menu', 'submenu', 'taxonomies', 'pages', 'admin_url');
		update_site_option('rocketbar_cache', json_encode($cache));
	}

	/**
	 * Builds JavaScript to give client-side code access to the cached information used to build the bar
	 */
	public static function build_js_file() {
		if(!isset($_GET['_rocketbar_cache']) || !current_user_can('manage_options')) return;

		header('Content-Type: application/javascript');

		$cache = wp_slash(get_site_option('rocketbar_cache'));
		echo '(function(){ document.rocketBarCache=JSON.parse(\'' . $cache . '\') })();';

		exit();
	}
}