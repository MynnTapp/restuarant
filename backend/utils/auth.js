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

// const restoreUser = (req, res, next) => {
//   // token parsed from cookies
//   const { token } = req.cookies;
//   req.user = null;

//   return jwt.verify(token, secret, null, async (err, jwtPayload) => {
//     if (err) {
//       return next();
//     }

//     try {
//       const { id } = jwtPayload.data;
//       req.user = await User.findByPk(id, {
//         attributes: {
//           include: ["email", "createdAt", "updatedAt"],
//         },
//       });
//     } catch (e) {
//       res.clearCookie("token");
//       return next();
//     }

//     if (!req.user) res.clearCookie("token");

//     return next();
//   });
// };

const restoreUser = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    console.log("No token found in cookies");
    req.user = null; // Explicitly set req.user to null
    return next(); // Proceed without restoring user
  }

  try {
    const jwtPayload = jwt.verify(token, secret); // Verify token with secret
    const { id } = jwtPayload.data;

    const user = await User.findByPk(id, {
      attributes: ["id", "username", "email", "firstName", "lastName", "createdAt", "updatedAt"],
    });

    if (user) {
      req.user = user; // Attach user object to req
      console.log(`User restored: ${user.username}`);
    } else {
      req.user = null; // User not found, ensure req.user is null
      res.clearCookie("token"); // Clear the invalid token
      console.log("User not found in database");
    }
  } catch (err) {
    console.log("Error during token verification or user lookup:", err);
    req.user = null; // On any error, set req.user to null
    res.clearCookie("token"); // Clear the invalid token
  }

  return next(); // Proceed to next middleware or route handler
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