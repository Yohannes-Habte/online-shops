import mongoose from 'mongoose';

const { Schema } = mongoose;

const eventSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, default: 'Running' },
    tags: { type: String },
    originalPrice: { type: Number, required: true },
    discountPrice: { type: Number, required: true },
    stock: { type: Number, required: true },
    images: { type: String, required: true },
    // images: [],
    shopId: { type: String, required: true },
    shop: { type: Object, required: true },
    sold_out: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now() },
  },
  { timestamps: true }
);

// Event Model
const Event = mongoose.model('Event', eventSchema);
export default Event;
