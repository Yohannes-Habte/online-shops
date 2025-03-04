import mongoose from "mongoose";

const { Schema } = mongoose;

// Variant schema for product options
const variantSchema = new Schema({
  productColor: { type: String, required: true },
  productSizes: [
    {
      size: {
        type: Schema.Types.Mixed, // Can be either String or Number
        required: true,
      },
      stock: { type: Number, required: true, min: 0 }, // Stock for this specific size
    },
  ],
  productImage: { type: String, required: true },
});

// Product review schema
const reviewSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true, min: 0, max: 5 },
  comment: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now },
});

// Product schema
const productSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    originalPrice: { type: Number, required: true },
    discountPrice: { type: Number, required: true },
    shop: { type: Schema.Types.ObjectId, ref: "Shop", required: true },
    supplier: { type: Schema.Types.ObjectId, ref: "Supplier", required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    subcategory: {
      type: Schema.Types.ObjectId,
      ref: "Subcategory",
      required: true,
    },
    brand: { type: Schema.Types.ObjectId, ref: "Brand", required: true },

    customerCategory: {
      type: String,
      enum: ["Ladies", "Gents", "Kids"],
      required: true,
    },

    tags: {
      type: [String], // Tags for filtering or categorization
      default: [],
      validate: [arrayLimit, "Exceeds the limit of tags"], // Limit tags to 10
    },

    status: {
      type: String,
      required: true,
      enum: ["active", "inactive", "out_of_stock"],
      default: "active",
    },

    soldOut: { type: Number, default: 0, min: 0 },

    ratings: {
      average: { type: Number, min: 0, max: 5, default: 0 }, // Average rating
      count: { type: Number, default: 0, min: 0 }, // Total number of ratings
    },

    reviews: [reviewSchema],

    variants: [variantSchema],
  },
  { timestamps: true }
);

// Helper function to limit array size
function arrayLimit(val) {
  return val.length <= 10;
}

// Pre-save hook to ensure discountPrice is valid
productSchema.pre("save", function (next) {
  if (this.discountPrice > this.originalPrice) {
    next(new Error("Discount price cannot be greater than the original price"));
  } else {
    next();
  }
});

// Add a text index for search optimization
productSchema.index({ title: "text", description: "text" });

const Product = mongoose.model("Product", productSchema);
export default Product;
