/*jslint forin: true, sloppy: true, unparam: true, vars: true, white: true, nomen: true, plusplus:true */
/*global window, document, jQuery, console, exports */

/**
 * Controller for collection "locations"
 */

// GET 'Location List (Home)' page
exports.locationList = function(req, res){
    res.render('locations-list', { title: 'Home' });
};

// GET 'Location info' page
exports.locationInfo = function(req, res){
    res.render('location-info', { title: 'Location info' });
};

// GET 'Add review' page
exports.addReview = function(req, res){
    res.render('index', { title: 'Add review' });
};