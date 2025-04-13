import mongoose from "mongoose";

const { Schema } = mongoose;

// Refund Request schema
const refundRequestSchema = new Schema(
  {
    // This was returnedId in the original code
    returnRequestId: { type: String, unique: true, required: true },

    // This was refundRequestIdLinked in the original code
    refundRequest: {
      type: Schema.Types.ObjectId,
      ref: "RefundRequest",
      required: true,
    },

    isProductReturned: { type: Boolean, default: false },

    // If isProductReturned is true, the rest of the fields are displayed and required
    // If isProductReturned is false, refund request will not be processed
    returnedDate: { type: Date, required: true },

    condition: {
      type: String,
      enum: ["New", "Used", "Damaged"],
      required: true,
    },

    comments: { type: String, required: true },

    refundAmount: { type: Number, required: true },

    processedDate: { type: Date, required: true, required: true },

    refundStatus: {
      type: String,
      enum: ["Pending", "Processing", "Accepted", "Rejected"],
      default: "Pending",
      required: true,
    },
    processedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// Return Request Model
const ReturnRequest = mongoose.model("ReturnRequest", refundRequestSchema);

export default ReturnRequest;
