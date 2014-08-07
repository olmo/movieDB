'use strict';
// Init the application configuration module for AngularJS application
var ApplicationConfiguration = function () {
    // Init module configuration options
    var applicationModuleName = 'moviedb';
    var applicationModuleVendorDependencies = [
        'ngResource',
        'ngCookies',
        'ngAnimate',
        'ngTouch',
        'ngSanitize',
        'ui.router',
        'ui.bootstrap',
        'ui.utils'
      ];
    // Add a new vertical module
    var registerModule = function (moduleName) {
      // Create angular module
      angular.module(moduleName, []);
      // Add the module to the AngularJS configuration file
      angular.module(applicationModuleName).requires.push(moduleName);
    };
    return {
      applicationModuleName: applicationModuleName,
      applicationModuleVendorDependencies: applicationModuleVendorDependencies,
      registerModule: registerModule
    };
  }();'use strict';
//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);
// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config([
  '$locationProvider',
  function ($locationProvider) {
    $locationProvider.hashPrefix('!');
  }
]);
//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash === '#_=_')
    window.location.hash = '#!';
  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('articles');'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');'use strict';
// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('movies');'use strict';
// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('people');'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');'use strict';
// Configuring the Articles module
angular.module('articles').run([
  'Menus',
  function (Menus) {
  }
]);'use strict';
// Setting up route
angular.module('articles').config([
  '$stateProvider',
  function ($stateProvider) {
    // Articles state routing
    $stateProvider.state('listArticles', {
      url: '/articles',
      templateUrl: 'modules/articles/views/list-articles.client.view.html'
    }).state('createArticle', {
      url: '/articles/create',
      templateUrl: 'modules/articles/views/create-article.client.view.html'
    }).state('viewArticle', {
      url: '/articles/:articleId',
      templateUrl: 'modules/articles/views/view-article.client.view.html'
    }).state('editArticle', {
      url: '/articles/:articleId/edit',
      templateUrl: 'modules/articles/views/edit-article.client.view.html'
    });
  }
]);'use strict';
angular.module('articles').controller('ArticlesController', [
  '$scope',
  '$stateParams',
  '$location',
  'Authentication',
  'Articles',
  function ($scope, $stateParams, $location, Authentication, Articles) {
    $scope.authentication = Authentication;
    $scope.create = function () {
      var article = new Articles({
          title: this.title,
          content: this.content
        });
      article.$save(function (response) {
        $location.path('articles/' + response._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
      this.title = '';
      this.content = '';
    };
    $scope.remove = function (article) {
      if (article) {
        article.$remove();
        for (var i in $scope.articles) {
          if ($scope.articles[i] === article) {
            $scope.articles.splice(i, 1);
          }
        }
      } else {
        $scope.article.$remove(function () {
          $location.path('articles');
        });
      }
    };
    $scope.update = function () {
      var article = $scope.article;
      article.$update(function () {
        $location.path('articles/' + article._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    $scope.find = function () {
      $scope.articles = Articles.query();
    };
    $scope.findOne = function () {
      $scope.article = Articles.get({ articleId: $stateParams.articleId });
    };
  }
]);'use strict';
//Articles service used for communicating with the articles REST endpoints
angular.module('articles').factory('Articles', [
  '$resource',
  function ($resource) {
    return $resource('articles/:articleId', { articleId: '@_id' }, { update: { method: 'PUT' } });
  }
]);'use strict';
// Setting up route
angular.module('core').config([
  '$stateProvider',
  '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    // Redirect to home view when route not found
    $urlRouterProvider.otherwise('/');
    // Home state routing
    $stateProvider.state('home', {
      url: '/home',
      templateUrl: 'modules/core/views/home.client.view.html'
    });
  }
]);'use strict';
angular.module('core').controller('HeaderController', [
  '$scope',
  'Authentication',
  'Menus',
  function ($scope, Authentication, Menus) {
    $scope.authentication = Authentication;
    $scope.isCollapsed = false;
    $scope.menu = Menus.getMenu('topbar');
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };
    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });
  }
]);'use strict';
angular.module('core').controller('HomeController', [
  '$scope',
  'Authentication',
  function ($scope, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
  }
]);'use strict';
//Menu service used for managing  menus
angular.module('core').service('Menus', [function () {
    // Define a set of default roles
    this.defaultRoles = ['user'];
    // Define the menus object
    this.menus = {};
    // A private function for rendering decision
    var shouldRender = function (user) {
      if (user) {
        for (var userRoleIndex in user.roles) {
          for (var roleIndex in this.roles) {
            if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
              return true;
            }
          }
        }
      } else {
        return this.isPublic;
      }
      return false;
    };
    // Validate menu existance
    this.validateMenuExistance = function (menuId) {
      if (menuId && menuId.length) {
        if (this.menus[menuId]) {
          return true;
        } else {
          throw new Error('Menu does not exists');
        }
      } else {
        throw new Error('MenuId was not provided');
      }
      return false;
    };
    // Get the menu object by menu id
    this.getMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Return the menu object
      return this.menus[menuId];
    };
    // Add new menu object by menu id
    this.addMenu = function (menuId, isPublic, roles) {
      // Create the new menu
      this.menus[menuId] = {
        isPublic: isPublic || false,
        roles: roles || this.defaultRoles,
        items: [],
        shouldRender: shouldRender
      };
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Return the menu object
      delete this.menus[menuId];
    };
    // Add menu item object
    this.addMenuItem = function (menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Push new menu item
      this.menus[menuId].items.push({
        title: menuItemTitle,
        link: menuItemURL,
        menuItemType: menuItemType || 'item',
        menuItemClass: menuItemType,
        uiRoute: menuItemUIRoute || '/' + menuItemURL,
        isPublic: isPublic || this.menus[menuId].isPublic,
        roles: roles || this.defaultRoles,
        items: [],
        shouldRender: shouldRender
      });
      // Return the menu object
      return this.menus[menuId];
    };
    // Add submenu item object
    this.addSubMenuItem = function (menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
          // Push new submenu item
          this.menus[menuId].items[itemIndex].items.push({
            title: menuItemTitle,
            link: menuItemURL,
            uiRoute: menuItemUIRoute || '/' + menuItemURL,
            isPublic: isPublic || this.menus[menuId].isPublic,
            roles: roles || this.defaultRoles,
            shouldRender: shouldRender
          });
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeMenuItem = function (menuId, menuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
          this.menus[menuId].items.splice(itemIndex, 1);
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeSubMenuItem = function (menuId, submenuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
          if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
            this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
          }
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    //Adding the topbar menu
    this.addMenu('topbar', true);
  }]);'use strict';
// Configuring the Articles module
angular.module('movies').run([
  'Menus',
  function (Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', 'Movies', 'movies', 'dropdown', '/movies(/create)?');
    Menus.addSubMenuItem('topbar', 'movies', 'List Movies', 'movies');
    Menus.addSubMenuItem('topbar', 'movies', 'New Movie', 'movies/create');
  }
]);'use strict';
//Setting up route
angular.module('movies').config([
  '$stateProvider',
  function ($stateProvider) {
    // Movies state routing
    $stateProvider.state('listMovies', {
      url: '/',
      templateUrl: 'modules/movies/views/list-movies.client.view.html'
    }).state('createMovie', {
      url: '/movies/create',
      templateUrl: 'modules/movies/views/create-movie.client.view.html'
    }).state('viewMovie', {
      url: '/movies/:movieId',
      templateUrl: 'modules/movies/views/view-movie.client.view.html'
    }).state('editMovie', {
      url: '/movies/:movieId/edit',
      templateUrl: 'modules/movies/views/edit-movie.client.view.html'
    });
  }
]);'use strict';
// Movies controller
angular.module('movies').controller('MoviesController', [
  '$scope',
  '$stateParams',
  '$location',
  '$http',
  'Authentication',
  'Movies',
  function ($scope, $stateParams, $location, $http, Authentication, Movies) {
    $scope.authentication = Authentication;
    // Create new Movie
    $scope.create = function () {
      // Create new Movie object
      var movie = new Movies({ name: this.name });
      // Redirect after save
      movie.$save(function (response) {
        $location.path('movies/' + response._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
      // Clear form fields
      this.name = '';
    };
    $scope.searchTmdb = function () {
      var data = { query: this.query };
      $http.post('/searchTmdb', data).success(function (response) {
        $scope.searchMovies = response.results;
      });
    };
    $scope.addMovie = function (id) {
      var data = { id: id };
      $http.post('/addFromTmdb', data).success(function (response) {
        $scope.searchMovies = response.results;
      });
    };
    // Remove existing Movie
    $scope.remove = function (movie) {
      if (movie) {
        movie.$remove();
        for (var i in $scope.movies) {
          if ($scope.movies[i] === movie) {
            $scope.movies.splice(i, 1);
          }
        }
      } else {
        $scope.movie.$remove(function () {
          $location.path('movies');
        });
      }
    };
    // Update existing Movie
    $scope.update = function () {
      var movie = $scope.movie;
      movie.$update(function () {
        $location.path('movies/' + movie._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    // Find a list of Movies
    $scope.find = function () {
      $scope.movies = Movies.query();
    };
    // Find existing Movie
    $scope.findOne = function () {
      $scope.movie = Movies.get({ movieId: $stateParams.movieId });
    };  /*$scope.load = function ()
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
]);'use strict';
angular.module('movies').directive('isotope', [function () {
    return {
      link: function (scope, element, attrs) {
        scope.$watch('$last', function (v) {
          if (v) {
            var $container = $('.fix-portfolio .items');
            $container.imagesLoaded(function () {
              $container.isotope({ itemSelector: '.item' });
            });
            $(window).on('resize', function () {
              $container.isotope('reLayout');
            });
          }
        });
      }
    };
  }]);'use strict';
//Movies service used to communicate Movies REST endpoints
angular.module('movies').factory('Movies', [
  '$resource',
  function ($resource) {
    return $resource('movies/:movieId', { movieId: '@_id' }, { update: { method: 'PUT' } });
  }
]);'use strict';
// Configuring the Articles module
angular.module('people').run([
  'Menus',
  function (Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', 'People', 'people', 'dropdown', '/people(/create)?');
    Menus.addSubMenuItem('topbar', 'people', 'List People', 'people');
    Menus.addSubMenuItem('topbar', 'people', 'New Person', 'people/create');
  }
]);'use strict';
//Setting up route
angular.module('people').config([
  '$stateProvider',
  function ($stateProvider) {
    // People state routing
    $stateProvider.state('listPeople', {
      url: '/people',
      templateUrl: 'modules/people/views/list-people.client.view.html'
    }).state('createPerson', {
      url: '/people/create',
      templateUrl: 'modules/people/views/create-person.client.view.html'
    }).state('viewPerson', {
      url: '/people/:personId',
      templateUrl: 'modules/people/views/view-person.client.view.html'
    }).state('editPerson', {
      url: '/people/:personId/edit',
      templateUrl: 'modules/people/views/edit-person.client.view.html'
    });
  }
]);'use strict';
// People controller
angular.module('people').controller('PeopleController', [
  '$scope',
  '$stateParams',
  '$location',
  'Authentication',
  'People',
  function ($scope, $stateParams, $location, Authentication, People) {
    $scope.authentication = Authentication;
    // Create new Person
    $scope.create = function () {
      // Create new Person object
      var person = new People({ name: this.name });
      // Redirect after save
      person.$save(function (response) {
        $location.path('people/' + response._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
      // Clear form fields
      this.name = '';
    };
    // Remove existing Person
    $scope.remove = function (person) {
      if (person) {
        person.$remove();
        for (var i in $scope.people) {
          if ($scope.people[i] === person) {
            $scope.people.splice(i, 1);
          }
        }
      } else {
        $scope.person.$remove(function () {
          $location.path('people');
        });
      }
    };
    // Update existing Person
    $scope.update = function () {
      var person = $scope.person;
      person.$update(function () {
        $location.path('people/' + person._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    // Find a list of People
    $scope.find = function () {
      $scope.people = People.query();
    };
    // Find existing Person
    $scope.findOne = function () {
      $scope.person = People.get({ personId: $stateParams.personId });
    };
  }
]);'use strict';
//People service used to communicate People REST endpoints
angular.module('people').factory('People', [
  '$resource',
  function ($resource) {
    return $resource('people/:personId', { personId: '@_id' }, { update: { method: 'PUT' } });
  }
]);'use strict';
// Config HTTP Error Handling
angular.module('users').config([
  '$httpProvider',
  function ($httpProvider) {
    // Set the httpProvider "not authorized" interceptor
    $httpProvider.interceptors.push([
      '$q',
      '$location',
      'Authentication',
      function ($q, $location, Authentication) {
        return {
          responseError: function (rejection) {
            switch (rejection.status) {
            case 401:
              // Deauthenticate the global user
              Authentication.user = null;
              // Redirect to signin page
              $location.path('signin');
              break;
            case 403:
              // Add unauthorized behaviour 
              break;
            }
            return $q.reject(rejection);
          }
        };
      }
    ]);
  }
]);'use strict';
// Setting up route
angular.module('users').config([
  '$stateProvider',
  function ($stateProvider) {
    // Users state routing
    $stateProvider.state('profile', {
      url: '/settings/profile',
      templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
    }).state('password', {
      url: '/settings/password',
      templateUrl: 'modules/users/views/settings/change-password.client.view.html'
    }).state('accounts', {
      url: '/settings/accounts',
      templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
    }).state('signup', {
      url: '/signup',
      templateUrl: 'modules/users/views/signup.client.view.html'
    }).state('signin', {
      url: '/signin',
      templateUrl: 'modules/users/views/signin.client.view.html'
    });
  }
]);'use strict';
angular.module('users').controller('AuthenticationController', [
  '$scope',
  '$http',
  '$location',
  'Authentication',
  function ($scope, $http, $location, Authentication) {
    $scope.authentication = Authentication;
    //If user is signed in then redirect back home
    if ($scope.authentication.user)
      $location.path('/');
    $scope.signup = function () {
      $http.post('/auth/signup', $scope.credentials).success(function (response) {
        //If successful we assign the response to the global user model
        $scope.authentication.user = response;
        //And redirect to the index page
        $location.path('/');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    $scope.signin = function () {
      $http.post('/auth/signin', $scope.credentials).success(function (response) {
        //If successful we assign the response to the global user model
        $scope.authentication.user = response;
        //And redirect to the index page
        $location.path('/');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
angular.module('users').controller('SettingsController', [
  '$scope',
  '$http',
  '$location',
  'Users',
  'Authentication',
  function ($scope, $http, $location, Users, Authentication) {
    $scope.user = Authentication.user;
    // If user is not signed in then redirect back home
    if (!$scope.user)
      $location.path('/');
    // Check if there are additional accounts 
    $scope.hasConnectedAdditionalSocialAccounts = function (provider) {
      for (var i in $scope.user.additionalProvidersData) {
        return true;
      }
      return false;
    };
    // Check if provider is already in use with current user
    $scope.isConnectedSocialAccount = function (provider) {
      return $scope.user.provider === provider || $scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider];
    };
    // Remove a user social account
    $scope.removeUserSocialAccount = function (provider) {
      $scope.success = $scope.error = null;
      $http.delete('/users/accounts', { params: { provider: provider } }).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.user = Authentication.user = response;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    // Update a user profile
    $scope.updateUserProfile = function () {
      $scope.success = $scope.error = null;
      var user = new Users($scope.user);
      user.$update(function (response) {
        $scope.success = true;
        Authentication.user = response;
      }, function (response) {
        $scope.error = response.data.message;
      });
    };
    // Change user password
    $scope.changeUserPassword = function () {
      $scope.success = $scope.error = null;
      $http.post('/users/password', $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.passwordDetails = null;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
// Authentication service for user variables
angular.module('users').factory('Authentication', [function () {
    var _this = this;
    _this._data = { user: window.user };
    return _this._data;
  }]);'use strict';
// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', [
  '$resource',
  function ($resource) {
    return $resource('users', {}, { update: { method: 'PUT' } });
  }
]);/*-----------------------------------------------------------------------------------*/
/*	STICKY HEADER
/*-----------------------------------------------------------------------------------*/
'use strict';
function init() {
  window.addEventListener('scroll', function (e) {
    var distanceY = window.pageYOffset || document.documentElement.scrollTop, shrinkOn = 50, header = document.querySelector('.navbar');
    if (distanceY > shrinkOn) {
      classie.add(header, 'fixed');
    } else {
      if (classie.has(header, 'fixed')) {
        classie.remove(header, 'fixed');
      }
    }
  });
}
window.onload = init();
$(document).ready(function () {
  $('.offset').css('padding-top', $('.navbar').height() + 'px');
});
$(window).resize(function () {
  $('.offset').css('padding-top', $('.navbar').height() + 'px');
});