import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Contract } from "../models/contract.model.js";
import { Application } from "../models/application.model.js";
import { Payment, PaymentStatus } from "../models/payment.model.js";
import { Notification } from "../models/notification.model.js";
import { Gig } from "../models/gig.model.js";
import mongoose from "mongoose";
import Razorpay from "razorpay";
import crypto from "crypto";
import { corsOrigin } from "../consts/cors.const.js";



// @desc    Get all contracts for a user
// @route   GET /api/v1/contracts
// @access  Private
const getUserContracts = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id as mongoose.Types.ObjectId;

  const contracts = await Contract.aggregate([
    {
      $match: {
        $or: [
          { clientId: new mongoose.Types.ObjectId(String(userId)) },
          { freelancerId: new mongoose.Types.ObjectId(String(userId)) },
        ],
      },
    },
    {
      $lookup: {
        from: 'gigs',
        localField: 'gigId',
        foreignField: '_id',
        as: 'gig',
      },
    },
    { $unwind: { path: '$gig', preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: 'users',
        localField: 'clientId',
        foreignField: '_id',
        as: 'client',
      },
    },
    { $unwind: { path: '$client', preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: 'users',
        localField: 'freelancerId',
        foreignField: '_id',
        as: 'freelancer',
      },
    },
    { $unwind: { path: '$freelancer', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 1,
        gig: {
          _id: '$gig._id',
          title: '$gig.title',
        },
        client: {
          _id: '$client._id',
          fullName: '$client.fullName',
          avatarUrl: '$client.avatar.url',
        },
        freelancer: {
          _id: '$freelancer._id',
          fullName: '$freelancer.fullName',
          avatarUrl: '$freelancer.avatar.url',
        },
        applicationId: 1,
        agreedRate: 1,
        agreedDuration: 1,
        milestones: 1,
        startDate: 1,
        endDate: 1,
        actualEndDate: 1,
        status: 1,
        terms: 1,
        clientSubmittedAt: 1,
        freelancerAccepted: 1,
        freelancerAcceptedAt: 1,
        escrowRequired: 1,
        escrowFunded: 1,
        escrowStatus: 1,
        totalPaid: 1,
        remainingAmount: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
    { $sort: { createdAt: -1 } },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, contracts, 'Contracts fetched successfully'));
});

// @desc    Get a single contract by ID
// @route   GET /api/v1/contracts/:contractId
// @access  Private
const getContractById = asyncHandler(async (req: Request, res: Response) => {
  const { contractId } = req.params;
  const userId = req.user?._id as mongoose.Types.ObjectId;

  if (!mongoose.isValidObjectId(contractId)) {
    throw new ApiError(400, 'Invalid contract ID');
  }

  // Permission check
  const bare = await Contract.findById(contractId).select({ clientId: 1, freelancerId: 1 });
  if (!bare) throw new ApiError(404, 'Contract not found');
  if (String(bare.clientId) !== String(userId) && String(bare.freelancerId) !== String(userId)) {
    throw new ApiError(403, 'Forbidden: You are not authorized to view this contract');
  }

  const results = await Contract.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(String(contractId)) } },
    { $limit: 1 },
    { $lookup: { from: 'gigs', localField: 'gigId', foreignField: '_id', as: 'gig' } },
    { $unwind: { path: '$gig', preserveNullAndEmptyArrays: true } },
    { $lookup: { from: 'users', localField: 'clientId', foreignField: '_id', as: 'client' } },
    { $unwind: { path: '$client', preserveNullAndEmptyArrays: true } },
    { $lookup: { from: 'users', localField: 'freelancerId', foreignField: '_id', as: 'freelancer' } },
    { $unwind: { path: '$freelancer', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 1,
        gig: { _id: '$gig._id', title: '$gig.title' },
        client: { _id: '$client._id', fullName: '$client.fullName', avatarUrl: '$client.avatar.url' },
        freelancer: { _id: '$freelancer._id', fullName: '$freelancer.fullName', avatarUrl: '$freelancer.avatar.url' },
        applicationId: 1,
        agreedRate: 1,
        agreedDuration: 1,
        milestones: 1,
        startDate: 1,
        endDate: 1,
        actualEndDate: 1,
        status: 1,
        terms: 1,
        clientSubmittedAt: 1,
        freelancerAccepted: 1,
        freelancerAcceptedAt: 1,
        escrowRequired: 1,
        escrowFunded: 1,
        escrowStatus: 1,
        totalPaid: 1,
        remainingAmount: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]);

  const contract = results[0] || null;
  return res
    .status(200)
    .json(new ApiResponse(200, contract, 'Contract fetched successfully'));
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

