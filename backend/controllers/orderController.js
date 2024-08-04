import createError from 'http-errors';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import Shop from '../models/shopModel.js';

//=========================================================================
// Create an order
//=========================================================================

export const createOrder = async (req, res, next) => {
  try {
    const { cart, shippingAddress, user, totalPrice, paymentInfo } = req.body;
    // group cart items by shopId
    const shopItemsMap = new Map();

    // Use a for loop to assign each item to the shop it belongs to
    for (const item of cart) {
      const shopId = item.shopId;
      if (!shopItemsMap.has(shopId)) {
        shopItemsMap.set(shopId, []);
      }
      // Push item to the shop it blongs to
      shopItemsMap.get(shopId).push(item);
    }

    // Create an order for each shop
    const orders = [];

    // the items belongs to the items in  shopItemsMap.get(shopId).push(item)
    for (const [shopId, items] of shopItemsMap) {
      const order = await Order.create({
        cart: items,
        shippingAddress,
        user,
        totalPrice,
        paymentInfo,
      });
      orders.push(order);
    }

    res.status(201).json({
      success: true,
      orders,
    });
  } catch (error) {
    next(createError(500, 'Order is not created! Please try again!'));
  }
};

//=========================================================================
// Update order status for a shop
//=========================================================================

export const updateShopOrders = async (req, res, next) => {
  try {
    // Find order by id
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(createError(400, 'Order not found!'));
    }

    // Update each ordered product using forEach method and updateOrder function
    if (req.body.status === 'Transferred to delivery partner') {
      order.cart.forEach(async (product) => {
        await updateOrder(product._id, product.qty);
      });
    }

    // The order status in the database will be ...
    order.status = req.body.status;

    // Update shop info using updateShopInfo function
    if (req.body.status === 'Delivered') {
      order.deliveredAt = Date.now();
      order.paymentInfo.status = 'Succeeded';
      const serviceCharge = order.totalPrice * 0.1;
      const ammount = order.totalPrice - serviceCharge;
      await updateShopInfo(ammount);
    }

    // Save the order
    await order.save({ validateBeforeSave: false });

    // Response is ...
    res.status(200).json({
      success: true,
      order,
    });

    // update product after an order has been transferred to delivery partner
    async function updateOrder(id, qty) {
      const product = await Product.findById(id);

      product.stock = product.stock - qty;
      product.sold_out = product.sold_out + qty;

      await product.save({ validateBeforeSave: false });
    }

    // update shop info after an order has been delivered to a user
    async function updateShopInfo(amount) {
      const shop = await Shop.findById(req.params.shopId);

      shop.availableBalance = amount;

      await shop.save();
    }
  } catch (error) {
    console.log(error);
    next(createError(500, 'Order is not updated! Please try again!'));
  }
};

//=========================================================================
// Order Refund for a user
//=========================================================================

export const refundUserOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(createError(400, 'Order does not exist in the database!'));
    }

    // Update status from the frontend
    order.status = req.body.status;

    // Save order update
    await order.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      order,
      message: `Refund Request for your order is successful!`,
    });
  } catch (error) {
    next(createError(500, 'Database could not refund! Please try again!'));
  }
};

//=========================================================================
// Shop Refunds back to a user ordered products
//=========================================================================

export const orderRefundByShop = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(createError(400, 'Order does not exist!'));
    }

    // Update status from the frontend
    order.status = req.body.status;

    // Save refund status
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order Refund is successfull!',
    });

    // Update order function
    const updateOrder = async (id, qty) => {
      const product = await Product.findById(id);

      product.stock = product.stock + qty;
      product.sold_out = product.sold_out - qty;

      await product.save({ validateBeforeSave: false });
    };

    // If status is 'Successfully refunded', then ...
    if (req.body.status === 'Successfully refunded') {
      order.cart.forEach(async (order) => {
        await updateOrder(order._id, order.qty);
      });
    }
  } catch (error) {
    next(createError(500, 'Database could not refund! Please try again!'));
  }
};

//=========================================================================
// Get an order
//=========================================================================

export const getOrder = async (req, res, next) => {
  try {
    res.send('New order');
  } catch (error) {
    next(createError(500, 'Order could not be accessed! Please try again!'));
  }
};

//=========================================================================
// Get all orders for a user
//=========================================================================

export const getAllUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ 'user._id': req.params.userId }).sort({
      createdAt: -1,
    });

    if (!orders) {
      return next(createError(400, 'User orders not found! Please try again!'));
    }

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    next(createError(500, 'Orders could not be accessed! Please try again!'));
  }
};

//=========================================================================
// Get all orders for a seller
//=========================================================================

export const allShopOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      'cart.shopId': req.params.shopId,
    }).sort({
      createdAt: -1,
    });

    if (!orders) {
      return next(
        createError(400, 'Seller orders not found! Please try again!')
      );
    }

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    next(createError(500, 'Orders could not be accessed! Please try again!'));
  }
};

//=========================================================================
// Delete an order
//=========================================================================

export const deleteOrder = async (req, res, next) => {
  try {
    res.send('New order');
  } catch (error) {
    next(createError(500, 'Order could not be deleted! Please try again!'));
  }
};

//=========================================================================
// Delete all orders
//=========================================================================

export const deleteOrders = async (req, res, next) => {
  try {
    res.send('New order');
  } catch (error) {
    next(createError(500, 'Orders could not be deleted! Please try again!'));
  }
};

//=========================================================================
// Get all orders for all shops by an admin
//=========================================================================

export const allShopsOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().sort({
      deliveredAt: -1,
      createdAt: -1,
    });
    res.status(201).json({
      success: true,
      orders,
    });
  } catch (error) {
    next(
      createError(500, 'All shops orders could not be accessed! Try again!')
    );
  }
};
