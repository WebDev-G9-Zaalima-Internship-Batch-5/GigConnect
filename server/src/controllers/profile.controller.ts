import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ClientProfile } from "../models/clientProfile.model.js";
import {
  FreelancerProfile,
  IFreelancerProfile,
} from "../models/freelancerProfile.model.js";
import { User } from "../models/user.model.js";
import mongoose, { isValidObjectId, Types } from "mongoose";

const isNumberLike = (v: any) => {
  if (typeof v === "number") return Number.isFinite(v);
  if (typeof v === "string" && v.trim() !== "") return !Number.isNaN(Number(v));
  return false;
};

const toNumber = (v: any) => (typeof v === "number" ? v : Number(v));

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

    if (user.isProfileComplete) {
      throw new ApiError(400, "Profile already completed");
    }
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

const completeFreelancerProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const user = (req as any).user;

    if (user.isProfileComplete) {
      throw new ApiError(400, "Profile already completed");
    }

    const {
      title,
      bio,
      skills,
      hourlyRate,
      availability,
      location,
      workPreferences,
      languages,
    } = req.body;

    if (!title || typeof title !== "string" || title.trim() === "") {
      throw new ApiError(400, "Title is required");
    }
    if (!bio || typeof bio !== "string" || bio.trim() === "") {
      throw new ApiError(400, "Bio is required");
    }

    if (!Array.isArray(skills) || skills.length === 0) {
      throw new ApiError(400, "At least one skill is required");
    }
    for (const s of skills) {
      if (typeof s !== "string" || s.trim() === "") {
        throw new ApiError(400, "Each skill must be a non-empty string");
      }
    }

    if (!Array.isArray(languages) || languages.length === 0) {
      throw new ApiError(400, "At least one language is required");
    }
    for (const lang of languages) {
      if (
        !lang ||
        typeof lang.language !== "string" ||
        lang.language.trim() === ""
      ) {
        throw new ApiError(
          400,
          "Each language must include a non-empty 'language' field"
        );
      }
      if (!lang.proficiency || typeof lang.proficiency !== "string") {
        throw new ApiError(
          400,
          "Each language must include a 'proficiency' field"
        );
      }
    }

    if (!isNumberLike(hourlyRate)) {
      throw new ApiError(400, "hourlyRate must be a number");
    }
    const hourlyRateNum = toNumber(hourlyRate);
    if (hourlyRateNum <= 0) {
      throw new ApiError(400, "hourlyRate must be greater than 0");
    }

    if (!location || typeof location !== "object") {
      throw new ApiError(400, "location object is required with coordinates");
    }
    if (
      !Array.isArray(location.coordinates) ||
      location.coordinates.length !== 2
    ) {
      throw new ApiError(
        400,
        "location.coordinates must be an array [longitude, latitude]"
      );
    }
    const lon = Number(location.coordinates[0]);
    const lat = Number(location.coordinates[1]);
    if (!Number.isFinite(lon) || !Number.isFinite(lat)) {
      throw new ApiError(
        400,
        "location.coordinates must contain numeric longitude and latitude"
      );
    }

    if (lon < -180 || lon > 180) {
      throw new ApiError(400, "Longitude must be between -180 and 180");
    }
    if (lat < -90 || lat > 90) {
      throw new ApiError(400, "Latitude must be between -90 and 90");
    }

    if (!workPreferences || typeof workPreferences !== "object") {
      throw new ApiError(400, "workPreferences object is required");
    }
    if (typeof workPreferences.remoteOnly !== "boolean") {
      throw new ApiError(400, "workPreferences.remoteOnly must be boolean");
    }
    if (typeof workPreferences.willingToTravel !== "boolean") {
      throw new ApiError(
        400,
        "workPreferences.willingToTravel must be boolean"
      );
    }
    if (
      !isNumberLike(workPreferences.maxTravelDistance) ||
      toNumber(workPreferences.maxTravelDistance) < 0
    ) {
      throw new ApiError(
        400,
        "workPreferences.maxTravelDistance must be a non-negative number"
      );
    }

    const userId = Types.ObjectId.isValid(user._id)
      ? new Types.ObjectId(user._id)
      : user._id;

    const payload: Partial<IFreelancerProfile> = {
      userId,
      title: (title as string).trim(),
      bio: (bio as string).trim(),
      skills: (skills as string[]).map((s) => s.trim()),
      hourlyRate: hourlyRateNum,
      availability,
      languages: (languages as any[]).map((l) => ({
        language: (l.language as string).trim(),
        proficiency: l.proficiency,
      })),
      workPreferences: {
        remoteOnly: !!workPreferences.remoteOnly,
        willingToTravel: !!workPreferences.willingToTravel,
        maxTravelDistance: toNumber(workPreferences.maxTravelDistance),
      },
      location: {
        type: "Point",
        coordinates: [lon, lat] as [number, number],
        address:
          typeof location.address === "string"
            ? location.address.trim()
            : undefined,
        city:
          typeof location.city === "string" ? location.city.trim() : undefined,
        state:
          typeof location.state === "string"
            ? location.state.trim()
            : undefined,
        country:
          typeof location.country === "string"
            ? location.country.trim()
            : undefined,
        pincode:
          typeof location.pincode === "string"
            ? location.pincode.trim()
            : undefined,
      },
    };

    try {
      const updatedProfile = await FreelancerProfile.findOneAndUpdate(
        { userId: userId },
        { $set: payload },
        {
          new: true,
          upsert: true,
          runValidators: true,
          context: "query",
        }
      );

      if (!updatedProfile) {
        throw new ApiError(500, "Failed to create/update freelancer profile");
      }

      await User.findByIdAndUpdate(user._id, {
        $set: { isProfileComplete: true },
      });

      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { profile: updatedProfile },
            "Freelancer profile completed successfully"
          )
        );
    } catch (err: any) {
      if (err instanceof mongoose.Error.ValidationError) {
        const messages = Object.values(err.errors).map((e: any) => e.message);
        throw new ApiError(400, `Validation failed: ${messages.join(", ")}`);
      }
      throw err;
    }
  }
);

export {
  getUserProfile,
  updateUserProfile,
  completeClientProfile,
  completeFreelancerProfile,
};
