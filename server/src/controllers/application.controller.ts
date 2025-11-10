import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Application, ApplicationStatus } from "../models/application.model.js";
import { Notification } from "../models/notification.model.js";
import { Contract } from "../models/contract.model.js";
import { Gig, GigStatus } from "../models/gig.model.js";
import mongoose from "mongoose";
import { corsOrigin } from "../consts/cors.const.js";

// @desc    Apply for a gig
// @route   POST /api/v1/gigs/:gigId/applications/apply
// @access  Private (Freelancer only)
const applyForGig = asyncHandler(async (req: Request, res: Response) => {
  const { gigId } = req.params;
  const freelancerId = req.user?._id;
  const { coverLetter, proposedRate, estimatedDuration, relevantExperience } =
    req.body;

  if (!mongoose.isValidObjectId(gigId)) {
    throw new ApiError(400, "Invalid gig ID");
  }

  const gig = await Gig.findById(gigId);
  if (!gig) {
    throw new ApiError(404, "Gig not found");
  }

  if (gig.status !== GigStatus.OPEN) {
    throw new ApiError(400, "This gig is not open for applications");
  }

  const existingApplication = await Application.findOne({
    gigId,
    freelancerId,
  });
  if (existingApplication) {
    throw new ApiError(409, "You have already applied for this gig");
  }

  // Basic payload validations
  if (
    !coverLetter ||
    typeof coverLetter !== "string" ||
    coverLetter.trim() === ""
  ) {
    throw new ApiError(400, "Cover letter is required");
  }
  const rateNum = Number(proposedRate);
  if (!Number.isFinite(rateNum) || rateNum <= 0) {
    throw new ApiError(400, "proposedRate must be a positive number");
  }
  if (
    !estimatedDuration ||
    typeof estimatedDuration !== "string" ||
    estimatedDuration.trim() === ""
  ) {
    throw new ApiError(400, "estimatedDuration is required");
  }
  if (
    !relevantExperience ||
    typeof relevantExperience !== "string" ||
    relevantExperience.trim() === ""
  ) {
    throw new ApiError(400, "relevantExperience is required");
  }

  const application = await Application.create({
    gigId,
    freelancerId,
    coverLetter: String(coverLetter).trim(),
    proposedRate: rateNum,
    estimatedDuration: String(estimatedDuration).trim(),
    relevantExperience: String(relevantExperience).trim(),
  });

  // Create a notification for the client
  await Notification.create({
    userId: gig.clientId,
    userRole: "client",
    title: "New Application",
    message: `You have a new application for your gig: ${gig.title}`,
    type: "gig_application",
    relatedId: application._id,
    actionUrl: `${corsOrigin}/gigs/${gig._id}/applications`,
    isRead: false,
  });

  // Update the application count in the gig
  await Gig.findByIdAndUpdate(gigId, { $inc: { applicationCount: 1 } });

  return res
    .status(201)
    .json(
      new ApiResponse(201, application, "Application submitted successfully")
    );
});

// @desc    Get all applications for a gig
// @route   GET /api/v1/gigs/:gigId/applications
// @access  Private (Client of the gig only)
const getGigApplications = asyncHandler(async (req: Request, res: Response) => {
  const { gigId } = req.params;
  const clientId = req.user?._id;

  if (!mongoose.isValidObjectId(gigId)) {
    throw new ApiError(400, "Invalid gig ID");
  }

  const gig = await Gig.findById(gigId);
  if (!gig) {
    throw new ApiError(404, "Gig not found");
  }

  if (gig.clientId.toString() !== clientId.toString()) {
    throw new ApiError(
      403,
      "Forbidden: You can only view applications for your own gigs"
    );
  }

  const applications = await Application.aggregate([
    // Match applications for this gig
    { $match: { gigId: new mongoose.Types.ObjectId(gigId) } },
    // Join with users collection
    {
      $lookup: {
        from: "users",
        localField: "freelancerId",
        foreignField: "_id",
        as: "freelancer",
      },
    },
    // Unwind the freelancer array
    { $unwind: "$freelancer" },
    // Project only the fields we need
    {
      $project: {
        _id: 1,
        gigId: 1,
        coverLetter: 1,
        proposedRate: 1,
        estimatedDuration: 1,
        relevantExperience: 1,
        portfolioSamples: 1,
        status: 1,
        appliedAt: 1,
        clientViewed: 1,
        clientViewedAt: 1,
        freelancer: {
          _id: "$freelancer._id",
          name: "$freelancer.fullName",
          avatar: "$freelancer.avatar",
        },
      },
    },
    // Sort by applied date (newest first)
    { $sort: { appliedAt: -1 } },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, applications, "Applications fetched successfully")
    );
});

