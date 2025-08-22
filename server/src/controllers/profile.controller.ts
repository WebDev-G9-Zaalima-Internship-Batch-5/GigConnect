import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ClientProfile } from "../models/clientProfile.model.js";
import { FreelancerProfile } from "../models/freelancerProfile.model.js";
import { User } from "../models/user.model.js";
import mongoose, { isValidObjectId } from "mongoose";

const getUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  const result = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "freelancerprofiles",
        localField: "_id",
        foreignField: "userId",
        as: "freelancerProfile",
      },
    },
    {
      $lookup: {
        from: "clientprofiles",
        localField: "_id",
        foreignField: "userId",
        as: "clientProfile",
      },
    },
    {
      $addFields: {
        profile: {
          $cond: {
            if: {
              $eq: ["$role", "client"],
            },
            then: {
              $arrayElemAt: ["$clientProfile", 0],
            },
            else: {
              $arrayElemAt: ["$freelancerProfile", 0],
            },
          },
        },
      },
    },
    {
      $project: {
        password: 0,
        isVerified: 0,
        isProfileComplete: 0,
        refreshTokens: 0,
        updatedAt: 0,
        verificationToken: 0,
        verificationTokenExpiry: 0,
        freelancerProfile: 0,
        clientProfile: 0,
        profile: {
          _id: 0,
          userId: 0,
          createdAt: 0,
          updatedAt: 0,
        },
      },
    },
  ]);

  const { profile, ...rest } = result[0];

  const finalProfile = { ...rest, ...profile };

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { profile: finalProfile },
        "Profile fetched successfully"
      )
    );
});

const updateUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const authenticatedUserId = req.user?._id;

  if (userId !== authenticatedUserId.toString()) {
    throw new ApiError(
      403,
      "Unauthorized: You can only update your own profile."
    );
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  let updatedProfile;
  if (user.role === "client") {
    updatedProfile = await ClientProfile.findOneAndUpdate(
      { userId },
      req.body,
      { new: true, runValidators: true }
    );
  } else if (user.role === "freelancer") {
    updatedProfile = await FreelancerProfile.findOneAndUpdate(
      { userId },
      req.body,
      { new: true, runValidators: true }
    );
  }

  if (!updatedProfile) {
    throw new ApiError(404, "Profile not found to update");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedProfile, "Profile updated successfully"));
});

const completeClientProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user;

    const {
      companyName,
      companyWebsite,
      businessType,
      industryType,
      description,
      preferredBudgetRange,
      location,
      communicationPreferences,
    } = req.body;

    const requiredFields = [
      companyName,
      businessType,
      industryType,
      description,
      preferredBudgetRange?.min,
      preferredBudgetRange?.max,
      preferredBudgetRange?.currency,
      communicationPreferences,
      location?.coordinates,
    ];

    if (
      requiredFields.some(
        (field) => field === undefined || field === null || field === ""
      )
    ) {
      throw new ApiError(400, "All required fields must be provided");
    }

    const validBusinessTypes = [
      "individual",
      "startup",
      "small_business",
      "enterprise",
    ];
    if (!validBusinessTypes.includes(businessType)) {
      throw new ApiError(400, "Invalid business type");
    }

    if (preferredBudgetRange.min < 0 || preferredBudgetRange.max < 0) {
      throw new ApiError(400, "Budget values cannot be negative");
    }

    if (preferredBudgetRange.min > preferredBudgetRange.max) {
      throw new ApiError(
        400,
        "Minimum budget cannot be greater than maximum budget"
      );
    }

    const updatedProfile = await ClientProfile.findOneAndUpdate(
      { userId: user._id },
      {
        $set: {
          companyName,
          companyWebsite,
          businessType,
          industryType,
          description,
          preferredBudgetRange: {
            min: preferredBudgetRange.min,
            max: preferredBudgetRange.max,
            currency: preferredBudgetRange.currency,
          },
          ...(location && {
            location: {
              type: "Point",
              coordinates: location.coordinates,
              address: location.address,
              city: location.city,
              state: location.state,
              country: location.country,
              pincode: location.pincode,
            },
          }),
          communicationPreferences: {
            emailNotifications:
              communicationPreferences.emailNotifications ?? true,
            smsNotifications:
              communicationPreferences.smsNotifications ?? false,
            projectUpdates: communicationPreferences.projectUpdates ?? true,
            promotionalEmails:
              communicationPreferences.promotionalEmails ?? true,
          },
        },
      },
      { new: true }
    );
    if (!updatedProfile) {
      throw new ApiError(
        404,
        "Client profile not found. Please contact support."
      );
    }

    await User.findByIdAndUpdate(user._id, { isProfileComplete: true });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { profile: updatedProfile },
          "Client profile completed successfully"
        )
      );
  }
);

export { getUserProfile, updateUserProfile, completeClientProfile };
