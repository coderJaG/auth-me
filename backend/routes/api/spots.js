const express = require('express');
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth')
const { check } = require('express-validator')
const { handleValidationErrors } = require('../../utils/validation')
const { Spot, Review, User, Image, UserSpot, sequelize } = require('../../db/models');
const { get } = require('./spots');

const validateSpotInfo = [
    check('address')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Street address is required'),
    check('city')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('state is required'),
    check('country')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Country is required'),
    check('lat')
        .exists({ checkFalsy: true })
        .notEmpty()
        .isFloat({ min: -90, max: 90 })
        .withMessage('Latitude must be within -90 and 90'),
    check('lat')
        .exists({ checkFalsy: true })
        .notEmpty()
        .isFloat({ min: -180, max: 180 })
        .withMessage('Longitude must be within -90 and 90'),
    check('name')
        .exists({ checkFalsy: true })
        .notEmpty()
        .isLength({ max: 50 })
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Description is required'),
    check('price')
        .exists({ checkFalsy: true })
        .notEmpty()
        .isInt({ min: 1 })
        .withMessage('Price per day must be a positive number'),
    handleValidationErrors
]

//check if spot !exists to be true helper function
// isNotSpot = (getSpotById) => {
//     if (!getSpotById) {
//         return res.status(404).json({
//             "message": "Spot couldn't be found"
//         });
//     };
// }

//get all spots
router.get('/', async (req, res) => {
    const getAllSpots = await Spot.findAll({
        include: [{
            model: Review,
            attributes: ['stars'],
        },
        {
            model: Image,
            attributes: ['url', 'preview']
        }
            ,
        {
            model: User,
            attributes: ['id']
        }
        ]
    });

    //build spot details
    const result = getAllSpots.map(spot => {

        const ownerId = spot.Users[0].UserSpot.ownerId
        let avgRating;
        if (!spot.Reviews.length) {
            avgRating = 'Not yet rated'
        } else {
            avgRating = (spot.Reviews.reduce((acc, rating) => acc + rating.stars, 0) / spot.Reviews.length).toFixed(1);
        }
        const previewImage = spot.Images[0].preview ? spot.Images[0].url : 'No image'

        return {
            id: spot.id,
            ownerId,
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

    })

    return res.json({ Spots: result });
});

//get all spots owned by current User (authenticated)
router.get('/current', requireAuth, async (req, res) => {
    let userId = req.user.id
    const getUserSpots = await User.findByPk(userId, {
        attributes: [],
        include: [
            {
                model: Spot,
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
            },
        ]
    });

    //build spot details
    const results = getUserSpots.Spots.map(spot => {
        const ownerId = spot.UserSpot.ownerId;
        const avgRatings = (spot.Reviews.reduce((acc, rating) => acc + rating.stars, 0) / spot.Reviews.length).toFixed(1);
        const avgRating = parseFloat(avgRatings)
        const previewImage = spot.Images.preview ? spot.Images.url : 'No image';
        return {
            id: spot.id,
            ownerId,
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
    })

    return res.json({ spot: results });
})

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
    };;

    //build spot details
    let result = [getSpotById].map(spotParts => {
        const ownerId = spotParts.Users[0].UserSpot.ownerId;
        const numReviews = spotParts.Reviews.length;
        const avgRating = spotParts.Reviews.reduce((acc, rating) => acc + rating.stars, 0) / numReviews;
        const SpotImages = spotParts.Images;
        for (let i = 0; i < SpotImages.length; i++) {
            let image = SpotImages[i]
            if (!image.url) {
                image.url = 'no image'
                SpotImages[image.url]
            };
        };
        const Owner = {};
        Owner.id = spotParts.Users[0].id;
        Owner.firstName = spotParts.Users[0].firstName;
        Owner.lastName = spotParts.Users[0].lastName;


        return {
            id: spotParts.id,
            ownerId,
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
            avgRating,
            SpotImages,
            Owner
        };

    });

    return res.json(...result);
});

//add an image based on spotId
router.post('/:spotId/images', async (req, res) => {
    const { spotId } = req.params;
    const getSpotById = await Spot.findByPk(spotId, {
        include: {
            model: User
        }
    })

    if (!getSpotById) {
        return res.status(404).json({
            "message": "Spot couldn't be found"
        });
    };

    const currentUserId = req.user.id
    const spotOwnerId = getSpotById.Users[0].UserSpot.ownerId

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
    }

    return res.json({
        "message": "Not authorized to add image to this spot"
    })
})

//create a spot after user is authenticateed
router.post('/', requireAuth, validateSpotInfo, async (req, res) => {

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

    //update UserSpot Table with new spotId and ownerId
    const updateUserSpot = UserSpot.build({
        spotId: newSpot.id,
        ownerId
    });

    await updateUserSpot.save();

    return res.status(201).json(newSpot);

});


//edit a spot
router.put('/:spotId', requireAuth, validateSpotInfo, async (req, res) => {
    const { spotId } = req.params;
    const getSpotById = await Spot.findByPk(spotId, {
        include: {
            model: User
        }
    });

    if (!getSpotById) {
        return res.status(404).json({
            "message": "Spot couldn't be found"
        });
    };
    const currentUserId = req.user.id
    const spotOwnerId = getSpotById.Users[0].UserSpot.ownerId

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

        return res.json(getSpotById)
    }
    return res.json({
        "message": "Not authorized to add image to this spot"
    })
})


//delete a spot

router.delete('/:spotId', requireAuth, async (req, res) => {
    const { spotId } = req.params;
    const getSpotById = await Spot.findByPk(spotId, {
        include: {
            model: User
        }
    });

    if (!getSpotById) {
        return res.status(404).json({
            "message": "Spot couldn't be found"
        });
    };
    const currentUserId = req.user.id
    const spotOwnerId = getSpotById.Users[0].UserSpot.ownerId

    if (currentUserId === spotOwnerId) {
        await getSpotById.destroy();

        return res.json({
            "message": "Successfully deleted"
        });
    }
    return res.json({
        "message": "Not authorized to add image to this spot"
    })

});




module.exports = router;