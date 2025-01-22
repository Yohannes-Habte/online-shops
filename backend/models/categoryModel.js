// Importing mongoose and its Schema constructor
import mongoose from "mongoose";

const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    categoryName: { type: String, required: true, unique: true },
    categoryDescription: { type: String, required: true },
    shop: { type: Schema.Types.ObjectId, ref: "Shop", required: true },
  },
  {
    timestamps: true,
  }
);

// Creating the ProductCategory model using the schema
const Category = mongoose.model("Category", categorySchema);

export default Category;
