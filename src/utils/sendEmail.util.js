import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { Resend } from "resend";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const resend = new Resend(process.env.RESEND_API_KEY);
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
  } catch (err) {
    console.error("Email send failed:", err);
    throw err;
  }
};

export const sendEmailUsingResend = async (to, subject, html) => {
  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error("Email send failed From Resend:", err);
    throw err;
  }
};
