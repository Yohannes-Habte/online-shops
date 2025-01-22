import mongoose from "mongoose";

const { Schema } = mongoose;

const withdrawSchema = new Schema(
  {
    seller: { type: Object, required: true },

    amount: { type: Number, required: true },

    status: { type: String, default: "Processing" },

    transactionId: { type: String, unique: true, sparse: true },

    method: {
      type: String,
      required: true,
      enum: ["Bank Transfer", "PayPal", "Other"],
    },
    
    notes: {
      type: String,
      maxLength: [500, "Notes cannot exceed 500 characters"],
    },
  },

  { timestamps: true }
);

// Withdraw Model
const Withdraw = mongoose.model("Withdraw", withdrawSchema);
export default Withdraw;
