// // backend/routes/api/session.js
// const express = require("express");
// const { Op } = require("sequelize");
// const bcrypt = require("bcryptjs");
// const { setTokenCookie, restoreUser } = require("../../utils/auth");
// const { User } = require("../../db/models");
// const { check } = require("express-validator");
// const { handleValidationErrors } = require("../../utils/validation");
// const router = express.Router();
// const {Spot} = require("../../db/models")
// const {Review} = require("../../db/models")
// const Sequelize = require("sequelize");


// // Middleware
// const validateLogin = [
//   check("credential").exists({ checkFalsy: true }).withMessage("Email or username is required"),
//   check("password").exists({ checkFalsy: true }).withMessage("Password is required"),
//   handleValidationErrors,
// ];


// router.get("/", restoreUser, async (req, res) => {
//   if (!req.user) {
//     return res.status(200).json({ user: null });
//   }

//   // Assuming you have a Spot model associated with the user
//   const user = req.user.dataValues;

//   // Fetch spots owned by the current user
//   const spots = await Spot.findAll({
//     where: { ownerId: user.id },
//     attributes: ["id", "ownerId", "address", "city", "state", "country", "lat", "lng", "name", "description", "price", "createdAt", "updatedAt"],
//     // If avgRating and previewImage are stored in other tables (e.g., reviews or images), you may need to include associations here.
//     include: [
//       {
//         model: Review, // Assuming you have a Review model for ratings
//         attributes: [[Sequelize.fn("AVG", Sequelize.col("rating")), "avgRating"]],
//       },
//       {
//         model: Image, // Assuming you have an Image model for preview images
//         attributes: ["url"],
//         where: { preview: true },
//         required: false, // Include even if there is no preview image
//       },
//     ],
//     group: ["Spot.id"], // Required to group by Spot id when using aggregate functions like avgRating
//   });

//   // Map the spots to the format you need
//   const formattedSpots = spots.map((spot) => {
//     return {
//       id: spot.id,
//       ownerId: spot.ownerId,
//       address: spot.address,
//       city: spot.city,
//       state: spot.state,
//       country: spot.country,
//       lat: spot.lat,
//       lng: spot.lng,
//       name: spot.name,
//       description: spot.description,
//       price: spot.price,
//       createdAt: spot.createdAt,
//       updatedAt: spot.updatedAt,
//     };
//   });

//   // Send the formatted spots in the response
//   return res.status(200).json({
//     Spots: formattedSpots,
//   });
// });

// //login
// router.post("/", validateLogin, async (req, res, next) => {
//   try {
//     const { credential, password } = req.body;

//     // Check if both credential and password are provided
//     const errors = {};
//     if (!credential) errors.credential = "Email or username is required";
//     if (!password) errors.password = "Password is required";

//     // If there are validation errors, respond with a 400 status code and the errors
//     if (Object.keys(errors).length > 0) {
//       return res.status(400).json({
//         message: "Bad Request",
//         errors: errors,
//       });
//     }

//     // Proceed with finding the user if validation passes
//     const user = await User.unscoped().findOne({
//       where: {
//         [Op.or]: {
//           username: credential,
//           email: credential,
//         },
//       },
//     });

//     // If no user is found or password is incorrect, respond with an error
//     if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
//       const err = new Error("Invalid credentials");
//       err.status = 401;
//       err.title = "Login failed";
//       err.errors = { credential: "Invalid credentials" };
//       return next(err);
//     }

//     // Construct safe user object
//     const safeUser = {
//       id: user.id,
//       firstName: user.firstName,
//       lastName: user.lastName,
//       email: user.email,
//       username: user.username,
//     };

//     // Set token cookie and respond with user info
//     await setTokenCookie(res, safeUser);

//     return res.json({
//       user: safeUser,
//     });
//   } catch (error) {
//     console.error(error); // Log the error for debugging
//     res.status(500).json({
//       message: "Error logging in",
//       error: error.message, // Return the error message
//     });
//   }
// });

// // Log out
// router.delete("/", (_req, res) => {
//   res.clearCookie("token");
//   return res.json({ message: "success" });
// });

// module.exports = router;


// backend/routes/api/session.js
const express = require("express");
const { restoreUser } = require("../../utils/auth");

const router = express.Router();

// Route to get the current logged-in user
router.get("/", restoreUser, async (req, res) => {
  if (!req.user) {
    return res.status(200).json({ user: null });
  }

  // User data is available via req.user after restoreUser middleware
  const user = req.user.dataValues;

  // Return only user information
  return res.status(200).json({
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
});

// Log out
router.delete("/", (req, res) => {
  // Clear the token cookie to log out the user
  res.clearCookie("token");

  return res.status(200).json({ message: "Successfully logged out" });
});

module.exports = router;
