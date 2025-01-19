
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
  const { credential, password } = req.body;
  console.log("credential ", credential, "password: ", password);
  const user = await User.unscoped().findOne({
    where: {
      [Op.or]: {
        username: credential,
        email: credential,
      },
    },
  });

  // if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
  //   const err = new Error("Invalid credentials");
  //   err.status = 401;
  //   return next(err);
  // }

  if (!user || !bcrypt.compareSync(password, user.hashedPassword)) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    err.errors = { credential: "The provided username/email and password combination is incorrect." };
    return next(err); // Pass the error to the error formatter
  }

  const safeUser = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    username: user.username,
  };

  await setTokenCookie(res, safeUser);

  return res.json({
    user: safeUser,
  });
});



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
