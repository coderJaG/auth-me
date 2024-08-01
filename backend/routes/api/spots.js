const express = require('express');
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth')
const { check, validationResult } = require('express-validator')
const { handleValidationErrors } = require('../../utils/validation')
const { validateQuery } = require('../../utils/validators')
const { Op } = require('sequelize')

const { Spot, Review, User, Image, Booking } = require('../../db/models');


//get all spots
router.get('/', /*validateQuery,*/ async (req, res, next) => {



        let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;
        console.log(req.query)
        page = parseInt(page);
        size = parseInt(size);
        minLat = parseFloat(minLat);
        maxLat = parseFloat(maxLat);
        minLng = parseFloat(minLng);
        maxLng = parseFloat(maxLng);
        minPrice = parseFloat(minPrice);
        maxPrice = parseFloat(maxPrice);

        if (Number.isNaN(page) || page <= 0) page = 1;
        if (Number.isNaN(size) || size <= 0 || size > 20) size = 20;


        let where = {};

        //latitude filter
        if (!Number.isNaN(minLat) && !Number.isNaN(maxLat)) {
            where.lat = {
                [Op.or]: {
                    [Op.lte]: maxLat,
                    [Op.gte]: minLat
                }
            }
        } else if (!Number.isNaN(minLat)) {
            where.lat = {
                [Op.gte]: minLat,
            }
        } else if (!Number.isNaN(maxLat)) {
            where.lat = {
                [Op.lte]: maxLat
            }
        };

        //longitude filter
        if (!Number.isNaN(minLng) && !Number.isNaN(maxLng)) {
            where.lng = {
                [Op.or]: {
                    [Op.lte]: maxLng,
                    [Op.gte]: minLng
                }
            }
        } else if (!Number.isNaN(minLng)) {
            where.lng = {
                [Op.gte]: minLng,
            }
        } else if (!Number.isNaN(maxLng)) {
            where.lng = {
                [Op.lte]: maxLng,
            }
        };

        //price filter
        if (!Number.isNaN(minPrice) && !Number.isNaN(maxPrice)) {
            where.price = {
                [Op.or]: {
                    [Op.lte]: maxPrice,
                    [Op.gte]: minPrice
                }
            }
        } else if (!Number.isNaN(minPrice)) {
            where.price = {
                [Op.gte]: minPrice,
            }
        } else if (!Number.isNaN(maxPrice)) {
            where.price = {
                [Op.lte]: maxPrice,

            }
        };


        const getAllSpots = await Spot.findAll({
            limit: size,
            offset: parseInt(size * (page - 1)),
            where,
            include: [{
                model: Review,
                attributes: ['stars'],
            },
            {
                model: Image,
                attributes: ['url', 'preview']
            }
            ]

        });
        // build spot details
        const result = getAllSpots.map(spot => {
            let avgRating;
            if (!spot.Reviews.length) {
                avgRating = 'Not yet rated'
            } else {
                avgRating = (spot.Reviews.reduce((acc, rating) => acc + rating.stars, 0) / spot.Reviews.length).toFixed(1);
            }
            const previewImage = spot.Images[0].preview ? spot.Images[0].url : 'No image';

            return {
                id: spot.id,
                ownerId: spot.ownerId,
                address: spot.address,
                city: spot.city,
                country: spot.country,
                lat: spot.lat,
                lng: spot.lng,
                name: spot.name,
                description: spot.description,
                price: spot.price,
                createdAt: spot.createdAt,
                updatedAt: spot.updatedAt,
                avgRating,
                previewImage,
            }

        });
        if (result.length) { return res.json({ Spots: result, page, size }); };

        return res.json({ "message": 'no results found' });



});

//get all spots owned by current User (authenticated)
router.get('/current', requireAuth, async (req, res) => {
    let userId = req.user.id
    const getUserSpots = await Spot.findByPk(userId, {
        include: [
            {
                model: Review,
                attributes: ['stars']
            },
            {
                model: Image,
                attributes: ['url', 'preview']
            },
        ],
    });

    //build spot details
    const results = [getUserSpots].map(spot => {
        const avgRatings = (spot.Reviews.reduce((acc, rating) => acc + rating.stars, 0) / spot.Reviews.length).toFixed(1);
        const avgRating = parseFloat(avgRatings);
        const previewImage = spot.Images[0].preview ? spot.Images[0].url : 'No image';
        return {
            id: spot.id,
            ownerId: spot.ownerId,
            address: spot.address,
            city: spot.city,
            country: spot.country,
            lat: spot.lat,
            lng: spot.lng,
            name: spot.name,
            description: spot.description,
            price: spot.price,
            createdAt: spot.createdAt,
            updatedAt: spot.updatedAt,
            avgRating,
            previewImage,
        }
    });

    return res.json({ Spots: results });

});

