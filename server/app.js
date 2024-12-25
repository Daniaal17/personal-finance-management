require("dotenv").config();
const config = require("./config");
const express = require("express");
const mongoose = require("mongoose");
const setupAppConfig = require("./app.config");
// const setupSocketConfig = require("./socket-config");
const AppSocketService = require("./socket");
const runCronJob = require("./utils/cronjob");
const cron = require('node-cron');

const app = express();
setupAppConfig(app);

const server = app.listen(config.port, () => {
  console.log(`🚀 Server is up and running!`);
  console.log(`🌐 Listening on PORT: ${config.port}`);
  console.log(`📅 Started at: ${new Date().toLocaleString()}`);
  console.log(`🎉 Ready to handle requests!`);
});

const appSocketService = new AppSocketService();
appSocketService.start(server);
global.appSocketService = appSocketService;


// Start the cron job immediately for testing
// runCronJob(); // Uncomment this line if you want to run it immediately for testing


// Cron job to run every day at midnight (12 AM)
cron.schedule('0 0 * * *', runCronJob);

// for testing start scheduling immediately
// cron.schedule('* * * * *', runCronJob);


// * * * * *
// | | | | |
// | | | | +---- Day of the week (0 - 6) (Sunday = 0)
// | | | +------ Month (1 - 12)
// | | +-------- Day of the month (1 - 31)
// | +---------- Hour (0 - 23)
// +------------ Minute (0 - 59)


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
