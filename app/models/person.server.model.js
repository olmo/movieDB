'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Person Schema
 */
var PersonSchema = new Schema({
	name: { type: String, default: '', required: 'Please fill Person name',  trim: true 	},
	biography: { type: String, default: '' },
	birthday: { type: Date },
	deadthday: { type: Date },
	id_tmdb: { type: Number },
	place_of_birth: { type: String, default: '',  },
	photo: { type: String, default: '' },
	created: { type: Date, default: Date.now },

});

mongoose.model('Person', PersonSchema);
