import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ClientProfile } from "../models/clientProfile.model.js";
import { FreelancerProfile } from "../models/freelancerProfile.model.js";
import { User } from "../models/user.model.js";

const createClientProfile = asyncHandler(async (req: Request, res: Response) => {
    const { companyName, businessType, industryType, description, preferredBudgetRange } = req.body;
    const userId = req.user?._id;

    if ([companyName, businessType, industryType, description, preferredBudgetRange].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findById(userId);
    if (!user || user.role !== 'client') {
        throw new ApiError(403, "Unauthorized: Only clients can create client profiles.");
    }

    const existingProfile = await ClientProfile.findOne({ userId });
    if (existingProfile) {
        throw new ApiError(409, "Client profile already exists.");
    }

    const profile = await ClientProfile.create({
        userId,
        companyName,
        businessType,
        industryType,
        description,
        preferredBudgetRange,
    });

    return res.status(201).json(new ApiResponse(201, profile, "Client profile created successfully"));
});

const createFreelancerProfile = asyncHandler(async (req: Request, res: Response) => {
    const { title, bio, skills, hourlyRate, availability } = req.body;
    const userId = req.user?._id;

    if ([title, bio, skills, hourlyRate, availability].some((field) => !field)) {
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findById(userId);
    if (!user || user.role !== 'freelancer') {
        throw new ApiError(403, "Unauthorized: Only freelancers can create freelancer profiles.");
    }

    const existingProfile = await FreelancerProfile.findOne({ userId });
    if (existingProfile) {
        throw new ApiError(409, "Freelancer profile already exists.");
    }

    const profile = await FreelancerProfile.create({
        userId,
        title,
        bio,
        skills,
        hourlyRate,
        availability,
    });

    return res.status(201).json(new ApiResponse(201, profile, "Freelancer profile created successfully"));
});

const getUserProfile = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    let profile;
    if (user.role === 'client') {
        profile = await ClientProfile.findOne({ userId }).populate('userId', 'firstName lastName avatar');
    } else if (user.role === 'freelancer') {
        profile = await FreelancerProfile.findOne({ userId }).populate('userId', 'firstName lastName avatar');
    }

    if (!profile) {
        throw new ApiError(404, "Profile not found");
    }

    return res.status(200).json(new ApiResponse(200, profile, "Profile fetched successfully"));
});

const updateUserProfile = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const authenticatedUserId = req.user?._id;

    if (userId !== authenticatedUserId.toString()) {
        throw new ApiError(403, "Unauthorized: You can only update your own profile.");
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    let updatedProfile;
    if (user.role === 'client') {
        updatedProfile = await ClientProfile.findOneAndUpdate({ userId }, req.body, { new: true, runValidators: true });
    } else if (user.role === 'freelancer') {
        updatedProfile = await FreelancerProfile.findOneAndUpdate({ userId }, req.body, { new: true, runValidators: true });
    }

    if (!updatedProfile) {
        throw new ApiError(404, "Profile not found to update");
    }

    return res.status(200).json(new ApiResponse(200, updatedProfile, "Profile updated successfully"));
});

export {
    createClientProfile,
    createFreelancerProfile,
    getUserProfile,
    updateUserProfile
};
