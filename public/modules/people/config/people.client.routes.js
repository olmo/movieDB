'use strict';

//Setting up route
angular.module('people').config(['$stateProvider',
	function($stateProvider) {
		// People state routing
		$stateProvider.
		state('listPeople', {
			url: '/people',
			templateUrl: 'modules/people/views/list-people.client.view.html'
		}).
		state('createPerson', {
			url: '/people/create',
			templateUrl: 'modules/people/views/create-person.client.view.html'
		}).
		state('viewPerson', {
			url: '/people/:personId',
			templateUrl: 'modules/people/views/view-person.client.view.html'
		}).
		state('editPerson', {
			url: '/people/:personId/edit',
			templateUrl: 'modules/people/views/edit-person.client.view.html'
		});
	}
]);