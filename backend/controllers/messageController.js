import Message from '../models/messageModel.js';
import createError from 'http-errors';

//=========================================================================
// Create new message
//=========================================================================

export const createMessage = async (req, res, next) => {
  try {
    const { conversationId, textMessage, sender, images } = req.body;
    const message = new Message({
      conversationId: conversationId,
      textMessage: textMessage,
      sender: sender,
      images: images,
    });

    await message.save();

    res.status(201).json({ success: true, message });
  } catch (error) {
    next(createError(500, 'Message could not be created! Please try again!'));
  }
};

//=========================================================================
// Get all messages for a particular conversationId 
//=========================================================================

export const getAllSenderMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({ conversationId: req.params.id });
    if (!messages) {
      return next(createError(400, 'Messages not found! Please try again!'));
    }

    res.status(200).json({ success: true, messages });
  } catch (error) {
    next(createError(500, 'Messages could not be accessed! Please try again!'));
  }
};
