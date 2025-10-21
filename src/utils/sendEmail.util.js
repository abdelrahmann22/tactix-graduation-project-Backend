import nodemailer from "nodemailer";
import dotenv from "dotenv";
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

export const sendEmail = async (to, subject, html) => {
  try {
    await transporter.verify();
    console.log("SMTP server is ready to send emails.");

    console.log("sending Email To", to);
    console.log("sending Email from", process.env.EMAIL_FROM);
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });
    console.log("Email Successfully sent ! :", info);
  } catch (err) {
    console.log("Error in sending Email : ", err);
    throw err;
  }
};
// import nodemailer from "nodemailer";
// import dotenv from "dotenv";

// dotenv.config();

// const transporter = nodemailer.createTransport({
//   host: process.env.ELASTIC_HOST,
//   port: process.env.ELASTIC_PORT || 587,
//   secure: false,
//   auth: {
//     user: process.env.ELASTIC_USERNAME,
//     pass: process.env.ELASTIC_PASSWORD,
//   },
//   connectionTimeout: 10000,
//   greetingTimeout: 10000,
//   socketTimeout: 10000,
// });

// transporter.verify((err, success) => {
//   if (err) {
//     console.log("Email transporter verification failed: ", err);
//   } else {
//     console.log("Email server is ready to send messages");
//   }
// });

// export const sendEmail = async (to, subject, html) => {
//   try {
//     console.log("Sending email to:", to);
//     const info = await transporter.sendMail({
//       from: process.env.EMAIL_FROM,
//       to,
//       subject,
//       html,
//     });
//     console.log("Email sent:", info.response);
//     return info;
//   } catch (err) {
//     console.error("Email send failed:", err);
//     throw err;
//   }
// };
