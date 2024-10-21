const path = require("path");
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const compression = require("compression");
const session = require("express-session");
const config = require("./config");

const isProduction = process.env.NODE_ENV === "production";
const { allowedOrigins, dbURL } = config;

module.exports = (app) => {
  app.use(
    cors({
      credentials: true,
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
          const msg =
            "The CORS policy for this site does not allow access from the specified Origin.";
          return callback(new Error(msg), false);
        }
        return callback(null, true);
      },
    })
  );

  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: false, limit: "500mb" }));
  app.use(bodyParser.json({ limit: "500mb" }));
  app.use(express.static(path.join(__dirname, "/public")));
  app.use(
    session({
      secret: config.secret,
      cookie: { maxAge: 60000 },
      resave: false,
      saveUninitialized: false,
    })
  );

  const connectToDatabase = async () => {
    try {
      await mongoose.connect(dbURL);
      console.log(
        `Connected to database in ${
          isProduction ? "production" : "development"
        } environment!`
      );
      if (!isProduction) mongoose.set("debug", true);
    } catch (err) {
      console.error("Error connecting to the database:", err);
    }
  };

  connectToDatabase();

  // Models/Schemas
  require("./models/User");

  // API Routes
  app.use(require("./routes"));

  app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
  });

  const errorHandler = (err, req, res) => {
    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message,
        error: isProduction ? {} : err,
      },
    });
  };

  app.use(errorHandler);
};
