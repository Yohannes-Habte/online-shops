import mongoose from "mongoose";

const { Schema } = mongoose;

// Schema for individual order items
const orderItemSchema = new Schema(
  {
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
  },
  { timestamps: true }
);

// Schema for shipping details
const shippingAddressSchema = new Schema(
  {
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    zipCode: { type: String, required: true },
    phoneNumber: { type: String, required: true },
  },
  { timestamps: true }
);

// Schema for payment details
const paymentSchema = new Schema(
  {
    method: {
      type: String,
      required: true,
      enum: [
        "Credit Card",
        "Debit Card",
        "Bank Transfer",
        "Direct Debit",
        "Cash On Delivery",
        "PayPal",
        "Stripe",
        "Crypto",
      ],
    },

    provider: {
      type: String,
      enum: [
        "Stripe",
        "PayPal",
        "Bank Transfer",
        "Square",
        "Authorize.Net",
        "Razorpay",
        "Google Pay",
        "Apple Pay",
      ],
    },

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
      uppercase: true,
      required: true,
    },

    amountPaid: { type: Number, required: true },

    paymentDate: { type: Date, default: Date.now },

    refunds: [
      {
        returnedId: { type: Schema.Types.ObjectId, required: true }, // Links to returnedItems.returnRequestId
        refundId: { type: String, required: true },
        processedBy: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        refundAmount: { type: Number, required: true }, // Taken from returned item
        refundMethod: {
          type: String,
          enum: [
            "Original Payment Method",
            "Store Credit",
            "Bank Transfer",
            "Digital Wallet",
            "Cheque",
          ],
          required: true,
        },

        refundDate: { type: Date, default: Date.now },
      },
    ],

    metadata: { type: Map, of: Schema.Types.Mixed, default: {} },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

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

    shipping: { type: mongoose.Schema.Types.ObjectId, ref: "Shipment" },

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
        "Awaiting Item Return",
        "Returned",
        "Refund Processing",
        "Refund Rejected",
        "Refund Accepted",
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
            "Awaiting Item Return",
            "Returned",
            "Refund Processing",
            "Refund Rejected",
            "Refund Accepted",
            "Refunded",
          ],
          default: "Pending",
        },
        changedAt: { type: Date, default: Date.now }, // Date of status change
        message: { type: String, trim: true }, // Message for status change
      },
    ],

    tracking: {
      carrier: { type: String, default: null },
      trackingNumber: { type: String, default: null },
      estimatedDeliveryDate: { type: Date, default: null },
    },

    transaction: { type: Schema.Types.ObjectId, ref: "Transaction" },

    refundRequests: [{ type: Schema.Types.ObjectId, ref: "RefundRequest" }],

    returnedItems: [{ type: Schema.Types.ObjectId, ref: "ReturnRequest" }],

    cancellationReason: { type: String }, // Cancellation reason provided by the customer if the entire order is cancelled

    cancellationDate: { type: Date }, // Date when the order was cancelled

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
