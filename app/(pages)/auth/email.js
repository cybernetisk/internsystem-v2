
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.NODEMAILER_NOREPLY_USER,
    pass: process.env.NODEMAILER_NOREPLY_PASSWORD,
  },
});

export const mailOptions = (receiver, html) => {
  return {
    from: {
      name: "CYB Email Verification",
      address: process.env.NODEMAILER_NOREPLY_USER,
    },
    to: [receiver],
    subject: "Please verify your CYB Email",
    html: html,
  }
};
