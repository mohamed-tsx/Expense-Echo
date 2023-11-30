const express = require("express");
const router = express.Router();
const Protect = require("../MiddleWares/userAuthMiddleWare.js");
const {
  registerExpense,
  getAllexpenses,
  getCategoryExpenses,
  getExpense,
  updateExpense,
  deleteExpense,
} = require("../Controllers/expenseControllers.js");

//Expense routes
router.post("/", Protect, registerExpense); // For registering new expense
router.get("/", Protect, getAllexpenses); // For getting all expense for the current user
router.get("/category", Protect, getCategoryExpenses); // For getting all expense which belongs to specified category
router.get("/:id", Protect, getExpense); // For getting one expense
router.put("/:id", Protect, updateExpense); // For updating speciefied expense
router.delete("/:id", Protect, deleteExpense); // For deleting speciefied expense
module.exports = router;
