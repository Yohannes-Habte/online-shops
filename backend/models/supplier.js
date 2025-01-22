// Importing mongoose and its Schema constructor
import mongoose from "mongoose";

const { Schema } = mongoose;

const supplierSchema = new Schema(
  {
    supplierName: { type: String, required: true, unique: true },

    supplierDescription: { type: String, required: false },

    supplierEmail: { type: String, required: false, unique: true },

    supplierPhone: { type: String, required: false },

    supplierAddress: { type: String, required: false },

    country: { type: String, required: false },

    // A flag to mark if the supplier is active or inactive
    isActive: { type: Boolean, default: true },
    
    // A reference to the shop that the supplier belongs to
    shop: { type: Schema.Types.ObjectId, ref: "Shop", required: true },
  },
  {
    timestamps: true,

    // Optionally add indexing for better performance in large datasets
    index: { fields: { supplierName: 1, isActive: 1 } },
  }
);

supplierSchema.index({ supplierName: 1 });

const Supplier = mongoose.model("Supplier", supplierSchema);

export default Supplier;
