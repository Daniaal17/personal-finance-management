const { BACKEND_URL } = require("../config");

exports.otpVerifyTemplate = (user) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <link
      href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
      rel="stylesheet"
    />
  </head>

  <body
    style="
      font-family: 'Roboto', sans-serif;
      background-color: #fff;
      color: #212121;
    "
  >
    <table
      width="100%"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
      style="
        max-width: 37.5em;
        padding: 20px;
        margin: 0 auto;
        background-color: #eee;
        border-radius: 16px;
      "
    >
      <tbody>
        <tr style="width: 100%">
          <td>
            <table
              width="100%"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="background-color: #fff;"
            >
              <tbody>
                <tr>
                  <td>
                    <table
                      width="100%"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation"
                      style="padding: 20px 0; text-align: center;"
                    >
                      <tbody>
                        <tr>
                          <td style="text-align: center;">
                            <img src="https://staging.fixtops.org/uploads/publicPics/download.png" style="width: 150px; height: 50px; display: block; margin: 0 auto;">
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table
                      width="100%"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation"
                      style="padding: 0px 35px"
                    >
                      <tbody>
                        <tr>
                          <td>
                            <h1
                              style="
                                color: #041b70;
                                font-size: 20px;
                                font-weight: bold;
                                margin-bottom: 15px;
                                text-align: center;
                              "
                            >
                              
                            </h1>
                            <p
                              style="
                                font-size: 14px;
                                line-height: 24px;
                                margin: 24px 0;
                                color: #333;
                                margin-bottom: 14px;

                              "
                            >
                              Thank you for initiating the account creation
                              process with Personal Finance Management. To complete your registration,
                              please verify the otp below.
                            </p>
                            <table
                              width="100%"
                              cellpadding="0"
                              cellspacing="0"
                              role="presentation"
                              style="margin-top: 24px"
                            >
                              <tbody>
                                <tr>
                                  <td>
                                    <p
                                      style="
                                        font-size: 14px;
                                        line-height: 24px;
                                        margin: 10px 0;
                                        color: #333;
                                        font-weight: bold;
                                        text-align: center;
                                      "
                                    >
                                      <a
                                       
                                        style="
                                          background-color: #041B70;
                                          border-radius: 8px;
                                          text-decoration: none;
                                          padding: 14px 30px;
                                          color: #fff;
                                        "
                                      >
                                       ${user.otp}
                                      </a>
                                    </p>
                                    <p
                                      style="
                                        font-size: 14px;
                                        line-height: 24px;
                                        margin: 20px 0px 0px;
                                        color: #333;
                                        text-align: center;
                                      "
                                    >
                                      (This OTP is valid for 30 minutes)
                                    </p>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <hr
                      style="
                        width: 100%;
                        border: none;
                        border-top: 1px solid #eaeaea;
                      "
                    />
                    <table
                      width="100%"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation"
                      style="padding: 25px 35px"
                    >
                      <tbody>
                        <tr>
                          <td>
                            <p
                              style="
                                font-size: 14px;
                                line-height: 24px;
                                margin: 0px;
                                color: #333;
                              "
                            >
                              Personal Finance Management will never email you and ask you
                              to disclose or verify your password.
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>
`;
};

exports.passwordResetTemplate = (user) => {
  return `
    <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
        <link
            href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
            rel="stylesheet">
    </head>

    <body style="font-family: 'Roboto', sans-serif;background-color:#fff;color:#212121">
        <table width="100%" cellPadding="0" cellSpacing="0" role="presentation"
            style="max-width:37.5em;padding:20px;margin:0 auto;background-color:#eee">
            <tbody>
                <tr style="width:100%">
                    <td>
                        <table width="100%" cellPadding="0" cellSpacing="0" role="presentation"
                            style="background-color:#fff">
                            <tbody>
                                <tr>
                                    <td>
                                        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-image:url('https://ci3.googleusercontent.com/meips/ADKq_NbHy-EDjl6ejtg69nV1jNOHnSHwFBSlE4a93v8edfNFKh6Zi6SCz8zgrhmgeIv-Yrm8Ej_Nf6pmeYKqyHSk7awPfZuUytTDRRacsFvY6pwJ=s0-d-e1-ft#https://staging.fixtops.org/uploads/publicPics/centrus.png');background-position:center;padding:20px 0;text-align:center;background-repeat:no-repeat;height:120px">
                      <tbody></tbody>
                    </table>
                                        <table width="100%" cellPadding="0" cellSpacing="0" role="presentation"
                                            style="padding:25px 35px">
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <h1
                                                            style="color:#333;font-size:20px;font-weight:bold;margin-bottom:15px">
                                                            Forgot your password?</h1>
                                                        <p
                                                            style="font-size:14px;line-height:24px;margin:10px 0;color:#333;margin-bottom:14px">
                                                            That's okay, it happens! Click on the below button to reset your
                                                            password.</p>
                                                        <table width="100%" cellPadding="0" cellSpacing="0"
                                                            role="presentation" style="margin-top:24px;">
                                                            <tbody>
                                                                <tr>
                                                                    <td>
                                                                        <p
                                      style="
                                        font-size: 14px;
                                        line-height: 24px;
                                        margin: 10px 0;
                                        color: #333;
                                        font-weight: bold;
                                        text-align: center;
                                      "
                                    >
                                      <a
                                        href="${BACKEND_URL}/app/api/auth/reset-password/${user.email}/${user?.resetPasswordToken?.value}"
                                        style="
                                          background-color: #041B70;
                                          border-radius: 8px;
                                          text-decoration: none;
                                          padding: 14px 30px;
                                          color: #fff;
                                        "
                                      >
                                        Reset Password
                                      </a>
                                    </p>
                                                                        <p
                                                                            style="font-size:14px;line-height:24px;margin:20px 0px 0px;color:#333;text-align:center">
                                                                            (This link is valid for 30 minutes)</p>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <hr style="width:100%;border:none;border-top:1px solid #eaeaea" />
                                        <table width="100%" cellPadding="0" cellSpacing="0" role="presentation"
                                            style="padding:25px 35px">
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <p style="font-size:14px;line-height:24px;margin:0px;color:#333;">
                                                            Centrus AI will never email you and ask you to disclose
                                                            or verify your password.</p>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <p style="font-size:12px;line-height:24px;margin:24px 0;color:#333;padding:0 20px">© 2024 Centrus AI, Inc. All rights reserved.</p>
                    </td>
                </tr>
            </tbody>
        </table>
    </body>

    </html>
    `;
};

exports.transactionReminder =(user, lastTransactionDate) => {
  return `

  <!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Transaction Logging Reminder</title>
    <!--[if mso]>
    <style>
        table {border-collapse: collapse;}
        td,th,div,p,a,h1,h2,h3,h4,h5,h6 {font-family: Arial, sans-serif;}
    </style>
    <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: Arial, sans-serif;">
    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background-color: #8b5cf6; padding: 32px; text-align: center;">
                                                     <h1  >Finance Management </h1>

                        </td>
                    </tr>

                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 32px;">
                            <h1 style="color: #1f2937; font-size: 24px; margin: 0 0 20px 0;">Transaction Logging Reminder</h1>
                            
                            <p style="color: #4b5563; font-size: 16px; line-height: 24px; margin: 0 0 20px 0;">
                                Hi ${user?.fullName},
                            </p>

                            <p style="color: #4b5563; font-size: 16px; line-height: 24px; margin: 0 0 20px 0;">
                                We noticed you haven't logged any transactions in your budget tracker for the past day. Regular transaction logging helps you stay on top of your finances and maintain accurate budget tracking.
                            </p>

                            <!-- Alert Box -->
                            <table role="presentation" width="100%" style="background-color: #fef2f2; border-radius: 6px; margin: 20px 0;">
                                <tr>
                                    <td style="padding: 16px;">
                                        <p style="color: #991b1b; font-size: 16px; margin: 0;">
                                            ⚠️ Last transaction logged: ${lastTransactionDate}
                                        </p>
                                    </td>
                                </tr>
                            </table>

                         
                 
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
  `
}





