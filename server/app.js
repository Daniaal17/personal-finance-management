require("dotenv").config();
const config = require("./config");
const express = require("express");
const mongoose = require("mongoose");
const setupAppConfig = require("./app.config");
// const setupSocketConfig = require("./socket-config");

const app = express();

setupAppConfig(app);

const server = app.listen(config.port, () => {
  console.log(`🚀 Server is up and running!`);
  console.log(`🌐 Listening on PORT: ${config.port}`);
  console.log(`📅 Started at: ${new Date().toLocaleString()}`);
  console.log(`🎉 Ready to handle requests!`);
});

const gracefulShutdown = (signal) => {
  console.info(`${signal} signal received.`);
  server.close(async () => {
    console.log("Http server closed.");
    await mongoose.connection.close(false);
    console.log("MongoDB connection closed.");
    process.exit(0);
  });
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.once("SIGUSR2", () => gracefulShutdown("SIGUSR2"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