// helpers
const computeEscrowRequired = (payload: any) => {
  const ms = Array.isArray(payload.milestones) ? payload.milestones : [];
  if (ms.length) {
    return ms.reduce((sum: number, m: any) => sum + Number(m.amount || 0), 0);
  }
  return Number(payload.agreedRate || 0);
};

// @desc    Create or update a PENDING draft contract from application
// @route   POST /api/v1/contracts/propose
// @access  Private (Client)
const proposeContract = asyncHandler(async (req: Request, res: Response) => {
  const clientId = req.user?._id;
  const {
    applicationId,
    agreedRate,
    agreedDuration,
    milestones,
    terms,
    startDate,
    endDate,
  } = req.body;

  if (!mongoose.isValidObjectId(applicationId)) {
    throw new ApiError(400, "Invalid application ID");
  }

  const app = await Application.findById(applicationId).lean();
  if (!app) throw new ApiError(404, "Application not found");

  const gig = await Gig.findById(app.gigId).lean();
  if (!gig) throw new ApiError(404, "Gig not found");
  if (String(gig.clientId) !== String(clientId)) {
    throw new ApiError(403, "Forbidden: Only the gig owner can propose a contract");
  }

  const escrowRequired = computeEscrowRequired({ milestones, agreedRate });

  const existingDraft = await Contract.findOne({ applicationId, status: "pending" });
  let contract;
  if (existingDraft) {
    existingDraft.agreedRate = Number(agreedRate);
    existingDraft.agreedDuration = String(agreedDuration);
    if (Array.isArray(milestones)) existingDraft.milestones = milestones;
    existingDraft.terms = String(terms);
    existingDraft.startDate = new Date(startDate);
    if (endDate) existingDraft.endDate = new Date(endDate);
    existingDraft.escrowRequired = escrowRequired;
    existingDraft.remainingAmount = escrowRequired;
    existingDraft.freelancerAccepted = false;
    existingDraft.freelancerAcceptedAt = undefined as any;
    contract = await existingDraft.save();
  } else {
    contract = await Contract.create({
      gigId: app.gigId,
      clientId: gig.clientId,
      freelancerId: app.freelancerId,
      applicationId: app._id,
      agreedRate: Number(agreedRate),
      agreedDuration: String(agreedDuration),
      milestones: Array.isArray(milestones) ? milestones : [],
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : undefined,
      status: "pending",
      terms: String(terms),
      escrowRequired,
      escrowFunded: 0,
      escrowStatus: "unfunded",
      escrowPaymentIds: [],
      totalPaid: 0,
      remainingAmount: escrowRequired,
    });
  }

  return res.status(200).json(new ApiResponse(200, contract, "Contract draft saved"));
});

// @desc    Update pending draft (client)
// @route   PATCH /api/v1/contracts/:contractId
// @access  Private (Client)
const updateContractDraft = asyncHandler(async (req: Request, res: Response) => {
  const { contractId } = req.params;
  const clientId = req.user?._id;
  const patch = req.body || {};

  if (!mongoose.isValidObjectId(contractId)) throw new ApiError(400, "Invalid contract ID");
  const contract = await Contract.findById(contractId);
  if (!contract) throw new ApiError(404, "Contract not found");
  if (String(contract.clientId) !== String(clientId)) throw new ApiError(403, "Forbidden");
  if (contract.status !== "pending") throw new ApiError(400, "Only pending contracts can be updated");

  const updatable = ["agreedRate", "agreedDuration", "milestones", "terms", "startDate", "endDate"] as const;
  updatable.forEach((k) => {
    if (k in patch) {
      // @ts-ignore
      contract[k] = patch[k];
    }
  });
  contract.escrowRequired = computeEscrowRequired(contract);
  contract.remainingAmount = contract.escrowRequired - contract.escrowFunded;
  const saved = await contract.save({ validateBeforeSave: true });
  return res.status(200).json(new ApiResponse(200, saved, "Contract draft updated"));
});

// @desc    Submit contract to freelancer (client)
// @route   POST /api/v1/contracts/:contractId/submit
// @access  Private (Client)
const submitContract = asyncHandler(async (req: Request, res: Response) => {
  const { contractId } = req.params;
  const clientId = req.user?._id;
  if (!mongoose.isValidObjectId(contractId)) throw new ApiError(400, "Invalid contract ID");
  const contract = await Contract.findById(contractId);
  if (!contract) throw new ApiError(404, "Contract not found");
  if (String(contract.clientId) !== String(clientId)) throw new ApiError(403, "Forbidden");
  if (contract.status !== "pending") throw new ApiError(400, "Only pending contracts can be submitted");
  contract.clientSubmittedAt = new Date();
  contract.freelancerAccepted = false;
  await contract.save();

  // notify freelancer
  await Notification.create({
    userId: contract.freelancerId,
    userRole: "freelancer",
    title: "New Contract Proposal",
    message: "A client submitted a contract proposal for your application.",
    type: "contract",
    relatedId: contract._id,
    actionUrl: `${corsOrigin}/freelancer/contracts/${contract._id}`,
    isRead: false,
  });

  return res.status(200).json(new ApiResponse(200, contract, "Contract submitted to freelancer"));
});

