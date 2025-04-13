import mongoose from "mongoose";

const { Schema } = mongoose;

const shopTransactionSchema = new Schema(
  {
    transactionId: { type: String, unique: true, required: true },

    shop: { type: String, required: true },

    transactionType: {
      type: String,
      enum: ["Payout", "Refund", "Withdrawal", "Adjustment"],
      required: true,
    },

    // If "Payout" is selected, show me the order ID and platform fees
    order: { type: Schema.Types.ObjectId, ref: "Order" },

    platformFees: { type: Number, default: 0 },

    // If "Refund or Withdrawal" is selected, show me withdrawal
    withdrawal: { type: Schema.Types.ObjectId, ref: "Withdrawal" },

    // If "Adjustment" is selected, show me the adjustmentReason reason and adjustmentNotes
    adjustmentReason: {
      type: String,
      enum: [
        "Order Reconciliation", // Adjustments due to order mismatches or errors
        "Manual Financial Adjustment", // Manually initiated adjustments for any reason
        "Promotional Credit Issuance", // Discounts or goodwill credits applied post-purchase
        "Operational Correction", // Fixes for system or operational discrepancies
      ],
    },

    adjustmentNotes: { type: String },

    amount: { type: Number, required: true },

    currency: { type: String, required: true, uppercase: true },

    method: { type: String, required: true },

    paymentProvider: { type: String, required: true },

    transactionStatus: {
      type: String,
      enum: ["Processing", "Completed", "Cancelled"],
      default: "Processing",
      required: true,
    },

    cancelledReason: { type: String, default: null },

    processedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },

    processedAt: { type: Date, required: true },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", shopTransactionSchema);

export default Transaction;
