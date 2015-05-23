<?php

namespace rocketbar;

class commands {
	public static function initialize() {
		do_action('rocketbar_commands_init'); //
	}

	/**
	 * This is the API function for adding a new command to The Rocketbar.
	 *
	 * Recommend use is through `add_action('rocketbar_commands_init', '...')`
	 *
	 * @param $command string The command name. Such as 'edit', 'parse', 'regex', etc.
	 * @param $url string This is the URL that the command leads to. If $params is specified, there will be GET variables appended to this URL
	 * @param $params string This is the parameter name you'd like sent to your URL. No special characters.
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
	 * rocketbar\commands::add_new('alert', '<string>');
	 * ```
	 *
	 * For a command that will take you to `example.com`, you might allow a parameter to specify the URI like so:
	 *
	 * ```
	 * rocketbar\commands::add_new('g2e', '[uri]');
	 * ```
	 */
	public static function add_new($command, $url, $params = '') {
	}

	public static function print_js() {
	}
}