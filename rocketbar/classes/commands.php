<?php

namespace rocketbar;

class commands {
	public static function initialize() {
		// Global array of commands used by the plugin
		$GLOBALS['rocketbar_commands'] = array();
		self::default_commands();

		// Recommended for use of `rocketbar\commands::add_new`
		do_action('rocketbar_commands_init');
		self::generate_js();
	}

	/**
	 * This is the API function for adding a new command to The Rocketbar.
	 *
	 * Recommend use is through `add_action('rocketbar_commands_init', '...')`
	 *
	 * @param $command string The command name. Such as 'edit', 'parse', 'regex', etc.
	 * @param $url string This is the URL that the command leads to. If $params is specified, there will be GET variables appended to this URL
	 * @param $description string A description for the command to be shown to the User
	 * @param $param string This is the parameter name you'd like sent to your URL. No special characters.
	 *
	 * NOTE: Only one parameter will be parsed from this function. If you would like to make multiple available, you can parse the values
	 *       that are send to your URL when the command is selected.
	 *
	 * NOTE2: In $params, a string starting with `<` signifies that your command REQUIRES you to enter a value. A string starting with `[`
	 *        (or nothing at all) is optional.
	 *
	 * Examples:
	 *
	 * For a command that opens a document that alerts a string, you might call this method like so:
	 *
	 * ```
	 * rocketbar\commands::add_new('alert', site_url('/?_my_url'), '<string>');
	 * ```
	 *
	 * For a command that will take you to `example.com`, you might allow a parameter to specify the URI like so:
	 *
	 * ```
	 * rocketbar\commands::add_new('g2e', 'http://example.com/', '[uri]');
	 * ```
	 */
	public static function add_new($command, $url, $description, $param = '') {
		// Commands should only have alphanumeric values, and be lowercase
		$command  = preg_replace('/[^a-zA-Z0-9]+/', '', trim(strtolower($command)));
		$url      = strpos(trim($url), '/') === 0 ? site_url($url) : trim($url);
		$optional = strpos(trim($param), '<') === 0 ? FALSE : TRUE;
		$param    = trim(trim($param), '<>[]');
		$start    = strpos($url, '?') === FALSE ? '?' : '&';

		$GLOBALS['rocketbar_commands'][$command] = compact('command', 'url', 'optional', 'param', 'start', 'description');
	}

	public static function generate_js() {
		if(!current_user_can('manage_options')) return;

		$print_js = function () {
			$obj = json_encode($GLOBALS['rocketbar_commands']);
			echo '<script>
				(function(){ document.rocketbarCommands=JSON.parse(\'' . $obj . '\');
				document.rocketbarIcon=\'' . plugin()->url . '/client-s/rocket.svg' . '\';
				document.rocketbarBaseURL=\'' . site_url() . '\'; })();
			</script>';
		};

		add_action('wp_footer', $print_js);
		add_action('admin_footer', $print_js);
	}

	/**
	 * Default RocketBar commands
	 */
	protected static function default_commands() {
		// Help
		self::add_new('help', admin_url('admin.php?page=rocketbar'), 'Help -- Commands / Key Binds');

		// Login / Logout Commands
		self::add_new('logout', wp_logout_url(), 'Logout of your WordPress site');
		self::add_new('login', site_url('/?_rocketbar_login_cmd=1'), 'Login to the specified User', '<username>');

		// Edit Post/Page Command
		global $post;
		if(is_single() || is_page()) self::add_new('edit', site_url('/?_rocketbar_edit_page=1&default_id=' . get_the_ID($post->ID)), 'Edit this Post/Page (or specify ID)', '[id]');
		else self::add_new('edit', site_url('/?_rocketbar_edit_page=1'), 'Edit a specified Post/Page', '<id>');

		self::add_new('home', home_url(), 'Go to your Home Page');
		self::add_new('g', 'https://google.com/', 'Search Google', '<q>');
	}
}
