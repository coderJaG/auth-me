const express = require('express');

const { requireAuth } = require('../../utils/auth')
const { User, Spot, Review, Image } = require('../../db/models');





const router = express.Router();


router.get('/current', requireAuth, async (req, res) => {

    const currentUserId = req.user.id;
    const getReviewsById = await Review.findAll({
        where: { userid: currentUserId },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            { model: Spot },
            { model: Image }
        ],
    });

    //build review results
    let result = getReviewsById.map(review => {

        let Spot = {
            id: review.Spot.id,
            ownerId: review.Spot.ownerId,
            address: review.Spot.address,
            city: review.Spot.city,
            state: review.Spot.state,
            country: review.Spot.country,
            lat: review.Spot.lat,
            lng: review.Spot.lng,
            name: review.Spot.name,
            description: review.Spot.description,
            price: review.Spot.price,
            createdAt: review.Spot.createdAt,
            updatedAt: review.Spot.updatedAt
        };

        let ReviewImages;

        if (review.Images && review.Images.length > 0) {
            ReviewImages = {
                id: review.Images[0].id,
                url: review.Images[0].url
            };
            Spot.previewImage = review.Images[0].url

        } else {
            ReviewImages = { 'Images': 'no images' }
            Spot.previewImage = 'no image'
        };

        return {
            id: review.id,
            userId: review.userId,
            spotId: review.spotId,
            review: review.review,
            stars: review.stars,
            createdAt: review.createdAt,
            updatedAt: review.updatedAt,
            User: review.User,
            Spot,
            ReviewImages
        };
    });
    return res.json({Reviews: result});
})








module.exports = router;