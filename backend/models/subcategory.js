import mongoose from "mongoose";

const { Schema } = mongoose;

const subcategorySchema = new Schema(
  {
    subcategoryName: { type: String, required: true, unique: true },
    subcategoryDescription: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    shop: { type: Schema.Types.ObjectId, ref: "Shop", required: true },
   
  },
  { timestamps: true }
);

// Subcategory Model
const Subcategory = mongoose.model("Subcategory", subcategorySchema);
export default Subcategory;
