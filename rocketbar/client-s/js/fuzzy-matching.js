(function() {
	var match = function(text, search) {
		// Remove spaces + make lowercase => Array
		search = search.replace(/\s/g, '').toLowerCase().split('');

		var chars = text.toString().toLowerCase().split(''), // Split down to characters
			pos = 0, // Position in search we're at
			matches = [], // Matched characters
			priority = 0;

		for(var i = 0; i < chars.length; i++) {
			if(chars[i] === search[pos]) {
				matches.push(i);
				pos++;

				priority++;
				if(i === 0 || chars[i - 1] === ' ') priority++;
				else if(chars[i - 1] === search[pos - 1]) priority += 2;
			}

			if(pos === search.length) return {priority: priority, matches: matches, text: text}; // We found all of the characters
		}

		return false; // We didn't find all of the characters
	};

	var search = function(arr, p) {
		var results = [];

		for(var i = 0; i < arr.length; i++)
			results.push(match(arr[i], p));

		results = results.filter(function(o) {
			return o !== false;
		});

		results = results.sort(function(a, b) {
			return b.priority - a.priority;
		});

		return results;
	};

	Array.prototype.fuzzyMatches = function(s) {
		return search(this, s);
	};
})();