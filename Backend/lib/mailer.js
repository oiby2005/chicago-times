const nodemailer = require('nodemailer');

/**
 * Centralized Transporter Helper - Reusable across Auth, Newsletters, Contact & Admin
 */
const getEmailTransporter = () => {
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  const senderName = process.env.SMTP_SENDER_NAME || 'Times Chicago News';

  if (gmailUser && gmailPass) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: gmailUser, pass: gmailPass },
    });
    const fromEmail = { name: senderName, address: gmailUser };
    return { transporter, fromEmail };
  }

  const host = process.env.SMTP_HOST || process.env.MAIL_HOST || 'mail.privateemail.com';
  const user = process.env.SMTP_USER || process.env.MAIL_USER || 'worldnews@timeschicago.com';
  const pass = process.env.SMTP_PASS || process.env.MAIL_PASS;
  const port = Number(process.env.SMTP_PORT || process.env.MAIL_PORT || 587);

  if (host && user && pass) {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      tls: { rejectUnauthorized: false },
    });
    const fromEmail = { name: senderName, address: user };
    return { transporter, fromEmail };
  }

  // Fallback dev transporter
  const fallbackTransporter = {
    sendMail: async (options) => {
      console.log('--- [DEV MOCK EMAIL] ---');
      console.log('To:', options.to);
      console.log('Subject:', options.subject);
      console.log('------------------------');
      return { messageId: 'mock-mail-id' };
    },
  };
  return { transporter: fallbackTransporter, fromEmail: { name: senderName, address: 'no-reply@timeschicago.com' } };
};

/**
 * Send Password Reset Email with Times Chicago styling
 */
async function sendPasswordResetEmail({ name, email, resetToken, resetUrl }) {
  try {
    const { transporter, fromEmail } = getEmailTransporter();
    const recipientName = name && name.trim() ? name.trim() : 'Reader';

    const mailOptions = {
      from: fromEmail,
      to: email,
      subject: 'Reset Your Times Chicago Password',
      html: `
        <div style="background-color: #FCFAF2; padding: 40px 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; min-height: 100%;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #EAE6DA; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.04);">
            
            <!-- Header Brand -->
            <div style="padding: 28px 24px; text-align: center; border-bottom: 1px solid #F1ECE1; background-color: #FCFAF2;">
              <h2 style="font-family: Georgia, 'Times New Roman', serif; font-size: 26px; font-weight: bold; color: #111111; margin: 0; letter-spacing: 0.5px;">
                TIMES CHICAGO
              </h2>
              <p style="font-size: 11px; font-weight: 700; color: #718096; margin: 4px 0 0 0; text-transform: uppercase; letter-spacing: 1px;">
                Security & Authentication Desk
              </p>
            </div>

            <!-- Body Content -->
            <div style="padding: 36px 32px; color: #2D3748; line-height: 1.6;">
              <h1 style="font-family: Georgia, 'Times New Roman', serif; font-size: 22px; font-weight: bold; color: #1A202C; margin-top: 0; margin-bottom: 20px;">
                Password Reset Request
              </h1>

              <p style="font-size: 15px; color: #4A5568; margin-bottom: 16px;">
                Hello <strong>${recipientName}</strong>,
              </p>

              <p style="font-size: 15px; color: #4A5568; margin-bottom: 24px;">
                We received a request to reset the password associated with your Times Chicago account (<strong>${email}</strong>). Click the secure button below to choose a new password:
              </p>

              <!-- CTA Button -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="${resetUrl}" target="_blank" style="display: inline-block; background-color: #00558C; color: #FFFFFF !important; font-size: 14px; font-weight: 700; letter-spacing: 0.5px; text-decoration: none !important; padding: 14px 36px; border-radius: 6px; box-shadow: 0 2px 6px rgba(0,85,140,0.3);">
                  <span style="color: #FFFFFF !important; text-decoration: none !important;">RESET PASSWORD</span>
                </a>
              </div>

              <!-- Expiry Alert -->
              <div style="background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 12px 16px; margin: 24px 0; border-radius: 4px;">
                <p style="margin: 0; font-size: 13px; color: #92400E; line-height: 1.5;">
                  <strong>Important:</strong> This password reset link is strictly valid for <strong>1 hour</strong>. If the link expires, you will need to submit a new request.
                </p>
              </div>

              <!-- Fallback Link -->
              <p style="font-size: 13px; color: #718096; margin-top: 24px; margin-bottom: 8px;">
                If the button above does not work, copy and paste this link into your browser:
              </p>
              <p style="font-size: 12px; color: #00558C; word-break: break-all; margin: 0 0 24px 0;">
                <a href="${resetUrl}" target="_blank" style="color: #00558C; text-decoration: underline;">${resetUrl}</a>
              </p>

              <!-- Security Disclaimer -->
              <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 28px 0;" />
              <p style="font-size: 13px; color: #718096; margin-bottom: 0;">
                If you did not make this request, you can safely disregard this email. Your account remains completely secure and your password will not be changed without your permission.
              </p>
            </div>

            <!-- Footer -->
            <div style="padding: 20px 24px; text-align: center; border-top: 1px solid #F1ECE1; background-color: #FCFAF2; font-size: 12px; color: #718096;">
              <p style="margin: 0 0 4px 0;">
                &copy; 2026 <strong>Times Chicago</strong> Media Inc. All Rights Reserved.
              </p>
              <p style="margin: 0;">
                Times Chicago Security Desk &bull; 200 W Madison St, Chicago, IL 60606
              </p>
            </div>

          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[PASSWORD RESET EMAIL SENT] to ${email} (Message ID: ${info?.messageId || 'OK'})`);
    return info;
  } catch (err) {
    console.warn(`[PASSWORD RESET EMAIL NOTICE] Failed to send email to ${email}:`, err.message);
    throw err;
  }
}

