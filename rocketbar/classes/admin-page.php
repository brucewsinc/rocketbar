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

			<hr />

			<h3>Using Commands</h3>

			<p>
				At the current time, commands with RocketBar are limited. Here are the basic commands available:
			</p>

			<ul>
				<li>
					<code>edit</code> - On the frontend of your site, when you're on a Post/Page this command will allow you to edit the current
					                  Post/Page that you're on. In other parts of you Dashboard, you'll need to enter a Post ID to use this command.
				</li>

				<li>
					<code>logout</code> - Logs you out of your WordPress site.
				</li>

				<li>
					<code>login</code> - Use this command, and a WordPress username to log into any User on your site.
					                   You'll be brought to the selected User's profile.
				</li>
			</ul>
		</div>
	<?php
	}
}