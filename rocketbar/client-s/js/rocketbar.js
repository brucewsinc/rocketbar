(function($) {

	var findMatches, getCommand, baseUrl;

	/**
	 * Data retrieval
	 */
	var data = function() {
		var cache = document.rocketBar.cache;
		baseUrl = document.rocketBar.baseURL;

		/* We need to compile a list of searchable titles first */
		var searchable = [],
			commands = document.rocketBar.commands;

		// The Commands
		for (var cmd in commands) {
			if (commands.hasOwnProperty(cmd)) {
				var cmdObj = commands[cmd];

				cmdObj.searchableIndex = searchable.length;
				cmdObj.iconHTML = '<img class="wp-menu-image svg" src="' + document.rocketBar.icon + '" style="fill: white; width: 20px; height: 20px;"></div>';
				cmdObj.link = cmdObj.url;
			}
		}

		// Compiling Pages
		for (var id in cache.pages) {
			if (cache.pages.hasOwnProperty(id)) {
				var page = cache.pages[id];
				page.searchableIndex = searchable.length;
				page.iconHTML = '<div class="wp-menu-image dashicons-before dashicons-admin-page"><br></div>';

				searchable.push(page.title);
			}
		}

		// Compiling Categories
		for (id in cache.taxonomies) {
			if (cache.taxonomies.hasOwnProperty(id)) {
				var tax = cache.taxonomies[id];
				tax.searchableIndex = searchable.length;
				tax.iconHTML = '<div class="wp-menu-image dashicons-before dashicons-admin-post"><br></div>';

				searchable.push(tax.title);
			}
		}

		// Compiling Menu Pages
		var menuNamesBySlug = {},
			menuIconsBySlug = {};

		for (var priority in cache.menu) {
			if (cache.menu.hasOwnProperty(priority)) {
				var menu = cache.menu[priority];
				menu.searchableIndex = searchable.length;

				if (menu[6] && !menu[6].match(/^data:image|^http/i)) // Dashicon class
					menu.iconHTML = '<div class="wp-menu-image dashicons-before ' + menu[6] + '"></div>';
				else if (menu[6] && menu[6].match(new RegExp('data:image\/svg', 'i')))
					menu.iconHTML = '<div class="wp-menu-image svg" style="background-image: url(\'' + menu[6] + '\') !important; width: 20px; height: 20px; background-size: contain; background-repeat: no-repeat;"></div>';
				else if (menu[6] && menu[6].match(new RegExp('http', 'i')))
					menu.iconHTML = '<img src="' + menu[6] + '" style="width: 18px; height: 18px; vertical-align: top;" />';
				else menu.iconHTML = '';

				var menu_slug = menu[2];
				if (menu_slug.match(/\.php/)) menu.link = cache.admin_url + menu_slug;
				else menu.link = cache.admin_url + 'admin.php?page=' + menu_slug;

				if (menu[0].length) {
					var name = menu[0].replace(/<(?:.|\n)*?>/gm, '').replace(/\ \d$/, '');

					//searchable.push(name); // Some menus have HTML in them, and a trailing number
					menuNamesBySlug[menu[2]] = name;

					// Generate icon HTML
					menuIconsBySlug[menu[2]] = menu.iconHTML;
				}
			}
		}

		/* Submenus, used in conjunction with toplevel menus. */
		for (var slug in cache.submenu) {
			if (cache.submenu.hasOwnProperty(slug)) {
				var submenus = cache.submenu[slug],
					menuName = menuNamesBySlug[slug];

				for (id in submenus) {
					if (submenus.hasOwnProperty(id)) {
						var submenu = submenus[id];

						menu_slug = submenu[2];
						if (menu_slug.match(/\.php/)) submenu.link = cache.admin_url + menu_slug;
						else submenu.link = cache.admin_url + 'admin.php?page=' + menu_slug;

						name = submenu[0].replace(/<(?:.|\n)*?>/gm, '').replace(/\ \d$/, '');

						if (name.length) {
							submenu.searchableIndex = searchable.length;
							submenu.iconHTML = menuIconsBySlug[slug];
							searchable.push(menuName + ' → ' + name);
						}
					}
				}
			}
		}

		/**
		 * Finds object in cache with the correct .searchableIndex
		 *
		 * @param i
		 * @param obj
		 * @returns {*}
		 */
		var findByIndex = function(i, obj) {
			if (!typeof i === 'number' || typeof obj !== 'object')
				return false;

			if (obj.hasOwnProperty('searchableIndex') && obj.searchableIndex === i) return obj;

			for (var property in obj) {
				if (obj.hasOwnProperty(property) && typeof obj[property] === 'object') {
					var r = findByIndex(i, obj[property]);

					if (r !== false) return r;
				}
			}

			return false;
		};

		/**
		 * Returns links for the toolbar based on the pattern
		 *
		 * @param pat string Pattern
		 * @returns {*}
		 */
		findMatches = function(pat) {
			var matches = searchable.fuzzyMatches(pat);

			matches.forEach(function(o, i) {
				var index = searchable.indexOf(o.text);

				matches[i] = findByIndex(index, cache);
				matches[i].txt = '';
				matches[i].priority = o.priority;

				o.text.split('').forEach(function(ch, p) {
					if (o.matches.indexOf(p) !== -1) matches[i].txt += '<strong>' + ch + '</strong>';
					else matches[i].txt += ch;
				});
			});

			return matches;
		};

		/**
		 * Finds the most likely command that the User is trying to use based on pattern
		 *
		 * @param pat
		 * @returns {boolean}
		 */
		getCommand = function(pat) {
			if (!pat.trim().length) return;

			var firstPart = pat.trim().split(' ')[0].toLowerCase(),
				theRest = pat.replace(firstPart, '').trim();

			var theCommand = false;

			for (var i in commands) {
				if (commands.hasOwnProperty(i)) {
					var o = commands[i];
					if (theCommand) continue;

					if (i.indexOf(firstPart) === 0) {
						if (theRest.length && o.param) o.dynamicLink = o.url + o.start + o.param + '=' + encodeURIComponent(theRest);
						else o.dynamicLink = o.url;

						theCommand = o;
					}
				}
			}

			return theCommand;
		};
	};

	/**
	 * The Rocket Bar
	 */
	var bar = function() {
		var bar = document.createElement('div');
		$(bar).addClass('rocketbar-wrapper');

		$(bar).append('<input type="text" id="rocketbar" placeholder="Type to navigate..." autofocus="yes" value="" /><ul id="rocketbar-list"></ul>');

		$('body').append(bar);

		/* Objects */
		var input = $('#rocketbar'),
			list = $('#rocketbar-list');

		/* Current selected */
		var selected = 0; // Defaults to 0

		/**
		 * UP / DOWN Arrows
		 */
		$(document).on('keyup', function(e) {
			if (!barIsVisible()) return selected = 0;

			e.preventDefault();

			if (e.keyCode === 38) selected--;
			else if (e.keyCode === 40) selected++;

			if (selected < 0) selected = 0;

			setSelected();
		});

		/**
		 * When the User presses ENTER
		 */
		input.on('keyup', function(e) {
			if (e.keyCode !== 13) return; // Enter key code is 13

			e.preventDefault();

			var elements = $('#rocketbar-list > li > a');

			elements.each(function(i, o) {
				if (i === selected) {
					$(o).click();
					var target = $(o).attr('target');
					target = (target) ? target.toString() : false;

					if (target === '_blank') {
						var win = window.open($(o).attr('href'), '_blank');
						win.focus();
					} else document.location = $(o).attr('href');
				}
			});
		});

		/* Bar Initialized */

		input.on('change keyup keydown paste', function() {
			list.html('');

			if ($(this).val() === ' ') $(this).val('');
			if ($(this).val() === '') return doDefaults();

			if ($(this).val().indexOf('/') === 0)
				list.append('<li><img class="wp-menu-image svg" src="' + document.rocketBar.icon + '" style="fill: white; width: 20px; height: 20px;" />' + '<a href="' + baseUrl + $(this).val() + '"/>Navigate to: ' + baseUrl + $(this).val().trim() + '</a>' + '</li>');

			/* Commands */
			var command = getCommand($(this).val());
			if (command) list.append('<li>' + command.iconHTML + '<a href="' + command.dynamicLink + '">' + command.description + '</a></li>');

			/* Regular Links */
			var matches = findMatches($(this).val());

			matches = matches.slice(0, 10);

			matches.forEach(function(o) {
				list.append('<li>' + o.iconHTML + '<a href="' + o.link + '">' + o.txt + '</a></li>')
			});

			var google_link = 'http://google.com/search?q=' + encodeURIComponent($(this).val());
			list.append('<li><a href="' + google_link + '" target="_blank"><strong>Search Google for: <code>' + $(this).val() + '</code></strong></a></li>');

			setSelected();
		});

		var doDefaults = function() {
			list.html('');

			var dashboard = findMatches('Dashboard Home')[0];
			list.append('<li>' + dashboard.iconHTML + '<a href="' + dashboard.link + '">' + dashboard.txt + '</a></li>');

			var pages = findMatches('Pages All Pages')[0];
			list.append('<li>' + pages.iconHTML + '<a href="' + pages.link + '">' + pages.txt + '</a></li>');

			var users = findMatches('Users All users')[0];
			list.append('<li>' + users.iconHTML + '<a href="' + users.link + '">' + users.txt + '</a></li>');

			var settings = findMatches('Settings General')[0];
			list.append('<li>' + settings.iconHTML + '<a href="' + settings.link + '">' + settings.txt + '</a></li>');

			var help = findMatches('Tools RocketBar')[0],
				iconHTML = '<img class="wp-menu-image svg" src="' + document.rocketBar.icon + '"  style="fill: white; width: 20px; height: 20px;" />';
			list.append('<li>' + iconHTML + '<a href="' + help.link + '"><strong>Help — Commands / Key Binds</strong></a></li>');
		};

		/* Keybind */
		$(document).on('keydown', function(e) {
			// e.shiftKey
			// e.altKey
			// e.ctrlKey
			// e.keyCode

			if (e.shiftKey && e.keyCode === 32) $(bar).toggle();
			if (e.keyCode === 27 && barIsVisible()) $(bar).hide();

			if (!barIsVisible()) input.val('');
			if (input.val() === ' ') input.val('');

			input.focus();
		});

		/* Utility functions */
		var setSelected = function() {
			var maxIndex = 0;

			list.find('li').each(function(i, o) {
				if (i === selected)
					$(o).addClass('selected');
				else $(o).removeClass('selected');

				if (i > maxIndex) maxIndex = i;
			});

			if (selected > maxIndex) {
				selected = maxIndex;
				setSelected();
			}
		};

		var barIsVisible = function() {
			return $(bar).is(':visible');
		};
	};

	// Initialization via jQuery
	$(document).ready(data);
	$(document).ready(bar);
})(jQuery);
