import Shop from "../models/shopModel.js";
import Event from "../models/eventModel.js";
import createError from "http-errors";
import mongoose, { model } from "mongoose";
import crypto from "crypto";

//==============================================================================
// Create Event
//==============================================================================
export const createEvent = async (req, res, next) => {
  const {
    eventName,
    description,
    tags,
    images,
    originalPrice,
    discountPrice,
    startDate,
    endDate,
    stock,
    purposes,
    category,
    subcategory,
    shop,
    brand,
    supplier,
  } = req.body;

  const shopId = req.shop.id;

  if (!mongoose.Types.ObjectId.isValid(shopId)) {
    return next(createError(400, "Invalid shop ID format"));
  }

  if (!mongoose.Types.ObjectId.isValid(shop)) {
    return next(createError(400, "Shop ID is not valid."));
  }

  if (shopId !== shop) {
    return next(createError(400, "Shop ID is not valid."));
  }

  try {
    const shopExists = await Shop.findById(shopId);
    if (!shopExists) {
      return next(createError(404, "Shop not found"));
    }

    // Generate a secure event identification code (UUID)
    const eventIdentificationCode = crypto.randomUUID();

    const eventExists = await Event.findOne({
      eventCode: eventIdentificationCode,
    });
    if (eventExists) {
      return next(createError(400, "Event code already exists!"));
    }

    // Create new event
    const newEvent = new Event({
      eventName,
      description,
      tags,
      images,
      originalPrice,
      discountPrice,
      startDate,
      endDate,
      stock,
      purposes,
      category,
      subcategory,
      shop,
      brand,
      supplier,
      eventCode: eventIdentificationCode, // Save secure event code
    });

    // Save the event
    await newEvent.save();

    return res.status(201).json({
      success: true,
      message: "Event created successfully!",
      event: newEvent,
    });
  } catch (error) {
    console.error("Error creating event:", error);
    next(createError(500, "Event could not be created! Please try again."));
  }
};
//==============================================================================
// Get Single Event
//==============================================================================
export const getShopSingleEvent = async (req, res, next) => {
  try {
    const { eventID } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eventID)) {
      return next(createError(400, "Invalid Event ID format"));
    }

    const event = await Event.findById(eventID)
      .populate([
        { path: "shop", model: "Shop" },
        { path: "category", model: "Category" },
        { path: "subcategory", model: "Subcategory" },
        { path: "brand", model: "Brand" },
        { path: "supplier", model: "Supplier" },
      ])
      .select("-__v")
      .lean();

    if (!event) {
      return next(createError(404, "Event not found"));
    }

    return res.status(200).json({ success: true, event });
  } catch (error) {
    console.error("Error fetching event:", error);
    next(
      createError(
        500,
        "An error occurred while retrieving the event. Please try again."
      )
    );
  }
};

//==============================================================================
// Get All Events for a particular shop
//==============================================================================
export const getAllShopEvents = async (req, res, next) => {
  try {
    const shopID = req.shop.id;

    if (!mongoose.Types.ObjectId.isValid(shopID)) {
      return next(createError(400, "Invalid Shop ID format"));
    }

    const shop = await Shop.findById(shopID).select("name location");

    if (!shop) {
      return next(createError(404, "Shop not found"));
    }

    const events = await Event.find({ shop: shopID })
      .populate([
        { path: "shop", model: "Shop", select: "name shopAddress" }, // Limit fields
        { path: "category", model: "Category", select: "categoryName" },
        {
          path: "subcategory",
          model: "Subcategory",
          select: "subcategoryName",
        },
        { path: "brand", model: "Brand", select: "brandName" },
        { path: "supplier", model: "Supplier", select: "supplierName" },
      ])
      .select("-__v")
      .lean();

    if (!events.length) {
      return next(createError(404, "No events found for this shop"));
    }

    return res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    console.error("Error fetching shop events:", error.message);
    next(
      createError(
        500,
        "An error occurred while retrieving events. Please try again."
      )
    );
  }
};

