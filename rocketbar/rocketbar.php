<?php
/**
 * Plugin Name: RocketBar by Jinx
 * Author: Code by Jinx
 * Author URI: http://byjinx.com/
 * Description: The quicker page switcher!? Keyboard shortcuts for your WordPress Dashboard.
 * Version: 150529
 */

/**
 * Copyright (C) 2015  Code by Jinx
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

$GLOBALS['wp_php_rv'] = '5.3';
if(require(dirname(__FILE__) . '/includes/wp-php-rv/check.php'))
	require dirname(__FILE__) . '/includes/rocketbar.inc.php';
else wp_php_rv_notice();
