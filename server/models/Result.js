import mongoose from 'mongoose'

const resultSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: true,
    },
    rollNumber: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    semester: {
      type: Number,
      required: true,
    },
    subjects: [
      {
        name: { type: String, required: true },
        marks: { type: Number, required: true },
        totalMarks: { type: Number, default: 100 },
        grade: { type: String },
      },
    ],
    totalMarks: { type: Number },
    obtainedMarks: { type: Number },
    percentage: { type: Number },
    result: {
      type: String,
      enum: ['Pass', 'Fail'],
      default: 'Pass',
    },
  },
  { timestamps: true }
)

export default mongoose.model('Result', resultSchema)