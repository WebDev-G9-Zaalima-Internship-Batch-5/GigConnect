import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Contract } from "../models/contract.model.js";
import mongoose from "mongoose";



// @desc    Get all contracts for a user
// @route   GET /api/v1/contracts
// @access  Private
const getUserContracts = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const contracts = await Contract.find({
        $or: [{ clientId: userId }, { freelancerId: userId }]
    })
    .populate('gigId', 'title description')
    .populate('clientId', 'firstName lastName avatar')
    .populate('freelancerId', 'firstName lastName avatar');

    return res.status(200).json(new ApiResponse(200, contracts, "Contracts fetched successfully"));
});

// @desc    Get a single contract by ID
// @route   GET /api/v1/contracts/:contractId
// @access  Private
const getContractById = asyncHandler(async (req: Request, res: Response) => {
    const { contractId } = req.params;
    const userId = req.user?._id;

    if (!mongoose.isValidObjectId(contractId)) {
        throw new ApiError(400, "Invalid contract ID");
    }

    const contract = await Contract.findById(contractId)
        .populate('gigId')
        .populate('clientId', 'firstName lastName')
        .populate('freelancerId', 'firstName lastName');

    if (!contract) {
        throw new ApiError(404, "Contract not found");
    }

    if (contract.clientId.toString() !== userId.toString() && contract.freelancerId.toString() !== userId.toString()) {
        throw new ApiError(403, "Forbidden: You are not authorized to view this contract");
    }

    return res.status(200).json(new ApiResponse(200, contract, "Contract fetched successfully"));
});

// @desc    Update a contract (e.g., add milestones, sign)
// @route   PUT /api/v1/contracts/:contractId
// @access  Private
const updateContract = asyncHandler(async (req: Request, res: Response) => {
    const { contractId } = req.params;
    const userId = req.user?._id;
    const { status, milestones } = req.body;

    if (!mongoose.isValidObjectId(contractId)) {
        throw new ApiError(400, "Invalid contract ID");
    }

    const contract = await Contract.findById(contractId);

    if (!contract) {
        throw new ApiError(404, "Contract not found");
    }

    // Ensure the user is a party to the contract
    if (contract.clientId.toString() !== userId.toString() && contract.freelancerId.toString() !== userId.toString()) {
        throw new ApiError(403, "Forbidden: You are not authorized to update this contract");
    }

    // Add specific logic for who can update what
    // For example, only a client can change the status to 'Completed'
    if (status) {
        contract.status = status;
    }

    if (milestones) {
        // Logic to add/update milestones
        contract.milestones = milestones; 
    }

    const updatedContract = await contract.save({ validateBeforeSave: true });

    return res.status(200).json(new ApiResponse(200, updatedContract, "Contract updated successfully"));
});

export {
    getUserContracts,
    getContractById,
    updateContract
};
