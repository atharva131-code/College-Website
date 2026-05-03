import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
 title: {
      type: String,
      required: true,
   },
   description: {
   type: String,
      required: true,
    },
  date: {
   type: Date,
      required: true,
    },
   venue: {
      type: String,
      required: true,
    },
 category: {
      type: String,
      enum: ['academic', 'cultural', 'sports', 'technical', 'other'],
      default: 'other',
    },
 imageUrl: {
      type: String,
      default: '',
    },
 postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Event', eventSchema);