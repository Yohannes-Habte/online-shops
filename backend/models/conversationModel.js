import mongoose from "mongoose";

const { Schema } = mongoose;

const conversationSchema = new Schema(
  {
    groupTitle: { type: String, required: true }, // User ID + Seller ID + Product ID + Color + Size
    members: [
      { type: Schema.Types.ObjectId, ref: "User", required: true },
      { type: Schema.Types.ObjectId, ref: "Shop", required: true },
    ],
    messageSenderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    variant: { type: String, required: true },
    productColor: { type: String, required: true },
    productSize: { type: String, required: true },

    lastMessage: { type: String },
    lastMessageId: { type: Schema.Types.ObjectId, ref: "Shop" },
  },
  { timestamps: true }
);

// Conversation Model
const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;
