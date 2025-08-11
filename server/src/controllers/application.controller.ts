import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Application } from "../models/application.model.js";
import { Notification } from "../models/notification.model.js";
import { Contract } from "../models/contract.model.js";
import { Gig, GigStatus } from "../models/gig.model.js";
import mongoose from "mongoose";

// @desc    Apply for a gig
// @route   POST /api/v1/gigs/:gigId/applications/apply
// @access  Private (Freelancer only)
const applyForGig = asyncHandler(async (req: Request, res: Response) => {
    const { gigId } = req.params;
    const freelancerId = req.user?._id;
    const { coverLetter, proposedRate, estimatedDuration } = req.body;

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

    const existingApplication = await Application.findOne({ gigId, freelancerId });
    if (existingApplication) {
        throw new ApiError(409, "You have already applied for this gig");
    }

    const application = await Application.create({
        gigId,
        freelancerId,
        coverLetter,
        proposedRate,
        estimatedDuration
    });

        // Create a notification for the client
    await Notification.create({
        userId: gig.clientId,
        message: `You have a new application for your gig: ${gig.title}`,
        link: `/gigs/${gig._id}/applications`
    });

    return res.status(201).json(new ApiResponse(201, application, "Application submitted successfully"));
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
        throw new ApiError(403, "Forbidden: You can only view applications for your own gigs");
    }

    const applications = await Application.find({ gigId }).populate('freelancerId', 'firstName lastName avatar');

    return res.status(200).json(new ApiResponse(200, applications, "Applications fetched successfully"));
});

// @desc    Update application status
// @route   PATCH /api/v1/gigs/:gigId/applications/:applicationId
// @access  Private (Client of the gig only)
const updateApplicationStatus = asyncHandler(async (req: Request, res: Response) => {
    const { gigId, applicationId } = req.params;
    const { status } = req.body; // expecting 'Accepted' or 'Rejected'
    const clientId = req.user?._id;

    if (!['Accepted', 'Rejected'].includes(status)) {
        throw new ApiError(400, "Invalid status provided");
    }

    const gig = await Gig.findById(gigId);
    if (!gig || gig.clientId.toString() !== clientId.toString()) {
        throw new ApiError(403, "Forbidden: You can only update applications for your own gigs");
    }

    const application = await Application.findByIdAndUpdate(applicationId, { status }, { new: true });

    if (!application) {
        throw new ApiError(404, "Application not found");
    }

    // Create a notification for the freelancer
    await Notification.create({
        userId: application.freelancerId,
        message: `Your application for the gig "${gig.title}" has been ${status}.`,
        link: `/applications/${application._id}` // A link to view their application status
    });

    if (status === 'Accepted') {
        // Create a contract
        await Contract.create({
            gigId: gig._id,
            clientId: gig.clientId,
            freelancerId: application.freelancerId,
            applicationId: application._id,
            agreedRate: application.proposedRate, // Or a different rate from req.body if negotiated
            // Milestones can be added later
        });

        // Optional: Update gig status to 'In Progress'
        gig.status = GigStatus.IN_PROGRESS;
        await gig.save({ validateBeforeSave: false });
    }

    return res.status(200).json(new ApiResponse(200, application, "Application status updated successfully"));
});

export {
    applyForGig,
    getGigApplications,
    updateApplicationStatus
};
