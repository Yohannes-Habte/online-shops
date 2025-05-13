import OrderCancellation from "../models/orderCancellationModel.js";
import Shop from "../models/shopModel.js";
import createError from "http-errors";
import mongoose from "mongoose";
import Order from "../models/orderModel.js";
import { addToStatusHistory } from "../utils/orderHelperFunctions.js";

export const createCancellationOrder = async (req, res, next) => {
  const { orderId, requestedBy, reason, otherReason } = req.body;
  const authUserId = req.user.id;

  if (!authUserId || !mongoose.Types.ObjectId.isValid(authUserId))
    return next(createError(400, "Invalid or missing user ID!"));

  if (!mongoose.Types.ObjectId.isValid(orderId))
    return next(createError(400, "Invalid order ID!"));

  if (!mongoose.Types.ObjectId.isValid(requestedBy))
    return next(createError(400, "Invalid user ID!"));

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Fetch order
    const order = await Order.findById(orderId).session(session);
    if (!order) {
      await session.abortTransaction();
      session.endSession();
      return next(createError(404, "Order not found!"));
    }

    // Check if already cancelled
    if (order.orderStatus === "Cancelled") {
      await session.abortTransaction();
      session.endSession();
      return next(
        createError(
          400,
          "Order cannot be cancelled in its current status: Cancelled"
        )
      );
    }

    // Validate shop
    const shopId = order.orderedItems?.[0]?.shop?._id;
    if (!shopId || !mongoose.Types.ObjectId.isValid(shopId)) {
      await session.abortTransaction();
      session.endSession();
      return next(createError(400, "Invalid or missing shop ID!"));
    }

    const shop = await Shop.findById(shopId).session(session);
    if (!shop) {
      await session.abortTransaction();
      session.endSession();
      return next(createError(404, "Shop not found!"));
    }

    // Validate order status
    const cancellableStatuses = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
    ];
    const nonCancellableStatuses = [
      "Refund Requested",
      "Returned Items",
      "Refund Processing",
      "Refunded",
      "Cancelled",
    ];

    if (
      !cancellableStatuses.includes(order.orderStatus) ||
      nonCancellableStatuses.includes(order.orderStatus)
    ) {
      await session.abortTransaction();
      session.endSession();
      return next(
        createError(
          400,
          `Order cannot be cancelled in its current status: ${order.orderStatus}`
        )
      );
    }

    // Check if cancellation already exists
    const existingCancellation = await OrderCancellation.findOne({
      orderId,
    }).session(session);

    if (existingCancellation) {
      await session.abortTransaction();
      session.endSession();
      return next(
        createError(400, "Cancellation already exists for this order!")
      );
    }

    // Create cancellation record
    const cancellationOrder = new OrderCancellation({
      orderId,
      requestedBy,
      reason,
      otherReason,
    });
    await cancellationOrder.save({ session });

    // Update shop
    shop.cancelledOrders.push(cancellationOrder._id);
    await shop.save({ session });

    // Finally, update order only after all the above succeed
    order.cancelledOrder = cancellationOrder._id;
    const updatedStatus = "Cancelled";
    order.orderStatus = updatedStatus;
    addToStatusHistory(order, updatedStatus);
    await order.save({ session });

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      cancel: cancellationOrder,
      message: "Cancellation order created successfully!",
    });
  } catch (error) {
    console.error("Error creating cancellation order:", error);
    await session.abortTransaction();
    session.endSession();
    return next(createError(500, "Internal server error!"));
  }
};

export const updateCancellationOrder = async (req, res, next) => {
  const { orderId, cancellationStatus, reviewerNotes, reviewedDate, reviewer } =
    req.body;

  const shopId = req.shop.id;

  if (!shopId || !mongoose.Types.ObjectId.isValid(shopId))
    return next(createError(400, "Invalid or missing shop ID!"));

  if (!mongoose.Types.ObjectId.isValid(orderId))
    return next(createError(400, "Invalid order ID!"));

  if (!mongoose.Types.ObjectId.isValid(reviewer))
    return next(createError(400, "Invalid shop ID!"));

  if (shopId !== reviewer)
    return next(
      createError(
        403,
        "You are not authorized to update this cancellation order!"
      )
    );

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const shop = await Shop.findById(shopId).session(session);
    if (!shop) {
      await session.abortTransaction();
      session.endSession();
      return next(createError(404, "Shop not found!"));
    }

    const order = await Order.findById(orderId).session(session);
    if (!order) {
      await session.abortTransaction();
      session.endSession();
      return next(createError(404, "Order not found!"));
    }

    // Check if already cancelled
    if (order.orderStatus !== "Cancelled") {
      await session.abortTransaction();
      session.endSession();
      return next(
        createError(
          400,
          "Order cannot be updated if the current status is: " +
            order.orderStatus
        )
      );
    }

    const existingCancellation = await OrderCancellation.findOne({
      orderId,
    }).session(session);

    if (!existingCancellation) {
      await session.abortTransaction();
      session.endSession();
      return next(
        createError(400, "Cancellation does not exist for this order!")
      );
    }

    // Update cancellation order
    const updatedOrder = await OrderCancellation.findByIdAndUpdate(
      existingCancellation._id,
      {
        cancellationStatus,
        reviewerNotes,
        reviewedDate,
        reviewer,
      },
      { new: true, session }
    );

    // Since the cancellation order is updated, we need to update the cancelledOrder id in the cancelledOrders array in the shop model
    const index = shop.cancelledOrders.indexOf(existingCancellation._id);
    if (index !== -1) {
      shop.cancelledOrders[index] = updatedOrder._id;
    } else {
      await session.abortTransaction();
      session.endSession();
      return next(createError(400, "Cancellation order not found in shop!"));
    }

    await shop.save({ session });

    // Finally, update order only after all the above succeed
    order.cancelledOrder = updatedOrder._id;
    const updatedStatus = "Cancelled";
    order.orderStatus = updatedStatus;
    addToStatusHistory(order, updatedStatus);
    await order.save({ session });

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      update: updatedOrder,
      message: "Cancellation order updated successfully!",
    });
  } catch (error) {
    console.error("Error updating cancellation order:", error);
    await session.abortTransaction();
    session.endSession();
    return next(createError(500, "Internal server error!"));
  }
};
