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
    try {
      // send mail with defined transport object
      const info = await transporter.sendMail({
        from: '"Do Not Reply" <support@mossy-creations.com>', // sender address
        to: email, // list of receivers
        subject: "Mossy-Creations Password Reset", // Subject line
        html: `
          <!DOCTYPE html>
          <html lang="en">
          <body style="font-family: Arial, sans-serif;">
            <h2>Password Reset</h2>
            <p>We received a request to reset your password. If you did not make this request, you can ignore this email.</p>
            <p>To reset your password, please click on the link below:</p>
            <p><a href="http://localhost:3000/password-reset/${token}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
            <p>If you're having trouble clicking the "Reset Password" button, you can copy and paste the following URL into your web browser:</p>
            <p>http://localhost:3000/password-reset/${token}</p>
          </body>
          </html>
        `, // html body
      });

      console.log("Message sent: %s", info.messageId);
    } catch (error) {
      console.error("Error sending password reset email:", error);
      throw new Error("Failed to send password reset email");
    }
  },

  passResetSuccessEmail: async function (email) {
    try {
      const info = await transporter.sendMail({
        from: '"Do Not Reply" <support@mossy-creations.com>', // sender address
        to: email, // list of receivers
        subject: "Password Reset Successful", // Subject line
        html: `
          <!DOCTYPE html>
          <html lang="en">
          <body style="font-family: Arial, sans-serif;">
            <h2>Password Reset Successful</h2>
            <p>Your password has been successfully reset.</p>
            <p>If you did not perform this action, please change your password immediately.</p>
            <p>Thank you!</p>
          </body>
          </html>
        `, // html body
      });
      console.log("Message sent: %s", info.messageId);
    } catch (error) {
      console.error("Error sending password reset success email:", error);
      throw new Error("Failed to send password reset success email");
    }
  },
};
