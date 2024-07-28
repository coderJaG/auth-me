const express = require('express');

const {requireAuth} = require('../../utils/auth')
const {User, Spot, Review, Image, Booking} = require('../../db/models')


const router = express.Router();



router.get('/current', requireAuth, async (req, res) => {
    
    const currentUserId = req.user.id;

    const getAllBookings = await Booking.findAll({
        where : {
            userId: currentUserId
        },
        include: [
            {
                model: Spot,
                include: [{model: Image}]
            },
            {model: User}
        ]
    });

    //convert data to json
    let bookingDdata =  getAllBookings[0].toJSON();

    //customize spot data
    let spot = bookingDdata.Spot
    spot.previewImage = spot.Images[0].url
    delete spot.createdAt;
    delete spot.updatedAt;
    delete spot.description;
    delete spot.Images;
    
    //compile required booking result
    let booking = {
        id: bookingDdata.id,
        spotId: bookingDdata.spotId,
        spot,
        userId: bookingDdata.userId,
        startDate: bookingDdata.startDate,
        endDate: bookingDdata.endDate,
        createdAt: bookingDdata.createdAt,
        updatedAt: bookingDdata.updatedAt
    };
    
    return res.json({Bookings: [booking]});
});











module.exports = router;