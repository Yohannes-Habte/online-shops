import mongoose from 'mongoose';

const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    conversationId: { type: String },
    textMessage: { type: String },
    sender: { type: String },
    images: [{ type: String }],
  },
  { timestamps: true }
);

// Message Model
const Message = mongoose.model('Message', messageSchema);
export default Message;
