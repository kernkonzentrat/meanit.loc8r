/*jslint forin: true, sloppy: true, unparam: true, vars: true, white: true, nomen: true, plusplus:true */
/*global window, document, jQuery, console, exports */

/**
 * Controller for collection "others"
 */

// GET 'About us' page
exports.about = function(req, res){
    res.render('index', { title: 'About us' });
};

// GET 'Sign in' page
exports.signin = function(req, res){
    res.render('index', { title: 'Sign in' });
};