// @desc    Freelancer accepts contract
// @route   POST /api/v1/contracts/:contractId/accept
// @access  Private (Freelancer)
const acceptContractByFreelancer = asyncHandler(async (req: Request, res: Response) => {
  const { contractId } = req.params;
  const userId = req.user?._id;
  if (!mongoose.isValidObjectId(contractId)) throw new ApiError(400, "Invalid contract ID");
  const contract = await Contract.findById(contractId);
  if (!contract) throw new ApiError(404, "Contract not found");
  if (String(contract.freelancerId) !== String(userId)) throw new ApiError(403, "Forbidden");
  if (contract.status !== "pending") throw new ApiError(400, "Only pending contracts can be accepted");
  contract.freelancerAccepted = true;
  contract.freelancerAcceptedAt = new Date();
  await contract.save();

  // notify client to fund escrow
  await Notification.create({
    userId: contract.clientId,
    userRole: "client",
    title: "Contract Accepted",
    message: "The freelancer accepted your contract. Please fund escrow to activate.",
    type: "contract",
    relatedId: contract._id,
    actionUrl: `${corsOrigin}/client/contracts/${contract._id}`,
    isRead: false,
  });

  return res.status(200).json(new ApiResponse(200, contract, "Contract accepted by freelancer"));
});

// @desc    Freelancer rejects contract
// @route   POST /api/v1/contracts/:contractId/reject
// @access  Private (Freelancer)
const rejectContractByFreelancer = asyncHandler(async (req: Request, res: Response) => {
  const { contractId } = req.params;
  const userId = req.user?._id;
  if (!mongoose.isValidObjectId(contractId)) throw new ApiError(400, "Invalid contract ID");
  const contract = await Contract.findById(contractId);
  if (!contract) throw new ApiError(404, "Contract not found");
  if (String(contract.freelancerId) !== String(userId)) throw new ApiError(403, "Forbidden");
  if (contract.status !== "pending") throw new ApiError(400, "Only pending contracts can be rejected");
  contract.freelancerAccepted = false;
  contract.freelancerAcceptedAt = undefined as any;
  await contract.save();
  return res.status(200).json(new ApiResponse(200, contract, "Contract rejected by freelancer"));
});

// @desc    Initiate escrow funding (Razorpay order creation)
// @route   POST /api/v1/contracts/:contractId/fund-escrow
// @access  Private (Client)
const fundEscrowInit = asyncHandler(async (req: Request, res: Response) => {
  const { contractId } = req.params;
  const clientId = req.user?._id;
  if (!mongoose.isValidObjectId(contractId)) throw new ApiError(400, "Invalid contract ID");
  const contract = await Contract.findById(contractId);
  if (!contract) throw new ApiError(404, "Contract not found");
  if (String(contract.clientId) !== String(clientId)) throw new ApiError(403, "Forbidden");
  if (!contract.freelancerAccepted) throw new ApiError(400, "Freelancer must accept before funding escrow");

  const amount = Math.max(0, contract.escrowRequired - contract.escrowFunded);
  if (amount <= 0) return res.status(200).json(new ApiResponse(200, { alreadyFunded: true }, "Escrow already funded"));

  // Platform fee 10%
  const platformFee = Math.round(amount * 0.10);
  const freelancerAmount = amount - platformFee;

  const key_id = process.env.RAZORPAY_KEY_ID || "";
  const key_secret = process.env.RAZORPAY_KEY_SECRET || "";
  if (!key_id || !key_secret) throw new ApiError(500, "Razorpay keys not configured");

  const rz = new Razorpay({ key_id, key_secret });
  const order = await rz.orders.create({
    amount: amount * 100, // in paise
    currency: "INR",
    receipt: `contract_${contract._id}_${Date.now()}`,
    notes: {
      contractId: String(contract._id),
      clientId: String(contract.clientId),
      freelancerId: String(contract.freelancerId),
    },
  });

  const payment = await Payment.create({
    contractId: contract._id,
    clientId: contract.clientId,
    freelancerId: contract.freelancerId,
    amount,
    platformFee,
    freelancerAmount,
    currency: "INR",
    paymentGateway: "razorpay",
    status: PaymentStatus.PENDING,
    gatewayTransactionId: order.id,
  });

  contract.escrowPaymentIds.push(payment._id);
  await contract.save();

  return res.status(200).json(new ApiResponse(200, {
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId: key_id,
  }, "Razorpay order created"));
});