// @desc    Update application status
// @route   PATCH /api/v1/gigs/:gigId/applications/:applicationId
// @access  Private (Client of the gig only)
const updateApplicationStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { gigId, applicationId } = req.params;
    let { status } = req.body as { status: string };
    const clientId = req.user?._id;

    // Normalize and validate against enum (lowercase)
    if (typeof status !== "string") {
      throw new ApiError(400, "Invalid status provided");
    }
    status = status.toLowerCase();
    const allowed = [ApplicationStatus.ACCEPTED, ApplicationStatus.REJECTED];
    if (!allowed.includes(status as ApplicationStatus)) {
      throw new ApiError(400, "Invalid status provided");
    }

    const gig = await Gig.findById(gigId);
    if (!gig || gig.clientId.toString() !== clientId.toString()) {
      throw new ApiError(
        403,
        "Forbidden: You can only update applications for your own gigs"
      );
    }

    const application = await Application.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true }
    );

    if (!application) {
      throw new ApiError(404, "Application not found");
    }

    // Create a notification for the freelancer
    const titleCase =
      status === ApplicationStatus.ACCEPTED ? "Accepted" : "Rejected";
    await Notification.create({
      userId: application.freelancerId,
      userRole: "freelancer",
      title:
        titleCase === "Accepted"
          ? "Application Accepted"
          : "Application Rejected",
      message: `Your application for the gig "${gig.title}" has been ${titleCase}.`,
      type: "gig_application",
      relatedId: application._id,
      actionUrl: `${corsOrigin}/applications/${application._id}`,
      isRead: false,
    });

    // Do not auto-create contract here. The client will create/submit a contract from the builder flow.
    // Optional: Update gig status to 'In Progress'
    gig.status = GigStatus.IN_PROGRESS;
    await gig.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          application,
          "Application status updated successfully"
        )
      );
  }
);

// @desc    Mark application as viewed by client
// @route   PATCH /api/v1/gigs/:gigId/applications/:applicationId/viewed
// @access  Private (Client of the gig only)
const markApplicationAsViewed = asyncHandler(
  async (req: Request, res: Response) => {
    const { gigId, applicationId } = req.params;
    const clientId = req.user?._id;

    if (
      !mongoose.isValidObjectId(gigId) ||
      !mongoose.isValidObjectId(applicationId)
    ) {
      throw new ApiError(400, "Invalid gig or application ID");
    }

    const gig = await Gig.findById(gigId);
    if (!gig) {
      throw new ApiError(404, "Gig not found");
    }

    if (gig.clientId.toString() !== clientId.toString()) {
      throw new ApiError(
        403,
        "Forbidden: You can only update view status for applications to your own gigs"
      );
    }

    const application = await Application.findOneAndUpdate(
      { _id: applicationId, gigId },
      {
        $set: {
          clientViewed: true,
          clientViewedAt: new Date(),
        },
      },
      { new: true }
    );

    if (!application) {
      throw new ApiError(404, "Application not found for this gig");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, application, "Application marked as viewed"));
  }
);

export {
  applyForGig,
  getGigApplications,
  updateApplicationStatus,
  markApplicationAsViewed,
};
