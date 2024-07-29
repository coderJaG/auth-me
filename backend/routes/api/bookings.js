const express = require('express');

const { requireAuth } = require('../../utils/auth')
const { User, Spot, Review, Image, Booking } = require('../../db/models')


const router = express.Router();



router.get('/current', requireAuth, async (req, res) => {

    const currentUserId = req.user.id;

    const getAllBookings = await Booking.findAll({
        where: {
            userId: currentUserId
        },
        include: [
            {
                model: Spot,
                include: [{ model: Image }]
            },
            { model: User }
        ]
    });

    //convert data to json
    let bookingDdata = getAllBookings[0].toJSON();

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

    return res.json({ Bookings: [booking] });
});


//edit a booking
router.put('/:bookingId', requireAuth, async (req, res) => {
    const { bookingId } = req.params;
    const currentUserId = req.user.id;
    const getAllBookings = await Booking.findAll();
    const getBookingById = await Booking.findByPk(bookingId);
    //check if booking exists
    if (!getBookingById) {
        return res.status(404).json({
            "message": "Booking couldn't be found"
        });
    };
    if (currentUserId === getBookingById.userId) {
        const { startDate, endDate } = req.body;

        let bookingConflict;
        for (const booking of getAllBookings) {
            if (booking.startDate === startDate && booking.endDate === endDate) {
                bookingConflict = true;
            };
        };

        //check if booking has passed
        let today = new Date().toJSON().slice(0, 10);
        if (getBookingById.endDate < today) {
            return res.status(403).json({
                "message": "Past bookings can't be modified"
            });
        } else if (bookingConflict) {
            return res.status(403).json({
                "message": "Sorry, this spot is already booked for the specified dates",
                "errors": {
                    "startDate": "Start date conflicts with an existing booking",
                    "endDate": "End date conflicts with an existing booking"
                }
            });
        } else {
            getBookingById.set({
                startDate,
                endDate
            });

            await getBookingById.save();

            res.json(getBookingById);
        };
    };

    res.status(403).json({"message": "Only booking creator can edit booking"})

});








module.exports = router;