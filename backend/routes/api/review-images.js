const express = require('express');


const { requireAuth } = require('../../utils/auth');
const { Review, Image } = require('../../db/models');

const router = express.Router();


router.delete('/:imageId', requireAuth, async (req, res) => {
    const currentUserId = req.user.id;
    const { imageId } = req.params;

    const getImageById = await Image.findOne({
        where: { id: imageId, imageableType: 'Review' },
        include: [
            { model: Review }
        ]
    });

    if (!getImageById) {
        res.status(404).json({
            "message": "Review Image couldn't be found"
        });
    };

    if (currentUserId === getImageById.Review.userId) {
        await getImageById.destroy()
        res.json({
            "message": "Successfully deleted"
        });
    };

    res.status(403).json({"message": "Only Review owner can delete Image"});
});





















module.exports = router;