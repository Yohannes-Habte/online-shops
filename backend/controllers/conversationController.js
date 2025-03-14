import mongoose, { mongo } from "mongoose";
import Conversation from "../models/conversationModel.js";
import createError from "http-errors";

//=========================================================================
// Create new conversation
//=========================================================================

export const createConversation = async (req, res, next) => {
  const {
    groupTitle,
    userId,
    sellerId,
    productId,
    variant,
    productColor,
    productSize,
  } = req.body;

  const authUserId = req.user.id;

  // Validate IDs
  if (
    ![userId, sellerId, productId, authUserId].every(
      mongoose.Types.ObjectId.isValid
    )
  ) {
    return next(createError(400, "Invalid ID format"));
  }

  if (authUserId !== userId) {
    return next(
      createError(
        403,
        "Forbidden: You do not have permission to perform this action"
      )
    );
  }
  try {
    
    const foundConversation = await Conversation.findOne({ groupTitle });

    if (foundConversation) {
      // This is used to avoid error when the group title is already exist
      const conversation = foundConversation;
      res.status(201).json({
        success: true,
        conversation,
      });
    } else {
      const conversation = await Conversation.create({
        groupTitle,
        members: [userId, sellerId],
        messageSenderId: userId,
        productId,
        variant,
        productColor,
        productSize,
      });

      res.status(201).json({ success: true, conversation });
    }
  } catch (error) {
    next(
      createError(500, "Conversation could not be create! Please try again!")
    );
  }
};

//=========================================================================
// Update the last message
//=========================================================================
export const updateLastMessage = async (req, res, next) => {
  try {
    const { lastMessage, lastMessageId } = req.body;

    if(!mongoose.Types.ObjectId.isValid(lastMessageId)) {
      return next(createError(400, "Invalid ID format"));
    }

    const conversation = await Conversation.findByIdAndUpdate(
      req.params.id,
      { $set: { lastMessage: lastMessage, lastMessageId: lastMessageId } },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, conversation });
  } catch (error) {
    console.log(error);
    next(createError(500, "Last message could not update! Please try again!"));
  }
};

//=========================================================================
// Get all shop conversations
//=========================================================================

export const getAllShopConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      members: { $in: [req.params.id] },
    }).sort({ updatedAt: -1, createdAt: -1 });

    if (!conversations) {
      return next(createError(400, "No conversations exist!"));
    }

    res.status(200).json({ success: true, conversations });
  } catch (error) {
    console.log(error);
    next(
      createError(500, "Conversations could not accessed! Please try again!")
    );
  }
};

//=========================================================================
// Get all user conversations
//=========================================================================

export const getAllUserConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      members: {
        $in: [req.params.id],
      },
    }).sort({ updatedAt: -1, createdAt: -1 });

    if (!conversations) {
      return next(createError(400, "No conversations exist!"));
    }

    res.status(200).json({ success: true, conversations });
  } catch (error) {
    console.log(error);
    next(
      createError(500, "Conversations could not accessed! Please try again!")
    );
  }
};
