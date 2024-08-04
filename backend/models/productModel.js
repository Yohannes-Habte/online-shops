import mongoose from 'mongoose';

const { Schema } = mongoose;

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    tags: { type: String },
    shop: { type: Object },
    shopId: { type: String, required: true },
    originalPrice: { type: Number },
    discountPrice: { type: Number, required: true },
    stock: { type: Number, required: true },
    images: { type: String, required: true },
    // images: [],
    sold_out: { type: Number, default: 0 },
    // Average rating of a product
    ratings: { type: Number },
    // Individual user product review for rating a product
    reviews: [
      {
        user: { type: Object },
        rating: { type: Number },
        comment: { type: String },
        productId: { type: String },
        createdAt: { type: Date, default: Date.now() },
      },
    ],
  },
  { timestamps: true }
);

// Product Model
const Product = mongoose.model('Product', productSchema);
export default Product;
