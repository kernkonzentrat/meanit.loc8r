/*jslint forin: true, sloppy: true, unparam: true, vars: true, white: true, nomen: true, plusplus:true */
/*global window, document, jQuery, console, exports, module, require, process */

/**
 * Sector: Main App
 * Controller for collection "locations"
 */

var request = require('request');

// Default config option for requests (development mode)
var api_options = {
    server: 'http://localhost:3000'
};

// Overwrite config option for requests (production mode)
if (process.env.NODE_ENV === 'production') {
    api_options.server = 'https://meanit-loc8r.herokuapp.com';
}

// Render 'Location List (Home)' page
var renderHomePage = function ( req, res, data ) {
    var message;

    if ( !Array.isArray(data) ) {
        message = 'API lookup error';
        data = [];
    } else {
        if ( !data.length ) {
            message = 'No places nearby';
        }
    }

    res.render('locations/locations-list', {
        title: 'MeanIt Loc8r - find a place to work with wifi',
        pageHeader: {
            title: 'MeanIt Loc8r',
            strapline: 'Find a place to work with wifi near you'
        },
        sidebar: 'Looking for wifi and a seat? MeanIt Loc8r helps you find places to work when out and about. Perhaps with coffee, cake or pint? Let MeanIt Loc8r help to find the place you are looking for.',
        locations: data,
        message: message
    });
};

// Render 'Location Info' page (separate rendering functionality from API call and data processing)
var renderLocationInfoPage = function ( req, res, data ) {
    res.render('locations/location-info', {
        title: data.title,
        pageHeader: {
            title: data.title
        },
        sidebar: {
            context: 'is on Loc8r beacuse it has accessible wifi and space to sit down with your laptop and get some work done.',
            cTA: 'If you\'ve been here and you like it - or if you don\'t - please leave a review to help other people just like you.'
        },
        location: data
    });
};

// Render 'Location Review Form' page
var renderLocationReviewFormPage = function ( req, res, data ) {
    res.render('locations/location-review-form', {
        title: 'Review ' + data.name + ' on MeanIt Loc8r',
        pageHeader: {
            title: 'Review ' + data.name
        },
        user: {
            displayName: 'Robin Rush'
        },
        error: req.query.err
    });
};

// Render Error pages (404 etc.)
var renderErrorPage = function ( req, res, status_code ) {
    var title,
        content;

    console.log('inside renderErrorPage');

    if ( status_code === 404 ) {
        title = '404, page not found';
        content = 'Sorry, looks like the page can\'t be found';
    } else {
        title = status_code + ', something\'s gone wrong';
    }
    res.status(status_code);
    res.render('generic/generic-text', {
        title: title,
        content: content
    });
};

// Helper function to format distance values
var formatDistance = function ( distance ) {
    var num_distance,
        unit;

    if (distance > 1) {
        num_distance = parseFloat(distance).toFixed(1);
        unit = 'km';
    } else {
        num_distance = parseInt(distance * 1000, 10);
        unit = 'm';
    }
    return num_distance + unit;
};

var getLocationInfo = function ( req, res, callback ) {
    var request_options,
        path;

    path = '/api/locations/' + req.params.locationid;
    request_options = {
        url: api_options.server + path,
        method: 'GET',
        json: {}
    };
    request( request_options, function (err, response, body) {
        var data,
            data_count
            status_code = response.statusCode;

        data = body;

        if ( status_code === 200 ) {
            data.coords = {
                lng: data.coords[0],
                lat: data.coords[1]
            };
            callback(req, res, data);
        } else {
            renderErrorPage(req, res, status_code);
        }
    });
};

// GET 'Location List (Home)' page
module.exports.locationList = function ( req, res ) {
    var request_options,
        path;

    path = '/api/locations';
    request_options = {
        url: api_options.server + path,
        method: 'GET',
        json: {},
        qs: {
            lng: 10.990684,
            lat: 48.241116,
            dsc: 20
        }
    };
    request( request_options, function (err, response, body) {
        var i,
            data,
            data_count;

        data = body;
        data_count = data.length;

        if ( response.statusCode === 200 && data_count) {
            for (i = 0; i < data_count; i++) {
                data[i].distance = formatDistance(data[i].distance);
            }
        }

        renderHomePage(req, res, data);
    });
};

// GET 'Location info' page
module.exports.locationInfo = function ( req, res ) {
    getLocationInfo(req, res, function ( req, res, response_data ) {
        renderLocationInfoPage(req, res, response_data);
    });
};

// GET 'Add review' page
module.exports.addReview = function ( req, res ) {
    getLocationInfo(req, res, function ( req, res, response_data ) {
        renderLocationReviewFormPage(req, res, response_data);
    });
};

// POST 'Add review' page
module.exports.doAddReview = function ( req, res ) {
    var request_options,
        path,
        location_id,
        post_data;

    location_id = req.params.locationid;
    path = '/api/locations/' + location_id + '/reviews';
    post_data = {
        author: req.body.name,
        rating: parseInt(req.body.rating, 10),
        reviewText: req.body.review
    };
    request_options = {
        url: api_options.server + path,
        method: 'POST',
        json: post_data
    };
    if ( !post_data.author || !post_data.rating || !post_data.reviewText) {
        res.redirect('/location/' + location_id + '/review/new?err=val');
    } else {
        request( request_options, function (err, response, body) {
            var status_code = response.statusCode;

            if ( status_code === 201 ) {
                res.redirect('/location/' + location_id);
            } else if ( status_code === 400 ) {
                res.redirect('/location/' + location_id + '/review/new?err=val');
            } else {
                renderErrorPage(req, res, status_code);
            }
        });
    }
};