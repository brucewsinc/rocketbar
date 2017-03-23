<?php

namespace rocketbar;

class bar {
	/**
	 * Initializes Client-side code for the RocketBar
	 */
	public static function initialize() {
		if(!current_user_can('manage_options') && (!defined('ROCKETBAR_ALLOW_ALL') || ROCKETBAR_ALLOW_ALL === FALSE)) return;

		wp_enqueue_script('fuzzy-matching', plugin()->url . '/client-s/js/fuzzy-matching.min.js', TRUE);
		wp_enqueue_script('rocketbar-cache', site_url('/?_rocketbar_cache=1'), TRUE);
		wp_enqueue_script('rocketbar', plugin()->url . '/client-s/js/rocketbar.min.js', array('jquery'), TRUE);

		wp_enqueue_style('dashicons');
		wp_enqueue_style('rocketbar', plugin()->url . '/client-s/css/rocketbar.min.css');
	}

	/**
	 * Retrieves and caches all information that's used by the RocketBar
	 */
	public static function gather() {
		/* === BEGIN PAGES === */
		$page_ids = get_all_page_ids();
		$pages    = array();

		foreach($page_ids as $id) {
			if(!'publish' === get_post_status($id)) continue;

			$pages[$id] = array(
				'title' => get_the_title($id),
				'link'  => get_page_link($id)
			);
		}
		/* === END PAGES === */

		/* === BEGIN CUSTOM POST TYPES === */
		$args = array(
			'public'   => true,
			'_builtin' => false
		);

		$output = 'names'; // names or objects, note names is the default
		$operator = 'and'; // 'and' or 'or'

		$post_types = get_post_types($args, $output, $operator);

		foreach ($post_types as $post_type) {
			$post_ids = get_posts('post_type=' . $post_type . '&posts_per_page=-1&fields=ids');

			foreach($post_ids as $id) {
				if(!'publish' === get_post_status($id)) continue;
				$pages[$id] = array(
					'title' => get_the_title($id),
					'link'  => get_page_link($id)
				);
			}
		}
		/* === END CUSTOM POST TYPES === */

		/* === BEGIN CATEGORIES === */
		$taxs       = get_terms('category', array('fields' => 'id=>name', 'hide_empty' => TRUE));
		$taxonomies = array();

		foreach($taxs as $id => $name)
			$taxonomies[$id] = array(
				'title' => $name,
				'link'  => get_term_link($id)
			);
		/* === END CATEGORIES === */

		$menu      = get_site_option('rocketbar_menu_cache', array());
		$submenu   = get_site_option('rocketbar_submenu_cache', array());
		$admin_url = admin_url();

		$cache = compact('menu', 'submenu', 'taxonomies', 'pages', 'posts', 'admin_url');
		update_site_option('rocketbar_cache', json_encode($cache));
	}

	/**
	 * Builds JavaScript to give client-side code access to the cached information used to build the bar
	 */
	public static function build_js_file() {
		if(!isset($_GET['_rocketbar_cache']) || (!current_user_can('manage_options') && (!defined('ROCKETBAR_ALLOW_ALL') || ROCKETBAR_ALLOW_ALL === FALSE))) return;

		header('Content-Type: application/javascript');

		$cache = wp_slash(get_site_option('rocketbar_cache'));
		echo '(function(){ document.rocketBar = {}; document.rocketBar.cache=JSON.parse(\'' . $cache . '\') })();';

		exit();
	}
}
