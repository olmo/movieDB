/*-----------------------------------------------------------------------------------*/
/*	STICKY HEADER
/*-----------------------------------------------------------------------------------*/
"use strict";
function init() {

        window.addEventListener('scroll', function(e){
            var distanceY = window.pageYOffset || document.documentElement.scrollTop,
                shrinkOn = 50,
                header = document.querySelector(".navbar");
            if (distanceY > shrinkOn) {
                classie.add(header,"fixed");
            } else {
                if (classie.has(header,"fixed")) {
                    classie.remove(header,"fixed");
                }
            }
        });
    }
    window.onload = init();


    $(document).ready(function() {
	$('.offset').css('padding-top', $('.navbar').height() + 'px');

});
$(window).resize(function() {
	$('.offset').css('padding-top', $('.navbar').height() + 'px');
});
