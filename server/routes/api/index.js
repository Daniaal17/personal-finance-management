const express = require("express");
const UserRoute = require("./user");
const AuthRoute = require("./auth");
const AdminRoute = require("./admin");
const BudgetRoute = require("./budget");
const TransactionRoute = require("./transaction");
const IncomeRoute = require("./income");

const router = express.Router();

router.use("/user", UserRoute);
router.use("/auth", AuthRoute);
router.use("/admin", AdminRoute);
router.use("/budget", BudgetRoute);
router.use("/transactions", TransactionRoute);
router.use("/income", IncomeRoute);

module.exports = router;
