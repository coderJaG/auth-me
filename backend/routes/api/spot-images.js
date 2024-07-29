const express = require('express');


const {requireAuth} = require('../../utils/auth');
const {Spot, Image} = require('../../db/models');

const router = express.Router();


router.delete('/:imageId', requireAuth, async (req, res) => {
    const currentUserId = req.user.id;
    const {imageId} = req.params;

    const getImageById = await Image.findByPk(imageId, {
        include: [
            {model: Spot}
        ]
    });

    if(!getImageById){
        res.status(404).json({
            "message": "Spot Image couldn't be found"
          });
    };

    if(currentUserId === getImageById.Spot.ownerId){
        await getImageById.destroy()
        res.json({
            "message": "Successfully deleted"
          });
    }

    res.status(403).json({"message": "Only Spot owner can delete Image"});
})





















module.exports = router;