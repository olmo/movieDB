'use strict';

// Movies controller
angular.module('movies').controller('MoviesController', ['$scope', '$stateParams', '$location', '$http', 'Authentication', 'Movies',
	function($scope, $stateParams, $location, $http, Authentication, Movies ) {
		$scope.authentication = Authentication;

		// Create new Movie
		$scope.create = function() {
			// Create new Movie object
			var movie = new Movies ({
				name: this.name
			});

			// Redirect after save
			movie.$save(function(response) {
				$location.path('movies/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			// Clear form fields
			this.name = '';
		};

		$scope.searchTmdb = function() {
			var data = {query: this.query};
			$http.post('/searchTmdb', data).success(function(response) {
		            $scope.searchMovies = response.results;
			  });
		};

		$scope.addMovie = function(id) {
			var data = {id: id};
			$http.post('/addFromTmdb', data).success(function(response) {
					$scope.searchMovies = response.results;
			});
		};

		// Remove existing Movie
		$scope.remove = function( movie ) {
			if ( movie ) { movie.$remove();

				for (var i in $scope.movies ) {
					if ($scope.movies [i] === movie ) {
						$scope.movies.splice(i, 1);
					}
				}
			} else {
				$scope.movie.$remove(function() {
					$location.path('movies');
				});
			}
		};

		// Update existing Movie
		$scope.update = function() {
			var movie = $scope.movie ;

			movie.$update(function() {
				$location.path('movies/' + movie._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Movies
		$scope.find = function() {
			$scope.movies = Movies.query();
		};

		// Find existing Movie
		$scope.findOne = function() {
			$scope.movie = Movies.get({
				movieId: $stateParams.movieId
			});
		};




		/*$scope.load = function ()
		{
			$(document).ready(function () {
				var $container = $('.fix-portfolio .items');
				$container.imagesLoaded(function () {
					$container.isotope({
						itemSelector: '.item'
					});
				});

				$(window).on('resize', function () {
					$('.fix-portfolio .items').isotope('reLayout')
				});

				$('.fix-portfolio .filter li a').click(function () {

					$('.fix-portfolio .filter li a').removeClass('active');
					$(this).addClass('active');

					var selector = $(this).attr('data-filter');
					$container.isotope({
						filter: selector
					});

					return false;
				});
			});
		});
		$scope.load();*/
	}
]);
