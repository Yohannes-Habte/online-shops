import Shop from '../models/shopModel.js';
import Event from '../models/eventModel.js';
import createError from 'http-errors';

//==============================================================================
// Create Event
//==============================================================================
export const createEvent = async (req, res, next) => {
  try {
    // Find shop ID
    const shopId = req.body.shopId;
    const shop = await Shop.findById(shopId);

    if (!shop) {
      return createError(401, 'Shop not found! Please login!');
    }
    // Create new event
    const event = new Event({
      ...req.body,
      shop: shop,
    });

    try {
      await event.save();
    } catch (error) {
      return createError(500, 'Event is not saved! Please try again!');
    }

    return res.status(201).json({ success: true, event: event });
  } catch (error) {
    console.log(error);
    next(createError(500, 'Event could not be created! Please try again!'));
  }
};

//==============================================================================
// Get Single Event
//==============================================================================
export const getShopSingleEvent = async (req, res, next) => {
  try {
    // Get the ids for the shop and the Event
    const shopID = req.params.shopID;
    const eventID = req.params.eventID;

    // find the shop id (seller id) and then find the Event id
    const shop = await Shop.findById(shopID);
    if (!shop) {
      return next(createError(400, 'Shop not found!'));
    }

    // Event id
    const event = await Event.findById(eventID);
    if (!event) {
      return next(createError(400, `Event not found in ${shop.name} shop !`));
    }

    // If shop and Event exist, then you can get the Event for that particular shop
    if (shop && event) {
      return res.status(200).json(event);
    }
  } catch (error) {
    console.log(error);
    next(createError(500, 'Event could not be accessed! Please try again!'));
  }
};

//==============================================================================
// Get All Events for a particular shop
//==============================================================================
export const getAllShopEvents = async (req, res, next) => {
  try {
    const shopID = req.params.shopID;

    const shop = await Shop.findById(shopID);

    if (!shop) {
      return next(createError(400, 'Shop not found!'));
    }

    const events = await Event.find({ shopId: shopID });

    if (!events) {
      return next(createError(400, 'Events not found!'));
    }
    if (shop && events) {
      return res.status(200).json({ success: true, events: events });
    }
  } catch (error) {
    console.log(error);
    next(createError(500, 'Events could not query! Please try again!'));
  }
};

//==============================================================================
// Get All Events for all shops
//==============================================================================
export const getAllShopsEvents = async (req, res, next) => {
  try {
    const events = await Event.find();
    if (!events) {
      return next(createError(400, 'Events not found!'));
    } else {
      return res.status(200).json(events);
    }
  } catch (error) {
    console.log(error);
    next(createError(500, 'Events could not query! Please try again!'));
  }
};

//==============================================================================
// Delete a Single Event from a specific shop
//==============================================================================
export const deleteShopSingleEvent = async (req, res, next) => {
  try {
    // Event id
    const event = await Event.findById(req.params.eventID);
    if (!event) {
      return next(createError(400, `Event not found!`));
    }

    // If shop and Event exist, then you can get the Event for that particular shop
    if (event) {
      await Event.findByIdAndDelete(req.params.eventID);
      return res
        .status(200)
        .json(`The ${event.name} has been successfully deleted!`);
    }
  } catch (error) {
    console.log(error);
    next(createError(500, 'Event could not be deleted! Please try again!'));
  }
};

//==============================================================================
// Admin has mandate to access all Events for all shops
//==============================================================================
export const allShopsEvents = async (req, res, next) => {
  try {
    const events = await Event.find().sort({
      createdAt: -1,
    });
    if (!events) {
      return next(createError(400, 'Events not found!'));
    } else {
      return res.status(200).json({
        success: true,
        events,
      });
    }
  } catch (error) {
    console.log(error);
    next(createError(500, 'Events could not query! Please try again!'));
  }
};
