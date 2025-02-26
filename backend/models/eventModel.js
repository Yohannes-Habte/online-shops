import mongoose from "mongoose";

const { Schema } = mongoose;

const eventSchema = new Schema(
  {
    eventCode: { type: String, required: true, unique: true },
    eventName: { type: String, required: true },
    description: { type: String, required: true },
    tags: { type: [String], default: [] },
    originalPrice: { type: Number, required: true },
    discountPrice: { type: Number, required: true },
    stock: { type: Number, required: true },
    images: [{ type: String }],
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    purposes: { type: [String], default: [] },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subcategory: { type: Schema.Types.ObjectId, ref: "Subcategory" },
    shop: { type: Schema.Types.ObjectId, ref: "Shop", required: true },
    brand: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
    supplier: { type: Schema.Types.ObjectId, ref: "Supplier", required: true },
    eventStatus: {
      type: String,
      required: true,
      enum: ["upcoming", "ongoing", "completed", "canceled"],
      default: "upcoming",
    },
    soldOut: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Event Model
const Event = mongoose.model("Event", eventSchema);
export default Event;
