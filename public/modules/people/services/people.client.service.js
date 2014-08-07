'use strict';

//People service used to communicate People REST endpoints
angular.module('people').factory('People', ['$resource',
	function($resource) {
		return $resource('people/:personId', { personId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);