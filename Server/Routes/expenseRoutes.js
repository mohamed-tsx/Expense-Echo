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
router.post("/", Protect, registerExpense);
router.get("/", Protect, getAllexpenses);
router.get("/category", Protect, getCategoryExpenses);
router.get("/:id", Protect, getExpense);
router.put("/:id", Protect, updateExpense);
router.delete("/:id", Protect, deleteExpense);
module.exports = router;
