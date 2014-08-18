'use strict';

// Movies controller
angular.module('movies').controller('MoviesController', ['$scope', '$stateParams', '$location', '$http', 'Authentication', 'Movies',
	function($scope, $stateParams, $location, $http, Authentication, Movies ) {
		$scope.authentication = Authentication;

        $scope.seenVals = [
            {value: 1, name: 'Sin ver'},
            {value: 2, name: 'Vistas'}
        ];

        $http({method: 'GET', url: 'genres/'}).success(function(result) {
            $scope.genres = result;
        });
        $scope.genre = {value: '', name: 'Todos'};

        $scope.countries = [
            {value: 'US', name: 'Estados Unidos'},
            {value: 'ES', name: 'España'},
            {value: 'MX', name: 'México'},
        ];

        $scope.orderTypes = [
            {value: 'release_date', name: 'Año'},
            {value: '-created', name: 'Nuevas'},
            {value: 'title', name: 'Título'}
        ];
        $scope.order = $scope.orderTypes[1];


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

        $scope.seen = function(id) {
            //var data = {query: this.query};
            $http.get('/movies/'+id+'/seen').success(function(response) {
                //$scope.searchMovies = response.results;
            });

            $scope.wseen = !$scope.wseen;
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

        $scope.numPerPage = 10;
        $scope.currentPage = 1;

		// Find a list of Movies
		$scope.find = function() {
            var data = {};
            if($scope.seenVal){
                data.seen = $scope.seenVal.value;
            }
            if($scope.country){
                data.country = $scope.country.value;
            }
            if($scope.genre){
                data.genre = $scope.genre._id;
            }
            if($scope.order){
                data.order = $scope.order.value;
            }
            data.page = $scope.currentPage;
            data.numPerPage = $scope.numPerPage;
			//$scope.movies = Movies.query();
            $http({method: 'GET', url: 'movies/', params: data}).success(function(result) {
                $scope.movies = result.movies;
                $scope.noOfPages = Math.ceil(result.count / $scope.numPerPage);
            });

		};

		// Find existing Movie
		$scope.findOne = function() {
			$scope.movie = Movies.get({
				movieId: $stateParams.movieId
			}, function(){
                if($scope.authentication.user)
                    $scope.wseen = $scope.movie.seen.indexOf($scope.authentication.user._id) > -1;
            });


		};





        /*$scope.setPage = function () {
            $scope.data = myData.get( ($scope.currentPage - 1) * $scope.numPerPage, $scope.numPerPage );
        };*/

        $scope.$watch( 'currentPage', $scope.find );

	}
]);