//==============================================================================
// Get All Events for All Shops
//==============================================================================
export const getAllShopsEvents = async (req, res, next) => {
  try {
    const events = await Event.find()
      .populate([
        { path: "shop", model: "Shop" },
        { path: "category", model: "Category" },
        { path: "subcategory", model: "Subcategory" },
        { path: "brand", model: "Brand" },
        { path: "supplier", model: "Supplier" },
      ])
      .select("-__v") // Exclude metadata fields
      .lean(); // Optimize query performance

    if (!events.length) {
      return next(createError(404, "No events found"));
    }

    return res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    console.error("Error fetching events:", error.message);
    next(
      createError(
        500,
        "An error occurred while retrieving events. Please try again."
      )
    );
  }
};

//==============================================================================
// Update a Single Event from a Specific Shop
//==============================================================================
//==============================================================================
// Update a Single Event from a Specific Shop
//==============================================================================

export const updateShopSingleEvent = async (req, res, next) => {
  try {
    const {
      eventName,
      description,
      tags,
      images,
      originalPrice,
      discountPrice,
      startDate,
      endDate,
      stock,
      purposes,
      category,
      subcategory,
      shop,
      brand,
      supplier,
    } = req.body;

    const shopId = req.shop.id;
    const { eventID } = req.params;

    if (!mongoose.Types.ObjectId.isValid(shopId)) {
      return next(createError(400, "Invalid Shop ID format"));
    }

    if (!mongoose.Types.ObjectId.isValid(eventID)) {
      return next(createError(400, "Invalid Event ID format"));
    }

    if (
      !mongoose.Types.ObjectId.isValid(shop) ||
      shopId.toString() !== shop.toString()
    ) {
      return next(createError(403, "Unauthorized: Shop ID mismatch."));
    }

    // Check if shop exists
    const shopExists = await Shop.findById(shopId);
    if (!shopExists) {
      return next(createError(404, "Shop not found"));
    }

    // Check if event exists and belongs to the shop
    const eventExists = await Event.findOne({ _id: eventID, shop: shopId });
    if (!eventExists) {
      return next(
        createError(404, "Event not found or does not belong to this shop")
      );
    }

    // Update the event
    const updatedEvent = await Event.findOneAndUpdate(
      { _id: eventID, shop: shopId }, // Ensures the event belongs to the shop
      {
        $set: {
          eventName,
          description,
          tags,
          images,
          originalPrice,
          discountPrice,
          startDate,
          endDate,
          stock,
          purposes,
          category,
          subcategory,
          brand,
          supplier,
        },
      },
      { new: true, runValidators: true }
    ).select("-__v");

    return res.status(200).json({
      success: true,
      message: "Event updated successfully!",
      event: updatedEvent,
    });
  } catch (error) {
    console.error("Error updating event:", error.message);
    next(createError(500, "An error occurred while updating the event"));
  }
};

//==============================================================================
// Delete a Single Event from a specific shop
//==============================================================================
export const deleteShopSingleEvent = async (req, res, next) => {
  try {
    const shopId = req.shop.id;
    const { eventID } = req.params;

    if (!mongoose.Types.ObjectId.isValid(shopId)) {
      return next(createError(400, "Invalid Shop ID format"));
    }

    if (!mongoose.Types.ObjectId.isValid(eventID)) {
      return next(createError(400, "Invalid Event ID format"));
    }

    // Check if event exists and belongs to the shop
    const event = await Event.findOne({ _id: eventID, shop: shopId });

    if (!event) {
      return next(
        createError(404, "Event not found or does not belong to this shop")
      );
    }

    // Delete the event
    await Event.findOneAndDelete({ _id: eventID, shop: shopId });

    return res.status(200).json({
      success: true,
      message: "Event deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting event:", error.message);
    next(
      createError(
        500,
        "An error occurred while deleting the event. Please try again."
      )
    );
  }
};
