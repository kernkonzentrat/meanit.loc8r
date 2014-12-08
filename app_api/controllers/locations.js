/*jslint forin: true, sloppy: true, unparam: true, vars: true, white: true, nomen: true, plusplus:true */
/*global window, document, jQuery, console, exports, module, require, ObjectId */

/**
 * Sector: API
 * Controller for collection "locations"
 */

var mongoose = require('mongoose'),
    model_location = mongoose.model('Location') || false;

// Helper function for sending responses
var sendJSONresponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

// Convert distances to radians and vice versa
var convertEarthUnits = (function () {
    // in km - miles is 3959
    var earthRadius = 6371,
        getDistanceFromRads = function (rads) {
            return parseFloat(rads * earthRadius);
        },
        getRadsFromDistance = function (distance) {
            return parseFloat(distance / earthRadius);
        };

    return {
        getRadsFromDistance : getRadsFromDistance,
        getDistanceFromRads : getDistanceFromRads
    };
}());

// Process a list of locations and return it
var processLocationList = function (data) {
    var locations = [];

    try {
        data.forEach(function (doc) {
            locations.push({
                // distance: doc.dis,
                distance: convertEarthUnits.getDistanceFromRads(doc.dis),
                name: doc.obj.name,
                address: doc.obj.address,
                rating: doc.obj.rating,
                facilities: doc.obj.facilities,
                _id: doc.obj._id
            });
        });
    } catch (err) {
        console.log(err);
    }

    console.log(locations);
    return locations;
};

// Set the average rating of a specific location
var setAverageRating = function (location) {
    var i,
        reviewCount,
        ratingAverage,
        ratingTotal;

    if (location !== undefined) {

        if (location.reviews && location.reviews.length > 0) {
            reviewCount = location.reviews.length;
            ratingTotal = 0;
            for (i = 0; i < reviewCount; i++) {
                ratingTotal = ratingTotal + location.reviews[i].rating;
            }
            ratingAverage = parseInt(ratingTotal / reviewCount, 10);
            location.rating = ratingAverage;
            location.save(function (err) {

                if (err) {
                    console.log(err);
                } else {
                    console.log('Average rating updated to ' + ratingAverage);
                }
            });
        }
    }
};

// Update the average rating of a specific location
var updateAverageRating = function (locationid) {

    if (locationid !== undefined && model_location) {
        model_location
            .findById(locationid)
            .select('rating name')
            .exec(function (err, location) {

                if (!err) {
                    setAverageRating(location);
                }
            });
    }
};

// Add a new review subdocument
var addNewReview = function (req, res, location) {
    if (!location) {
        sendJSONresponse(res, 404, 'locationid not found');
    } else {
        location.reviews.push({
            author: {
                displayName: req.body.author
            },
            rating: req.body.rating,
            reviewText: req.body.reviewText
        });

        location.save(function (err, location) {
            var thisReview;

            if (err) {
                sendJSONresponse(res, 400, err);
            } else {
                updateAverageRating(location._id);
                thisReview = location.reviews[location.reviews.length - 1];
                sendJSONresponse(res, 201, thisReview);
            }
        });
    }
};

module.exports.locationsListByDistance = function (req, res) {
    var lng = parseFloat(req.query.lng),
        lat = parseFloat(req.query.lat),
        dsc = parseInt(req.query.dsc, 10),
        point = {
            type: 'Point',
            coordinates: [lng, lat]
        },
        options = {
            spherical: true,
            maxDistance : convertEarthUnits.getRadsFromDistance(dsc),
            num: 10
        };

    if ( (!lng && lng !== 0) || (!lat && lat !== 0) ) {
        sendJSONresponse(res, 404, {
            "message": "longitude and latitude parameters are required"
        });
        return;
    }

    if ( model_location ) {
        model_location.geoNear(point, options, function (err, results, stats) {
            if (err) {
                sendJSONresponse(res, 404, err);
            } else {
                sendJSONresponse(res, 200, processLocationList(results));
            }
        });
    }
};

module.exports.locationsCreate = function (req, res) {

    if ( model_location ) {
        model_location.create({
            name: req.body.name,
            address: req.body.address,
            facilities: req.body.facilities.split(','),
            coords: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
            openingTimes: [
                {
                    days: req.body.days1,
                    opening: req.body.opening1,
                    closing: req.body.closing1,
                    closed: req.body.closed1
                },
                {
                    days: req.body.days2,
                    opening: req.body.opening2,
                    closing: req.body.closing2,
                    closed: req.body.closed2
                }
            ]
        }, function (err, location) {

            if (err) {
                sendJSONresponse(res, 404, err);
            } else {
                sendJSONresponse(res, 201, location);
            }
        });
    }
};

/* GET a location by the id */
module.exports.locationsReadOne = function(req, res) {
    console.log('Finding location details', req.params);

    if (req.params && req.params.locationid && model_location) {
        model_location
            .findById(req.params.locationid)
            .exec(function (err, location) {

                if (!location) {
                    sendJSONresponse(res, 404, {
                        "message": "locationid not found"
                    });
                    return;
                }

                if (err) {
                    console.log(err);
                    sendJSONresponse(res, 404, err);
                    return;
                }

                console.log('location');
                console.log(location);

                sendJSONresponse(res, 200, location);
            });
    } else {
        sendJSONresponse(res, 404, {
            "message": "No locationid in request"
        });
    }
};

