const express = require('express');

const { requireAuth } = require('../../utils/auth')
const { User, Spot, Review, Image } = require('../../db/models');





const router = express.Router();


router.get('/', requireAuth, async (req, res) => {

    const currentUserId = req.user.id;

    const getReviewsById = await Spot.findByPk(currentUserId, {
        include: [
            { Spot: Review },
            
           
        ],
     
    });


    return res.json(getReviewsById);
})








module.exports = router;