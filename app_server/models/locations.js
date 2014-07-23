var mongoose = require( 'mongoose' );

/**
 * Nested Schema: Opening Time
 * Parent Schema: Location
 *
 *  openingTimes: [
 *   {
 *    days: 'Monday - Friday',
 *    opening: '7:00am',
 *    closing: '7:00pm',
 *    closed: false
 *   }
 *  ]
 */
var openingTimeSchema = new mongoose.Schema( {
    days: {
        type: String,
        required: true
    },
    opening: String,
    closing: String,
    closed: {
        type: Boolean,
        required: true
    }
});

/**
 * Nested Schema: Review
 * Parent Schema: Location
 *
 *  reviews: [
 *   {
 *    author: 'Robin Rush',
 *    rating: 5,
 *    timestamp: '16 July 2014',
 *    reviewText: 'A great place. Ultra fast wifi connection and cold beer. Extremely speeded up my work.'
 *   }
 *  ]
 */
var reviewSchema = new mongoose.Schema( {
    author: {
        displayName: String
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 0
    },
    reviewText: String,
    createdOn: {
        type: Date,
        'default': Date.now
    }
});

/**
 * Schema: Location
 *
 *  name: 'Starcups',
 *  address: '125 High Street, Reading, RG6 1PS',
 *  rating: 3,
 *  facilities: ['Hot drinks', 'Food', 'Premium wifi'],
 *  coords: {
 *   lat: 48.26350551,
 *   lng: 10.98502994
 *  },
 *  openingTimes: [
 *   {
 *    days: {
 *     type: String,
 *     required: true
 *    },
 *    opening: String,
 *    closing: String,
 *    closed: {
 *     type: Boolean,
 *     required: true
 *    }
 *   }
 *  ],
 *  reviews: [
 *   {
 *    author: {
 *     displayName: String
 *    },
 *    rating: {
 *     type: Number,
 *     required: true,
 *     min: 0,
 *     max: 0
 *    },
 *    reviewText: String,
 *    createdOn: {
 *     type: Date,
 *     'default': Date.now
 *    }
 *   }
 *  ]
 */
var locationSchema = new mongoose.Schema( {
    name: String,
    address: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        'default': 0,
        min: 0,
        max: 5
    },
    facilities: [String],
    coords: {
        type: [Number],
        index: '2dsphere'
    },
    openingTimes: [openingTimeSchema],
    reviews: [reviewSchema]
});

// Compile schema into a model
mongoose.model( 'Location', locationSchema );