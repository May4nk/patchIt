import nodemailer from "nodemailer";

export const sendMail = async (email: string, message: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.MAIL_SERVICE,
      auth: {
        user: `${process.env.MAIL_USER}`,
        pass: `${process.env.MAIL_PASS}`,
      },
    });

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Your Magic Login Link",
      text: message,
    };

    await transporter.sendMail(mailOptions);

    return { status: 200, message: "Mail sent successfully" };
  } catch (err) {
    throw err;
  }
};
