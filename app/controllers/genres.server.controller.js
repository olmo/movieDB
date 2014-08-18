'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Genre = mongoose.model('Genre'),
    _ = require('lodash');


var getErrorMessage = function(err) {
    var message = '';

    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = 'Genre already exists';
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
 * Create a Genre
 */
exports.create = function(req, res) {

};

/**
 * Show the current Genre
 */
exports.read = function(req, res) {

};

/**
 * Update a Genre
 */
exports.update = function(req, res) {

};

/**
 * Delete an Genre
 */
exports.delete = function(req, res) {

};

/**
 * List of Genres
 */
exports.list = function(req, res) {
    Genre.find().sort('name').exec(function(err, genres) {
        if (err) {
            return res.send(400, {
                message: getErrorMessage(err)
            });
        } else {
            res.jsonp(genres);
        }
    });
};