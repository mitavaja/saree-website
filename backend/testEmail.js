import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

transporter
  .sendMail({
    from: process.env.SMTP_EMAIL,
    to: "dharmikdashlani@gmail.com",
    subject: "Test Email",
    text: "This is a test from admin panel OTP setup.",
  })
  .then(() => console.log("Email sent successfully!"))
  .catch((err) => console.error("Email send error:", err));