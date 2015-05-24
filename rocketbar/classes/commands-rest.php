<?php

namespace rocketbar;

class commands_rest {
	public function __construct() {
		if(!current_user_can('manage_options')) return;

		$methods = get_class_methods('rocketbar\commands_rest');

		foreach($methods as $method) {
			if(array_key_exists('_rocketbar_' . $method, $_REQUEST) && $_REQUEST['_rocketbar_' . $method] === '1') {
				call_user_func('rocketbar\commands_rest::' . $method);
				exit();
			}
		}
	}

	/**
	 * RocketBar command `login`
	 *
	 * Logs in a User to any account by providing a Username
	 */
	public function login_cmd() {
		if(isset($_REQUEST['username']) && !empty($_REQUEST['username'])) $username = trim($_REQUEST['username']);
		else return;

		// Get User, and make sure that they exist
		$user = new \WP_User($username);
		if(!$user->exists()) {
			?>
			<script type="application/javascript">
				alert('Sorry, we couldn\'t find that User! Press Okay to go back to the last page.');
				window.history.back();
			</script>
			<?php
			exit();
		};

		// Login the current User
		wp_set_current_user($user->ID, $user->user_login);
		wp_set_auth_cookie($user->ID);
		do_action('wp_login', $user->user_login);

		// This can be overridden.
		header('Location: ' . get_edit_profile_url($user->ID));
	}

	/**
	 * RocketBar command `edit`
	 *
	 * Brings you to the edit page for any Post or Page
	 */
	public function edit_page() {
		if(!isset($_REQUEST['default_id'])) $id = 0;
		else $id = (int)$_REQUEST['default_id'];

		if(isset($_REQUEST['id'])) $id = $_REQUEST['id'];

		$url = get_edit_post_link($id, '');

		if(!$url) {
			?>
			<script type="application/javascript">
				alert('Sorry, we couldn\'t find that Post or Page! Press Okay to go back.');
				window.history.back();
			</script>
			<?php
			exit();
		};

		header('Location: ' . $url);
	}
}