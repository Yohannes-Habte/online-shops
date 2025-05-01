import mongoose from "mongoose";

const { Schema } = mongoose;

const shoWithdrawSchema = new Schema(
  {
    withdrawalCode: { type: String, unique: true, required: true },
    
    withdrawId: { type: String, unique: true, required: true },

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
    supplier: { type: String },

    // If "Customer Reimbursement" is selected, show me the RefundRequest and returnRequest IDs
    refundRequest: { type: Schema.Types.ObjectId, ref: "RefundRequest" },
    returnRequest: { type: Schema.Types.ObjectId, ref: "ReturnRequest" },

    amount: { type: Number, required: true },

    currency: { type: String, required: true },

    method: { type: String, required: true },

    notes: { type: String, required: true },

    processedDate: { type: Date, required: true },

    processedBy: { type: Schema.Types.ObjectId, ref: "Shop", required: true },
  },

  { timestamps: true }
);

// Withdraw Model
const Withdrawal = mongoose.model("Withdrawal", shoWithdrawSchema);
export default Withdrawal;
