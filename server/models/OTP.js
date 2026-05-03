import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true, //store hashed OTP 
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, //auto deletes from mongodb after 600 sec
  },
});

export default mongoose.model('OTP', otpSchema);