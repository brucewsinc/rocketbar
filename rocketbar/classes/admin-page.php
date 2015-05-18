<?php

namespace rocketbar;

/**
 * Class admin_page
 *
 * @package rocketbar
 */
class admin_page {
	/**
	 * Options save mechanism
	 */
	public static function maybe_save_opts() {
	}

	/**
	 * Page HTML
	 */
	public static function page() {
		?>
		<div class="wrap">
			<h2>RocketBar</h2>

			<h3>To Open the RocketBar press <code>SHIFT + SPACE</code></h3>

			<h4>Use the arrow keys to select the area of the Dashboard you wish to visit, and type to narrow your results.</h4>

			<h4>Use <code>SHIFT + SPACE</code> or the <code>ESC</code> key to close the RocketBar.</h4>

			<hr />

			<h3>About RocketBar</h3>

			<p>
				RocketBar is designed to allow easy access to any part of your WordPress site without any mouse clicks, or User Interface clutter.
			</p>

			<p>
				Just press the RocketBar key combination (<code>SHIFT + SPACE</code>), open and type to get started!
			</p>
		</div>
	<?php
	}
}