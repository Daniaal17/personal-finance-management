const express = require("express");
const UserRoute = require("./user");
const AuthRoute = require("./auth");
const BudgetRoute = require("./budget");
const TransactionRoute = require("./transaction");
const IncomeRoute = require("./income");
const NotificationRoute = require("./notification");


const router = express.Router();

router.use("/user", UserRoute);
router.use("/auth", AuthRoute);
router.use("/budget", BudgetRoute);
router.use("/transactions", TransactionRoute);
router.use("/income", IncomeRoute);

router.use("/notification", NotificationRoute);

module.exports = router;
