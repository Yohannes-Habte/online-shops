import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const { Schema } = mongoose;



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

    soldProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }],

    orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],

    refundRequests: [{ type: Schema.Types.ObjectId, ref: "RefundRequest" }],

    returnedItems: [{ type: Schema.Types.ObjectId, ref: "ReturnRequest" }],

    withdrawals: [{ type: Schema.Types.ObjectId, ref: "Withdrawal" }],

    transactions: [{ type: Schema.Types.ObjectId, ref: "Transaction" }],

    availableBalance: [],

    netShopIncome: { type: Number, default: 0 },

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
