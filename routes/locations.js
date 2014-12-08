/*jslint forin: true, sloppy: true, unparam: true, vars: true, white: true, nomen: true, plusplus:true */
/*global window, document, jQuery, console, require, module, exports */

/**
 * Sector: Main App
 * Routes collection: Location routes
 * Route requests to respective controller
 */

var ctrl = require('../app_server/controllers/locations');

module.exports = function (app) {
    app.get('/', ctrl.locationList);
    app.get('/location/:locationid', ctrl.locationInfo);
    app.get('/location/:locationid/review/new', ctrl.addReview);
    app.post('/location/:locationid/review/new', ctrl.doAddReview);
};