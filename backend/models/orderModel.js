import mongoose from 'mongoose';

const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    cart: { type: Array, required: true },
    shippingAddress: { type: Object, required: true },
    user: { type: Object, required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, default: 'Processing' },
    paymentInfo: {
      id: { type: String },
      status: { type: String },
      type: { type: String },
    },
    paidAt: { type: Date, default: Date.now() },
    deliveredAt: { type: Date },
    createdAt: { type: Date, default: Date.now() },
  },
  { timestamps: true }
);

// Order Model
const Order = mongoose.model('Order', orderSchema);
export default Order;
