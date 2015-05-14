<?php

namespace rocketbar;

class bar {
	public static function initialize() {
		wp_enqueue_script('fuzzy-matching', plugin()->url . '/client-s/js/fuzzy-matching.min.js', TRUE);
		wp_enqueue_script('rocketbar', plugin()->url . '/client-s/js/rocketbar.min.js', array('jquery'), TRUE);

		wp_enqueue_style('dashicons');
		wp_enqueue_style('rocketbar', plugin()->url . '/client-s/css/rocketbar.min.css');
	}
}