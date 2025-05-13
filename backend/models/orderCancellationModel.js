import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const { Schema, model } = mongoose;

const statusEnum = ["Pending", "Approved", "Rejected"];

const reasonEnum = [
  "Ordered by mistake",
  "Found a better price elsewhere",
  "Item arrived late",
  "Item not as described",
  "Item was damaged or defective",
  "Changed my mind",
  "Duplicate order",
  "Received the wrong item",
  "Billing or payment issue",
  "Other",
];

const orderCancellationSchema = new Schema(
  {
    cancellationCode: { type: String, unique: true },

    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },

    requestedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },

    reason: { type: String, enum: reasonEnum, required: true },

    // If other, specify the reason
    otherReason: { type: String },

    cancellationStatus: { type: String, enum: statusEnum },

    reviewerNotes: { type: String },

    reviewedDate: { type: Date },

    reviewer: { type: Schema.Types.ObjectId, ref: "Shop" },
  },

  {
    timestamps: true,
  }
);

// Middleware to generate a unique cancellation code before saving
orderCancellationSchema.pre("save", function (next) {
  if (this.isNew) {
    this.cancellationCode = `CANC-${uuidv4()}`;
  }
  next();
});

const OrderCancellation = model("OrderCancellation", orderCancellationSchema);

export default OrderCancellation;
