import nodemailer from "nodemailer";
const siteTitle = "TEAM HMS";
export async function sendVerificationEmail(email: string, token: string) {
  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const confirmLink = `${process.env.DOMAIN}//verifyEmail?token=${token}`;

  const mailOptions = {
    from: `${siteTitle} itsmaazmalick@gmail.com`,
    to: email,
    subject: "Verify your email",
    html: `<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; text-align: center; background-color: #f4f4f4; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
    <h2 style="color: #333; margin-bottom: 20px; font-size: 28px; font-weight: bold;">Welcome to ${siteTitle}</h2>
    <p style="color: #666; font-size: 16px; line-height: 1.6;">Hello There,</p>
    <p style="color: #666; font-size: 16px; line-height: 1.6;">Thank you for signing up with us. To activate your account, please click the button below:</p>
    <a href="${confirmLink}" style="display: inline-block; padding: 12px 24px; background-color: #1E603F; color: #fff; text-decoration: none; font-size: 18px; border-radius: 5px; border: 2px solid #1E603F; transition: background-color 0.3s;">Verify Email</a>
    <p style="color: #666; font-size: 16px; line-height: 1.6; margin-top: 20px;">Having trouble with the button? Simply copy and paste the link below into your browser:</p>
    <p style="color: #1E603F; margin-top: 10px; font-size: 14px; line-height: 1.6;">${confirmLink}</p>
    <p style="color: #666; margin-top: 20px; font-size: 14px; line-height: 1.6;">Best Regards,</p>
    <p style="color: #666; margin-top: 10px; font-size: 14px; line-height: 1.6;">${siteTitle}</p>
  </div>
  `,
  };
  const mailResponse = await transporter.sendMail(mailOptions);
  return mailResponse;
}
