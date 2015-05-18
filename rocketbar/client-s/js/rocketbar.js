(function($) {

	var findMatches;

	/**
	 * Data retrieval
	 */
	(function data() {
		var cache = document.rocketBarCache;

		/* We need to compile a list of searchable titles first */
		var searchable = [];

		// Compiling Page
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

				var menu_slug = menu[2];
				if(menu_slug.match(/\.php/)) menu.link = cache.admin_url + menu_slug;
				else menu.link = cache.admin_url + 'admin.php?page=' + menu_slug;

				if(menu[0].length) {
					var name = menu[0].replace(/<(?:.|\n)*?>/gm, '').replace(/\ \d$/, '');

					searchable.push(name); // Some menus have HTML in them, and a trailing number
					menuNamesBySlug[menu[2]] = name;

					// Generate icon HTML
					menuIconsBySlug[menu[2]] = '';
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
							searchable.push(menuName + ' &rarr; ' + name);
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

				o.text.split('').forEach(function(char, pos) {
					if(o.matches.indexOf(pos) !== -1) matches[i].txt += '<strong>' + char + '</strong>';
					else matches[i].txt += char;
				});
			});

			return matches;
		};
	})();

	/**
	 * The Rocket Bar
	 */
	var bar = function() {
		var bar = document.createElement('div');
		$(bar).addClass('rocketbar-wrapper');

		$(bar).append('<input type="text" id="rocketbar" placeholder="Type to navigate..." />');

		$('body').append(bar);
	};

	$(document).ready(bar);
})(jQuery);