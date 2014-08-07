'use strict';

angular.module('movies').directive('isotope', [
	function() {
		return {
			//restrict: 'E',
			link: function (scope, element, attrs) {
				scope.$watch('$last',function(v){
					if(v){
						var $container = $('.fix-portfolio .items');
						$container.imagesLoaded(function () {
							$container.isotope({
								itemSelector: '.item'
							});
						});

						$(window).on('resize', function () {
							$container.isotope('reLayout');
						});
					}
				});
			}
		};
	}
]);