module.exports.locationsUpdateOne = function (req, res) {
    if (!req.params.locationid) {
        sendJSONresponse(res, 404, { "message" : "Not found, locationid is required" });
        return;
    }
    model_location
        .findById(req.params.locationid)
        .select('-reviews -rating')
        .exec(function (err, location) {

            if (!location) {
                sendJSONresponse(res, 404, { "message" : "Not found, locationid is required" });
                return;
            } else if (err) {
                console.log(err);
                sendJSONresponse(res, 404, err);
                return;
            }
            location.name = req.body.name;
            location.address = req.body.address;
            location.facilities = req.body.facilities.split(',');
            location.coords = [parseFloat(req.body.lng), parseFloat(req.body.lat)];
            location.openingTimes = [
                {
                    days: req.body.days1,
                    opening: req.body.opening1,
                    closing: req.body.closing1,
                    closed: req.body.closed1
                },
                {
                    days: req.body.days2,
                    opening: req.body.opening2,
                    closing: req.body.closing2,
                    closed: req.body.closed2
                }
            ];
            location.save(function (err, location) {

                if (err) {
                    console.log(err);
                    sendJSONresponse(res, 404, err);
                } else {
                    sendJSONresponse(res, 200, location);
                }
            });
        });
};

module.exports.locationsDeleteOne = function (req, res) {
    var locationid = req.params.locationid;

    if (locationid) {
        model_location
            .findById(locationid)
            .exec(function (err, location) {
                model_location.remove(function (err, location) {

                    if (err) {
                        console.log(err);
                        sendJSONresponse(res, 404, err);
                    } else {
                        sendJSONresponse(res, 204, null);
                    }
                });
            });
    } else {
        sendJSONresponse(res, 404, {
            "message": "Not found, locationid required"
        });
    }
};

module.exports.reviewsCreate = function (req, res) {
    console.log('Create review', req.params);

    if (req.params && req.params.locationid && model_location) {
        model_location
            .findById(req.params.locationid)
            .select('name reviews')
            .exec(function (err, location) {

                if (err) {
                    sendJSONresponse(res, 404, err);
                } else {
                    addNewReview(req, res, location);
                }
            });
    } else {
        sendJSONresponse(res, 404, {
            "message": "Not found, locationid required"
        });
    }
};

module.exports.reviewsReadOne = function (req, res) {
    console.log('Finding location details', req.params);

    if (req.params && req.params.locationid && model_location) {
        model_location
            .findById(req.params.locationid)
            .select('name reviews')
            .exec(function (err, location) {
                var response,
                    review;

                if (!location) {
                    sendJSONresponse(res, 404, {
                        "message": "locationid not found"
                    });
                    return;
                }

                if (err) {
                    console.log(err);
                    sendJSONresponse(res, 404, err);
                    return;
                }

                if (location.reviews && location.reviews.length > 0) {
                    review = location.reviews.id(req.params.reviewid);

                    if (!review) {
                        sendJSONresponse(res, 404, {
                            "message": "reviewid not found"
                        });
                        return;
                    }
                    response = {
                        location : {
                            name : location.name,
                            id : req.params.locationid
                        },
                        review : review
                    };

                    sendJSONresponse(res, 200, response);
                }
            });
    } else {
        sendJSONresponse(res, 404, {
            "message": "No reviews found"
        });
    }
};

module.exports.reviewsUpdateOne = function (req, res) {
    sendJSONresponse(res, 200, { "status" : "success" });

    if (!req.params.locationid) {
        sendJSONresponse(res, 404, { "message" : "Not found, locationid is required" });
        return;
    }
    model_location
        .findById(req.params.locationid)
        .select('reviews')
        .exec(function (err, location) {
            var thisReview;

            if (!location) {
                sendJSONresponse(res, 404, {
                    "message": "locationid not found"
                });
                return;
            }

            if (err) {
                console.log(err);
                sendJSONresponse(res, 404, err);
                return;
            }

            if (location.reviews && location.reviews.length > 0) {
                thisReview = location.reviews.id(req.params.reviewid);

                if (!thisReview) {
                    sendJSONresponse(res, 404, {
                        "message": "reviewid not found"
                    });
                } else {
                    thisReview.author.displayName = req.body.author;
                    thisReview.rating = req.body.rating;
                    thisReview.reviewText = req.body.reviewText;
                    location.save(function (err, location) {
                        if (err) {
                            console.log(err);
                            sendJSONresponse(res, 404, err);
                        } else {
                            updateAverageRating(location._id);
                            sendJSONresponse(res, 200, thisReview);
                        }
                    });
                }
            } else {
                sendJSONresponse(res, 404, {
                    "message": "No review to update"
                });
            }

        });
};

module.exports.reviewsDeleteOne = function (req, res) {
    var locationid = req.params.locationid,
        reviewid = req.params.reviewid;

    if (!locationid || !reviewid) {
        sendJSONresponse(res, 404, {
            "message": "Not found, locationid and reviewid required"
        });
        return;
    }

    model_location
        .findById(locationid)
        .select('reviews')
        .exec(function (err, location) {

            if (!location) {
                sendJSONresponse(res, 404, {
                    "message": "locationid not found"
                });
                return;
            }

            if (err) {
                console.log(err);
                sendJSONresponse(res, 404, err);
                return;
            }

            if (location.reviews && location.reviews.length > 0) {

                if (!location.reviews.id(reviewid)) {
                    sendJSONresponse(res, 404, {
                        "message": "reviewid not found"
                    });
                } else {
                    location.reviews.id(reviewid).remove();
                    location.save(function (err, location) {
                        if (err) {
                            console.log(err);
                            sendJSONresponse(res, 404, err);
                        } else {
                            updateAverageRating(location._id);
                            sendJSONresponse(res, 204, null);
                        }
                    });
                }
            } else {
                sendJSONresponse(res, 404, {
                    "message": "No review to delete"
                });
            }
        });
};