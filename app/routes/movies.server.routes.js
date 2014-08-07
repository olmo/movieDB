'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var movies = require('../../app/controllers/movies');

	// Movies Routes
	app.route('/movies')
		.get(movies.list)
		.post(users.requiresLogin, movies.create);

	app.route('/movies/:movieId')
		.get(movies.read)
		//.put(users.requiresLogin, movies.hasAuthorization, movies.update)
		//.delete(users.requiresLogin, movies.hasAuthorization, movies.delete);
		.put(movies.update)
		.delete(movies.delete);

		app.route('/searchTmdb')
			.post(movies.searchTmdb);
		app.route('/addFromTmdb')
			.post(movies.addFromTmdb);

	// Finish by binding the Movie middleware
	app.param('movieId', movies.movieByID);
};
