import mongoose from "mongoose";

const { Schema } = mongoose;

// Schema for individual order items
const orderItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  title: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  subcategory: {
    type: Schema.Types.ObjectId,
    ref: "Subcategory",
    required: true,
  },
  brand: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
  supplier: { type: Schema.Types.ObjectId, ref: "Supplier", required: true },
  shop: { type: Schema.Types.ObjectId, ref: "Shop", required: true },
  productColor: { type: String, required: true },
  productImage: { type: String, required: true },
  size: { type: Schema.Types.Mixed, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  total: { type: Number, required: true }, // Total price for this item (quantity * price)
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

// Schema for refund details
const refundRequestSchema = new Schema({
  refundId: { type: String, required: true },
  title: { type: String, required: true },
  color: { type: String, required: true },
  size: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  amount: { type: Number, required: true },
  reason: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  userRefundId: { type: String }, // userRefundId will be used by the shop for reference
});

// Schema for payment details
const paymentSchema = new Schema({
  method: {
    type: String,
    required: true,
    enum: ["Credit Card", "PayPal", "Cash On Delivery"],
  },
  provider: { type: String, enum: ["Stripe", "PayPal"] },
  paymentStatus: {
    type: String,
    required: true,
    enum: ["pending", "completed", "refunded", "cancelled"],
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
  refunds: { type: [refundRequestSchema] },
  metadata: { type: Object, default: {} }, // Additional payment-related data
  createdBy: { type: Schema.Types.ObjectId, ref: "User" }, // User who initiated payment
  updatedBy: { type: Schema.Types.ObjectId, ref: "User" }, // User who updated payment
});

// Main order schema
const orderSchema = new Schema(
  {
    customer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    orderedItems: { type: [orderItemSchema], required: true },
    itemsQty: {
      type: Number,
      required: true,
      default: function () {
        return this.orderedItems.reduce((sum, item) => sum + item.quantity, 0);
      },
    },
    shippingAddress: { type: shippingAddressSchema, required: true },
    payment: { type: paymentSchema },
    subtotal: { type: Number, required: true, min: 0 }, // Total price of ordered items before tax, shipping, and service fees
    shippingFee: { type: Number, default: 0 },
    tax: { type: Number, default: 0 }, // Calculated tax amount
    serviceFee: { type: Number, default: 0 }, // Service charges for the app or platform
    grandTotal: { type: Number, required: true, min: 0 }, // subtotal + tax + shipping + service fees
    orderStatus: {
      type: String,
      required: true,
      enum: [
        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
        "Refund Requested",
        "Returned",
        "Refunded",
      ],
      default: "Pending",
    },
    statusHistory: [
      {
        status: {
          type: String,
          enum: [
            "Pending",
            "Processing",
            "Shipped",
            "Delivered",
            "Cancelled",
            "Refund Requested",
            "Returned",
            "Refunded",
          ],
        },
        changedAt: { type: Date, default: Date.now }, // Date of status change
        message: { type: String, trim: true }, // Message for status change
      },
    ],

    tracking: {
      carrier: { type: String }, // Carrier used for shipping
      trackingNumber: { type: String }, // Tracking number for the shipment
      estimatedDeliveryDate: { type: Date }, // Estimated delivery date
    },

    refundRequestInfo: { type: [refundRequestSchema] },

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
