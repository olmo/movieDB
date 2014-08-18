'use strict';

angular.module('movies').directive('changeNavbarBackground', [
	function() {
		return {

			link: function (scope, element, attrs, ctrl) {

                var change = function(){
                    $('.navbar-header').css('background', 'rgba(21,21,21,0.9)');
                }
                change();
			}
		};
	}
]);