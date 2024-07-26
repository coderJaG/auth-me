const express = require('express');
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth')

const { Spot, Review, User, Image } = require('../../db/models');



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

    res.json({ Spots: result });
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

    res.json({ spot: results });
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
        res.status(404).json({
            "message": "Spot couldn't be found"
        });
    };

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

    res.json(...result);
});


module.exports = router;