//get details of a Spot from a spot id without authentication

router.get('/:spotId', async (req, res) => {
    const { spotId } = req.params;
    let getSpotById = await Spot.findByPk(spotId, {
        include: [
            {
                model: Review,
                attributes: ['stars']
            },
            {
                model: Image,
                attributes: ['id', 'url', 'preview']
            },
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName'],
            }
        ]
    });

    //if no spot is found
    if (!getSpotById) {
        return res.status(404).json({
            "message": "Spot couldn't be found"
        });
    };

    //     //build spot details
    let result = [getSpotById].map(spotParts => {
        const numReviews = spotParts.Reviews.length;
        const avgStarRating = spotParts.Reviews.reduce((acc, rating) => acc + rating.stars, 0) / numReviews;
        const SpotImages = spotParts.Images;
        for (let i = 0; i < SpotImages.length; i++) {
            let image = SpotImages[i]
            if (!image.url) {
                image.url = 'no image'
                SpotImages[image.url]
            };
        };
        const Owner = {};
        Owner.id = spotParts.User.id;
        Owner.firstName = spotParts.User.firstName;
        Owner.lastName = spotParts.User.lastName;


        return {
            id: spotParts.id,
            ownerId: spotParts.ownerId,
            address: spotParts.address,
            city: spotParts.city,
            country: spotParts.country,
            lat: spotParts.lat,
            lng: spotParts.lng,
            name: spotParts.name,
            description: spotParts.description,
            price: spotParts.price,
            createdAt: spotParts.createdAt,
            updatedAt: spotParts.updatedAt,
            numReviews,
            avgStarRating,
            SpotImages,
            Owner
        };

    });

    return res.json(result);
});

//add an image based on spotId
router.post('/:spotId/images', requireAuth, async (req, res) => {
    const { spotId } = req.params;
    const getSpotById = await Spot.findByPk(spotId, {
    });

    if (!getSpotById) {
        return res.status(404).json({
            "message": "Spot couldn't be found"
        });
    };

    const currentUserId = req.user.id;
    const spotOwnerId = getSpotById.ownerId;

    if (currentUserId === spotOwnerId) {
        const { url, preview } = req.body;

        const newImage = Image.build({
            imageableId: +spotId,
            imageableType: 'Spot',
            url,
            preview,
        });

        await newImage.save();

        const result = newImage.toJSON();

        delete result.imageableId;
        delete result.imageableType;
        delete result.createdAt;
        delete result.updatedAt;

        return res.status(201).json(result)
    };

    return res.json({
        "message": "Forbidden"
    });
});

//create a spot after user is authenticateed
router.post('/', requireAuth, async (req, res) => {

    const ownerId = req.user.id;
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const newSpot = Spot.build({
        ownerId,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    });

    await newSpot.save();

    return res.status(201).json(newSpot);

});


//edit a spot
router.put('/:spotId', requireAuth, async (req, res) => {
    const { spotId } = req.params;
    const getSpotById = await Spot.findByPk(spotId, {
    });

    if (!getSpotById) {
        return res.status(404).json({
            "message": "Spot couldn't be found"
        });
    };
    const currentUserId = req.user.id
    const spotOwnerId = getSpotById.ownerId

    if (currentUserId === spotOwnerId) {
        const { address, city, state, country, lat, lng, name, description, price } = req.body

        getSpotById.set({
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        })

        await getSpotById.save()

        return res.json(getSpotById);
    };
    return res.json({
        "message": "Forbidden"
    });
});


//delete a spot

router.delete('/:spotId', requireAuth, async (req, res) => {
    const { spotId } = req.params;
    const getSpotById = await Spot.findByPk(spotId, {
    });

    if (!getSpotById) {
        return res.status(404).json({
            "message": "Spot couldn't be found"
        });
    };
    const currentUserId = req.user.id
    const spotOwnerId = getSpotById.ownerId

    if (currentUserId === spotOwnerId) {
        await getSpotById.destroy();

        return res.json({
            "message": "Successfully deleted"
        });
    }
    return res.json({
        "message": "Forbidden"
    });

});

