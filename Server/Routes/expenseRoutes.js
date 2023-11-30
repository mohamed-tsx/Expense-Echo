const express = require("express");
const router = express.Router();
const Protect = require("../MiddleWares/userAuthMiddleWare.js");
const {
  registerExpense,
  getAllexpenses,
  getCategoryExpenses,
  getExpense,
} = require("../Controllers/expenseControllers.js");

//Expense routes
router.post("/", Protect, registerExpense);
router.get("/", Protect, getAllexpenses);
router.get("/category", Protect, getCategoryExpenses);
router.get("/:id", Protect, getExpense);
module.exports = router;
