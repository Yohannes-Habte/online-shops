import nodemailer from 'nodemailer';

// Create Email Sender Function
const sendEmail = async (option) => {
  // Create Email transporter that sends email to the user
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

  // Options for sending Email
  const options = {
    from: process.env.EMAIL_SENDER,
    to: option.email,
    subject: option.subject,
    html: option.message,
  };

  // Send Email
  await transporter.sendMail(options, function (err, infos) {
    if (err) {
      console.log(err);
    } else {
      console.log(infos);
    }
  });
};

export default sendEmail;
