import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Message } from "../models/message.model.js";
import { Conversation } from "../models/conversation.model.js";
import { Notification } from "../models/notification.model.js";
import mongoose from "mongoose";

// @desc    Send a message to another user
// @route   POST /api/v1/messages
// @access  Private
const sendMessage = asyncHandler(async (req: Request, res: Response) => {
    const { recipientId, content, gigId, contractId } = req.body;
    const senderId = req.user?._id;

    if (!mongoose.isValidObjectId(recipientId)) {
        throw new ApiError(400, "Invalid recipient ID");
    }

    let conversation = await Conversation.findOne({
        participants: { $all: [senderId, recipientId] },
    });

    if (!conversation) {
        conversation = await Conversation.create({
            participants: [senderId, recipientId],
            gigId,
            contractId
        });
    }

    const message = await Message.create({
        conversationId: conversation._id,
        senderId,
        senderRole: req.user?.role,
        content,
    });

    conversation.lastMessage = message.content;
    conversation.lastMessageAt = new Date();
    await conversation.save({ validateBeforeSave: false });

        // Create a notification for the recipient
    await Notification.create({
        userId: recipientId,
        message: `You have a new message from ${req.user?.firstName}`,
        link: `/messages/${conversation._id}`
    });

    // TODO: Implement real-time events with Socket.IO

    return res.status(201).json(new ApiResponse(201, message, "Message sent successfully"));
});

// @desc    Get all messages in a conversation
// @route   GET /api/v1/messages/:conversationId
// @access  Private
const getConversationMessages = asyncHandler(async (req: Request, res: Response) => {
    const { conversationId } = req.params;
    const userId = req.user?._id;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation || !conversation.participants.includes(userId)) {
        throw new ApiError(403, "Forbidden: You are not part of this conversation.");
    }

    const messages = await Message.find({ conversationId })
        .sort({ createdAt: 'asc' })
        .populate('senderId', 'firstName lastName avatar');

    return res.status(200).json(new ApiResponse(200, messages, "Messages fetched successfully"));
});

// @desc    Get all of a user's conversations
// @route   GET /api/v1/messages/conversations
// @access  Private
const getConversations = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const conversations = await Conversation.find({ participants: userId })
        .populate({
            path: 'participants',
            select: 'firstName lastName avatar',
            match: { _id: { $ne: userId } } // Exclude self from populated participants
        })
        .sort({ lastMessageAt: -1 });

    return res.status(200).json(new ApiResponse(200, conversations, "Conversations fetched successfully"));
});

export {
    sendMessage,
    getConversationMessages,
    getConversations
};
