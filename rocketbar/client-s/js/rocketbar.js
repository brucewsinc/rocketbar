(function() {
	var cache = document.rocketBarCache;

	/* We need to compile a list of searchable titles first */
	var searchable = [];

	// Compiling Page
	for(var id in cache.pages) {
		if(cache.pages.hasOwnProperty(id)) {
			var page = cache.pages[id];
			page.searchableIndex = searchable.length;

			searchable.push(page.title);
		}
	}

	// Compiling Categories
	for(id in cache.taxonomies) {
		if(cache.taxonomies.hasOwnProperty(id)) {
			var tax = cache.taxonomies[id];
			tax.searchableIndex = searchable.length;

			searchable.push(tax.title);
		}
	}

	// Compiling Menu Pages
	var menusNamesBySlug = {};

	for(var priority in cache.menu) {
		if(cache.menu.hasOwnProperty(priority)) {
			var menu = cache.menu[priority];
			menu.searchableIndex = searchable.length;

			if(menu[0].length) {
				var name = menu[0].replace(/<(?:.|\n)*?>/gm, '').replace(/\ \d$/, '');

				searchable.push(name); // Some menus have HTML in them, and a trailing number
				menusNamesBySlug[menu[2]] = name;
			}
		}
	}

	for(var slug in cache.submenu) {
		if(cache.submenu.hasOwnProperty(slug)) {
			var submenus = cache.submenu[slug],
				menuName = menusNamesBySlug[slug];

			for(id in submenus) {
				if(submenus.hasOwnProperty(id)) {
					var submenu = submenus[id];

					name = submenu[0].replace(/<(?:.|\n)*?>/gm, '').replace(/\ \d$/, '');

					if(name.length) {
						submenu.searchableIndex = searchable.length;
						searchable.push(menuName + ' &rarr; ' + submenu[0]);
					}
				}
			}
		}
	}

	// Done compiling!

	var findByIndex = function(i) {

	};

	document.findMatches = function(pat) {
		var matches = searchable.fuzzyMatches(pat);

	};
})();