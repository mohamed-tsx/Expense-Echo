// Import necessary modules and configurations
const Prisma = require("../Config/Prisma.js");
const asyncHandler = require("express-async-handler");

// @description Handle registration of a new expense
// @Route POST /expense/
// @access private
const registerExpense = asyncHandler(async (req, res) => {
  // Extract amount and description from the request body
  const { amount, description } = req.body;

  // Check if both amount and description are provided, otherwise send a 400 response
  if (!amount || !description) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }

  // Create a new expense in the database using Prisma
  const newExpense = await Prisma.expense.create({
    data: {
      amount: parseFloat(req.body.amount), // Ensure amount is stored as a floating-point number
      description,
      userId: req.user.id, // Associate the expense with the user ID from the request
    },
  });

  // If the expense creation is successful, send a 201 response with the created expense details
  if (!newExpense) {
    throw new Error("Please fix the issue"); // Throw an error if the expense creation fails
  }

  // Send a success response with the created expense details
  res.status(201).json({
    status: 201,
    error: null,
    success: true,
    expense: newExpense,
  });
});
// @description Retrieve all expenses associated with the authenticated user
// @Route GET /expense/
// @access private
const getAllexpenses = asyncHandler(async (req, res) => {
  // Log the user ID for debugging purposes
  console.log(req.user.id);

  // Find all expenses in the database associated with the user ID from the request
  const allExpense = await Prisma.expense.findMany({
    where: {
      userId: req.user.id,
    },
  });

  // If no expenses are found, send a 400 response with an error message
  if (!allExpense) {
    res.status(400);
    throw new Error("Expense not found");
  }

  // Send a success response with the list of expenses
  res.status(200).json({
    success: true,
    error: null,
    results: {
      data: allExpense,
    },
  });
});

// Export the functions for use in other parts of the application
module.exports = {
  registerExpense,
  getAllexpenses,
};
