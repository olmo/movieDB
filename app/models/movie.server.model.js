'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var genreSchema = new Schema({ id:{ type: Schema.ObjectId }, name: {type: String} });
var crewSchema = new Schema({ _id: false, id: { type: Schema.ObjectId }, name: {type: String}, photo: {type: String} });
var castSchema = new Schema({ _id: false, id: { type: Schema.ObjectId }, name: {type: String}, character: {type: String}, photo: {type: String} });
/**
 * Movie Schema
 */
var MovieSchema = new Schema({
	tmdb_id: { type: Number, default: '', required: 'Please fill themoviedb id' },
	imdb_id: { type: String },
	title: { type: String, default: '', required: 'Please fill Movie title', trim: true 	},
	title_o: { type: String, default: '', required: 'Please fill original title', trim: true },
	poster: { type: String, default: '', required: 'Please fill poster', trim: true },
	overview: { type: String, default: '', required: 'Please fill overview', trim: true },
	runtime: { type: Number },
	release_date: { type: Date, default: '', required: 'Please fill release date' },

	genres: [ genreSchema ],
	cast: [ crewSchema ],
	director: [ crewSchema ],
	screenplay: [ crewSchema ],
	producer: [ crewSchema ],
	executive_producer: [ crewSchema ],
	music: [ crewSchema ],
	photography: [ crewSchema ],
	editor: [ crewSchema ],
	production_design: [ crewSchema ],
	art_direction: [ crewSchema ],
	costume_design: [ crewSchema ],
	sound_editor: [ crewSchema ],
	special_effects: [ crewSchema ],

	created: { type: Date, default: Date.now }
});

mongoose.model('Movie', MovieSchema);
