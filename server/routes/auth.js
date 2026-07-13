const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    },
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,
    socketTimeout: 10000
  });
};

// @route   POST /api/auth/send-otp
// @desc    Generate and send OTP
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Find user or create if not exists
    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      user = new User({ email: email.toLowerCase() });
    }

    user.otp = otp;
    user.otpExpires = otpExpires;
    user.isVerified = false;
    await user.save();

    // Log the OTP for easy local debugging if email is not configured
    console.log(`[AUTH] Generated OTP for ${email}: ${otp}`);

    const isProd = process.env.NODE_ENV === 'production';

    // Try sending email via Gmail SMTP (asynchronously in background)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = createTransporter();
      const mailOptions = {
        from: `"QRGen Visiting Cards" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your QRGen Authentication OTP Code',
        text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #333; background-color: #0d0d0d; color: #fff; border-radius: 8px;">
            <h2 style="color: #6200ea; text-align: center;">QRGen Authentication</h2>
            <p>Hello,</p>
            <p>You requested an OTP to login to your QRGen Account. Use the verification code below:</p>
            <div style="background: rgba(255, 255, 255, 0.05); padding: 15px; border-radius: 6px; text-align: center; font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #00e676; margin: 20px 0; border: 1px solid #333;">
              ${otp}
            </div>
            <p style="font-size: 12px; color: #888; text-align: center;">This code will expire in 5 minutes. If you did not request this, please ignore this email.</p>
          </div>
        `
      };

      transporter.sendMail(mailOptions)
        .then(() => console.log(`[SMTP] OTP email sent successfully to ${email}`))
        .catch((mailError) => console.error('[SMTP] Nodemailer Error: ', mailError));
    }

    return res.status(200).json({ 
      message: 'OTP verification code generated and sent.', 
      devOtp: (isProd || (!process.env.EMAIL_USER || !process.env.EMAIL_PASS)) ? undefined : otp
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error generating OTP' });
  }
});

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP and return JWT
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.otp || user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP code' });
    }

    if (new Date() > user.otpExpires) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    user.otp = null;
    user.otpExpires = null;
    user.isVerified = true;
    await user.save();

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      token,
      userId: user._id,
      email: user.email,
      profileData: user.profileData,
      qrTheme: user.qrTheme,
      scanCount: user.scanCount
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error verifying OTP' });
  }
});

module.exports = router;
