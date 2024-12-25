const User = require('../models/User'); // Adjust to your models
const Transaction = require('../models/Transaction'); // Adjust to your models
const { sendEmail } = require('./nodemailer');



// Function to run the cron job logic
const runCronJob = async () => {
  console.log('Running daily cron job to check for users with no transaction for the past day.');

  try {
    // Get all users
    const users = await User.find(); // You can filter if needed

    // Iterate through each user
    for (const user of users) {
      // Find the most recent transaction for the user
      const lastTransaction = await Transaction.findOne({ user: user._id }).sort({ createdAt: -1 }); // Get the most recent transaction
   console.log("Last transaction" ,lastTransaction)


      // Check if no transaction exists or the last transaction is older than 24 hours
      if (!lastTransaction || new Date() - new Date(lastTransaction.createdAt) > 24 * 60 * 60 * 1000) {
        // Send an email reminder
         sendEmail({ ...user._doc, lastTransactionDate: lastTransaction ? lastTransaction.createdAt : null }, 'Reminder for Transaction', { reminder: true });
      }
    }

    console.log('Cron job completed.');
  } catch (error) {
    console.error('Error during cron job:', error);
  }
};



// Export the cron job for future use
module.exports = runCronJob;
