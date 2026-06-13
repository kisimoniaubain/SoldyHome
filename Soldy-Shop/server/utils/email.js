const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  };
  await transporter.sendMail(mailOptions);
};

const sendOrderConfirmation = async (order, user) => {
  const itemsHtml = order.orderItems
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px;border-bottom:1px solid #eee">${item.name}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${item.qty}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">KSh ${(item.price * item.qty).toLocaleString()}</td>
        </tr>`
    )
    .join('');

  await sendEmail({
    to: user.email,
    subject: `Order Confirmed - ${order.invoiceNumber} | Soldy.Shop`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#6366f1;padding:20px;text-align:center">
          <h1 style="color:white;margin:0">Soldy.Shop</h1>
        </div>
        <div style="padding:30px">
          <h2>Order Confirmed! 🎉</h2>
          <p>Hi ${user.name}, your order has been placed successfully.</p>
          <p><strong>Invoice:</strong> ${order.invoiceNumber}</p>
          <table style="width:100%;border-collapse:collapse;margin:20px 0">
            <thead>
              <tr style="background:#f3f4f6">
                <th style="padding:8px;text-align:left">Product</th>
                <th style="padding:8px;text-align:center">Qty</th>
                <th style="padding:8px;text-align:right">Total</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>
          <div style="text-align:right;margin-top:10px">
            <strong>Total: KSh ${order.totalPrice.toLocaleString()}</strong>
          </div>
          <p style="margin-top:20px">Payment Method: ${order.paymentMethod.toUpperCase()}</p>
          <p>We'll notify you when your order ships!</p>
        </div>
        <div style="background:#f3f4f6;padding:15px;text-align:center;font-size:12px;color:#666">
          © 2026 Soldy.Shop. All rights reserved.
        </div>
      </div>
    `,
  });
};

const sendPasswordReset = async (user, resetUrl) => {
  await sendEmail({
    to: user.email,
    subject: 'Password Reset Request | Soldy.Shop',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#6366f1;padding:20px;text-align:center">
          <h1 style="color:white;margin:0">Soldy.Shop</h1>
        </div>
        <div style="padding:30px">
          <h2>Password Reset</h2>
          <p>Hi ${user.name}, you requested to reset your password.</p>
          <p>Click the button below to reset it. This link expires in 10 minutes.</p>
          <a href="${resetUrl}" style="display:inline-block;background:#6366f1;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;margin:20px 0">
            Reset Password
          </a>
          <p style="color:#666;font-size:14px">If you didn't request this, ignore this email.</p>
        </div>
      </div>
    `,
  });
};

module.exports = { sendEmail, sendOrderConfirmation, sendPasswordReset };
