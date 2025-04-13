import mongoose from "mongoose";

const { Schema } = mongoose;

// Refund Request schema
const refundRequestSchema = new Schema(
  {
    refundRequestId: { type: String, unique: true, required: true },
    order: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    productColor: { type: String, required: true },
    productSize: { type: String, required: true },
    productQuantity: { type: Number, required: true },
    requestedDate: { type: Date, required: true },
    requestRefundReason: {
      type: String,
      enum: [
        "Damaged or Faulty Product",
        "Incorrect Item Received",
        "Size or Fit Issue",
        "Product Not as Described",
        "Changed My Mind",
        "Other",
      ],
      required: true,
    },

    otherReason: { type: String, trim: true }, // Only used if "Other" is selected

    // the amount will not display to the user, but will be used to calculate the refund amount
    requestedRefundAmount: { type: Number },

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

    // Show me bank details if and Only if "Bank Transfer" is selected
    accountHolderName: { type: String },
    bankName: { type: String },
    bankCountry: { type: String },
    bankAddress: { type: String },
    bankSwiftCode: { type: String },
    accountNumber: { type: String },
    routingNumber: { type: String },

    // Show me email if and Only if "PayPal or Stripe" is selected
    email: { type: String }, // for PayPal / Stripe

    // Show me chequeRecipient if and Only if "Cheque" is selected
    chequeRecipient: { type: String },

    notes: { type: String, required: true },
    processedDate: { type: Date, required: true },
    processedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Refund Request Model
const RefundRequest = mongoose.model("RefundRequest", refundRequestSchema);

export default RefundRequest;
