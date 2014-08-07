'use strict';

module.exports = {
	app: {
		title: 'MovieDB',
		description: 'movie database',
		keywords: 'movie, data, base'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.css',
			],
			js: [
				'public/lib/angular/angular.js',
				'public/lib/angular-resource/angular-resource.js',
				'public/lib/angular-cookies/angular-cookies.js',
				'public/lib/angular-animate/angular-animate.js',
				'public/lib/angular-touch/angular-touch.js',
				'public/lib/angular-sanitize/angular-sanitize.js',
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
				'public/lib/jquery/dist/jquery.js',
				'public/lib/bootstrap/dist/js/bootstrap.js',
				'public/lib/bootstrap-hover-dropdown/bootstrap-hover-dropdown.js',
				'public/lib/fancybox/source/jquery.fancybox.js',
				'public/lib/isotope/jquery.isotope.js',
				'public/lib/fitvids/jquery.fitvids.js',
				'public/lib/jquery-sticky/jquery.sticky.js',
				'public/lib/classie/classie.js',
			]
		},
		css: [
			'public/modules/**/css/*.css',
			'public/css/style.css',
			'public/css/aqua.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js',
			
			'public/js/scripts.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};
