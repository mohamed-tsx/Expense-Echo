const jwt = require("jsonwebtoken");
const Prisma = require("../Config/Prisma.js");
const asyncHandler = require("express-async-handler");

// Middleware to protect routes requiring authentication
const Protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if the request includes a valid token in the Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract the token from the Authorization header
      token = req.headers.authorization.split(" ")[1];

      // Verify the token using the secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user in the database based on the decoded information
      const user = await Prisma.user.findUnique({
        where: {
          name: decoded.name,
          email: decoded.email,
        },
      });

      // If the user does not exist, return an error
      if (!user) {
        res.status(401);
        throw new Error("Authentication failed: User not found");
      }

      // Attach the user to the request for further use in the route
      req.user = user;
      next();
    } catch (error) {
      // Handle token verification errors
      res.status(401);
      throw new Error("Authorization failed: Invalid token");
    }
  }

  // If no valid token is present in the Authorization header, return an error
  if (!token) {
    res.status(401);
    throw new Error("Authorization failed: No token provided");
  }
});

module.exports = Protect;
