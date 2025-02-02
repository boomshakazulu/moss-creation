const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.ionos.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "support@mossy-creations.com",
    pass: process.env.EMAIL_PASS_SECRET,
  },
});

module.exports = {
  passResetEmail: async function (email, token) {
    if (!email || !token) {
      return;
    }
    try {
      // send mail with defined transport object
      const info = await transporter.sendMail({
        from: '"Do Not Reply" <support@mossy-creations.com>', // sender address
        to: email, // list of receivers
        subject: "Mossy-Creations Password Reset", // Subject line
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <body style="font-family: Arial, sans-serif; text-align: center;">
          <h2 style="text-align: center;">Password Reset</h2>
          <p style="text-align: center;">We received a request to reset your password. If you did not make this request, you can ignore this email.</p>
          <p style="text-align: center;">To reset your password, please click on the link below:</p>
          <p style="text-align: center;"><a href="https://www.mossy-creations.com/password-reset/${token}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
          <p style="text-align: center;">If you're having trouble clicking the "Reset Password" button, you can copy and paste the following URL into your web browser:</p>
          <p style="text-align: center;">www.mossy-creations.com/password-reset/${token}</p>
        </body>
        </html>
        `,
      });
    } catch (error) {
      console.error("Error sending password reset email:", error);
      throw new Error("Failed to send password reset email");
    }
  },

  passResetSuccessEmail: async function (email) {
    if (!email) {
      return;
    }
    try {
      const info = await transporter.sendMail({
        from: '"Do Not Reply" <support@mossy-creations.com>', // sender address
        to: email, // list of receivers
        subject: "Password Reset Successful", // Subject line
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <body style="font-family: Arial, sans-serif; text-align: center;">
          <h2 style="text-align: center;">Password Reset Successful</h2>
          <p style="text-align: center;">Your password has been successfully reset.</p>
          <p style="text-align: center;">If you did not perform this action, please change your password immediately.</p>
          <p style="text-align: center;">Thank you!</p>
        </body>
        </html>
        `,
      });
    } catch (error) {
      console.error("Error sending password reset success email:", error);
      throw new Error("Failed to send password reset success email");
    }
  },

  trackingNumberEmail: async function (carrier, trackingNum, email) {
    let trackingWebsite;

    if (!email) {
      return;
    }

    switch (carrier) {
      case "UPS":
        trackingWebsite = `https://www.ups.com/track?loc=en_US&tracknum=${trackingNum}`;
        break;
      case "Fedex":
        trackingWebsite = `https://www.fedex.com/apps/fedextrack/?tracknumbers=${trackingNum}`;
        break;
      case "USPS":
        trackingWebsite = `https://tools.usps.com/go/TrackConfirmAction?qtc_tLabels1=${trackingNum}`;
        break;
      default:
        // Handle other carriers if needed
        trackingWebsite = ""; // Default to an empty string
    }
    try {
      const info = await transporter.sendMail({
        from: '"Do Not Reply" <support@mossy-creations.com>',
        to: email,
        subject: "Order Tracking Number",
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <body style="font-family: Arial, sans-serif; text-align: center;">
          <h2 style="text-align: center;">Order Shipped!</h2>
          ${
            trackingNum
              ? `
            <p style="text-align: center;">Your ${carrier} tracking number is</p>
            <p style="text-align: center;">${trackingNum}</p>
            <p style="text-align: center;">To track your order please click on the link below</p>
            <p style="text-align: center;">
              <a href="${trackingWebsite}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">
                Track my package
              </a>
            </p>
            <p style="text-align: center;">If you're having trouble clicking the "Track My Package" button, you can copy and paste the following URL into your web browser:</p>
            <p style="text-align: center;">${trackingWebsite}</p>
          `
              : `
            <p style="text-align: center;">There is no tracking number available at this time.</p>
            <p style="text-align: center;">You will be notified when one is available</p>
          `
          }
          <p style="text-align: center;">Thank You!</p>
        </body>
        </html>
      `,
      });
    } catch (err) {
      console.error("Error sending order tracking email:", err);
      throw new Error("Failed to send order tracking email");
    }
  },
  orderRecievedEmail: async function (email) {
    if (!email) {
      return;
    }

    try {
      const info = await transporter.sendMail({
        from: '"Do Not Reply" <support@mossy-creations.com>',
        to: email,
        subject: "Order Confirmation",
        html: `
         <!DOCTYPE html>
        <html lang="en">
        <body style="font-family: Arial, sans-serif; text-align: center;">
          <h2 style="text-align: center;">We have recieved your order!</h2>
          <p style="text-align: center;">We are working to get this shipped out to you as soon as possible</p>
          <p style="text-align: center;">Once we ship your order you will recieve and email with a tracking number</p>
          <p style="text-align: center;">You may also see the status of your order on the profile page of our website</p>
           <p style="text-align: center;">
              <a href="https://www.mossy-creations.com/profile" style="color: #007bff;">
                www.mossy-creations.com/profile
              </a>
            </p>
            <br>
            <br>
            <p style="text-align: center;">If you didn't submit an order or if you have any questions about your order feel free to contact us at</p>
            <p style="text-align: center;"><a href="mailto:support@mossy-creations.com" style="color: #007bff;">
                support@mossy-creations.com
              </a> </p>
      `,
      });
    } catch (err) {
      console.error("Error sending order order confirmation email:", err);
      throw new Error("Failed to send order confirmation email");
    }
  },
};
