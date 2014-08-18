'use strict';

module.exports = function(app) {
    var genres = require('../../app/controllers/genres');

    // Movies Routes
    app.route('/genres')
        .get(genres.list);
};