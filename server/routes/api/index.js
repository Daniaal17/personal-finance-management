const express = require("express");
const UserRoute = require("./user");
const AuthRoute = require("./auth");
const AdminRoute = require("./admin");

const router = express.Router();

router.use("/user", UserRoute);
router.use("/auth", AuthRoute);
router.use("/admin", AdminRoute);

module.exports = router;
