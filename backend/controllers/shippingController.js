import Shipment from "../models/shipmentModel.js";
import createError from "http-errors";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import Order from "../models/orderModel.js";
import Shop from "../models/shopModel.js";
import { addToStatusHistory } from "../utils/orderHelperFunctions.js";

export const createShipping = async (req, res, next) => {
  const {
    order,
    provider,
    serviceType,
    weightKg,
    insuranceSupported,
    trackingNumber,
    trackingUrlTemplate,
    trackingUrl,
    contact,
    deliveryAddress,
    continent,
    region,
    shippingStatus,
    expectedDeliveryDate,
    actualDeliveryDate,
    notes,
  } = req.body;

  const shopId = req.shop.id;

  // Validate IDs
  if (!mongoose.Types.ObjectId.isValid(order)) {
    return next(createError(400, "Invalid order ID"));
  }
  if (!mongoose.Types.ObjectId.isValid(shopId)) {
    return next(createError(400, "Invalid shop ID"));
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // If the shipping exists, return an error
    const existingShipment = await Shipment.findOne({ order }).session(session);

    if (existingShipment) {
      await session.abortTransaction();
      return next(createError(400, "This order is already shipped."));
    }

    const shopDetails = await Shop.findById(shopId).session(session);

    if (!shopDetails) {
      await session.abortTransaction();
      next(createError(404, "Shop not found."));
    }

    const orderDetails = await Order.findById(order).session(session);

    if (!orderDetails) {
      await session.abortTransaction();
      next(createError(404, "Order not found."));
    }

    // Validate order status
    const orderShippingStatuses = [
      "Pending",
      "Shipped",
      "Delivered",
      "Returned",
      "Refund Requested",
      "Returned Items",
      "Refund Processing",
      "Refunded",
      "Cancelled",
    ];

    if (orderShippingStatuses.includes(orderDetails.orderStatus)) {
      await session.abortTransaction();
      return next(
        createError(
          400,
          `Order cannot be shipped if the current status is ${orderDetails.orderStatus}.`
        )
      );
    }

    const providerCode = uuidv4();

    const shipment = new Shipment({
      order,
      provider,
      providerCode,
      serviceType,
      weightKg,
      insuranceSupported,
      trackingNumber,
      trackingUrlTemplate,
      trackingUrl,
      contact,
      deliveryAddress,
      continent,
      region,
      shippingStatus,
      expectedDeliveryDate,
      actualDeliveryDate,
      notes,
    });

    shipment.$session(session);
    await shipment.save();

    // Update order
    const updatedOrderStatus = "Shipped";
    orderDetails.orderStatus = updatedOrderStatus;
    orderDetails.shipping = shipment._id;
    addToStatusHistory(orderDetails, updatedOrderStatus);

    orderDetails.$session(session);
    await orderDetails.save();

    // Update shop
    shopDetails.shippings.push(shipment._id);

    shopDetails.$session(session);
    await shopDetails.save();

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      message: "Shipment created successfully.",
    });
  } catch (error) {
    console.error("Error creating shipment:", error);
    await session.abortTransaction();
    return next(createError(500, error.message || "Internal Server Error"));
  } finally {
    session.endSession();
  }
};
