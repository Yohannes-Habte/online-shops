import mongoose from "mongoose";

const { Schema } = mongoose;

const shoWithdrawSchema = new Schema(
  {
    shop: { type: Schema.Types.ObjectId, ref: "Shop", required: true },

    withdrawalPurpose: {
      type: String,
      enum: [
        "Product Procurement", // Purchasing inventory or raw materials from suppliers
        "Customer Reimbursement", // Refunding customers for canceled or returned orders
        "Operating Expenses", // Utilities, rent, logistics, warehousing, etc.
        "Marketing & Advertising", // Paid ads, influencer campaigns, promotions
        "Corporate Donations", // Charitable donations or social responsibility funds
        "Profit Distribution", // Owner or shareholder withdrawals
        "Vendor Disbursement", // Payments to third-party contractors or service providers
        "Tax Obligations", // VAT, GST, or other government tax payments
        "Employee Payroll", // Salaries, wages, bonuses, etc.
        "Loan Repayment", // Repaying business loans or credit lines
        "Capital Investment", // Purchasing assets like equipment or tech
        "Platform Fees", // Fees charged by the platform (service, listing, etc.)
        "Subscription Payments", // SaaS tools, software licenses, or recurring services
        "Commission Payout", // Affiliate, influencer, or sales commission payments
        "Legal & Compliance Fees", // Lawyer fees, regulatory filings, or business licensing
        "Insurance Premiums", // Business or employee insurance payments
      ],
      required: true,
    },

    // Show me supplier if and Only if "Product Procurement" is selected
    supplier: { type: Schema.Types.ObjectId, ref: "Supplier" },

    // Show me order, product and transactionId if and Only if "Customer Reimbursement" is selected
    order: { type: Schema.Types.ObjectId, ref: "Order" },
    product: { type: Schema.Types.ObjectId, ref: "Product" },   
    refundTransactionId: { type: String },// Links to returnedItems.returnedId in the Order model

    amount: { type: Number, required: true },

    currency: {
      type: String,
      required: true,
      enum: ["USD", "EUR", "GBP", "INR", "JPY", "AUD"],
      default: "USD",
      uppercase: true,
    },

    refundType: { type: String, enum: ["Full", "Partial"], required: true },

    status: {
      type: String,
      enum: ["Pending", "Completed", "Cancelled"],
      default: "Pending",
    },

    refundFailureReason: { type: String, default: null },

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

    // Show me Crypto details if and Only if "Crypto" is selected
    cryptoWalletAddress: { type: String },
    cryptoCurrency: {
      type: String,
      enum: ["Bitcoin", "Ethereum", "USDT", "Other"],
    },

    // Show me chequeRecipient if and Only if "Cheque" is selected
    chequeRecipient: { type: String },

    withdrawalReason: { type: String, required: true },
    refundDate: { type: Date, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "Shop", required: true },
  },

  { timestamps: true }
);

// Withdraw Model
const Withdraw = mongoose.model("Withdraw", shoWithdrawSchema);
export default Withdraw;
