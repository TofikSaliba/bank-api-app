import nodemailer from "nodemailer";

export const sendEmail = async (email, key) => {
  try {
    let transporter = nodemailer.createTransport({
      host: "smtp-mail.outlook.com",
      secureConnection: false,
      port: 587,
      tls: {
        ciphers: "SSLv3",
      },
      auth: {
        user: "tofik.api@hotmail.com",
        pass: "ts1234567",
      },
    });

    const options = {
      from: '"Bank API 🔑" <tofik.api@hotmail.com>',
      to: email,
      subject: "Your API Key",
      text: `Your API key is: ${key}`,
      html: `<h1>Your API key is: ${key}</h1>`,
    };

    let info = await transporter.sendMail(options);
    console.log("Message sent: %s", info.messageId);
  } catch (err) {
    console.log(err);
    throw new Error(
      "There was a problem generating your API Key, please try again!"
    );
  }
};
