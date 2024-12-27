// backend/utils/auth.js
const jwt = require("jsonwebtoken");
const { jwtConfig } = require("../config");
const { User } = require("../db/models");

const { secret, expiresIn } = jwtConfig;

// Sends a JWT Cookie
const setTokenCookie = (res, user) => {
  // Create the token.
  const safeUser = {
    id: user.id,
    email: user.email,
    username: user.username,
  };
  const token = jwt.sign(
    { data: safeUser },
    secret,
    { expiresIn: parseInt(expiresIn) } // 604,800 seconds = 1 week
  );

  const isProduction = process.env.NODE_ENV === "production";

  // Set the token cookie
  res.cookie("token", token, {
    maxAge: expiresIn * 1000, // maxAge in milliseconds
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction && "Lax",
  });

  return token;
};


const restoreUser = (req, res, next) => {
  // Parse token from cookies
  const { token } = req.cookies;

  req.user = User;

  if (!token) {
    console.log("No token found in cookies");
    return next(); // If no token, continue without restoring user
  }

  return jwt.verify(token, secret, null, async (err, jwtPayload) => {
    if (err) {
      console.log("JWT verification error:", err); // Log error if token verification fails
      res.clearCookie("token");
      return next();
    }

    try {
      const { id } = jwtPayload.data;
      req.user = await User.findByPk(id, {
        attributes: {
          include: ["email", "createdAt", "updatedAt"],
        },
      });

      if (!req.user) {
        console.log("User not found in database");
        res.clearCookie("token"); // Clear token if user not found
      } else {
        console.log(`User restored: ${req.user.username}`);
      }
    } catch (e) {
      console.log("Error finding user by ID:", e);
      res.clearCookie("token"); // Clear token if error occurs during user lookup
    }

    return next(); // Proceed to next middleware or route handler
  });
};

const refreshToken = async (req, res, next) => {
  // If the user is authenticated, issue a new token and reset the cookie
  if (req.user) {
    const newToken = setTokenCookie(res, req.user);
    req.token = newToken; // Optional: Attach the new token to the request object
  }
  next(); // Proceed to the next middleware or route handler
};

// If there is no current user, return an error
const requireAuth = function (req, _res, next) {
  if (req.user) return next();

  const err = new Error("Authentication required");
  err.title = "Authentication required";
  err.errors = { message: "Authentication required" };
  err.status = 401;
  return next(err);
};

module.exports = { setTokenCookie, restoreUser, requireAuth, refreshToken };