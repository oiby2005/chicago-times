const nodemailer = require('../Backend/node_modules/nodemailer');
require('../Backend/node_modules/dotenv').config({ path: '../Backend/.env' });

async function testSMTP() {
  console.log('Testing SMTP connection with settings:');
  console.log('Host:', process.env.SMTP_HOST);
  console.log('Port:', process.env.SMTP_PORT);
  console.log('User:', process.env.SMTP_USER);

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  try {
    await transporter.verify();
    console.log('✅ SMTP Connection Successful! Server is ready to send emails.');

    // Send a test email to self (worldnews@timeschicago.com)
    const info = await transporter.sendMail({
      from: `"Times Chicago Test" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      subject: 'Newsletter SMTP Test Successful',
      text: 'If you see this email in your PrivateEmail inbox, your Chicago Times newsletter distribution system is 100% operational!'
    });

    console.log('✅ Test Email Sent Successfully! Message ID:', info.messageId);
  } catch (error) {
    console.error('❌ SMTP Test Failed:', error);
  }
}

testSMTP();
