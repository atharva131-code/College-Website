import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  code: {
      type: String,
      required: true,
      unique: true,
    },
    department: {
      type: String,
      required: true,
    },
  duration: {
      type: String, //years "
      required: true,
    },
  totalSeats: {
      type: Number,
      required: true,
    },
 description: {
      type: String,
      default: '',
    },
 fees: {
      tuition: { type: Number, default: 0 },
      hostel: { type: Number, default: 0 },
      exam: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

export default mongoose.model('Course', courseSchema);