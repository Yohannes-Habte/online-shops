import Conversation from '../models/conversationModel.js';
import createError from 'http-errors';

//=========================================================================
// Create new conversation
//=========================================================================

export const createConversation = async (req, res, next) => {
  try {
    const { groupTitle, userId, sellerId } = req.body;
    const foundConversation = await Conversation.findOne({ groupTitle });

    if (foundConversation) {
      // This is used to avoid error when the group title is arleady exist
      const conversation = foundConversation;
      res.status(201).json({
        success: true,
        conversation,
      });
    } else {
      const conversation = await Conversation.create({
        members: [userId, sellerId],
        groupTitle: groupTitle,
      });

      res.status(201).json({ success: true, conversation });
    }
  } catch (error) {
    next(
      createError(500, 'Conversation could not be create! Please try again!')
    );
  }
};

//=========================================================================
// Update the last message
//=========================================================================
export const updateLastMessage = async (req, res, next) => {
  try {
    const { lastMessage, messageSenderId } = req.body;

    const conversation = await Conversation.findByIdAndUpdate(
      req.params.id,
      { $set: { lastMessage: lastMessage, messageSenderId: messageSenderId } },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, conversation });
  } catch (error) {
    console.log(error);
    next(createError(500, 'Last message could not update! Please try again!'));
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
      return next(createError(400, 'No conversations exist!'));
    }

    res.status(200).json({ success: true, conversations });
  } catch (error) {
    console.log(error);
    next(
      createError(500, 'Conversations could not accessed! Please try again!')
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
      return next(createError(400, 'No conversations exist!'));
    }

    res.status(200).json({ success: true, conversations });
  } catch (error) {
    console.log(error);
    next(
      createError(500, 'Conversations could not accessed! Please try again!')
    );
  }

};
