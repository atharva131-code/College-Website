import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import User from '../models/User.js'
import OTP from '../models/OTP.js'

const router = express.Router()

// Send OTP email
// const sendOTPEmail = async (email, otp) => {
//   const transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 465,
//     secure: true,
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//     tls: {
//       rejectUnauthorized: false,
//     },
//   })

//   await transporter.sendMail({
//     from: `"Atharva College" <${process.env.EMAIL_USER}>`,
//     to: email,
//     subject: 'Your OTP Code',
//     html: `
//       <h2>Your OTP Code</h2>
//       <p>Use this OTP to verify your account:</p>
//       <h1 style="color: #4F46E5; letter-spacing: 8px;">${otp}</h1>
//       <p>This OTP expires in <b>10 minutes</b>.</p>
//     `,
//   })
// }

// // Generate and save OTP
// const generateAndSaveOTP = async (email) => {
//   const otp = Math.floor(100000 + Math.random() * 900000).toString()
//   const hashedOTP = await bcrypt.hash(otp, 10)
//   await OTP.deleteMany({ email })
//   await OTP.create({ email, otp: hashedOTP })
//   return otp
// }

// ROUTE 1 — Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, department, rollNumber } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'student',
      department: department || '',
      rollNumber: rollNumber || '',
      isVerified: true,
    })

    res.status(201).json({
      message: 'Registration successful! You can now login.',
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// ROUTE 2 — Verify OTP
// router.post('/verify-otp', async (req, res) => {
//   try {
//     const { email, otp } = req.body

//     const otpRecord = await OTP.findOne({ email })
//     if (!otpRecord) {
//       return res.status(400).json({ message: 'OTP expired or not found.' })
//     }

//     const isMatch = await bcrypt.compare(otp, otpRecord.otp)
//     if (!isMatch) {
//       return res.status(400).json({ message: 'Wrong OTP. Please try again.' })
//     }

//     await User.findOneAndUpdate({ email }, { isVerified: true })
//     await OTP.deleteMany({ email })

//     res.status(200).json({ message: 'Email verified successfully! You can now login.' })
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message })
//   }
// })

// ROUTE 3 — Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'No account found with this email' })
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: 'Please verify your email first' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Wrong password' })
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    )

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
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// ROUTE 4 — Forgot Password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'No account found with this email' })
    }

    const otp = await generateAndSaveOTP(email)
    await sendOTPEmail(email, otp)

    res.status(200).json({ message: 'OTP sent to your email for password reset' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// ROUTE 5 — Verify Reset OTP
router.post('/verify-reset-otp', async (req, res) => {
  try {
    const { email, otp } = req.body

    const otpRecord = await OTP.findOne({ email })
    if (!otpRecord) {
      return res.status(400).json({ message: 'OTP expired or not found.' })
    }

    const isMatch = await bcrypt.compare(otp, otpRecord.otp)
    if (!isMatch) {
      return res.status(400).json({ message: 'Wrong OTP. Please try again.' })
    }

    const resetToken = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: '10m' }
    )

    await OTP.deleteMany({ email })

    res.status(200).json({
      message: 'OTP verified. You can now reset your password.',
      resetToken,
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// ROUTE 6 — Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body

    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET)
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await User.findOneAndUpdate(
      { email: decoded.email },
      { password: hashedPassword }
    )

    res.status(200).json({ message: 'Password reset successful! You can now login.' })
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'Reset token expired. Please start again.' })
    }
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// ROUTE 7 — Resend OTP
router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'No account found with this email' })
    }

    const otp = await generateAndSaveOTP(email)
    await sendOTPEmail(email, otp)

    res.status(200).json({ message: 'New OTP sent to your email' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

export default router