// Importing mongoose and its Schema constructor
import mongoose from "mongoose";

const { Schema } = mongoose;

const productBrandSchema = new Schema(
  {
    brandName: { type: String, required: true, unique: true },
    brandDescription: { type: String, required: true },
    shop: { type: Schema.Types.ObjectId, ref: "Shop", required: true },
  },
  {
    timestamps: true,
  }
);

const Brand = mongoose.model("Brand", productBrandSchema);

export default Brand;
