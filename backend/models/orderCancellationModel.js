import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const { Schema, model } = mongoose;

const statusEnum = ["Pending", "Approved", "Rejected"];

const orderCancellationSchema = new Schema(
  {
    cancellationCode: { type: String, unique: true, required: true },

    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },

    requestedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },

    cancellationStatus: { type: String, enum: statusEnum, required: true },

    reviewedAt: { type: Date, required: true },

    reviewerNotes: { type: String, required: true },
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
