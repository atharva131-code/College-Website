import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import User from '../models/User.js';
import OTP from '../models/OTP.js';

const router = express.Router();

const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,          // ← true for port 465
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,  // ← fixes SSL issues on cloud servers
    },
  })

  // Verify connection before sending
  await transporter.verify()

  await transporter.sendMail({
    from: `"Atharva College" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your OTP Code — Atharva College',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 400px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #1d4ed8;">🎓 City College</h2>
        <p>Your OTP code for verification is:</p>
        <h1 style="color: #1d4ed8; letter-spacing: 10px; font-size: 36px;">${otp}</h1>
        <p>This OTP expires in <b>10 minutes</b>.</p>
        <p style="color: #999; font-size: 12px;">If you did not request this, ignore this email.</p>
      </div>
    `,
  })
}
//Generate and save OTP

const generateAndSaveOTP = async (email) => {
  // Generate random 6 digit number
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Hash the OTP before saving
  const hashedOTP = await bcrypt.hash(otp, 10);

  // Delete any old OTP for this email first
  await OTP.deleteMany({ email });

  // Save new hashed OTP in database
  await OTP.create({ email, otp: hashedOTP });

  return otp; // return raw OTP to send in email
};


// Register (Step 1)
// POST /api/auth/register

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, department, rollNumber } = req.body;

    
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user but keep isVerified false until OTP verified
    await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'student',
      department: department || '',
      rollNumber: rollNumber || '',
      isVerified: false,
    });

    // Generate OTP and send email
    const otp = await generateAndSaveOTP(email);
    await sendOTPEmail(email, otp);

    res.status(201).json({
      message: 'Registration successful! Check your email for OTP.',
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Verify OTP after Register
// POST /api/auth/verify-otp

router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find OTP record in database
    const otpRecord = await OTP.findOne({ email });
    if (!otpRecord) {
      return res.status(400).json({ message: 'OTP expired or not found. Request a new one.' });
    }

    // Compare entered OTP with hashed OTP in database
    const isMatch = await bcrypt.compare(otp, otpRecord.otp);
    if (!isMatch) {
      return res.status(400).json({ message: 'Wrong OTP. Please try again.' });
    }

    // Mark user as verified
    await User.findOneAndUpdate({ email }, { isVerified: true });

    // Delete OTP record — no longer needed
    await OTP.deleteMany({ email });

    res.status(200).json({ message: 'Email verified successfully! You can now login.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ROUTE 3 — Login
// POST /api/auth/login

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'No account found with this email' });
    }

    // Check if user verified their email
    if (!user.isVerified) {
      return res.status(400).json({ message: 'Please verify your email first' });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Wrong password' });
    }

    // Create JWT token — like a digital ID card
    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ROUTE 4 — Forgot Password (Send OTP)
// POST /api/auth/forgot-password

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    // Check if this email exists in database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'No account found with this email' });
    }

    // Generate OTP and send email
    const otp = await generateAndSaveOTP(email);
    await sendOTPEmail(email, otp);

    res.status(200).json({ message: 'OTP sent to your email for password reset' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ROUTE 5 — Verify Reset OTP
// POST /api/auth/verify-reset-otp

router.post('/verify-reset-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find OTP record
    const otpRecord = await OTP.findOne({ email });
    if (!otpRecord) {
      return res.status(400).json({ message: 'OTP expired or not found. Request a new one.' });
    }

    // Compare OTPs
    const isMatch = await bcrypt.compare(otp, otpRecord.otp);
    if (!isMatch) {
      return res.status(400).json({ message: 'Wrong OTP. Please try again.' });
    }

    // Create a short lived reset token — valid only 10 minutes
    const resetToken = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: '10m' }
    );

    // Delete OTP — no longer needed
    await OTP.deleteMany({ email });

    res.status(200).json({
      message: 'OTP verified. You can now reset your password.',
      resetToken,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ROUTE 6 — Reset Password
// POST /api/auth/reset-password

router.post('/reset-password', async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    // Verify the reset token is valid and not expired
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in database
    await User.findOneAndUpdate(
      { email: decoded.email },
      { password: hashedPassword }
    );

    res.status(200).json({ message: 'Password reset successful! You can now login.' });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'Reset token expired. Please start again.' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ROUTE 7 — Resend OTP
// POST /api/auth/resend-otp

router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;

    // Check user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'No account found with this email' });
    }

    // Generate new OTP and send
    const otp = await generateAndSaveOTP(email);
    await sendOTPEmail(email, otp);

    res.status(200).json({ message: 'New OTP sent to your email' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;