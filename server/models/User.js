import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
email: {
  type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
 password: {
      type: String,
      required: true,
      minlength: 6,
    },
role: {
     type: String,
      enum: ['student', 'teacher', 'admin'],
      default: 'student',
    },
isVerified: {
     type: Boolean,
      default: false, // OTP verification
    },
department: {
    type: String,
      default: '',
    },
rollNumber: {
   type: String,
      default: '',
    },
  },
  { timestamps: true } // auto created and updated
);

export default mongoose.model('User', userSchema);