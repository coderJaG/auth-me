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
    return res.json({ Reviews: result });
})



//add image to review by reviewID with authentication and authorization

router.post('/:reviewId/images', requireAuth, async (req, res) => {
    const { reviewId } = req.params;
    const getReviewById = await Review.findByPk(reviewId, {
        include: [
            { model: Image }
        ]
    });

    //check if review by Id exists
    if (!getReviewById) {
        return res.status(404).json({
            "message": "Review couldn't be found"
        });
    };

    const currentUserId = req.user.id;
    const reviewUserId = getReviewById.userId;

    //check if current user created review
    if (currentUserId !== reviewUserId) {
        return res.status(403).json({
            "message": "only review owner can add an image to a review"
        });
    };

    //check if max images already reached
    if (getReviewById.Images.length >= 10) {
        return res.status(403).json({
            "message": "Maximum number of images for this resource was reached"
        });
    };

    // add image
    const { url } = req.body
    const addImage = Image.build({
        imageableId: reviewId,
        imageableType: 'Review',
        url,
        preview: true

    });

    await addImage.save();

    let result = {
        id: addImage.id,
        url: addImage.url
    };

    return res.status(201).json(result);

})

//edit a review

router.put('/:reviewId', requireAuth, async (req, res) => {
    const { reviewId } = req.params;
    const getReviewById = await Review.findByPk(reviewId, {
    });

    //check if review by Id exists
    if (!getReviewById) {
        return res.status(404).json({
            "message": "Review couldn't be found"
        });
    };

    const currentUserId = req.user.id;
    const reviewUserId = getReviewById.userId;

    //check if current user created review
    if (currentUserId !== reviewUserId) {
        return res.status(403).json({
            "message": "only review owner can edit a review"
        });
    };

    const {review, stars} = req.body;
    getReviewById.set({
        review,
        stars
    });

    await getReviewById.save();

    return res.json(getReviewById)
})


//delte a review
router.delete('/:reviewId', requireAuth, async (req, res) => {
    const { reviewId } = req.params;
    const getReviewById = await Review.findByPk(reviewId, {
    });

    //check if review by Id exists
    if (!getReviewById) {
        return res.status(404).json({
            "message": "Review couldn't be found"
        });
    };

    const currentUserId = req.user.id;
    const reviewUserId = getReviewById.userId;

    //check if current user created review
    if (currentUserId !== reviewUserId) {
        return res.status(403).json({
            "message": "only review owner can edit a review"
        });
    };

    getReviewById.destroy();

    return res.json({
        "message": "Successfully deleted"
      })
})


module.exports = router;