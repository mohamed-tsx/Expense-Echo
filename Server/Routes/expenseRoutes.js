const express = require("express");
const router = express.Router();
const Protect = require("../MiddleWares/userAuthMiddleWare.js");
const {
  registerExpense,
  getAllexpenses,
  getCategoryExpenses,
} = require("../Controllers/expenseControllers.js");

//Expense routes
router.post("/", Protect, registerExpense);
router.get("/", Protect, getAllexpenses);
router.get("/category", Protect, getCategoryExpenses);

module.exports = router;
