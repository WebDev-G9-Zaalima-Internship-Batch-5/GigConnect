import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { Contract } from "../models/contract.model.js";
import { Gig, GigStatus } from "../models/gig.model.js";
import { Application } from "../models/application.model.js";
import { Payment, PaymentStatus } from "../models/payment.model.js";

export const getClientDashboard = asyncHandler(async (req: Request, res: Response) => {
  const clientId = req.user?._id as mongoose.Types.ObjectId;
  const appsLimit = Number(req.query.appsLimit ?? 5);
  const contractsLimit = Number(req.query.contractsLimit ?? 5);
  const completedLimit = Number(req.query.completedLimit ?? 5);
  const gigsLimit = Number(req.query.gigsLimit ?? 10);

  const [activeProjects, openGigs, totalSpentAgg] = await Promise.all([
    Contract.countDocuments({ clientId, status: "active" }),
    Gig.countDocuments({ clientId, status: GigStatus.OPEN }),
    Payment.aggregate([
      { $match: { clientId: new mongoose.Types.ObjectId(clientId), status: PaymentStatus.COMPLETED } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
  ]);

  const clientGigs = await Gig.find({ clientId }).select({ _id: 1 }).lean();
  const gigIds = clientGigs.map((g) => g._id);

  const [pendingApplications, activeContractsList, recentApplications, completedProjects] = await Promise.all([
    gigIds.length
      ? Application.countDocuments({ gigId: { $in: gigIds }, status: "pending" })
      : Promise.resolve(0),
    Contract.find({ clientId, status: "active" })
      .sort({ createdAt: -1 })
      .limit(contractsLimit)
      .populate({ path: "gigId", select: "title" })
      .populate({ path: "freelancerId", select: "firstName lastName avatar" })
      .lean(),
    gigIds.length
      ? Application.find({ gigId: { $in: gigIds } })
          .sort({ appliedAt: -1 })
          .limit(appsLimit)
          .populate({ path: "gigId", select: "title budget" })
          .populate({ path: "freelancerId", select: "firstName lastName avatar" })
          .lean()
      : Promise.resolve([]),
    Contract.find({ clientId, status: "completed" })
      .sort({ updatedAt: -1 })
      .limit(completedLimit)
      .populate({ path: "gigId", select: "title" })
      .populate({ path: "freelancerId", select: "firstName lastName avatar" })
      .lean(),
  ]);

  // Active gigs: all client gigs not completed (open or in_progress)
  const activeGigsRaw = await Gig.find({
    clientId,
    status: { $in: [GigStatus.OPEN, GigStatus.IN_PROGRESS] },
  })
    .sort({ createdAt: -1 })
    .limit(gigsLimit)
    .select({ title: 1, status: 1, budget: 1, createdAt: 1 })
    .lean();

  let applicationsCountMap: Record<string, number> = {};
  if (activeGigsRaw.length) {
    const agIds = activeGigsRaw.map((g: any) => g._id);
    const counts = await Application.aggregate([
      { $match: { gigId: { $in: agIds } } },
      { $group: { _id: "$gigId", count: { $sum: 1 } } },
    ]);
    applicationsCountMap = Object.fromEntries(
      counts.map((c: any) => [String(c._id), c.count])
    );
  }

  const stats = {
    activeProjects,
    openGigs,
    totalSpent: totalSpentAgg?.[0]?.total ?? 0,
    pendingApplications,
  };

  const data = {
    stats,
    activeGigs: activeGigsRaw.map((g: any) => ({
      _id: g._id,
      title: g.title,
      status: g.status,
      budget: g.budget,
      createdAt: g.createdAt,
      applicationCount: applicationsCountMap[String(g._id)] ?? 0,
    })),
    activeContracts: activeContractsList.map((c: any) => ({
      _id: c._id,
      status: c.status,
      agreedRate: c.agreedRate,
      startDate: c.startDate,
      totalPaid: c.totalPaid,
      remainingAmount: c.remainingAmount,
      gig: c.gigId && { _id: c.gigId._id, title: c.gigId.title },
      freelancer: c.freelancerId && {
        _id: c.freelancerId._id,
        firstName: c.freelancerId.firstName,
        lastName: c.freelancerId.lastName,
        avatar: c.freelancerId.avatar,
      },
    })),
    recentApplications: recentApplications.map((a: any) => ({
      _id: a._id,
      status: a.status,
      appliedAt: a.appliedAt,
      proposedRate: a.proposedRate,
      gig: a.gigId && { _id: a.gigId._id, title: a.gigId.title, budget: a.gigId.budget },
      freelancer: a.freelancerId && {
        _id: a.freelancerId._id,
        firstName: a.freelancerId.firstName,
        lastName: a.freelancerId.lastName,
        avatar: a.freelancerId.avatar,
      },
    })),
    completedProjects: completedProjects.map((c: any) => ({
      _id: c._id,
      status: c.status,
      agreedRate: c.agreedRate,
      startDate: c.startDate,
      endDate: c.endDate ?? c.actualEndDate ?? c.updatedAt,
      totalPaid: c.totalPaid,
      remainingAmount: c.remainingAmount,
      gig: c.gigId && { _id: c.gigId._id, title: c.gigId.title },
      freelancer: c.freelancerId && {
        _id: c.freelancerId._id,
        firstName: c.freelancerId.firstName,
        lastName: c.freelancerId.lastName,
        avatar: c.freelancerId.avatar,
      },
    })),
  };

  return res.status(200).json(new ApiResponse(200, data, "Client dashboard data fetched"));
});

export const getFreelancerDashboard = asyncHandler(async (req: Request, res: Response) => {
  const freelancerId = req.user?._id as mongoose.Types.ObjectId;
  const appsLimit = Number(req.query.appsLimit ?? 5);
  const contractsLimit = Number(req.query.contractsLimit ?? 5);

  const [activeJobs, totalEarningsAgg, pendingProposals] = await Promise.all([
    Contract.countDocuments({ freelancerId, status: "active" }),
    Payment.aggregate([
      { $match: { freelancerId: new mongoose.Types.ObjectId(freelancerId), status: PaymentStatus.COMPLETED } },
      { $group: { _id: null, total: { $sum: "$freelancerAmount" } } },
    ]),
    Application.countDocuments({ freelancerId, status: "pending" }),
  ]);

  // Active contracts aggregation
  const activeContractsList = await Contract.aggregate([
    { $match: { freelancerId: new mongoose.Types.ObjectId(String(freelancerId)), status: "active" } },
    { $sort: { createdAt: -1 } },
    { $limit: contractsLimit },
    { $lookup: { from: 'gigs', localField: 'gigId', foreignField: '_id', as: 'gig' } },
    { $unwind: { path: '$gig', preserveNullAndEmptyArrays: true } },
    { $lookup: { from: 'users', localField: 'clientId', foreignField: '_id', as: 'client' } },
    { $unwind: { path: '$client', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 1,
        status: 1,
        agreedRate: 1,
        startDate: 1,
        endDate: 1,
        totalPaid: 1,
        remainingAmount: 1,
        gig: { _id: '$gig._id', title: '$gig.title' },
        client: { _id: '$client._id', fullName: '$client.fullName', avatarUrl: '$client.avatar.url' },
      }
    }
  ]);

  // Proposed (pending) contracts aggregation
  const proposedContracts = await Contract.aggregate([
    { $match: { freelancerId: new mongoose.Types.ObjectId(String(freelancerId)), status: "pending" } },
    { $sort: { clientSubmittedAt: -1, createdAt: -1 } },
    { $limit: contractsLimit },
    { $lookup: { from: 'gigs', localField: 'gigId', foreignField: '_id', as: 'gig' } },
    { $unwind: { path: '$gig', preserveNullAndEmptyArrays: true } },
    { $lookup: { from: 'users', localField: 'clientId', foreignField: '_id', as: 'client' } },
    { $unwind: { path: '$client', preserveNullAndEmptyArrays: true } },
    {
      $addFields: {
        deadline: {
          $ifNull: [ '$endDate', { $min: { $map: { input: '$milestones', as: 'm', in: '$$m.dueDate' } } } ]
        }
      }
    },
    {
      $project: {
        _id: 1,
        status: 1,
        agreedRate: 1,
        startDate: 1,
        endDate: 1,
        clientSubmittedAt: 1,
        freelancerAccepted: 1,
        deadline: 1,
        gig: { _id: '$gig._id', title: '$gig.title' },
        client: { _id: '$client._id', fullName: '$client.fullName', avatarUrl: '$client.avatar.url' },
      }
    }
  ]);

  // My applications with correct client fields
  const myApplicationsList = await Application.aggregate([
    { $match: { freelancerId: new mongoose.Types.ObjectId(String(freelancerId)) } },
    { $sort: { appliedAt: -1 } },
    { $limit: appsLimit },
    { $lookup: { from: 'gigs', localField: 'gigId', foreignField: '_id', as: 'gig' } },
    { $unwind: { path: '$gig', preserveNullAndEmptyArrays: true } },
    { $lookup: { from: 'users', localField: 'gig.clientId', foreignField: '_id', as: 'client' } },
    { $unwind: { path: '$client', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 1,
        status: 1,
        appliedAt: 1,
        proposedRate: 1,
        gig: { _id: '$gig._id', title: '$gig.title', budget: '$gig.budget' },
        client: { _id: '$client._id', fullName: '$client.fullName', avatarUrl: '$client.avatar.url' },
      }
    }
  ]);

  const stats = {
    activeJobs,
    totalEarnings: totalEarningsAgg?.[0]?.total ?? 0,
    pendingProposals,
  };

  const data = {
    stats,
    activeContracts: activeContractsList,
    proposedContracts,
    myApplications: myApplicationsList,
  };

  return res.status(200).json(new ApiResponse(200, data, "Freelancer dashboard data fetched"));
});
