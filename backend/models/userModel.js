import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    addresses: [
      {
        country: { type: String, required: true },
        state: { type: String, required: true },
        city: { type: String, required: true },
        address: { type: String, required: true },
        zipCode: { type: Number, required: true },
        addressType: { type: String, required: true },
      },
    ],
    image: {
      type: String,
      default: "https://i.ibb.co/4pDNDk1/avatar.png",
      required: true,
    },
    role: {
      type: String,
      default: "customer",
      enum: ["customer", "seller", "admin"],
    },

    myOrders: [{ type: Schema.Types.ObjectId, ref: "Order" }],

    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],

    agree: { type: Boolean, default: false, required: true },

    passwordResetToken: { type: String },
    forgotPasswordChangedAt: Date,
    passwordResetTokenExpires: Date,
  },
  { timestamps: true }
);

// Pre save
userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();
    const hashedPassword = await bcrypt.hash(this.password, 12);
    this.password = hashedPassword;
    return next();
  } catch (error) {
    return next(err);
  }
});

// Generate randomly set token for the forgot and reset password using instance methods
// createResetpasswordToken is a variable name, which stores what is coded inside it.

userSchema.methods.createResetpasswordToken = function () {
  // Create reset token
  let resetToken = crypto.randomBytes(32).toString("hex");

  // Hash token before saving to DB
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetToken = hashedToken;
  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;

  // The user gets the decrypted reset token therefore we return resetToken. However, what is stored in the database is the encrypted reset token to block hakers from hacking user account
  return resetToken;
};

// User Model
const User = mongoose.model("User", userSchema);
export default User;
