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

//get all spots owned by current User
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

    const results = getUserSpots.Spots.map(spot => {
        const ownerId = spot.UserSpot.ownerId;
        const avgRatings = (spot.Reviews.reduce((acc, rating) => acc + rating.stars, 0) / spot.Reviews.length).toFixed(1);
        const avgRating = parseFloat(avgRatings)
        const previewImage = spot.Images.preview ? spot.Images.url : 'No image';
        console.log(spot.Reviews)
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



module.exports = router;