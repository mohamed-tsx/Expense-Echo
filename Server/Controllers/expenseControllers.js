// Import necessary modules and configurations
const Prisma = require("../Config/Prisma.js");
const asyncHandler = require("express-async-handler");
const Protect = require("../MiddleWares/userAuthMiddleWare.js");

// @description Handle registration of a new expense
// @Route POST /expense/
// @access private
const registerExpense = asyncHandler(async (req, res) => {
  const { amount, description, categoryName, type } = req.body;

  if (!amount || !description || !categoryName || !type) {
    res.status(400);
    throw new Error("Please fill all the required fields");
  }

  // Check if the category already exists
  let existingCategory = await Prisma.category.findUnique({
    where: {
      name: categoryName,
    },
  });

  // If category is not found, create a new category
  if (!existingCategory) {
    existingCategory = await Prisma.category.create({
      data: {
        name: categoryName,
      },
    });
  }
  let isExpense;

  if (type === "expense") {
    isExpense = true;
  } else {
    isExpense = false;
  }

  let transactionAmount;

  if (isExpense) {
    transactionAmount = -amount;
  } else {
    transactionAmount = amount;
  }

  // Create a new expense with the existing or newly created category
  const newTransaction = await Prisma.expense.create({
    data: {
      amount: parseFloat(transactionAmount),
      description,
      categoryName: existingCategory.name, // Use the name of the existing or newly created category
      userId: req.user.id,
    },
  });

  // Update the user's balance
  const updatedUser = await Prisma.user.update({
    where: { id: req.user.id },
    data: {
      balance: {
        increment: parseFloat(transactionAmount),
      },
    },
  });

  res.status(201).json({
    status: 201,
    error: null,
    success: true,
    transaction: newTransaction,
    userBalance: updatedUser.balance,
  });
});
// @description Retrieve all expenses associated with the authenticated user
// @Route GET /expense/
// @access private
const getAllexpenses = asyncHandler(async (req, res) => {
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

const getCategoryExpenses = asyncHandler(async (req, res) => {
  // Retrieve the category name from the params
  const { categoryName } = req.body;

  // Find the category by name
  const category = await Prisma.category.findUnique({
    where: {
      name: categoryName,
    },
  });

  if (!category) {
    // If the category does not exist, return a 404 response
    res.status(404).json({
      success: false,
      error: "Category not found",
      results: null,
    });
    return;
  }

  // Find all expenses for the user and the specific category
  const expenseCategory = await Prisma.expense.findMany({
    where: {
      userId: req.user.id,
      categoryName: categoryName, // Assuming categoryName is the field in Prisma.expense model
    },
  });

  // Send a success response with the list of expenses that belong to this specific category
  res.status(200).json({
    success: true,
    error: null,
    results: {
      data: expenseCategory,
    },
  });
});

// Export the functions for use in other parts of the application
module.exports = {
  registerExpense,
  getAllexpenses,
  getCategoryExpenses,
};
