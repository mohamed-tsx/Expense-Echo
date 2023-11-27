const prisma = require("../Config/Prisma");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

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

  if (userExists) {
    res.status(401);
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  res.status(201).json({
    status: 201,
    success: true,
    error: null,
    results: {
      data: {
        Message: "User Created Successfully",
        user,
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
module.exports = {
  register,
  login,
};
