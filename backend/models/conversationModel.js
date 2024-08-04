import mongoose from 'mongoose';

const { Schema } = mongoose;

const conversationSchema = new Schema(
  {
    groupTitle: { type: String },
    members: { type: Array },
    lastMessage: { type: String },
    messageSenderId: { type: String },
  },
  { timestamps: true }
);

// Conversation Model
const Conversation = mongoose.model('Conversation', conversationSchema);
export default Conversation;
