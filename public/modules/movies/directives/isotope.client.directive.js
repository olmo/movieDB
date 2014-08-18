'use strict';

angular.module('movies').directive('isotope', [
	function() {
		return {
			//restrict: 'E',

			link: function (scope, element, attrs) {
				scope.$watch('$last',function(v){
					if(v){
						var $container = $('.items');

                        /*if($container.hasClass('isotope')){
                            $container.isotope('destroy');
                        }*/

						$container.imagesLoaded(function () {
							/*$container.isotope({
								itemSelector: '.item',
                                layoutMode: 'fitRows'
							});*/

                            var sum = 0;
                            var cont=0;
                            $('.item img').each(function() {
                                sum += $(this).height();
                                cont++;
                            });
                            $('.item img').height(sum/cont);
						});

						/*$(window).on('resize', function () {
							$container.isotope('reLayout');
						});*/
					}
				});
			}
		};
	}
]);
