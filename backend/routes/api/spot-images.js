const express = require("express");
const { RestaurantImage, Restaurant } = require("../../db/models");
const { requireAuth } = require("../../utils/auth.js");
const router = express.Router();





router.delete("/:imageId", requireAuth, async (req, res) => {
  const imageId = req.params.imageId;
  const userId = req.user.id;

  const restaurantImage = await RestaurantImage.findByPk(imageId);

  if (!restaurantImage) {
    return res.status(404).json({ message: "Spot Image couldn't be found" });
  }

  const restaurant= await Restaurant.findOne({
    where: {
      id: RestaurantImage.restaurantId,
    },
    attributes: ["id", "ownerId"],
  });

  if (userId !== restaurant.ownerId) {
    return res.status(403).json({ message: "Unauthorized to delete this image" });
  }

  try {
    await RestaurantImage.destroy();

    res.status(200).json({ message: "Successfully deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting SpotImage" });
  }
});

module.exports = router;