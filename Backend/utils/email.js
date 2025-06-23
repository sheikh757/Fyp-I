require('dotenv').config();
const { MailtrapClient } = require("mailtrap");

const client = new MailtrapClient({
  endpoint: "https://send.api.mailtrap.io",
  token: process.env.MAILTRAP_API_TOKEN,
});

const sender = {
  email: process.env.MAILTRAP_SENDER_EMAIL,
  name: "FlashFit",
};

function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendVerificationEmail(recipientEmail, verificationCode) {
  try {
    const emailHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification</title>
      <style>
      body {
        font-family: 'Arial', sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
      }
      .header {
        text-align: center;
        padding: 20px 0;
        border-bottom: 1px solid #eaeaea;
      }
      .logo {
        max-width: 150px;
        height: auto;
      }
      .content {
        padding: 20px 0;
      }
      .code-container {
        background: #f8f9fa;
        border-radius: 8px;
        padding: 15px;
        text-align: center;
        margin: 20px 0;
        font-size: 24px;
        font-weight: bold;
        color: #2c3e50;
        letter-spacing: 2px;
      }
      .button {
        display: inline-block;
        padding: 12px 24px;
        background-color: #4CAF50;
        color: white;
        text-decoration: none;
        border-radius: 4px;
        font-weight: bold;
        margin: 20px 0;
      }
      .footer {
        margin-top: 30px;
        padding-top: 20px;
        border-top: 1px solid #eaeaea;
        font-size: 12px;
        color: #7f8c8d;
        text-align: center;
      }
      @media only screen and (max-width: 600px) {
        body {
        padding: 10px;
        }
        .code-container {
        font-size: 20px;
        }
      }
      </style>
    </head>
    <body>
      
      
      <div class="content">
      <h2>Verify Your Email Address</h2>
      <p>Thank you for signing up with FlashFit! To complete your registration, please enter the following verification code in the app:</p>
      
      <div class="code-container">
        ${verificationCode}
      </div>
      
      <p>This code will expire in 3 minutes. If you didn't request this code, you can safely ignore this email.</p>
      
      <p>Need help? <a href="mailto:support@flashfit.com">Contact our support team</a></p>
      </div>
      
      <div class="footer">
      <p>&copy; ${new Date().getFullYear()} FlashFit. All rights reserved.</p>
      <p>123 Fitness Street, Health City, HC 12345</p>
      <p>
        <a href="https://flashfit.com/privacy">Privacy Policy</a> | 
        <a href="https://flashfit.com/terms">Terms of Service</a>
      </p>
      </div>
    </body>
    </html>
    `;

    const emailText = `
    Verify Your Email Address
    -------------------------
    
    Thank you for signing up with FlashFit! 
    
    Your verification code is: ${verificationCode}
    
    Please enter this code in the app to complete your registration.
    This code will expire in 30 minutes.
    
    If you didn't request this code, you can safely ignore this email.
    
    Need help? Contact our support team at support@flashfit.com
    
    © ${new Date().getFullYear()} FlashFit. All rights reserved.
    123 Fitness Street, Health City, HC 12345
    `;

    await client.send({
      from: sender,
      to: [{ email: recipientEmail }],
      subject: "Verify Your FlashFit Account",
      text: emailText,
      html: emailHtml,
      category: "Email Verification",
    });
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}

module.exports = {
  generateVerificationCode,
  sendVerificationEmail
};