// @desc    Verify Razorpay payment and activate contract if fully funded
// @route   POST /api/v1/contracts/:contractId/razorpay/verify
// @access  Private (Client)
const verifyRazorpayPayment = asyncHandler(async (req: Request, res: Response) => {
  const { contractId } = req.params;
  const clientId = req.user?._id;
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body || {};
  if (!mongoose.isValidObjectId(contractId)) throw new ApiError(400, "Invalid contract ID");
  const contract = await Contract.findById(contractId);
  if (!contract) throw new ApiError(404, "Contract not found");
  if (String(contract.clientId) !== String(clientId)) throw new ApiError(403, "Forbidden");

  const key_secret = process.env.RAZORPAY_KEY_SECRET || "";
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw new ApiError(400, "Missing Razorpay verification params");
  }
  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expected = crypto.createHmac("sha256", key_secret).update(body).digest("hex");
  if (expected !== razorpay_signature) throw new ApiError(400, "Invalid Razorpay signature");

  // Find the pending Payment by order id
  const payment = await Payment.findOne({ gatewayTransactionId: razorpay_order_id, status: PaymentStatus.PENDING, contractId: contract._id });
  if (!payment) throw new ApiError(404, "Pending payment not found");

  payment.status = PaymentStatus.COMPLETED;
  payment.paidAt = new Date();
  await payment.save();

  // Update contract escrow
  contract.escrowFunded += payment.amount;
  if (contract.escrowFunded >= contract.escrowRequired) {
    contract.escrowStatus = "funded";
    contract.status = "active";
  }
  await contract.save();
  if (contract.status === "active") {
    await Gig.findByIdAndUpdate(contract.gigId, { $set: { status: "in_progress" } });
  }

  return res.status(200).json(new ApiResponse(200, { success: true, contractId: contract._id }, "Payment verified"));
});

// @desc    Get contract by applicationId
// @route   GET /api/v1/contracts/by-application/:applicationId
// @access  Private (Client or Freelancer)
const getContractByApplication = asyncHandler(async (req: Request, res: Response) => {
  const { applicationId } = req.params;
  const userId = req.user?._id as mongoose.Types.ObjectId;
  if (!mongoose.isValidObjectId(applicationId)) throw new ApiError(400, "Invalid application ID");

  // permission check
  const bare = await Contract.findOne({ applicationId }).select({ clientId: 1, freelancerId: 1 });
  if (!bare) throw new ApiError(404, "Contract not found");
  if (String(bare.clientId) !== String(userId) && String(bare.freelancerId) !== String(userId)) {
    throw new ApiError(403, "Forbidden");
  }

  const results = await Contract.aggregate([
    { $match: { applicationId: new mongoose.Types.ObjectId(String(applicationId)) } },
    { $limit: 1 },
    { $lookup: { from: 'gigs', localField: 'gigId', foreignField: '_id', as: 'gig' } },
    { $unwind: { path: '$gig', preserveNullAndEmptyArrays: true } },
    { $lookup: { from: 'users', localField: 'clientId', foreignField: '_id', as: 'client' } },
    { $unwind: { path: '$client', preserveNullAndEmptyArrays: true } },
    { $lookup: { from: 'users', localField: 'freelancerId', foreignField: '_id', as: 'freelancer' } },
    { $unwind: { path: '$freelancer', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 1,
        gig: { _id: '$gig._id', title: '$gig.title' },
        client: { _id: '$client._id', fullName: '$client.fullName', avatarUrl: '$client.avatar.url' },
        freelancer: { _id: '$freelancer._id', fullName: '$freelancer.fullName', avatarUrl: '$freelancer.avatar.url' },
        applicationId: 1,
        agreedRate: 1,
        agreedDuration: 1,
        milestones: 1,
        startDate: 1,
        endDate: 1,
        actualEndDate: 1,
        status: 1,
        terms: 1,
        clientSubmittedAt: 1,
        freelancerAccepted: 1,
        freelancerAcceptedAt: 1,
        escrowRequired: 1,
        escrowFunded: 1,
        escrowStatus: 1,
        totalPaid: 1,
        remainingAmount: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]);

  const contract = results[0] || null;
  return res.status(200).json(new ApiResponse(200, contract, "Contract fetched"));
});

export {
    getUserContracts,
    getContractById,
    updateContract,
    // new
    proposeContract,
    updateContractDraft,
    submitContract,
    acceptContractByFreelancer,
    rejectContractByFreelancer,
    fundEscrowInit,
    getContractByApplication,
    verifyRazorpayPayment,
};
