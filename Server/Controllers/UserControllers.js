const prisma = require("../Config/Prisma");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// @description Register new User
// @Route POST /users
// @access public
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  //Check if some required fields are empty
  if (!email || !name || !password) {
    res.status(401);
    throw new Error("Please fill all the required fields");
  }

  //Check if the user is already registered
  const userExists = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  // if the user is already registered
  if (userExists) {
    res.status(401);
    throw new Error("User already exists");
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  //Register the user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  // Respond with success and user information with token
  res.status(201).json({
    status: 201,
    success: true,
    error: null,
    results: {
      data: {
        Message: "User Created Successfully",
        user,
        token: generateToken(user.email, user.id),
      },
    },
  });
});

// @description Login user
// @Route POST /users/login
// @access public
const login = (req, res) => {
  res.send("This user is logged in!");
};

const generateToken = (email, id) => {
  return jwt.sign({ email, id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};
module.exports = {
  register,
  login,
};
