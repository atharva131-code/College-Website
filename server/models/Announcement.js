import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema(
  {
 title: {
   type: String,
      required: true,
    },
 content: {
    type: String,
      required: true,
    },
 category: {
   type: String,
      enum: ['exam', 'holiday', 'general', 'urgent'],
      default: 'general',
  },
 postedBy: {
  type: mongoose.Schema.Types.ObjectId,
      ref: 'User', //link to User model
    },
  },
  { timestamps: true }
);

export default mongoose.model('Announcement', announcementSchema);