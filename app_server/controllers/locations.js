/*jslint forin: true, sloppy: true, unparam: true, vars: true, white: true, nomen: true, plusplus:true */
/*global window, document, jQuery, console, exports */

/**
 * Controller for collection "locations"
 */

// GET 'Location List (Home)' page
exports.locationList = function ( req, res ) {
    res.render('locations/locations-list', {
        title: 'MeanIt Loc8r - find a place to work with wifi',
        pageHeader: {
            title: 'MeanIt Loc8r',
            strapline: 'Find a place to work with wifi near you'
        },
        sidebar: 'Looking for wifi and a seat? MeanIt Loc8r helps you find places to work when out and about. Perhaps with coffee, cake or pint? Let MeanIt Loc8r help to find the place you are looking for.',
        locations: [
            {
                name: 'Starcups',
                address: '125 High Street, Reading, RG6 1PS',
                rating: 3,
                facilities: ['Hot drinks', 'Food', 'Premium wifi'],
                distance: '100m'
            },
            {
                name: 'Cafe Hero',
                address: '125 High Street, Reading, RG6 1PS',
                rating: 5,
                facilities: ['Hot drinks', 'Food', 'Premium wifi'],
                distance: '150m'
            },
            {
                name: 'Burger Queen',
                address: '125 High Street, Reading, RG6 1PS',
                rating: 4,
                facilities: ['Food', 'Premium wifi'],
                distance: '250m'
            }
        ]
    });
};

// GET 'Location info' page
exports.locationInfo = function ( req, res ) {
    res.render('locations/location-info', {
        title: 'Starcups',
        pageHeader: {
            title: 'Starcups'
        },
        sidebar: {
            context: 'is on Loc8r beacuse it has accessible wifi and space to sit down with your laptop and get some work done.',
            cTA: 'If you\'ve been here and you like it - or if you don\'t - please leave a review to help other people just like you.'
        },
        location: {
            name: 'Starcups',
            address: 'Münchener Strasse 37b, 86415 Mering',
            rating: 3,
            facilities: ['Hot drinks', 'Food', 'Premium wifi'],
            coords: {
                lat: 48.26350551,
                lng: 10.98502994
            },
            openingTimes: [
                {
                    days: 'Monday - Friday',
                    opening: '7:00am',
                    closing: '7:00pm',
                    closed: false
                },
                {
                    days: 'Saturday',
                    opening: '8:00am',
                    closing: '5:00pm',
                    closed: false
                },
                {
                    days: 'Sunday',
                    closed: true
                }
            ],
            reviews: [
                {
                    author: 'Robin Rush',
                    rating: 5,
                    timestamp: '16 July 2014',
                    reviewText: 'A great place. Ultra fast wifi connection and cold beer. Extremely speeded up my work.'
                },
                {
                    author: 'Kurt Knauser',
                    rating: 3,
                    timestamp: '17 July 2014',
                    reviewText: 'Location is ok. But there was a drunk guy next to me, that really pissed me off.'
                }
            ]
        }
    });
};

// GET 'Add review' page
exports.addReview = function ( req, res ) {
    res.render('locations/location-review-form', {
        title: 'Review Starcups on MeanIt Loc8r',
        pageHeader: {
            title: 'Review Starcups'
        },
        user: {
            displayName: 'Robin Rush'
        }
    });
};