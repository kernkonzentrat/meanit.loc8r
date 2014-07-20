/*jslint forin: true, sloppy: true, unparam: true, vars: true, white: true, nomen: true, plusplus:true */
/*global window, document, jQuery, console, require, module, exports */

/**
 * Routes collection: Location routes
 * Route requests to respective controller
 */

var ctrl = require('../app_server/controllers/locations');

module.exports = function (app) {
    app.get('/', ctrl.locationList);
    app.get('/location', ctrl.locationInfo);
    app.get('/location/review/new', ctrl.addReview);
};