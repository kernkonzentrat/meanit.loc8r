/*jslint forin: true, sloppy: true, unparam: true, vars: true, white: true, nomen: true, plusplus:true */
/*global window, document, jQuery, console, require, module, exports */

/**
 * Sector: API
 * Routes collection: Location routes
 * Route requests to respective controller
 */

var ctrl = require( '../controllers/locations' );

module.exports = function ( app ) {
    // locations
    app.get( '/api/locations', ctrl.locationsListByDistance );
    app.post( '/api/locations', ctrl.locationsCreate );
    app.get( '/api/locations/:locationid', ctrl.locationsReadOne );
    app.put( '/api/locations/:locationid', ctrl.locationsUpdateOne );
    app.del( '/api/locations/:locationid', ctrl.locationsDeleteOne );
    // reviews
    app.post( '/api/locations/:locationid/reviews', ctrl.reviewsCreate );
    app.get( '/api/locations/:locationid/reviews/:reviewid', ctrl.reviewsReadOne );
    app.put( '/api/locations/:locationid/reviews/:reviewid', ctrl.reviewsUpdateOne );
    app.del( '/api/locations/:locationid/reviews/:reviewid', ctrl.reviewsDeleteOne );
};