/**
 * Send Contributor Warning Email (Triggered from Day 5 if articles remaining)
 */
async function sendContributorWarningEmail({ name, email, remainingArticles, daysLeft, weeklyTarget = 4 }) {
  try {
    const { transporter, fromEmail } = getEmailTransporter();
    const recipientName = name && name.trim() ? name.trim() : 'Contributor';

    const mailOptions = {
      from: fromEmail,
      to: email,
      subject: `Weekly Alert: You Have ${remainingArticles} More Article${remainingArticles > 1 ? 's' : ''} to Publish This Week - Times Chicago`,
      html: `
        <div style="background-color: #F8F9FA; padding: 40px 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; min-height: 100%;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #EAE6DA; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
            
            <!-- Header Brand matching Times Chicago standard -->
            <div style="padding: 24px 24px 18px 24px; text-align: center; border-bottom: 1px solid #F1ECE1; background-color: #FFFFFF;">
              <p style="margin: 0 0 12px 0;">
                <a href="https://timeschicago.com" target="_blank" style="font-family: Arial, sans-serif; font-size: 13px; font-weight: bold; color: #718096 !important; text-decoration: none !important; letter-spacing: 0.5px;">
                  <span style="color: #718096 !important; text-decoration: none !important;">timeschicago.com</span>
                </a>
              </p>
              <a href="https://timeschicago.com" target="_blank" style="text-decoration: none;">
                <img src="https://f005.backblazeb2.com/file/timeschicago/branding/exact_timeschicago_logo.jpg" alt="Times Chicago" style="max-width: 280px; width: 100%; height: auto; display: block; margin: 0 auto; border: 0;" />
              </a>
            </div>

            <!-- Body Content -->
            <div style="padding: 36px 32px; color: #2D3748; line-height: 1.6;">
              <h1 style="font-family: Georgia, 'Times New Roman', serif; font-size: 24px; font-weight: bold; color: #111111; margin-top: 0; margin-bottom: 22px;">
                Weekly alert
              </h1>

              <p style="font-size: 15px; color: #4A5568; margin-bottom: 16px;">
                Dear <strong>${recipientName}</strong>,
              </p>

              <p style="font-size: 15px; color: #4A5568; margin-bottom: 16px;">
                This is an urgent reminder regarding your contributor publishing commitment for this 7-day cycle.
              </p>

              <!-- Warning Box -->
              <div style="background-color: #FFF5F5; border-left: 4px solid #E53E3E; padding: 18px 20px; margin: 24px 0; border-radius: 6px;">
                <p style="margin: 0 0 6px 0; font-size: 16px; font-weight: bold; color: #9B2C2C;">
                  You have <span style="font-size: 18px; color: #E53E3E;">${remainingArticles}</span> more article${remainingArticles > 1 ? 's' : ''} left to publish this week.
                </p>
                <p style="margin: 0; font-size: 13.5px; color: #742A2A; line-height: 1.5;">
                  Days remaining in this cycle: <strong>${daysLeft} day${daysLeft === 1 ? '' : 's'}</strong><br/>
                  Weekly minimum requirement: <strong>${weeklyTarget} published articles</strong>
                </p>
              </div>

              <p style="font-size: 14px; color: #4A5568; margin-bottom: 20px;">
                As a Contributor on Times Chicago, you are required to publish a minimum of <strong>4 articles per week</strong> and <strong>16 articles per month</strong>. If you do not publish the required minimum within the remaining ${daysLeft} day${daysLeft === 1 ? '' : 's'}, <strong>your account will be automatically suspended</strong> and you will not be able to sign in.
              </p>

              <!-- CTA Button -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="http://localhost:3000/author-workspace/create-post" target="_blank" style="display: inline-block; background-color: #00558C; color: #FFFFFF !important; font-size: 14px; font-weight: 700; letter-spacing: 0.5px; text-decoration: none !important; padding: 14px 36px; border-radius: 6px; box-shadow: 0 2px 6px rgba(0,85,140,0.3);">
                  <span style="color: #FFFFFF !important; text-decoration: none !important;">SUBMIT ARTICLE NOW</span>
                </a>
              </div>

              <p style="font-size: 13px; color: #718096; margin-top: 24px; line-height: 1.5;">
                Need help or editorial clarification? Reach out directly to our administration team at <a href="mailto:worldnews@timeschicago.com" style="color: #00558C;">worldnews@timeschicago.com</a>.
              </p>
            </div>

            <!-- Footer -->
            <div style="padding: 20px 24px; text-align: center; border-top: 1px solid #F1ECE1; background-color: #FCFAF2; font-size: 12px; color: #718096;">
              <p style="margin: 0 0 4px 0;">
                &copy; 2026 <strong>Times Chicago LLC</strong>. All Rights Reserved.
              </p>
              <p style="margin: 0;">
                You received this email because you subscribed to Times Chicago.
              </p>
            </div>

          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[CONTRIBUTOR WARNING EMAIL SENT] to ${email} (Message ID: ${info?.messageId || 'OK'})`);
    return info;
  } catch (err) {
    console.warn(`[CONTRIBUTOR WARNING EMAIL NOTICE] Failed to send email to ${email}:`, err.message);
  }
}

