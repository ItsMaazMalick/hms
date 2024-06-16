"use server";
import nodemailer from "nodemailer";
import { generateOTP } from "./generateOTP";
export const sendOTP = async ({
  name,
  email,
}: {
  name: string;
  email: string;
}) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const OTP = generateOTP(6);

  const mailOptions = {
    from: `Gyros'N More ${process.env.SMTP_EMAIL}`,
    to: email,
    subject: "OTP Verification",
    html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; text-align: center;">
    <p style="font-size: 16px;">Hi <strong>${name}</strong>,</p>
    <p style="font-size: 16px;">Please use the following One Time Password (OTP) to access the form:</p>
    <p style="font-size: 24px; color: #4CAF50; "><strong>${OTP}</strong></p>
    <p style="font-size: 16px;">Do not share this OTP with anyone.</p>
    <p style="font-size: 16px;">Thank you!</p>
  </div>`,
  };

  const sendMail = await transporter.sendMail(mailOptions);
  if (!sendMail) {
    return {
      status: 401,
      success: false,
      message: "Something went wrong",
    };
  }
  return {
    status: 200,
    success: true,
    OTP,
  };
};
