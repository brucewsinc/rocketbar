(function() {
	var cache = document.rocketBarCache;

	var searchable = [];

	for(var id in cache.pages) {
		if(cache.pages.hasOwnProperty(id)) {
			var page = cache.pages[id];
			page.searchableIndex = searchable.length;

			searchable.push(page.title);
		}
	}

	for(id in cache.taxonomies) {
		if(cache.taxonomies.hasOwnProperty(id)) {
			var tax = cache.taxonomies[id];
			tax.searchableIndex = searchable.length;

			searchable.push(tax.title);
		}
	}

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

	console.log(cache.menu);
	console.log(cache.submenu);

	for(var slug in cache.submenu) {
		if(cache.submenu.hasOwnProperty(slug)) {
			var submenus = cache.submenu[slug],
				menuName = menusNamesBySlug[slug];

			searchable.push(menuName + ' &rarr; ' + ' Submenu');
		}
	}

	console.log(searchable);

	document.findMatches = function(pat) {
		return searchable.fuzzyMatches(pat);
	};
})();