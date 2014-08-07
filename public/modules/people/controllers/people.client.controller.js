'use strict';

// People controller
angular.module('people').controller('PeopleController', ['$scope', '$stateParams', '$location', 'Authentication', 'People',
	function($scope, $stateParams, $location, Authentication, People ) {
		$scope.authentication = Authentication;

		// Create new Person
		$scope.create = function() {
			// Create new Person object
			var person = new People ({
				name: this.name
			});

			// Redirect after save
			person.$save(function(response) {
				$location.path('people/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			// Clear form fields
			this.name = '';
		};

		// Remove existing Person
		$scope.remove = function( person ) {
			if ( person ) { person.$remove();

				for (var i in $scope.people ) {
					if ($scope.people [i] === person ) {
						$scope.people.splice(i, 1);
					}
				}
			} else {
				$scope.person.$remove(function() {
					$location.path('people');
				});
			}
		};

		// Update existing Person
		$scope.update = function() {
			var person = $scope.person ;

			person.$update(function() {
				$location.path('people/' + person._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of People
		$scope.find = function() {
			$scope.people = People.query();
		};

		// Find existing Person
		$scope.findOne = function() {
			$scope.person = People.get({ 
				personId: $stateParams.personId
			});
		};
	}
]);