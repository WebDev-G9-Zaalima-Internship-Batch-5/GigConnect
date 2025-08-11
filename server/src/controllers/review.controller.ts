import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Review } from "../models/review.model.js";
import { Contract } from "../models/contract.model.js";
import mongoose from "mongoose";

// @desc    Create a review for a completed contract
// @route   POST /api/v1/reviews
// @access  Private
const createReview = asyncHandler(async (req: Request, res: Response) => {
    const { contractId, rating, comment, wouldWorkAgain, skills } = req.body;
    const fromUserId = req.user?._id;

    if (!mongoose.isValidObjectId(contractId)) {
        throw new ApiError(400, "Invalid contract ID");
    }

    const contract = await Contract.findById(contractId);
    if (!contract) {
        throw new ApiError(404, "Contract not found");
    }

    // 1. Verify the user is part of the contract
    const isClient = contract.clientId.toString() === fromUserId.toString();
    const isFreelancer = contract.freelancerId.toString() === fromUserId.toString();

    if (!isClient && !isFreelancer) {
        throw new ApiError(403, "Forbidden: You are not a party to this contract.");
    }

    // 2. Determine the recipient of the review
    const toUserId = isClient ? contract.freelancerId : contract.clientId;

    // 3. Check if a review already exists
    const existingReview = await Review.findOne({ contractId, fromUserId });
    if (existingReview) {
        throw new ApiError(409, "You have already submitted a review for this contract.");
    }

    // 4. Create the review
    const review = await Review.create({
        contractId,
        fromUserId,
        toUserId,
        rating,
        comment,
        wouldWorkAgain,
        skills: isFreelancer ? undefined : skills // Only clients can rate freelancer skills
    });

    return res.status(201).json(new ApiResponse(201, review, "Review submitted successfully"));
});

// @desc    Get all reviews for a user
// @route   GET /api/v1/reviews/user/:userId
// @access  Public
const getUserReviews = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;

    if (!mongoose.isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID");
    }

    const reviews = await Review.find({ toUserId: userId })
        .populate('fromUserId', 'firstName lastName avatar');

    if (!reviews) {
        // Return empty array instead of error if no reviews are found
        return res.status(200).json(new ApiResponse(200, [], "No reviews found for this user"));
    }

    return res.status(200).json(new ApiResponse(200, reviews, "Reviews fetched successfully"));
});

export {
    createReview,
    getUserReviews
};
