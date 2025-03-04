import mongoose from "mongoose";

const { Schema } = mongoose;

// Event review schema
const reviewSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true, min: 0, max: 5 },
  comment: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now },
});

// Event schema
const eventSchema = new Schema(
  {
    eventCode: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    tags: {
      type: [String], // Tags for filtering or categorization
      default: [],
      validate: {
        validator: (val) => val.length <= 10,
        message: "Exceeds the limit of 10 tags.",
      },
    },
    originalPrice: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, required: true, min: 0 },

    // The order of images should match the stock levels
    images: [{ type: String, required: true }],
    stockLevels: [{ type: Schema.Types.Mixed, required: true }],

    // Sizes and colors apply to all images
    sizes: [{ type: Schema.Types.Mixed, required: true }], // [34, 35, 36] or [S, M, L]
    colors: [{ type: String, required: true }],

    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    purposes: { type: [String], default: [] },

    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
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

    soldOut: { type: Number, default: 0, min: 0 },

    ratings: {
      average: { type: Number, min: 0, max: 5, default: 0 }, // Average rating
      count: { type: Number, default: 0, min: 0 }, // Total number of ratings
    },

    reviews: [reviewSchema],

    // The total number of items available in stock
    totalInventory: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

// Ensure stocks and images array lengths match
eventSchema.path("stockLevels").validate(function (value) {
  return value.length === this.images.length;
}, "Stock levels and images length must be the same.");

// Pre-save hook to calculate total inventory
eventSchema.pre("save", function (next) {
  if (this.stockLevels && Array.isArray(this.stockLevels)) {
    this.totalInventory = this.stockLevels.reduce((acc, curr) => acc + curr, 0);
  }
  next();
});

// Pre-save hook to ensure discount price is valid
eventSchema.pre("save", function (next) {
  if (this.discountPrice > this.originalPrice) {
    return next(
      new Error("Discount price cannot be higher than the original price.")
    );
  }
  next();
});

// Event Model
const Event = mongoose.model("Event", eventSchema);
export default Event;
