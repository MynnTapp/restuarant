
// backend/routes/api/session.js
const express = require("express");
const { restoreUser } = require("../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { User } = require("../../db/models");
const router = express.Router();
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const { setTokenCookie} = require("../../utils/auth")

const validateLogin = [
  check("credential").exists({ checkFalsy: true }).withMessage("Email or username is required"),
  check("password").exists({ checkFalsy: true }).withMessage("Password is required"),
  handleValidationErrors,
];



router.post("/", validateLogin, async (req, res, next) => {
  try {
    const { credential, password } = req.body;

    // Check if both credential and password are provided
    const errors = {};
    if (!credential) errors.credential = "Email or username is required";
    if (!password) errors.password = "Password is required";

    // If there are validation errors, respond with a 400 status code and the errors
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        message: "Bad Request",
        errors: errors,
      });
    }

    // Proceed with finding the user if validation passes
    const user = await User.unscoped().findOne({
      where: {
        [Op.or]: {
          username: credential,
          email: credential,
        },
      },
    });

    // If no user is found or password is incorrect, respond with an error
    if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
      const err = new Error("Invalid credentials");
      err.status = 401;
      err.title = "Login failed";
      err.errors = { credential: "Invalid credentials" };
      return next(err);
    }

    // Construct safe user object
    const safeUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
    };

    // Set token cookie and respond with user info
    await setTokenCookie(res, safeUser);

    return res.json({
      user: safeUser,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({
      message: "Error logging in",
      error: error.message, // Return the error message
    });
  }
});



// Route to get the current logged-in user
// router.get("/", restoreUser, async (req, res) => {
//   if (!req.user) {
//     return res.status(200).json({ user: null });
//   }

//   // User data is available via req.user after restoreUser middleware
//   const user = req.user

//   // Return only user information
//   return res.status(200).json({
//     user: {
//       id: user.id,
//       firstName: user.firstName,
//       lastName: user.lastName,
//       email: user.email,
//       username: user.username,
//       createdAt: user.createdAt,
//       updatedAt: user.updatedAt,
//     },
//   });
// });


// Route to get the current logged-in user
router.get("/", restoreUser, async (req, res) => {
  if (!req.user) {
    return res.status(200).json({ user: null }); // Ensure user: null when not logged in
  }

  const user = req.user; // req.user is populated by restoreUser middleware

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
