const nodemailer = require("nodemailer");
const {
  emailVerifyTemplate,
  passwordResetTemplate,
  contactTemplate,
  subscribeTemplate,
} = require("../templates/authTemplates");
const { smtpAuth } = require("../config");

const SENDER_ADDRESS = `Spectrum<${smtpAuth.SMTP_USERNAME}>`;

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
  if (body.verifyEmail) {
    template = emailVerifyTemplate(user);
  } else if (body.resetPassword) {
    template = passwordResetTemplate(user);
  } else if (body.contact) {
    template = contactTemplate(user);
  } else if (body.subscribe) {
    template = subscribeTemplate(user);
  } else {
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

const setFormMessage = (supportEmail, subject, body) => ({
  to: supportEmail,
  from: SENDER_ADDRESS,
  subject,
  html: body,
});

const sendEmail = (user, subject, body) => {
  const transporter = setTransporter();

  let template = "";
  template = selectTemplate(user, body, template);
  let msg;
  if (body.contact) {
    msg = setFormMessage("muhammadsalman2471006@gmail.com", subject, template);
  } else {
    msg = setMessage(user.email, subject, template);
  }

  transporter.sendMail(msg, (err, info) => {
    if (err) console.log("🚀 ~ transporter.sendMail ~ err:", err);
    else console.log("Email sent", info);
  });
};

module.exports = { sendEmail };
