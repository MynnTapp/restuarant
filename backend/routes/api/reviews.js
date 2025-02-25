const express = require("express");
const router = express.Router();
const { Review, User, Restaurant, ReviewImage, RestaurantImage } = require("../../db/models");

const { requireAuth } = require("../../utils/auth");


// Get all reviews for a specific restaurant





router.get("/", async (req, res) => {
  try {
    // Fetch all reviews from the database
    const reviews = await Review.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName"], // Include user details
        },
        {
          model: Restaurant,
          attributes: ["id", "ownerId", "address", "city", "state", "country", "name", "price"], // Include restaurant details
          include: [
            {
              model: RestaurantImage,
              where: { preview: true }, // Only include preview images
              attributes: ["url"],
              required: false, // Allow restaurants without preview images
            },
          ],
        },
        {
          model: ReviewImage,
          attributes: ["id", "url"], // Include review images
        },
      ],
    });

    // Format the reviews response
    const formattedReviews = reviews.map((review) => {
      const reviewData = review.toJSON();

      // Extract preview image for the restaurant if available
      reviewData.Restaurant.previewImage = reviewData.Restaurant.RestaurantImages?.[0]?.url || null;

      // Remove RestaurantImages from the response as it's not needed
      delete reviewData.Restaurant.RestaurantImages;

      return reviewData;
    });

    // Send the response
    res.status(200).json({ Reviews: formattedReviews });
  } catch (err) {
    console.error("Error fetching reviews:", err.message); // Log error for debugging
    res.status(500).json({
      message: "An error occurred while fetching reviews",
      error: err.message,
    });
  }
});



router.get("/current", requireAuth, async (req, res) => {
  try {
    const currentUser = parseInt(req.user.id);

    //console.log(currentUser);

    // Fetch all reviews for the current user
    const reviews = await Review.findAll({
      where: {
        userId: currentUser,
      },
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName"],
        },
        {
          model: Restaurant,
          attributes: ["id", "ownerId", "address", "city", "state", "country",  "name", "price"],
          include: [
            {
              model: RestaurantImage,
              where: {
                preview: true,
              },
              attributes: ["url"],
              required: false, // Allow spots without preview images
            },
          ],
        },
        {
          model: ReviewImage,
          attributes: ["id", "url"],
        },
      ],
    });

    // Format the reviews response
    const formattedReviews = reviews.map((review) => {
      const reviewData = review.toJSON();

      // Safely extract the previewImage if available
      reviewData.Restaurant.previewImage = reviewData.Restaurant.RestaurantImages && reviewData.Restaurant.RestaurantImages.length > 0 ? reviewData.Restaurant.RestaurantImages[0].url : null;

      // Remove SpotImages from the response as it's no longer needed
      delete reviewData.Restaurant.RestaurantImages;

      return reviewData;
    });

    // Send the response
    res.status(200).json({ Reviews: formattedReviews });
  } catch (err) {
    console.error("Error fetching reviews:", err.message); // Log the error for debugging
    res.status(500).json({ message: "Error fetching all Reviews from current User", error: err.message });
  }
});

// Add an Image to a Review based on the Review's id
router.post("/:reviewId/images", requireAuth, async (req, res) => {
  const { url } = req.body;
  const reviewId = req.params.reviewId;

  if (!url) {
    return res.status(400).json({ message: "Image URL is required" });
  }

  try {
    const review = await Review.findByPk(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review couldn't be found" });
    }

    if (review.userId !== req.user.id) {
      return res.status(403).json({ message: "User is not authorized to add an image to this review" });
    }

    const imageCount = await ReviewImage.count({
      where: {
        reviewId,
      },
    });

    if (imageCount >= 10) {
      return res.status(403).json({ message: "Maximum number of images for this resource was reached" });
    }

    const newImage = await ReviewImage.create({
      reviewId,
      url,
    });

    delete newImage.dataValues.reviewId;
    delete newImage.dataValues.createdAt;
    delete newImage.dataValues.updatedAt;

    res.status(201).json(newImage);
  } catch (err) {
    res.status(500).json({ message: "An error occurred while uploading the image" });
  }
});

// Edit a Review
router.put("/:reviewId", requireAuth, async (req, res) => {
  const { review, stars } = req.body;
  const reviewId = req.params.reviewId;

  const errors = {};

  if (!review) {
    errors.review = "Review text is required";
  }

  if (stars === undefined || stars < 1 || stars > 5) {
    errors.stars = "Stars must be an integer from 1 to 5";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: "Bad request",
      errors,
    });
  }

  try {
    const existingReview = await Review.findByPk(reviewId);

    if (!existingReview) {
      return res.status(404).json({ message: "Review couldn't be found" });
    }

    if (existingReview.userId !== req.user.id) {
      return res.status(403).json({ message: "User is not authorized to edit this review" });
    }
   
    existingReview.review = review;
    existingReview.stars = stars;

    await existingReview.save();

    res.status(200).json(existingReview);
  } catch (err) {
    res.status(500).json({ message: "An error occured while updating the review" });
  }
});

// Delete a Review
router.delete("/:reviewId", requireAuth, async (req, res) => {
  const reviewId = req.params.reviewId;

  try {
    const review = await Review.findByPk(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review couldn't be found" });
    }

    if (review.userId !== req.user.id) {
      return res.status(403).json({ message: "User is not authorized to delete this review" });
    }

    await review.destroy();

    res.status(200).json({ message: "Successfully deleted" });
  } catch (err) {
    res.status(500).json({ message: "An error occurred while deleting the review", error: err});
  }
});

module.exports = router;