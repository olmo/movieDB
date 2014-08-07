'use strict';

// Configuring the Articles module
angular.module('people').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'People', 'people', 'dropdown', '/people(/create)?');
		Menus.addSubMenuItem('topbar', 'people', 'List People', 'people');
		Menus.addSubMenuItem('topbar', 'people', 'New Person', 'people/create');
	}
]);