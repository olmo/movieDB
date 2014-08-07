'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Person Schema
 */
var GenreSchema = new Schema({
    name: {
        type: String,
        default: '',
        required: 'Please fill Person name',
        trim: true
    }
});

mongoose.model('Genre', GenreSchema);
