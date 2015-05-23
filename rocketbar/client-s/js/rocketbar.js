(function($) {

	var findMatches;

	/**
	 * Data retrieval
	 */
	var data = function() {
		var cache = document.rocketBarCache;

		/* We need to compile a list of searchable titles first */
		var searchable = [];

		cache.commands = document.rocketbarCommands;
		console.log(cache.commands);

		for(var cmd in cache.commands) {
			if(cache.commands.hasOwnProperty(cmd)) {
				var cmdObj = cache.commands[cmd];

				cmdObj.searchableIndex = searchable.length;
				cmdObj.iconHTML = '<img class="wp-menu-image svg" src="' + document.rocketbarIcon + '" style="fill: white; width: 20px; height: 20px; background-size: contain; background-repeat: no-repeat;"></div>';
				cmdObj.link = cmdObj.url;

				searchable.push(cmdObj.description);
			}
		}

		// Compiling Pages
		for(var id in cache.pages) {
			if(cache.pages.hasOwnProperty(id)) {
				var page = cache.pages[id];
				page.searchableIndex = searchable.length;
				page.iconHTML = '<div class="wp-menu-image dashicons-before dashicons-admin-page"><br></div>';

				searchable.push(page.title);
			}
		}

		// Compiling Categories
		for(id in cache.taxonomies) {
			if(cache.taxonomies.hasOwnProperty(id)) {
				var tax = cache.taxonomies[id];
				tax.searchableIndex = searchable.length;
				tax.iconHTML = '<div class="wp-menu-image dashicons-before dashicons-admin-post"><br></div>';

				searchable.push(tax.title);
			}
		}

		// Compiling Menu Pages
		var menuNamesBySlug = {},
			menuIconsBySlug = {};

		for(var priority in cache.menu) {
			if(cache.menu.hasOwnProperty(priority)) {
				var menu = cache.menu[priority];
				menu.searchableIndex = searchable.length;

				if(menu[6] && !menu[6].match(/^data:image|^http/i)) // Dashicon class
					menu.iconHTML = '<div class="wp-menu-image dashicons-before ' + menu[6] + '"></div>';
				else if(menu[6] && menu[6].match(new RegExp('data:image\/svg', 'i')))
					menu.iconHTML = '<div class="wp-menu-image svg" style="background-image: url(\'' + menu[6] + '\') !important; width: 20px; height: 20px; background-size: contain; background-repeat: no-repeat;"></div>';
				else if(menu[6] && menu[6].match(new RegExp('http', 'i')))
					menu.iconHTML = '<img src="' + menu[6] + '" style="width: 18px; height: 18px; vertical-align: top;" />';
				else menu.iconHTML = '';

				var menu_slug = menu[2];
				if(menu_slug.match(/\.php/)) menu.link = cache.admin_url + menu_slug;
				else menu.link = cache.admin_url + 'admin.php?page=' + menu_slug;

				if(menu[0].length) {
					var name = menu[0].replace(/<(?:.|\n)*?>/gm, '').replace(/\ \d$/, '');

					//searchable.push(name); // Some menus have HTML in them, and a trailing number
					menuNamesBySlug[menu[2]] = name;

					// Generate icon HTML
					menuIconsBySlug[menu[2]] = menu.iconHTML;
				}
			}
		}

		for(var slug in cache.submenu) {
			if(cache.submenu.hasOwnProperty(slug)) {
				var submenus = cache.submenu[slug],
					menuName = menuNamesBySlug[slug];

				for(id in submenus) {
					if(submenus.hasOwnProperty(id)) {
						var submenu = submenus[id];

						menu_slug = submenu[2];
						if(menu_slug.match(/\.php/)) submenu.link = cache.admin_url + menu_slug;
						else submenu.link = cache.admin_url + 'admin.php?page=' + menu_slug;

						name = submenu[0].replace(/<(?:.|\n)*?>/gm, '').replace(/\ \d$/, '');

						if(name.length) {
							submenu.searchableIndex = searchable.length;
							submenu.iconHTML = menuIconsBySlug[slug];
							searchable.push(menuName + ' → ' + name);
						}
					}
				}
			}
		}

		var findByIndex = function(i, obj) {
			if(!typeof i === 'number' || typeof obj !== 'object')
				return false;

			if(obj.hasOwnProperty('searchableIndex') && obj.searchableIndex === i) return obj;

			for(var property in obj) {
				if(obj.hasOwnProperty(property) && typeof obj[property] === 'object') {
					var r = findByIndex(i, obj[property]);

					if(r !== false) return r;
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
					if(o.matches.indexOf(p) !== -1) matches[i].txt += '<strong>' + ch + '</strong>';
					else matches[i].txt += ch;
				});
			});

			return matches;
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

		$(document).on('keyup', function(e) {
			if(!barIsVisible()) return selected = 0;

			e.preventDefault();

			if(e.keyCode === 38) selected--;
			else if(e.keyCode === 40) selected++;

			if(selected < 0) selected = 0;

			setSelected();
		});

		input.on('keyup', function(e) {
			if(e.keyCode !== 13) return;

			e.preventDefault();

			var elements = $('#rocketbar-list > li > a');

			elements.each(function(i, o) {
				if(i === selected) {
					$(o).click();
					document.location = $(o).attr('href');
				}
			});
		});

		/* Bar initialized */

		input.on('change keyup keydown paste', function() {
			var matches = findMatches($(this).val());
			list.html('');

			matches = matches.slice(0, 10);

			matches.forEach(function(o) {
				list.append('<li>' + o.iconHTML + '<a href="' + o.link + '">' + o.txt + '</a></li>')
			});

			setSelected();
		});

		/* Keybind */

		$(document).on('keydown', function(e) {
			// e.shiftKey
			// e.altKey
			// e.ctrlKey
			// e.keyCode

			if(e.shiftKey && e.keyCode === 32) $(bar).toggle();
			if(e.keyCode === 27 && barIsVisible()) $(bar).hide();

			if(!barIsVisible()) input.val('');
			if(input.val() === ' ') input.val('');

			input.focus();
		});

		/* Utility functions */

		var setSelected = function() {
			list.find('li').each(function(i, o) {
				if(i === selected)
					$(o).addClass('selected');
				else $(o).removeClass('selected');
			});
		};

		var barIsVisible = function() {
			return $(bar).is(':visible');
		};
	};

	$(document).ready(data);
	$(document).ready(bar);
})(jQuery);