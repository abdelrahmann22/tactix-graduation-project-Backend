import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.ELASTIC_HOST,
  port: process.env.ELASTIC_PORT || 587,
  secure: false,
  auth: {
    user: process.env.ELASTIC_USERNAME,
    pass: process.env.ELASTIC_PASSWORD,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

transporter.verify((err, success) => {
  if (err) {
    console.log("Email transporter verification failed: ", err);
  } else {
    console.log("Email server is ready to send messages");
  }
});

export const sendEmail = async (to, subject, html) => {
  try {
    console.log("Sending email to:", to);
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });
    console.log("Email sent:", info.response);
    return info;
  } catch (err) {
    console.error("Email send failed:", err);
    throw err;
  }
};
