import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ClientProfile } from "../models/clientProfile.model.js";
import { FreelancerProfile } from "../models/freelancerProfile.model.js";
import { User } from "../models/user.model.js";

const createClientProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      companyName,
      businessType,
      industryType,
      description,
      companyWebsite,
      preferredBudgetRange,
    } = req.body;
    const userId = req.user?._id;

    if (
      [
        companyName,
        businessType,
        industryType,
        description,
        preferredBudgetRange,
      ].some((field) => field?.trim() === "")
    ) {
      throw new ApiError(400, "All fields are required");
    }

    const user = await User.findById(userId);
    if (!user || user.role !== "client") {
      throw new ApiError(
        403,
        "Unauthorized: Only clients can create client profiles."
      );
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

    return res
      .status(201)
      .json(
        new ApiResponse(201, profile, "Client profile created successfully")
      );
  }
);

const createFreelancerProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const { title, bio, skills, hourlyRate, availability } = req.body;
    const userId = req.user?._id;

    if (
      [title, bio, skills, hourlyRate, availability].some((field) => !field)
    ) {
      throw new ApiError(400, "All fields are required");
    }

    const user = await User.findById(userId);
    if (!user || user.role !== "freelancer") {
      throw new ApiError(
        403,
        "Unauthorized: Only freelancers can create freelancer profiles."
      );
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

    return res
      .status(201)
      .json(
        new ApiResponse(201, profile, "Freelancer profile created successfully")
      );
  }
);

const getUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  let profile;
  if (user.role === "client") {
    profile = await ClientProfile.findOne({ userId }).populate(
      "userId",
      "firstName lastName avatar"
    );
  } else if (user.role === "freelancer") {
    profile = await FreelancerProfile.findOne({ userId }).populate(
      "userId",
      "firstName lastName avatar"
    );
  }

  if (!profile) {
    throw new ApiError(404, "Profile not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, profile, "Profile fetched successfully"));
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

    const userId = req.user?._id;

    // Validate required fields
    const requiredFields = [
      companyName,
      businessType,
      industryType,
      description,
      preferredBudgetRange?.min,
      preferredBudgetRange?.max,
      preferredBudgetRange?.currency,
      communicationPreferences,
    ];

    if (
      requiredFields.some(
        (field) => field === undefined || field === null || field === ""
      )
    ) {
      throw new ApiError(400, "All required fields must be provided");
    }

    // Validate business type
    const validBusinessTypes = [
      "individual",
      "startup",
      "small_business",
      "enterprise",
    ];
    if (!validBusinessTypes.includes(businessType)) {
      throw new ApiError(400, "Invalid business type");
    }

    // Validate budget range
    if (preferredBudgetRange.min < 0 || preferredBudgetRange.max < 0) {
      throw new ApiError(400, "Budget values cannot be negative");
    }

    if (preferredBudgetRange.min > preferredBudgetRange.max) {
      throw new ApiError(
        400,
        "Minimum budget cannot be greater than maximum budget"
      );
    }

    const user = await User.findById(userId);
    if (!user || user.role !== "client") {
      throw new ApiError(403, "Only clients can complete client profiles");
    }

    const existingProfile = await ClientProfile.findOne({ userId });
    if (existingProfile) {
      throw new ApiError(409, "Client profile already exists");
    }
    const clientProfile = await ClientProfile.create({
      userId,
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
      location: location
        ? {
            type: { type: "Point" },
            coordinates: location.coordinates,
            address: location.address,
            city: location.city,
            state: location.state,
            country: location.country,
            pincode: location.pincode,
          }
        : undefined,
      communicationPreferences: {
        emailNotifications: communicationPreferences.emailNotifications ?? true,
        smsNotifications: communicationPreferences.smsNotifications ?? false,
        projectUpdates: communicationPreferences.projectUpdates ?? true,
        promotionalEmails: communicationPreferences.promotionalEmails ?? true,
      },
      // Initialize default values
      projectsPosted: 0,
      totalSpent: 0,
      activeGigs: 0,
      completedProjects: 0,
      clientRating: 0,
      totalReviews: 0,
      verifiedPayment: false,
    });

    // Update user's profile completion status
    user.isProfileComplete = true;
    await user.save({ validateBeforeSave: false });

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          clientProfile,
          "Client profile completed successfully"
        )
      );
  }
);

export {
  createClientProfile,
  createFreelancerProfile,
  getUserProfile,
  updateUserProfile,
  completeClientProfile,
};
