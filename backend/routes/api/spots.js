const express = require("express");
const router = express.Router();
const { Restaurant, Review, ReviewImage, RestaurantImage, User, Purchase } = require("../../db/models");
const { Sequelize, Op } = require("sequelize");
const { check, validationResult } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const { setTokenCookie, requireAuth } = require("../../utils/auth.js");
const { restoreUser } = require("../../utils/auth");






const ValidateSpotEdit = [
  check("address").exists({ checkFalsy: true }).withMessage("Street address is required"),
  check("city").exists({ checkFalsy: true }).withMessage("City is required"),
  check("state").exists({ checkFalsy: true }).withMessage("State is required"),
  check("country").exists({ checkFalsy: true }).withMessage("Country is required"),
  check("name").exists({ checkFalsy: true }).isLength({ max: 50 }).withMessage("Name must be less than 50 characters"),
  check("description").exists({ checkFalsy: true }).withMessage("Description is required"),
  check("price").exists({ checkFalsy: true }).isNumeric().withMessage("Price per day is required"),
  handleValidationErrors,
];

const validateQueryParams = [
  check("page").optional().isInt({ min: 1 }).withMessage("Page must be an integer greater than 0"),
  check("size").optional().isInt({ min: 1 }).withMessage("Size must be an integer greater than 0"),
  check("minPrice").optional().isFloat({ min: 0 }).withMessage("Minimum price must be greater than or equal to 0"),
  check("maxPrice")
    .optional()
    .isFloat()
    .custom((val, { req }) => (req.query.minPrice ?? 0) < req.query.maxPrice)
    .withMessage("Maximum price must be greater than 0 and greater than minimum price"),
  handleValidationErrors,
];

/**** GET all spots ****/
router.get("/", validateQueryParams, async (req, res, next) => {
  let { page, size, minPrice, maxPrice } = req.query;
  page = page ? page : 1;
  size = size ? size : 20;

  const where = {};

  /*** search filters ***/
  

  if (minPrice != undefined || maxPrice != undefined) {
    const filter = [];

    if (minPrice != undefined) {
      filter.push({ [Op.gte]: parseFloat(minPrice) });
    }

    if (maxPrice != undefined) {
      filter.push({ [Op.lte]: parseFloat(maxPrice) });
    }

    where.price = { [Op.and]: filter };
  }
  /*** end search filters ***/

  try {
    const allRestaurants = await Restaurant.findAll({
      offset: (page - 1) * size,
      limit: size,
      where,
      attributes: [
        "id",
        "ownerId",
        "address",
        "city",
        "state",
        "country",
        "name",
        "description",
        "price",
        "createdAt",
        "updatedAt",
        [Sequelize.fn("AVG", Sequelize.col("Reviews.stars")), "avgRating"], // Calculate average rating
      ],
      include: [
        {
          model: RestaurantImage, // Include associated images
          attributes: ["url"], // Get image URL
          where: { preview: true },
          required: false,
          duplicating: false,
        },
        {
          model: Review,
          attributes: [],
          required: false,
          duplicating: false,
        },
      ],
      group: ["Restaurant.id", "RestaurantImages.id"],
    });

    const allResturantsArray = allRestaurants.map((restaurant) => {
      return {
        id: restaurant.id,
        ownerId: restaurant.ownerId,
        address: restaurant.address,
        city: restaurant.city,
        state: restaurant.state,
        country: restaurant.country,
        name: restaurant.name,
        description: restaurant.description,
        price: parseFloat(restaurant.price), // probably worth doing it here too.
        createdAt: restaurant.createdAt,
        updatedAt: restaurant.updatedAt,
        avgRating: restaurant.get("avgRating") ? parseFloat(restaurant.get("avgRating")).toFixed(1) : null,
        previewImage: restaurant.RestaurantImages.length ? restaurant.RestaurantImages[0].url : null,
      };
    });

    return res.status(200).json({Restaurants: allResturantsArray });
  } catch (error) {
    next(error);
  }
});

/**** Validate Create Spot POST body ****/
const validateSpotData = [
  check("address").exists({ checkFalsy: true }).withMessage("Street address is required"),
  check("city").exists({ checkFalsy: true }).withMessage("City is required"),
  check("state").exists({ checkFalsy: true }).withMessage("State is required"),
  check("country").exists({ checkFalsy: true }).withMessage("Country is required"),
  check("name").exists({ checkFalsy: true }).isLength({ max: 50 }).withMessage("Name must be less than 50 characters"),
  check("description").exists({ checkFalsy: true }).withMessage("Description is required"),
  check("price").exists({ checkFalsy: true }).isFloat({ gt: 0 }).withMessage("Price per day must be a positive number"),
  handleValidationErrors,
];

