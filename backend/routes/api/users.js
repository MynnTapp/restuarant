// backend/routes/api/users.js
const express = require("express");
const bcrypt = require("bcryptjs");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

// Middleware
const validateSignup = [
  check("email").exists({ checkFalsy: true }).isEmail().withMessage("Invalid email."),
  check("username").exists({ checkFalsy: true }).isLength({ min: 4 }).withMessage("Username is required"),
  check("username").not().isEmail().withMessage("Username cannot be an email."),
  check("firstName").exists({ checkFalsy: true }).withMessage("First Name is required."),
  check("lastName").exists({ checkFalsy: true }).withMessage("Last Name is required."),
  handleValidationErrors,
];


router.post("/", validateSignup, async (req, res) => {
  const { email, password, username, firstName, lastName } = req.body;
  const hashedPassword = bcrypt.hashSync(password);
  const errors = {};

  // Check if email already exists
  const emailExists = await User.findOne({ where: { email } });
  if (emailExists) {
    errors.email = "User with that email already exists";
  }

  // Check if username already exists
  const usernameExists = await User.findOne({ where: { username } });
  if (usernameExists) {
    errors.username = "User with that username already exists";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(500).json({
      message: "User already exists",
      errors,
    });
  }

  // Proceed to create user if no validation errors
  try {
    const user = await User.create({ email, firstName, lastName, username, hashedPassword });
    const safeUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
    };
    await setTokenCookie(res, safeUser);
    return res.status(201).json({
      user: safeUser,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});


module.exports = router;