/**
 * Send Contributor Suspension Email (Triggered when quota failed)
 */
async function sendContributorSuspensionEmail({ name, email, weeklyPublished = 0, weeklyTarget = 4 }) {
  try {
    const { transporter, fromEmail } = getEmailTransporter();
    const recipientName = name && name.trim() ? name.trim() : 'Contributor';

    const mailOptions = {
      from: fromEmail,
      to: email,
      subject: 'Account Suspended: Contributor Article Quota Not Met - Times Chicago',
      html: `
        <div style="background-color: #FCFAF2; padding: 40px 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; min-height: 100%;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #EAE6DA; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.04);">
            <div style="padding: 24px 24px 18px 24px; text-align: center; border-bottom: 1px solid #F1ECE1; background-color: #FFFFFF;">
              <p style="margin: 0 0 12px 0;">
                <a href="https://timeschicago.com" target="_blank" style="font-family: Arial, sans-serif; font-size: 13px; font-weight: bold; color: #718096 !important; text-decoration: none !important; letter-spacing: 0.5px;">
                  <span style="color: #718096 !important; text-decoration: none !important;">timeschicago.com</span>
                </a>
              </p>
              <a href="https://timeschicago.com" target="_blank" style="text-decoration: none;">
                <img src="https://f005.backblazeb2.com/file/timeschicago/branding/exact_timeschicago_logo.jpg" alt="Times Chicago" style="max-width: 280px; width: 100%; height: auto; display: block; margin: 0 auto; border: 0;" />
              </a>
            </div>
            <div style="padding: 36px 32px; color: #2D3748; line-height: 1.6;">
              <h1 style="font-family: Georgia, 'Times New Roman', serif; font-size: 22px; font-weight: bold; color: #C53030; margin-top: 0;">
                Contributor Account Suspended
              </h1>
              <p style="font-size: 15px; color: #4A5568;">
                Dear <strong>${recipientName}</strong>,
              </p>
              <p style="font-size: 14px; color: #4A5568;">
                Your Contributor account (<strong>${email}</strong>) has been automatically suspended because the mandatory publication quota was not completed before the 7-day cycle deadline (Published: <strong>${weeklyPublished} of ${weeklyTarget}</strong> articles).
              </p>
              <div style="background-color: #FEF2F2; border-left: 4px solid #EF4444; padding: 14px 18px; margin: 20px 0; border-radius: 6px;">
                <p style="margin: 0; font-size: 13.5px; color: #991B1B;">
                  Your sign-in access is currently restricted. To request an account review and unblock, please contact administration via email.
                </p>
              </div>
              <div style="text-align: center; margin: 28px 0;">
                <a href="mailto:worldnews@timeschicago.com?subject=Contributor%20Account%20Reactivation%20Request%20-%20${encodeURIComponent(email)}" style="display: inline-block; background-color: #C53030; color: #FFFFFF !important; font-size: 13px; font-weight: 700; text-decoration: none; padding: 13px 30px; border-radius: 6px;">
                  EMAIL ADMINISTRATION TO UNBLOCK
                </a>
              </div>
              <p style="font-size: 13px; color: #718096; margin-top: 24px;">
                Administration: <a href="mailto:worldnews@timeschicago.com" style="color: #00558C;">worldnews@timeschicago.com</a>
              </p>
            </div>
          </div>
        </div>
      `,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log(`[CONTRIBUTOR SUSPENSION EMAIL SENT] to ${email}`);
    return info;
  } catch (err) {
    console.warn(`[CONTRIBUTOR SUSPENSION EMAIL NOTICE] Failed to send email to ${email}:`, err.message);
  }
}

module.exports = {
  getEmailTransporter,
  sendPasswordResetEmail,
  sendContributorWarningEmail,
  sendContributorSuspensionEmail,
};
