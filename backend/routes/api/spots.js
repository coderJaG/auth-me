const express = require('express');
const router = express.Router();

const { Spot, Review, User, Image } = require('../../db/models');
const { Model } = require('sequelize');
//const {Review} = require('../../db/models');


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
            avgRating = spot.Reviews.reduce((acc, rating) => acc + rating.stars, 0) / spot.Reviews.length;
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



module.exports = router;