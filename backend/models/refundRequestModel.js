import mongoose from "mongoose";

const { Schema } = mongoose;

// Sub schema for bank transfer details
const bankDetailsSchema = new Schema(
  {
    accountHolderName: { type: String, required: true },
    accountNumber: { type: String, required: true }, // May be used with or without IBAN
    bankName: { type: String, required: true },
    bankBranch: { type: String, required: true },
    bankAddress: { type: String, required: true },
    bankZipCode: { type: String, required: true },
    bankCity: { type: String, required: true },
    bankState: { type: String, required: true },
    bankCountry: { type: String, required: true },

    swiftCode: { type: String }, // SWIFT/BIC code for international transfers
    IBAN: { type: String }, // Europe, Middle East, parts of Asia & Latin America

    // Flexible region-specific codes
    regionalCodes: {
      type: Map,
      of: String,
      default: {},
    },
  },
  { _id: false }
);

// Sub Schema for Crypto refund details
const cryptoDetailsSchema = new Schema(
  {
    network: { type: String, required: true },
    token: { type: String, required: true },
    walletAddress: { type: String, required: true },
  },
  { _id: false }
);

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

    // Internal use only
    requestedRefundAmount: { type: Number, required: true },

    currency: { type: String, required: true },

    method: {
      type: String,
      enum: ["Bank Transfer", "PayPal", "Stripe", "Crypto", "Cheque"],
      required: true,
    },

    // Show me bank details if and Only if "Bank Transfer" is selected
    bankDetails: { type: bankDetailsSchema },

    // Show me email if and Only if "PayPal or Stripe" is selected
    email: { type: String }, // for PayPal / Stripe

    // Show me chequeRecipient if and Only if "Cheque" is selected
    chequeRecipient: { type: String },

    cryptoDetails: { type: cryptoDetailsSchema }, // for Crypto

    notes: { type: String, required: true },

    processedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Refund Request Model
const RefundRequest = mongoose.model("RefundRequest", refundRequestSchema);

export default RefundRequest;
