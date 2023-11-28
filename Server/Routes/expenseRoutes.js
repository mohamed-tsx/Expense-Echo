const express = require("express");
const router = express.Router();
const Protect = require("../MiddleWares/userAuthMiddleWare.js");
const {
  registerExpense,
  getAllexpenses,
} = require("../Controllers/expenseControllers.js");

// @description Registering an expense
// @route /expense/
// @access private
router.post("/", Protect, registerExpense);
router.get("/", Protect, getAllexpenses);

module.exports = router;
