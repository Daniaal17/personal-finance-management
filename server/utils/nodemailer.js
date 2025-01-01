const nodemailer = require("nodemailer");
const {
  otpVerifyTemplate,
  passwordResetTemplate,
  transactionReminder,
} = require("../templates/authTemplates");
const { smtpAuth } = require("../config");

const SENDER_ADDRESS = `Finance<${smtpAuth.SMTP_USERNAME}>`;

const setTransporter = () =>
  nodemailer.createTransport({
    host: "smtp.gmail.com",
    // port: 465,
    port: 587,
    secure: false,
    auth: {
      user: smtpAuth.SMTP_USERNAME,
      pass: smtpAuth.SMTP_PASSWORD,
    },
  });

const selectTemplate = (user, body, template) => {
  if (body.verifyAccount) {
    template = otpVerifyTemplate(user);
  } else if (body.resetPassword) {
    template = passwordResetTemplate(user);
  } else if (body.reminder) {
    template = transactionReminder(user, user.lastTransactionDate)
  }
  
  else {
    console.log("Body Not Valid", body);
  }

  return template;
};

const setMessage = (userEmail, subject, template) => ({
  to: userEmail,
  from: SENDER_ADDRESS,
  subject,
  html: template,
});

const sendEmail = (user, subject, body) => {

  console.log("USer", user)
  console.log("subject", subject)
  console.log("body", body)


  const transporter = setTransporter();

  let template = "";
  template = selectTemplate(user, body, template);
  let msg = setMessage(user.email, subject, template);

  transporter.sendMail(msg, (err, info) => {
    if (err) console.log("🚀 ~ transporter.sendMail ~ err:", err);
    else console.log("Email sent", info);
  });
};

module.exports = { sendEmail };
