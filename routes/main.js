/**
 * Routes collection: Main routes
 * Route requests to respective controller
 */

var ctrl = require('../app_server/controllers/main');

module.exports = function (app) {
    app.get('/', ctrl.index);
};