// get all reviews by spotId
router.get('/:spotId/reviews', async (req, res) => {
    const { spotId } = req.params;

    if (!(await Spot.findByPk(spotId))) {
        return res.status(404).json({
            "message": "Spot couldn't be found"
        });
    };

    const getAllReviews = await Review.findAll({
        where: { spotId },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: Image,
                attributes: ['id', 'url']
            }
        ]
    });


    let result = getAllReviews.map(reviews => {
        let review = reviews.toJSON();
        review['ReviewImages'] = review['Images'];
        delete review['Images'];

        return review;
    });
    return res.json({ Reviews: result });
});

//create review for a spot based on spotId

router.post('/:spotId/reviews', requireAuth, async (req, res) => {
    const { spotId } = req.params;
    const userId = req.user.id;

    //check if there is spot exist
    if (!(await Spot.findByPk(spotId))) {
        return res.status(404).json({
            "message": "Spot couldn't be found"
        });
    }
    //check if user already did a Review for the spot 
    if (await Review.findOne({
        where: {
            spotId, userId
        }
    })) {
        return res.status(500).json({
            "message": "User already has a review for this spot"
        });
    }

    const { review, stars } = req.body;
    const newReview = Review.build({
        userId,
        spotId,
        review,
        stars
    });

    await newReview.save();

    res.status(201).json(newReview);


});


//Get all bookings for a spot based on spotId
router.get('/:spotId/bookings', requireAuth, async (req, res) => {
    const { spotId } = req.params;
    const currentUserId = req.user.id;

    //check if spot exists
    if (!(await Spot.findByPk(spotId))) {
        return res.status(404).json({
            "message": "Spot couldn't be found"
        });
    };

    const getAllBookingsBySpotId = await Booking.findAll({
        where: { spotId },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            }
        ]
    });
    //if no bookings found
    if (!getAllBookingsBySpotId.length) {
        return res.status(404).json({
            "message": "No bookings found"
        });
    };

    const bookingsData = getAllBookingsBySpotId[0].toJSON();
    //build results
    if (currentUserId === bookingsData.User.id) {
        const User = bookingsData.User
        delete bookingsData.User
        let result = [{
            User,
            ...bookingsData
        }]
        return res.json({ Bookings: result });
    } else {
        result = [{
            spotId: bookingsData.spotId,
            startDate: bookingsData.startDate,
            endDate: bookingsData.endDate
        }];
        return res.json({ Bookings: result });
    };
});

//create a booking on spotId

router.post('/:spotId/bookings', requireAuth, async (req, res) => {
    const currentUserId = req.user.id;
    const { spotId } = req.params;

    const getSpotById = await Spot.findByPk(spotId, {
        include: [
            { model: Booking }
        ]
    })
    //check if spot exist
    if (!getSpotById) {
        res.status(404).json({
            "message": "Spot couldn't be found"
        });
    };

    if (currentUserId !== getSpotById.ownerId) {
        const { startDate, endDate } = req.body;

        //check for booking conflicts;
        for (const booking of getSpotById.Bookings) {
            if (startDate >= booking.startDate && startDate < booking.endDate
                && endDate >= booking.startDate && endDate <= booking.endDate
                || startDate <= booking.startDate && endDate >= booking.endDate) {
                return res.status(403).json({
                    "message": "Sorry, this spot is already booked for the specified dates",
                    "errors": {
                        "startDate": "Start date conflicts with an existing booking",
                        "endDate": "End date conflicts with an existing booking"
                    }
                });
            } else if (startDate >= booking.startDate && startDate < booking.endDate) {
                return res.status(403).json({
                    "message": "Sorry, this spot is already booked for the specified dates",
                    "errors": {
                        "startDate": "Start date conflicts with an existing booking"
                    }
                });
            } else if (endDate >= booking.startDate && endDate <= booking.endDate) {
                return res.status(403).json({
                    "message": "Sorry, this spot is already booked for the specified dates",
                    "errors": {
                        "endDate": "End date conflicts with an existing booking"
                    }
                });
            };
        };

        // create booking
        const newBooking = Booking.build({
            spotId: +spotId,
            userId: currentUserId,
            startDate,
            endDate
        });

        await newBooking.save();

        res.status(201).json(newBooking);
    };

    res.status(403).json({ "message": "Forbidden" });
});




module.exports = router;