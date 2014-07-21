/*jslint forin: true, sloppy: true, unparam: true, vars: true, white: true, nomen: true, plusplus:true */
/*global window, document, jQuery, console, exports */

/**
 * Controller for collection "others"
 */

// GET 'About us' page
exports.about = function(req, res){
    res.render('generic-text', { title: 'About' });
};

// GET 'Sign in' page
exports.signin = function(req, res){
    res.render('signin', { title: 'Sign in to MeanIt Loc8r' });
};