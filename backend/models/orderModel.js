import mongoose from "mongoose";

const { Schema } = mongoose;

// Schema for individual order items
const orderItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
  brand: { type: String, required: true },
  supplier: { type: String, required: true },
  shop: { type: String, required: true },
  productColor: { type: String, required: true },
  size: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  total: { type: Number, required: true }, // Total price for this item (quantity * price)
  error: { type: String, trim: true }, // Optional field for errors during processing
});

// Schema for shipping details
const shippingAddressSchema = new Schema({
  country: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String, required: true },
  zipCode: { type: String, required: true },
  phoneNumber: { type: String, required: true },
});

// Schema for payment details
const paymentSchema = new Schema({
  method: {
    type: String,
    required: true,
    enum: ["paypal", "stripe", "Credit Card", "Cash On Delivery"],
  },
  provider: { type: String, enum: ["paypal", "stripe", "Credit Card"] }, // Payment provider
  paymentStatus: {
    type: String,
    required: true,
    enum: ["pending", "completed", "failed", "refunded", "cancelled"],
    default: "pending",
  },
  transactionId: { type: String, unique: true, sparse: true }, // Transaction ID
  currency: {
    type: String,
    required: true,
    default: "USD",
    enum: ["USD", "EUR", "GBP", "INR", "JPY", "AUD"],
  },
  amountPaid: { type: Number, required: true },
  paymentDate: { type: Date, default: Date.now },
  error: { type: String, trim: true },
  refunds: [
    {
      refundId: { type: String },
      amount: { type: Number },
      reason: { type: String }, // Reason for refund
      createdAt: { type: Date, default: Date.now },
    },
  ],
  metadata: { type: Object, default: {} }, // Additional payment-related data
  createdBy: { type: Schema.Types.ObjectId, ref: "User" }, // User who initiated payment
  updatedBy: { type: Schema.Types.ObjectId, ref: "User" }, // User who updated payment
});

// Main order schema
const orderSchema = new Schema(
  {
    customer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    orderedItems: { type: [orderItemSchema], required: true },
    shippingAddress: { type: shippingAddressSchema, required: true },
    payment: { type: paymentSchema },
    subtotal: { type: Number, required: true, min: 0 }, // Total price of ordered items before tax, shipping, and service fees
    shippingFee: { type: Number, default: 0 },
    tax: { type: Number, default: 0 }, // Calculated tax amount
    serviceFee: { type: Number, default: 0 }, // Additional service charges for the app or platform
    grandTotal: { type: Number, required: true, min: 0 }, // subtotal + tax + shipping + service fees
    orderStatus: {
      type: String, // Status of the order
      required: true,
      enum: [
        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
        "Returned",
      ],
      default: "Pending",
    },
    statusHistory: [
      {
        status: {
          type: String, // Historical status of the order
          enum: [
            "Pending",
            "Processing",
            "Shipped",
            "Delivered",
            "Cancelled",
            "Returned",
          ],
        },
        changedAt: { type: Date, default: Date.now }, // Date of status change
      },
    ],
    tracking: {
      carrier: { type: String }, // Carrier used for shipping
      trackingNumber: { type: String }, // Tracking number for the shipment
      estimatedDeliveryDate: { type: Date }, // Estimated delivery date
    },
    cancellationReason: { type: String },
    returnReason: { type: String },
    deliveredAt: { type: Date },
    version: { type: Number, default: 1 },
  },
  { timestamps: true }
);

// Add indexes for frequent queries
orderSchema.index({ customer: 1, orderStatus: 1, createdAt: -1 });
orderSchema.index({ "payment.transactionId": 1 }, { sparse: true });
orderSchema.index({ "tracking.trackingNumber": 1 }, { sparse: true });

const Order = mongoose.model("Order", orderSchema);
export default Order;
