const { oaut2Client } = require('./oauth2');
const nodeMailer = require('nodemailer');
const ejs = require('ejs');

// set credential
oaut2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const sendEmail = async ({ to, subject, html }) => {
  console.log(to);
  try {
    const accessToken = await oaut2Client.getAccessToken();
    const transport = nodeMailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.GOOGLE_SENDER_EMAIL,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    const email = await transport.sendMail({ to, subject, html });

    console.log('Email untuk ' + email.envelope.to + ' terkirim');
  } catch (error) {
    console.log(error);
  }
};

module.exports = { sendEmail };
