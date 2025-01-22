import mongoose from "mongoose";

const { Schema } = mongoose;

const eventSchema = new Schema(
  {
    eventName: { type: String, required: true },
    description: { type: String, required: true },
    shop: { type: Schema.Types.ObjectId, ref: "Shop", required: true },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subcategory: { type: Schema.Types.ObjectId, ref: "Subcategory" },
    brand: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, default: "Running" },
    tags: { type: [String], default: [] },
    originalPrice: { type: Number, required: true },
    discountPrice: { type: Number, required: true },
    stock: { type: Number, required: true },
    images: [{ type: String }],
    soldOut: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Event Model
const Event = mongoose.model("Event", eventSchema);
export default Event;
