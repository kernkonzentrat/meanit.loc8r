/*jslint forin: true, sloppy: true, unparam: true, vars: true, white: true, nomen: true, plusplus:true */
/*global window, document, jQuery, console */

/**
 * Controller for collection "locations"
 */

// GET 'Home' page
exports.homelist = function(req, res){
    res.render('index', { title: 'Home' });
};

// GET 'Location info' page
exports.locationInfo = function(req, res){
    res.render('index', { title: 'Location info' });
};

// GET 'Add review' page
exports.addReview = function(req, res){
    res.render('index', { title: 'Add review' });
};