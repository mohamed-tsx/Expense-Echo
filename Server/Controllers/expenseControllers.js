// Import necessary modules and configurations
const Prisma = require("../Config/Prisma.js");
const asyncHandler = require("express-async-handler");

// @description Handle registration of a new expense
// @Route /expense/
// METHOD POST
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

  //Check if the expense type is income or expense
  if (type === "expense") {
    isExpense = true;
  } else {
    isExpense = false;
  }

  let transactionAmount;

  //If the transaction type is expense make the amount minus or if it's not make the amount plus
  if (isExpense) {
    transactionAmount = -amount;
  } else {
    transactionAmount = amount;
  }

  const user = await Prisma.user.findUnique({
    where: {
      id: req.user.id,
    },
  });

  // Check if the transaction amount exceeds the user's balance
  if (user.balance + transactionAmount < 0) {
    // Reject the transaction or handle the situation as needed
    res.status(400).json({
      success: false,
      error: "Transaction amount exceeds the available balance.",
    });
    return;
  }

  // Create a new expense with the existing or newly created category
  const newTransaction = await Prisma.expense.create({
    data: {
      amount: parseFloat(transactionAmount),
      description,
      categoryName: existingCategory.name,
      type,
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
// @Route /expense/
// METHOD GET
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

// @description Retreive expenses in speciefic category
// @Route /expense/category/
// METHOD GET
// @Access private
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

// @description Retreive a speciefic expense
// @Route /expense/id
// @METHOD GET
// @Access private
const getExpense = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user.id;

  const expense = await Prisma.expense.findUnique({
    where: {
      id,
      userId,
    },
  });

  if (!expense) {
    res.status(404);
    throw new Error("Expense not found!");
  }

  // Send a success response with the speciefic expense
  res.status(200).json({
    success: true,
    error: null,
    results: {
      data: expense,
    },
  });
});

// @description Updating existing expense
// @Route /expense/:id
// @METHOD PUT
// @Access private
const updateExpense = asyncHandler(async (req, res) => {
  const expenseId = req.params.id;
  const { amount, description, type, categoryName } = req.body;

  // Check if the expense exists
  const existingExpense = await Prisma.expense.findUnique({
    where: { id: expenseId },
    select: { userId: true, amount: true, categoryName: true },
  });

  if (!existingExpense) {
    res.status(404).json({
      success: false,
      error: "Expense not found",
    });
    return;
  }

  // Check if the authenticated user is the owner of the expense
  if (existingExpense.userId !== req.user.id) {
    res.status(403).json({
      success: false,
      error: "You are not authorized to update this expense",
    });
    return;
  }

  // Determine whether it's an expense or income
  const isExpense = type === "expense";

  // Calculate the transaction amount based on the expense type
  const transactionAmount = isExpense ? -amount : amount;

  // Check if the updated transaction amount exceeds the user's balance
  const currentUser = await Prisma.user.findUnique({
    where: { id: req.user.id },
    select: { balance: true },
  });

  if (currentUser.balance - existingExpense.amount + transactionAmount < 0) {
    res.status(400).json({
      success: false,
      error: "Updated transaction amount exceeds the available balance.",
    });
    return;
  }

  // Find or create the category based on the provided category name
  let existingCategory = await Prisma.category.findUnique({
    where: { name: categoryName },
  });

  if (!existingCategory) {
    existingCategory = await Prisma.category.create({
      data: {
        name: categoryName,
      },
    });
  }

  // Update the expense, including the categoryId
  const updatedExpense = await Prisma.expense.update({
    where: { id: expenseId },
    data: {
      amount: parseFloat(transactionAmount),
      description,
      categoryName: existingCategory.name, // Use the name of the existing or newly created category
      type,
    },
  });

  // Update the user's balance
  const updatedUser = await Prisma.user.update({
    where: { id: req.user.id },
    data: {
      balance: {
        increment: parseFloat(transactionAmount - existingExpense.amount),
      },
    },
  });

  res.status(200).json({
    success: true,
    transaction: updatedExpense,
    userBalance: updatedUser.balance,
  });
});

const deleteExpense = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    // Check if the expense exists
    const existingExpense = await Prisma.expense.findUnique({
      where: { id },
    });

    // Check if the expense exists
    if (!existingExpense) {
      res.status(404).json({
        success: false,
        error: "Expense not found",
      });
      return;
    }

    // Check if the user is authorized to delete the expense
    if (existingExpense.userId !== userId) {
      res.status(403);
      throw new Error("You are not authorized to delete this expense!");
    }

    // Delete the expense
    await Prisma.expense.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      error: null,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
});

// Export the functions for use in other parts of the application
module.exports = {
  registerExpense,
  getAllexpenses,
  getCategoryExpenses,
  getExpense,
  updateExpense,
  deleteExpense,
};