/**** CREATE spot ****/
router.post("/", restoreUser, requireAuth, validateSpotData, async (req, res) => {
  try {
    const { address, city, state, country, name, description, price } = req.body; // missing id, ownerId
    const { user } = req;
    // const userId = user.id;
    if (!user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const newRestaurant = await Restaurant.create({
      ownerId: user.id,
      address,
      city,
      state,
      country,
      name,
      description,
      price,
    });

    return res.status(201).json(newRestaurant);
  } catch (error) {
    
    next(error);
  }
});


router.delete("/:id", restoreUser, requireAuth, async (req, res, next) => {
  const { id } = req.params;
  const { user } = req;

  try {
    // Find the restaurant by ID
    const restaurant = await Restaurant.findByPk(id);

    if (!restaurant) {
      return res.status(404).json({
        message: "Spot not found",
      });
    }

    // Check if the authenticated user owns the spot
    if (restaurant.ownerId !== user.id) {
      return res.status(403).json({
        message: "Forbidden: You do not have permission to delete this spot",
      });
    }

    // Delete the spot
    await restaurant.destroy();

    return res.status(200).json({
      message: "Spot deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});



//////////////////////////////////////////////////////////////////////////////

/**** GET current user's spots ****/
router.get("/current", restoreUser, requireAuth, async (req, res, next) => {
  try {
    const { user } = req;

    // Restore user ensures user is loggedin
    if (user) {
      const userId = user.id;

      // Capture user's spot listings + associated preview images
      const userRestaurants = await Restaurant.findAll({
        where: { ownerId: userId },
        include: [
          // Fetch images
          {
            model: RestaurantImage,
            where: { preview: true }, // Include only where there are pics
            required: false, // without voiding query if no pics
            attributes: ["url"],
          },
          {
            model: Review, // Fetch reviews for forthcoming aggregation
            attributes: [],
          },
        ],
        attributes: [
          // DELETE. not listing any would pull all atts? listing some will pull that exclusive list of atts?
          "id",
          "ownerId",
          "address",
          "city",
          "state",
          "country",
          "name",
          "description",
          "price",
          "createdAt",
          "updatedAt",
          [Sequelize.fn("AVG", Sequelize.col("Reviews.stars")), "avgRating"],
        ],
        group: ["Restaurant.id", "RestaurantImages.id"],
      });

      // Capture spots in array indexes
      const userRestaurantsArray = userSpots.map((userSpots) => ({
        id: userRestaurants.id,
        ownerId: userRestaurants.ownerId,
        address: userRestaurants.address,
        city: userRestaurants.city,
        state: userRestaurants.state,
        country: userRestaurants.country,
        name: userRestaurants.name,
        description: userRestaurants.description,
        price: userRestaurants.price,
        createdAt: userRestaurants.createdAt,
        updatedAt: userRestaurants.updatedAt,
        avgRating: userRestaurants.get("avgRating") !== null ? parseFloat(userSpots.get("avgRating")).toFixed(1) : null,
        previewImage: userRestaurants.RestaurantImages.length ? userSpots.RestaurantImagesImages[0].url : null,
      }));

      // Encapsulate spots in object
      return res.status(200).json({ Spots: userRestaurantsArray });
    } else {
      return res.status(401).json({ message: "Authentication required" });
    }
  } catch (error) {
    // Pass query or response error for handdling
    next(error);
  }
});
///////////////////////////////////////////////
/**** GET spot details on id ****/

router.get("/:restaurantId", async (req, res, next) => {
  const { restaurantId } = req.params;

  try {
    // Capture spot details including associated images and owner details
    const restaurant = await Restaurant.findOne({
      where: { id: restaurantId },
      include: [
        {
          model: RestaurantImage,
          attributes: ["id", "url", "preview"],
        },
        {
          model: User,
          as: "Owner",
          attributes: ["id", "firstName", "lastName"],
        },
      ],
    });

    // Return 404 if spot not found
    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant couldn't be found",
      });
    }

    // Create aggregate columns on query
    const aggregateStats = await Review.findOne({
      where: { restaurantId: restaurant.id },
      attributes: [
        [Sequelize.fn("COUNT", Sequelize.col("Review.id")), "numReviews"],
        [Sequelize.fn("AVG", Sequelize.col("stars")), "avgStarRating"],
      ],
      raw: true, // Add raw: true to get plain object
    });

    // Ensure aggregate values are not null
    const numReviews = aggregateStats.numReviews ? parseInt(aggregateStats.numReviews) : 0;
    //const avgStarRating = aggregateStats.avgStarRating ? parseFloat(aggregateStats.avgStarRating).toFixed(1) : "0.0";
const avgStarRating = aggregateStats.avgStarRating !== null ? parseFloat(aggregateStats.avgStarRating).toFixed(1) : "0.0";
    // Spot details derived from Spots, and spot associations
    // with SpotImages, Reviews, and Users.
    const detailedResponse = {
      id: restaurant.id,
      ownerId: restaurant.ownerId,
      address: restaurant.address,
      city: restaurant.city,
      state: restaurant.state,
      country: restaurant.country,
      name: restaurant.name,
      description: restaurant.description,
      price: restaurant.price,
      createdAt: restaurant.createdAt,
      updatedAt: restaurant.updatedAt,
      numReviews,
      avgStarRating,
      SpotImages: restaurant.SpotImages, // array
      Owner: {
        // alias association
        id: restaurant.Owner.id,
        firstName: restaurant.Owner.firstName,
        lastName: restaurant.Owner.lastName,
      },
    };

    return res.status(200).json(detailedResponse);
  } catch (error) {
    return next(error);
  }
});





/**** EDIT a spot on id ****/
router.put("/:restaurantId", restoreUser, requireAuth, ValidateSpotEdit, async (req, res, next) => {
  const { user } = req;
  const userId = user.id;

  if (!user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const restaurant = await Restaurant.findByPk(req.params.restaurantId);

  if (!restaurant) {
    return res.status(404).json({ message: "restaurant couldn't be found" });
  }

  if (userId !== restaurant.ownerId) {
    return res.status(403).json({ message: "Restaurant must belong to the current user" });
  }

  const { address, city, state, country, name, description, price } = req.body;

  // update or reassign initial values on update if falsy
  restaurant.address = address || restaurant.address;
  restaurant.city = city || restaurant.city;
  restaurant.state = state || restaurant.state;
  restaurant.country = country || restaurant.country;
  restaurant.name = name || restaurant.name;
  restaurant.description = description || restaurant.description;
  restaurant.price = price !== undefined ? price : restaurant.price;

  try {
    await restaurant.save();
  } catch (error) {
    return next(error);
  }

  return res.status(200).json(restaurant);
});
//////////////////////////////////////// I CAN DO It//////////////////////////
/**** DELETE a review by its ID ****/
router.delete("/:restaurantId", restoreUser, requireAuth, async (req, res, next) => {
  const { user } = req;

  if (!user) {
    return res.status(401).json({ message: "You must be signed in to access this resource." });
  }

  const userId = user.id;
  const dropSpot = await Restaurant.findByPk(req.params.spotId);

  if (!dropSpot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  if (userId !== dropSpot.ownerId) {
    return res.status(403).json({ message: "Spot must belong to the current user" });
  }

  try {
    await dropSpot.destroy();
    return res.status(200).json({ message: "Successfully deleted" });
  } catch (error) {
    return next(error);
  }
});


const validateSpotImage = [
  check("images").isArray({ min: 1 }).withMessage("At least one image is required"),
  check("images.*.url").isURL().withMessage("Each image URL must be valid"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];


// Route to add images to a specific spot
router.post("/:restaurantId/images", validateSpotImage, async (req, res) => {
  try {
    const { url, preview } = req.body;
    const restaurantId = req.params.restaurantId;

    // Assuming you have a SpotImage model
    const newImage = await RestaurantImage.create({
      restaurantId,
      url,
      preview: preview || false, // Default to false if preview is not provided
    });

    res.status(201).json(newImage);
  } catch (err) {
    console.error("Error in route handler:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to update images for a specific spot
// router.put("/:spotId/images", validateSpotImage, async (req, res) => {
//   console.log("Request body in update route handler:", req.body); // Log the request body
//   try {
//     const spotId = req.params.spotId;
//     const images = req.body;

//     // Assuming you have a SpotImage model
//     await SpotImage.destroy({ where: { spotId } }); // Delete existing images

//     const updatedImages = await Promise.all(
//       images.map(async (image) => {
//         const newImage = await SpotImage.create({
//           spotId,
//           url: image.url,
//           preview: image.preview || false,
//         });
//         return newImage;
//       })
//     );

//     res.status(200).json(updatedImages);
//   } catch (err) {
//     console.error("Error in update route handler:", err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });


const sequelize = require("sequelize");

router.put("/:restaurantId/images", validateSpotImage, async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const restaurantId = req.params.restaurantId;
    const images = req.body;

    // Validate images array
    if (!Array.isArray(images) || images.some((img) => !img.url)) {
      return res.status(400).json({ error: "Invalid image data" });
    }

    // Delete existing images
    await RestaurantImage.destroy({ where: { restaurantId }, transaction });

    // Bulk create new images
    const updatedImages = await RestaurantImage.bulkCreate(
      images.map((image) => ({
        restaurantId,
        url: image.url,
        preview: image.preview || false,
      })),
      { transaction }
    );

    // Commit transaction
    await transaction.commit();
    res.status(200).json(updatedImages);
  } catch (err) {
    // Rollback transaction on error
    if (transaction) await transaction.rollback();
    console.error("Error in update route handler:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});








/**** validate review ****/
const validateReview = [
  // do we need to validate id type fields: id, userId, spotId?
  check("review")
    .exists({ checkFalsy: true })
    .withMessage("Review text is required")
    .isString()
    .withMessage("Review must be a string")
    .isLength({ max: 4000 })
    .withMessage("Review must not exceed the length of a verified user's tweet"),
  check("stars").exists({ checkFalsy: true }).withMessage("Stars rating is required").isInt({ min: 1, max: 5 }).withMessage("Stars must be an integer between 1 and 5"),
  handleValidationErrors,
];


router.post("/:restaurantId/reviews", restoreUser, requireAuth, validateReview, async (req, res, next) => {
  const { restaurantId } = req.params; // retrieve spotId to add review at
  const { review, stars } = req.body; // retrieve info to populate review
  const { user } = req; // current user adding review
  const userId = user.id;

  const restaurant = await Restaurant.findByPk(restaurantId);

  if (!restaurant) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }

  const newReview = await Review.create({
    review,
    stars,
    restaurantId,
    userId,
  });

  res.status(201).json(newReview);
});


/**** GET reviews by spot's id ****/
router.get("/:restaurantId/reviews", async (req, res) => {
  const { restaurantId } = req.params;
  const restaurant = await Restaurant.findByPk(req.params.restaurantId); // get spot id

  if (!restaurant) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }

  const restaurantReviews = await Review.findAll({
    where: { restaurantId: restaurantId}, // thisTable[foreignKey] === otherTable[uniqueId]
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: ReviewImage,
        attributes: ["id", "url"],
      },
    ],
  });

  return res.status(200).json({ Reviews: restaurantReviews });
});
///////////////////////////////////////////////////////////////////////////////////////////////////////
/**** GET bookings by spot's id ****/
// router.get("/:spotId/bookings", restoreUser, async (req, res) => {
//   const { spotId } = req.params;
//   const currentUserId = req.user.id;

//   const spot = await Spot.findByPk(spotId); // get spot id

//   if (!spot) {
//     return res.status(404).json({
//       message: "Spot couldn't be found",
//     });
//   }

//   const spotBookings = await Booking.findAll({
//     where: { spotId: spotId }, // Review.[foreignKey] matches Spot.[uniqueId]
//     include: [
//       {
//         model: User,
//         attributes: ["id", "firstName", "lastName"],
//       },
//     ],
//   });

//   if (spot.ownerId !== currentUserId) {
//     // Capture non-owner booking information
//     const nonOwnerBookings = spotBookings.map((booking) => ({
//       spotId: booking.spotId,
//       startDate: booking.startDate,
//       endDate: booking.endDate,
//     }));
//     return res.status(200).json({ Bookings: nonOwnerBookings });
//   }

//   // Capture booking information
//   const ownerBookings = spotBookings.map((booking) => ({
//     User: {
//       id: booking.User.id,
//       firstName: booking.User.firstName,
//       lastName: booking.User.lastName,
//     },
//     id: booking.id,
//     spotId: booking.spotId,
//     userId: booking.User.id,
//     startDate: booking.startDate,
//     endDate: booking.endDate,
//     createdAt: booking.createdAt,
//     updatedAt: booking.updatedAt,
//   }));

//   return res.status(200).json({ Bookings: ownerBookings });
// });
/////////////////////////////////////////////////////////////////////////////////////////////
module.exports = router;