/*jslint forin: true, sloppy: true, unparam: true, vars: true, white: true, nomen: true, plusplus:true */
/*global window, document, jQuery, console, require, module, exports */

/*
 * Collate all route files
 */

module.exports = function (app) {
    require('./main')(app);
    require('./locations')(app);
};