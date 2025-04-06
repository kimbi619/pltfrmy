const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});


async function sendWelcomeEmail(user) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: 'Welcome to Todo App!',
      html: `
      Hello ${user.first_name}, 

      Welcome to kimbi's todo app experimadafada.
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${user.email}`);
    return true;
  } catch (error) {
    return false;
  }
}

module.exports = {
  sendWelcomeEmail
};