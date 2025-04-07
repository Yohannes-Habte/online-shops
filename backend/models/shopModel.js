import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { type } from "os";

const { Schema } = mongoose;

// Schema for individual order items and refund items
const shopPaymentSettingsSchema = new Schema(
  {
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

    // Optional notes
    notes: { type: String },
  },
  { timestamps: true }
);

// transactions in the Shop schema are meant to record the payout history between the platform and the shop (i.e., the seller).
const shopTransactionSchema = new Schema(
  {
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

    withdrawDetailsSnapshot: {
      // snapshot of method used at time of transaction
      type: shopPaymentSettingsSchema,
    },

    relatedOrders: [{ type: Schema.Types.ObjectId, ref: "Order" }],

    status: {
      type: String,
      enum: ["Processing", "Completed", "Failed", "Cancelled"],
      default: "Processing",
    },

    failureReason: {
      type: String,
      default: null,
    },

    createdBy: { type: Schema.Types.ObjectId, ref: "User" },

    processedAt: { type: Date, required: true },
  },
  { timestamps: true }
);

// Refund transactions in the Shop schema are meant to record the refund history between the platform and the shop (i.e., the seller).
const shopRefundTransactionSchema = new Schema(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    refundAmount: { type: Number, required: true },
    refundDate: { type: Date, required: true },
    reason: { type: String },
    method: {
      type: String,
      enum: ["Bank Transfer", "PayPal", "Stripe", "Crypto", "Cheque"],
      required: true,
    },
    refundType: { type: String, enum: ["Full", "Partial"], required: true },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Failed", "Cancelled"],
      default: "Pending",
    },
    refundFailureReason: { type: String, default: null },
    processedAt: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    notes: { type: String },
  },
  { timestamps: true }
);

const shopSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: Number, required: true },
    description: { type: String, required: true },
    shopAddress: { type: String, required: true },

    role: { type: String, default: "seller", enum: ["seller", "admin"] },

    LogoImage: { type: String, required: true },

    agree: { type: Boolean, default: false, required: true },

    categories: [{ type: Schema.Types.ObjectId, ref: "Category" }],

    subCategories: [{ type: Schema.Types.ObjectId, ref: "Subcategory" }],

    brands: [{ type: Schema.Types.ObjectId, ref: "Brand" }],

    shopProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }],

    suppliers: [{ type: Schema.Types.ObjectId, ref: "Supplier" }],

    orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],

    soldProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }],

    shopIncomeInfo: { type: [shopTransactionSchema] },

    shopRefundInfo: { type: [shopRefundTransactionSchema] },

    netShopIncome: { type: Number, default: 0 },

    paymentSettings: { type: [shopPaymentSettingsSchema] },

    passwordResetToken: { type: String },

    forgotPasswordChangedAt: Date,

    passwordResetTokenExpires: Date,

    approvedCategories: [{ type: Schema.Types.ObjectId, ref: "Category" }],

    approvedSubcategories: [
      { type: Schema.Types.ObjectId, ref: "Subcategory" },
    ],
  },
  { timestamps: true }
);

// Pre save for hashed password
shopSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();
    const hashedPassword = await bcrypt.hash(this.password, 12);
    this.password = hashedPassword;
    return next();
  } catch (error) {
    return next(err);
  }
});

// Pre save for rest forgot password
shopSchema.methods.createResetpasswordToken = function () {
  let resetToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetToken = hashedToken;
  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const Shop = mongoose.model("Shop", shopSchema);
export default Shop;
