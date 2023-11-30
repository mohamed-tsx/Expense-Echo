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
router.route("/").post(Protect, registerExpense).get(Protect, getAllexpenses); // For registering new expense and getting all expenses
router.get("/category", Protect, getCategoryExpenses); // For getting all expense which belongs to specified category
router
  .route("/:id")
  .get(Protect, getExpense) // For getting one expense
  .put(Protect, updateExpense) // For updating speciefied expense
  .delete(Protect, deleteExpense); // For deleting speciefied expense
module.exports = router;
