'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Movie = mongoose.model('Movie'),
	Genre = mongoose.model('Genre'),
	Person = mongoose.model('Person'),
	_ = require('lodash');

var events = require('events');
var eventEmitter = new events.EventEmitter();
/**
 * Get the error message from error object
 */
var getErrorMessage = function(err) {
	var message = '';

	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = 'Movie already exists';
				break;
			default:
				message = 'Something went wrong';
		}
	} else {
		for (var errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	}

	return message;
};

/**
 * Create a Movie
 */
exports.create = function(req, res) {
	var movie = new Movie(req.body);
	movie.user = req.user;

	movie.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(movie);
		}
	});
};

exports.searchTmdb = function(req, res) {
	var request = require('request');
	request.get({
	  //headers: {'content-type' : 'application/x-www-form-urlencoded'},
	  url:     'http://api.themoviedb.org/3/search/movie?api_key=d87ab3d9f54fbc7bb6c7bee9a20c8788&language=es&query='+req.body.query,
	  //body:    "api_key=d87ab3d9f54fbc7bb6c7bee9a20c8788&language=es&query=alien"
	}, function(error, response, body){
	  res.send(body);
	});
};

exports.addFromTmdb = function(req, res) {
	var request = require('request');
	var movie = new Movie();

	request.get({
		url:     'http://api.themoviedb.org/3/movie/'+req.body.id+'?language=es&api_key=d87ab3d9f54fbc7bb6c7bee9a20c8788',
	}, function(error, response, body){
		var data = JSON.parse(body);
		var newArray = [];
		var crewData = {};
		var dataCrew;

		movie.title = data.title;
		movie.title_o = data.original_title;
		movie.tmdb_id = data.id;
		movie.imdb_id = data.imdb_id;
		movie.overview = data.overview;
		movie.release_date = data.release_date;
		movie.poster = data.poster_path;
		movie.runtime = data.runtime;

		var genreCount = data.genres.length;
		data.genres.forEach(function(genre) {
			Genre.findOne({name: genre.name}, function (err, doc){
				var obj_id;
				if(err){
					console.log(getErrorMessage(err));
				}
				if(doc===null){
					var newGenre = new Genre({name:genre.name});
					newGenre.save(function(err) {
						if (err) {
							console.log(getErrorMessage(err));
						}
						else{
							obj_id = newGenre._id;
							movie.genres.push({id: obj_id, name: genre.name});

							genreCount--;
							if(genreCount === 0){
								eventEmitter.emit('genresComplete');
							}

						}
					});
				}
				else{
					obj_id = doc._id;
					movie.genres.push({id: obj_id, name: genre.name});

					genreCount--;
					if(genreCount === 0){
						eventEmitter.emit('genresComplete');
					}
				}
			});
		});

		eventEmitter.on('genresComplete', function(){
			request.get({
				url:     'http://api.themoviedb.org/3/movie/'+req.body.id+'/credits?language=es&api_key=d87ab3d9f54fbc7bb6c7bee9a20c8788',
			}, function(error, response, body){
				dataCrew = JSON.parse(body);

				newArray.push.apply(newArray, dataCrew.cast);
				newArray.push.apply(newArray, dataCrew.crew);

				var crewcount = newArray.length;
				newArray.forEach(function(person) {
					Person.findOne({name: person.name}, function (err, doc){
						var obj_id;
						if(err){
							console.log(getErrorMessage(err));
						}
						if(doc===null){
							request.get({
								url:     'http://api.themoviedb.org/3/person/'+person.id+'?language=es&api_key=d87ab3d9f54fbc7bb6c7bee9a20c8788',
							}, function(error, response, body){
								var dataPerson = JSON.parse(body);

								var newPerson = new Person({name:dataPerson.name, biography:dataPerson.biography, birthday:dataPerson.birthday,
									deathday:dataPerson.deathday, place_of_birth:dataPerson.place_of_birth, id_tmdb:dataPerson.id, photo:dataPerson.profile_path});
								newPerson.save(function(err) {
									if (err) {
										console.log(getErrorMessage(err));
									}
									else{
										crewData[person.name] = {id: newPerson._id, name: person.name, photo: newPerson.profile_path};

										crewcount--;
										if(crewcount === 0){
											eventEmitter.emit('peopleComplete');
										}

									}
								});
							});

						}
						else{
							crewData[person.name] = {id: doc._id, name: person.name, photo: doc.profile_path};

							crewcount--;
							if(crewcount === 0){
								eventEmitter.emit('peopleComplete');
							}
						}
					});
				});




			});


		});

		eventEmitter.on('peopleComplete', function(){
			var crewcount = newArray.length;

			dataCrew.cast.forEach(function(person) {
				movie.cast.push(crewData[person.name]);

				crewcount--;
				if(crewcount === 0){
					eventEmitter.emit('crewComplete');
				}
			});

			dataCrew.crew.forEach(function(person) {
				switch (person.job){
					case 'Director': movie.director.push(crewData[person.name]); break;
					case 'Screenplay': movie.screenplay.push(crewData[person.name]); break;
					case 'Producer': movie.producer.push(crewData[person.name]); break;
					case 'Executive Producer': movie.executive_producer.push(crewData[person.name]); break;
					case 'Original Music Composer': movie.music.push(crewData[person.name]); break;
					case 'Director of Photography': movie.photography.push(crewData[person.name]); break;
					case 'Editor': movie.editor.push(crewData[person.name]); break;
					case 'Production Design': movie.production_design.push(crewData[person.name]); break;
					case 'Art Direction': movie.art_direction.push(crewData[person.name]); break;
					case 'Costume Design': movie.costume_design.push(crewData[person.name]); break;
					case 'Sound Editor': movie.sound_editor.push(crewData[person.name]); break;
					case 'Special Effects': movie.special_effects.push(crewData[person.name]); break;
				}

				crewcount--;
				if(crewcount === 0){
					eventEmitter.emit('crewComplete');
				}
			});


		});

		eventEmitter.on('crewComplete', function(){
			movie.save(function(err) {
				if (err) {
					console.log(getErrorMessage(err));
					return res.send(400, {
						message: getErrorMessage(err)
					});
				} else {
					res.jsonp(movie);
				}
			});
		});
	});
};

/**
 * Show the current Movie
 */
exports.read = function(req, res) {
	res.jsonp(req.movie);
};

/**
 * Update a Movie
 */
exports.update = function(req, res) {
	var movie = req.movie ;

	movie = _.extend(movie , req.body);

	movie.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(movie);
		}
	});
};

/**
 * Delete an Movie
 */
exports.delete = function(req, res) {
	var movie = req.movie ;

	movie.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(movie);
		}
	});
};

/**
 * List of Movies
 */
exports.list = function(req, res) { Movie.find().sort('-created').populate('user', 'displayName').exec(function(err, movies) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(movies);
		}
	});
};

/**
 * Movie middleware
 */
exports.movieByID = function(req, res, next, id) { Movie.findById(id).populate('user', 'displayName').exec(function(err, movie) {
		if (err) return next(err);
		if (! movie) return next(new Error('Failed to load Movie ' + id));
		req.movie = movie ;
		next();
	});
};

/**
 * Movie authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.movie.user.id !== req.user.id) {
		return res.send(403, 'User is not authorized');
	}
	next();
};
