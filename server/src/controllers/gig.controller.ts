import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Gig } from "../models/gig.model.js";
import mongoose from "mongoose";

const createGig = asyncHandler(async (req: Request, res: Response) => {
    const { title, description, category, skillsRequired, experienceLevel, budget, duration, projectComplexity } = req.body;
    const clientId = req.user?._id;

    if ([title, description, category, experienceLevel, budget, duration, projectComplexity].some((field) => !field) || !skillsRequired?.length) {
        throw new ApiError(400, "All required fields must be provided");
    }

    const gig = await Gig.create({
        clientId,
        title,
        description,
        category,
        skillsRequired,
        experienceLevel,
        budget,
        duration,
        projectComplexity
    });

    return res.status(201).json(new ApiResponse(201, gig, "Gig created successfully"));
});

const getAllGigs = asyncHandler(async (req: Request, res: Response) => {
    // TODO: Add pagination and filtering
    const gigs = await Gig.find({ status: 'Open' }).populate('clientId', 'firstName lastName avatar');
    return res.status(200).json(new ApiResponse(200, gigs, "Gigs fetched successfully"));
});

const getGigById = asyncHandler(async (req: Request, res: Response) => {
    const { gigId } = req.params;
    if (!mongoose.isValidObjectId(gigId)) {
        throw new ApiError(400, "Invalid gig ID");
    }

    const gig = await Gig.findById(gigId).populate('clientId', 'firstName lastName avatar');
    if (!gig) {
        throw new ApiError(404, "Gig not found");
    }

    return res.status(200).json(new ApiResponse(200, gig, "Gig fetched successfully"));
});

const updateGig = asyncHandler(async (req: Request, res: Response) => {
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
        throw new ApiError(403, "Forbidden: You can only update your own gigs");
    }

    const updatedGig = await Gig.findByIdAndUpdate(gigId, req.body, { new: true, runValidators: true });

    return res.status(200).json(new ApiResponse(200, updatedGig, "Gig updated successfully"));
});

const deleteGig = asyncHandler(async (req: Request, res: Response) => {
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
        throw new ApiError(403, "Forbidden: You can only delete your own gigs");
    }

    await Gig.findByIdAndDelete(gigId);

    return res.status(200).json(new ApiResponse(200, {}, "Gig deleted successfully"));
});

export {
    createGig,
    getAllGigs,
    getGigById,
    updateGig,
    deleteGig
};
