import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Notification } from "../models/notification.model.js";
import mongoose from "mongoose";

// @desc    Get all notifications for a user
// @route   GET /api/v1/notifications
// @access  Private
const getUserNotifications = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const notifications = await Notification.find({ userId })
        .sort({ createdAt: -1 });

    return res.status(200).json(new ApiResponse(200, notifications, "Notifications fetched successfully"));
});

// @desc    Mark notifications as read
// @route   PATCH /api/v1/notifications/mark-read
// @access  Private
const markNotificationsAsRead = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { notificationIds } = req.body; // Expecting an array of notification IDs

    if (!notificationIds || !Array.isArray(notificationIds)) {
        throw new ApiError(400, "An array of notification IDs is required.");
    }

    await Notification.updateMany(
        { _id: { $in: notificationIds }, userId },
        { $set: { isRead: true } }
    );

    return res.status(200).json(new ApiResponse(200, {}, "Notifications marked as read"));
});

export {
    getUserNotifications,
    markNotificationsAsRead
};
