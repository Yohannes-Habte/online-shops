import mongoose from 'mongoose';

const { Schema } = mongoose;

const commentSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

// User Model
const Comment = mongoose.model('Comment', commentSchema);
export default Comment;
