import mongoose from "mongoose";

const { Schema } = mongoose;

// Transaction Types enum
export const transactionEnum = ["Payout", "Refund", "Withdrawal", "Adjustment"];

// Adjustment Reasons enum
export const adjustmentEnum = [
  "Order Reconciliation", // Adjustments due to order mismatches or errors
  "Manual Financial Adjustment", // Manually initiated adjustments for any reason
  "Promotional Credit Issuance", // Discounts or goodwill credits applied post-purchase
  "Operational Correction", // Fixes for system or operational discrepancies
];

// Transaction Status enum
export const statusEnum = ["Processing", "Completed", "Cancelled"];

const shopTransactionSchema = new Schema(
  {
    transactionId: { type: String, unique: true, required: true },

    shop: { type: Schema.Types.ObjectId, ref: "Shop", required: true },

    transactionType: { type: String, enum: transactionEnum, required: true },

    // If "Payout" is selected, show me the order ID and platform fees
    order: { type: Schema.Types.ObjectId, ref: "Order" },

    platformFees: { type: Number, default: 0 },

    // If "Refund" is selected, show me the refundRequest, returnedItem and withdrawal
    refundRequest: { type: Schema.Types.ObjectId, ref: "RefundRequest" },

    returnedItem: { type: Schema.Types.ObjectId, ref: "ReturnRequest" },

    // If "Withdrawal" is selected, show me withdrawal
    withdrawal: { type: Schema.Types.ObjectId, ref: "Withdrawal" },

    // If "Adjustment" is selected, show me the adjustmentReason reason and adjustmentNotes
    adjustmentReason: { type: String, enum: adjustmentEnum, required: false },

    adjustmentNotes: { type: String },

    amount: { type: Number, required: true },

    currency: { type: String, required: true, uppercase: true },

    method: { type: String, required: true },

    paymentProvider: { type: String, required: true },

    transactionStatus: { type: String, enum: statusEnum, required: true },

    cancelledReason: { type: String, default: null },

    processedDate: { type: Date, required: true },

    processedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", shopTransactionSchema);

export default Transaction;
