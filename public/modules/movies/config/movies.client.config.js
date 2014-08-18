'use strict';

// Configuring the Articles module
angular.module('movies').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Movies', 'movies', 'dropdown', '/movies(/create)?');
		Menus.addSubMenuItem('topbar', 'movies', 'List Movies', 'movies');
		Menus.addSubMenuItem('topbar', 'movies', 'New Movie', 'movies/create', 'movies/create', false, ['admin']);
	}
]);
