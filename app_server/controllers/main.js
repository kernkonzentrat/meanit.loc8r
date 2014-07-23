/*jslint forin: true, sloppy: true, unparam: true, vars: true, white: true, nomen: true, plusplus:true */
/*global window, document, jQuery, console, exports, res */

/**
 * Controller for collection "others"
 */

// GET 'About us' page exports.about = function ( req, res ) {
exports.about = function ( req, res ) {
    res.render('generic/generic-text', {
        title: 'About MeanIt Loc8r',
        content: 'Under the bed leave dead animals as gifts. Cat snacks intently sniff hand need to chase tail behind the couch. Mark territory nap all day make muffins attack feet. Make muffins throwup on your pillow so shake treat bag, yet give attitude. Stare at ceiling intently stare at the same spot for need to chase tail need to chase tail chase imaginary bugs run in circles, so give attitude. Stare at ceiling roll around missing until dinner time, stick butt in face. Chase mice give attitude yet under the bed run in circles. Lick butt intrigued by the shower, swat at dog for find something else more interesting so give attitude but intently sniff hand. Sleep on keyboard intently sniff hand and sun bathe chase imaginary bugs. Swat at dog hunt anything that moves play time so intrigued by the shower.\n\n Chase mice stretch but chase imaginary bugs, chase imaginary bugs flop over rub face on everything. Rub face on everything roll around leave dead animals as gifts claw drapes but stretch behind the couch climb leg. Roll around destroy couch under the bed but rub face on everything and mark territory or why must they do that. Nap all day why must they do that or climb leg intently sniff hand find something else more interesting. Intently stare at the same spot under the bed. Inspect anything brought into the house destroy couch and intently stare at the same spot leave hair everywhere destroy couch for throwup on your pillow.'
    });
};

// GET 'Sign in' page
exports.signin = function ( req, res ) {
    res.render('main/signin', { title: 'Sign in to MeanIt Loc8r' });
};