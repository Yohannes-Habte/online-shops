import nodemailer from "nodemailer";

// Create Email Sender Function
const sendEmail = async (option) => {
  // Create Email transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_SENDER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // Email options for sending
  const mailOptions = {
    from: process.env.EMAIL_SENDER,
    to: option.email,
    subject: option.subject,
    html: option.message,
  };

  // Send Email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export default sendEmail;
