const asyncHandler = require('express-async-handler');
const { sendEmail } = require('../utils/email');

const CONTACT_FORM_RECEIVER = process.env.CONTACT_FORM_RECEIVER || 'kisimoniaubain@gmail.com';

const escapeHtml = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

// @desc    Send contact form email
// @route   POST /api/contact
// @access  Public
const sendContactMessage = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    res.status(400);
    throw new Error('Please fill in all contact form fields');
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br/>');

  await sendEmail({
    to: CONTACT_FORM_RECEIVER,
    subject: `[SoldyHome Contact] ${subject}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto">
        <h2 style="margin:0 0 12px 0;color:#111827">New Get In Touch Message</h2>
        <p style="margin:0 0 8px 0"><strong>From:</strong> ${safeName}</p>
        <p style="margin:0 0 8px 0"><strong>Email:</strong> ${safeEmail}</p>
        <p style="margin:0 0 12px 0"><strong>Subject:</strong> ${safeSubject}</p>
        <div style="padding:12px;border:1px solid #e5e7eb;border-radius:8px;background:#f9fafb">
          ${safeMessage}
        </div>
      </div>
    `,
  });

  res.status(200).json({ success: true, message: 'Message sent successfully' });
});

module.exports = { sendContactMessage };
