import mongoose from 'mongoose'

const syllabusSchema = new mongoose.Schema(
  {
    course: {
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
        code: { type: String, required: true },
        credits: { type: Number, default: 4 },
        type: {
          type: String,
          enum: ['theory', 'practical', 'elective'],
          default: 'theory',
        },
      },
    ],
  },
  { timestamps: true }
)

export default mongoose.model('Syllabus', syllabusSchema)