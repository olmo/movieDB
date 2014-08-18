'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var movies = require('../../app/controllers/movies');

	// Movies Routes
	app.route('/movies')
		.get(movies.list)
		.post(users.requiresLogin, users.hasAuthorization(['admin']), movies.create);

	app.route('/movies/:movieId')
		.get(movies.read)
		//.put(users.requiresLogin, movies.hasAuthorization, movies.update)
		//.delete(users.requiresLogin, movies.hasAuthorization, movies.delete);
		.put(users.requiresLogin, users.hasAuthorization(['admin']), movies.update)
		.delete(users.requiresLogin, users.hasAuthorization(['admin']), movies.delete);

    app.route('/movies/:movieId/seen')
        .get(users.requiresLogin, movies.seen);

    app.route('/searchTmdb')
        .post(users.requiresLogin, users.hasAuthorization(['admin']), movies.searchTmdb);
    app.route('/addFromTmdb')
        .post(users.requiresLogin, users.hasAuthorization(['admin']), movies.addFromTmdb);

	// Finish by binding the Movie middleware
	app.param('movieId', movies.movieByID);
};
