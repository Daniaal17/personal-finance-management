const { BACKEND_URL } = require("../config");

exports.emailVerifyTemplate = (user) => {
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
                            <img src="https://staging.fixtops.org/uploads/publicPics/centrus.png" style="width: 150px; height: 50px; display: block; margin: 0 auto;">
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
                              Verify Your Email Address
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
                              process with Centrus AI. To confirm your
                              email address and complete your registration,
                              please click the button below.
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
                                        href="${BACKEND_URL}/app/api/auth/verify-email/${user?.mailToken?.value}"
                                        style="
                                          background-color: #041B70;
                                          border-radius: 8px;
                                          text-decoration: none;
                                          padding: 14px 30px;
                                          color: #fff;
                                        "
                                      >
                                        Confirm registration
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
                                      (This link is valid for 30 minutes)
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
                              Centrus AI will never email you and ask you
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
            <p
              style="
                font-size: 12px;
                line-height: 24px;
                margin: 24px 0;
                color: #333;
                padding: 0 20px;
              "
            >
              © 2024 Centrus AI, Inc. All rights reserved.
            </p>
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

exports.contactTemplate = (user) => {
	return `
  <!DOCTYPE html>
<html lang="en">

<head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <link
        href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
        rel="stylesheet" />
</head>

<body style="
      font-family: 'Roboto', sans-serif;
      background-color: #fff;
      color: #212121;
    ">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="
        max-width: 37.5em;
        padding: 20px;
        margin: 0 auto;
        background-color: #eee;
        border-radius: 16px;
      ">
        <tbody>
            <tr style="width: 100%">
                <td>
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
                        style="background-color: #fff; ">
                        <tbody>
                            <tr>
                                <td>
                                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="
                        background-image: url('https://staging.fixtops.org/uploads/publicPics/centrus.png');
                        background-position: center;
                     
                        padding: 20px 0;
                        text-align: center;
                        margin
                        background-repeat: no-repeat;
                        height: 100px;
                      ">
                                        <tbody></tbody>
                                    </table>
                                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
                                        style="padding:0px 35px 25px 35px">
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <h1 style="
                                color: #333;
                                font-size: 20px;
                                font-weight: bold;
                                margin-bottom: 5px;
                              ">
                                                        ${user.fname} ${user.lname}
                                                    </h1>
                                                    <p style="
                                font-size: 14px;
                                line-height: 24px;
                                margin: 5px 0;
                                color: #a2a2a2;
                                margin-bottom: 14px;

                              ">
                                                        ${new Date()
																													.toLocaleString("en-US", {
																														month: "short",
																														day: "numeric",
																														year: "numeric",
																														hour: "numeric",
																														minute: "numeric",
																														timeZone: "UTC",
																														timeZoneName: "short",
																													})
																													.replace("GMT", "UTC")}
                                                    </p>
                                                    <p style="
                                color: #333;
                                font-size: 14px;
                                font-weight: bold;
                                margin-top: 20px;
                                margin-bottom: 14px;

                              ">
                                                        Email:
                                                        <a style="font-weight: 400;color: blue;">
                                                            &nbsp;${user.email}
                                                        </a>
                                                    </p>
                                                    <p style="
                                color: #333;
                                font-size: 14px;
                                font-weight: bold;
                                margin-bottom: 14px;

                              ">
                                                        Phone Number:
                                                        <span style="font-weight: 400;">
                                                            &nbsp;${user.phone}
                                                        </span>
                                                    </p>
                                                    <p style="
                                color: #333;
                                font-size: 14px;
                                font-weight: bold;
                                margin-bottom: 14px;

                              ">
                                                        Company:
                                                        <span style="font-weight: 400;">
                                                            &nbsp;${user.company}
                                                        </span>
                                                    </p>
                                                    <p style="
                                color: #333;
                                font-size: 14px;
                                font-weight: bold;
                                margin-bottom: 14px;

                              ">
                                                        Industry:
                                                        <span style="font-weight: 400;">
                                                            &nbsp;${user.industry}
                                                        </span>
                                                    </p>
                                                    <p style="
                                color: #333;
                                font-size: 14px;
                                font-weight: bold;
                                margin-bottom: 14px;

                              ">
                                                        Message:

                                                    </p>
                                                    <div style="font-weight: 400;font-size: 14px;">
                                                        ${user.message}
                                                    </div>

                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <p style="
                font-size: 12px;
                line-height: 24px;
                margin: 24px 0;
                color: #333;
                padding: 0 20px;
              ">
                        © 2024 Centrus AI, Inc. All rights reserved.
                    </p>
                </td>
            </tr>
        </tbody>
    </table>
</body>

</html>
  `;
};

exports.subscribeTemplate = (user) => {
	return `
  <!DOCTYPE html>
<html lang="en">

<head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <link
        href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
        rel="stylesheet" />
</head>

<body style="
      font-family: 'Roboto', sans-serif;
      background-color: #fff;
      color: #212121;
    ">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="
        max-width: 37.5em;
        padding: 20px;
        margin: 0 auto;
        background-color: #eee;
        border-radius: 16px;
      ">
        <tbody>
            <tr style="width: 100%">
                <td>
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
                        style="background-color: #fff; ">
                        <tbody>
                            <tr>
                                <td>
                                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="
                        background-image: url('https://staging.fixtops.org/uploads/publicPics/centrus.png');
                        background-position: center;
                     
                        padding: 20px 0;
                        text-align: center;
                        background-repeat: no-repeat;
                        height: 100px;
                      ">
                                        <tbody></tbody>
                                    </table>
                                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
                                        style="padding:0px 35px 25px 35px">
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <h1 style="
                                color: #333;
                                font-size: 20px;
                                font-weight: bold;
                                margin-bottom: 15px;
                                text-align: center;
                              ">
                                                        Welcome to Centrus AI Newsletter
                                                    </h1>
                                                    <p style="
                                font-size: 14px;
                                line-height: 24px;
                                margin: 24px 0;
                                color: #333;
                                margin-bottom: 14px;

                              ">
                                                        Hi ${user.name}! <br> Thank you for subscribing to our newsletter! We’re excited to have you join our community. Expect to receive useful insights and updates.
                                                    </p>

                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <hr style="
                        width: 100%;
                        border: none;
                        border-top: 1px solid #eaeaea;
                      " />
                                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
                                        style="padding: 25px 35px">
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <p style="
                                font-size: 14px;
                                line-height: 24px;
                                margin: 0px;
                                color: #333;
                              ">
                                                        If you did not mean to subscribe, you can unsubscribe at any time. Centrus AI will never email you asking to verify your password.
                                                    </p>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <p style="
                font-size: 12px;
                line-height: 24px;
                margin: 24px 0;
                color: #333;
                padding: 0 20px;
              ">
                        © 2024 Centrus AI, Inc. All rights reserved.
                    </p>
                </td>
            </tr>
        </tbody>
    </table>
</body>

</html>
  `;
};

exports.appJoinTemplate = (user) => {
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
              style="background-color: #fff; "
             

            >
              <tbody>
                <tr>
                  <td>
                    <table
                      width="100%"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation"

                      style="
                        background-image: url('https://staging.fixtops.org/uploads/publicPics/centrus.png');
                        background-position: center;
                     
                        padding: 20px 0;
                        text-align: center;
                        background-repeat: no-repeat;
                        height: 120px;
                      "
                    >
                      <tbody></tbody>
                    </table>
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
                            <h1
                              style="
                                color: #333;
                                font-size: 20px;
                                font-weight: bold;
                                margin-bottom: 15px;
                                text-align: center;
                              "
                            >
                              Join Centrus AI
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
                              Hi ${user.fname},
                            </p>
                            <p
                              style="
                                font-size: 14px;
                                line-height: 24px;
                                margin: 24px 0;
                                color: #333;
                                margin-bottom: 14px;

                              "
                            >
                              You have been invited to join Centrus AI, the AI-Powered Business Expert that learns from your company data and is available to support your team 24/7. It’s like Alexa for your business.
                            </p>
                            <p
                              style="
                                font-size: 14px;
                                line-height: 24px;
                                margin: 24px 0;
                                color: #333;
                                margin-bottom: 14px;

                              "
                            >
                              To get started, please confirm your registration by clicking the button below:
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
                                        href="${BACKEND_URL}/app/api/auth/verify-email/${user?.mailToken?.value}"
                                        style="
                                          background-color: #041B70;
                                          border-radius: 8px;
                                          text-decoration: none;
                                          padding: 14px 30px;
                                          color: #fff;
                                        "
                                      >
                                        Confirm registration
                                      </a>
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
                              Centrus AI will never email you and ask you
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
            <p
              style="
                font-size: 12px;
                line-height: 24px;
                margin: 24px 0;
                color: #333;
                padding: 0 20px;
              "
            >
              © 2024 Centrus AI, Inc. All rights reserved.
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>`;
};
