import mongoose from "mongoose";

const { Schema } = mongoose;

const shopTransactionSchema = new Schema(
  {
    transactionId: { type: String, unique: true, required: true },
    shop: { type: Schema.Types.ObjectId, ref: "Shop", required: true },
    order: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    amount: { type: Number, required: true },
    currency: {
      type: String,
      required: true,
      enum: ["USD", "EUR", "GBP", "INR", "JPY", "AUD"],
      default: "USD",
      uppercase: true,
    },
    method: {
      type: String,
      enum: ["Bank Transfer", "PayPal", "Stripe", "Crypto", "Cheque"],
      required: true,
    },
    paymentProvider: {
      type: String,
      enum: [
        "Bank Transfer",
        "PayPal",
        "Stripe",
        "Square",
        "Authorize.Net",
        "Razorpay",
        "Google Pay",
        "Apple Pay",
      ],
      required: true,
    },
    type: {
      type: String,
      enum: ["Payout", "Refund", "Adjustment"],
      default: "Payout",
    },
    platformFees: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Processing", "Completed", "Failed", "Cancelled"],
      default: "Processing",
    },
    failureReason: { type: String, default: null },
    processedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    processedAt: { type: Date, required: true },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", shopTransactionSchema);

export default Transaction;
