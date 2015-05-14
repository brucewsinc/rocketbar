<?php

namespace rocketbar;

/**
 * Class plugin
 *
 * @package rocketbar
 */
class plugin {

	/**
	 * Class constructor
	 */
	public function __construct() {
		$this->file = dirname(dirname(__FILE__)) . '/rocketbar.php';
		$this->url  = plugins_url(NULL, $this->file);

		spl_autoload_register(array($this, 'autoload'));
	}

	protected function autoload($class) {
		if(strpos($class, __NAMESPACE__) !== 0) return; // We only need to autoload classes in our namespace

		$d   = DIRECTORY_SEPARATOR;
		$dir = dirname($this->file) . $d . 'classes' . $d;

		$class_file = $dir . str_replace(array(__NAMESPACE__ . '\\', '\\', '_'), array('', $d, '-'), $class) . '.php';
		is_file($class_file) AND require_once($class_file);
	}
}

$GLOBALS[__NAMESPACE__] = new plugin;

function plugin() {
	return $GLOBALS[__NAMESPACE__];
}

require_once(dirname(__FILE__) . '/hooks.php');