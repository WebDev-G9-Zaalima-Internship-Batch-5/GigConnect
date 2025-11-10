import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Gig, GigStatus } from "../models/gig.model.js";
import { uploadOnCloudinary } from "../services/cloudinary.service.js";
import { FILES_FOLDER_PATH } from "../consts/cloudinary.const.js";
import mongoose from "mongoose";

const createGig = asyncHandler(async (req: Request, res: Response) => {
  const clientId = req.user?._id;
  if (!clientId) throw new ApiError(401, "User is not logged in.");

  // Parse/normalize fields from multipart or JSON
  const raw = req.body as any;
  const title = raw.title;
  const description = raw.description;
  const category = raw.category;
  const subCategory = raw.subCategory;
  const skillsRequired = Array.isArray(raw.skillsRequired)
    ? raw.skillsRequired
    : typeof raw.skillsRequired === "string"
    ? raw.skillsRequired
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean)
    : [];
  const experienceLevel = raw.experienceLevel;
  const budget =
    typeof raw.budget === "string" ? JSON.parse(raw.budget) : raw.budget;
  const duration = raw.duration;
  const expectedStartDate = raw.expectedStartDate;
  const location =
    typeof raw.location === "string" ? JSON.parse(raw.location) : raw.location;
  const deadline = raw.deadline;
  const requirements = Array.isArray(raw.requirements)
    ? raw.requirements
    : typeof raw.requirements === "string"
    ? raw.requirements
        .split("\n")
        .map((s: string) => s.trim())
        .filter(Boolean)
    : [];
  const deliverables = Array.isArray(raw.deliverables)
    ? raw.deliverables
    : typeof raw.deliverables === "string"
    ? raw.deliverables
        .split("\n")
        .map((s: string) => s.trim())
        .filter(Boolean)
    : [];
  const isUrgent = raw.isUrgent === "true" || raw.isUrgent === true;
  const isFeatured = raw.isFeatured === "true" || raw.isFeatured === true;

  // Basic required validations
  const requiredFields = [
    title,
    description,
    category,
    experienceLevel,
    duration,
    expectedStartDate,
    budget?.type,
    budget?.amount,
  ];
  if (
    requiredFields.some(
      (f) =>
        f === undefined ||
        f === null ||
        (typeof f === "string" && f.trim() === "")
    )
  ) {
    throw new ApiError(400, "All required fields must be provided.");
  }

  if (!Array.isArray(skillsRequired) || skillsRequired.length === 0) {
    throw new ApiError(400, "At least one skill is required.");
  }

  if (!["entry", "intermediate", "expert"].includes(experienceLevel)) {
    throw new ApiError(400, "Invalid experience level.");
  }

  if (!["fixed", "hourly"].includes(budget.type)) {
    throw new ApiError(400, "Invalid budget type.");
  }
  if (typeof budget.amount !== "number" || budget.amount < 0) {
    throw new ApiError(400, "Budget amount must be a non-negative number.");
  }

  // optional location validation (GeoJSON Point)
  let sanitizedLocation: any = undefined;
  if (location) {
    const { type, coordinates } = location;
    if (
      type !== "Point" ||
      !Array.isArray(coordinates) ||
      coordinates.length !== 2
    ) {
      throw new ApiError(
        400,
        "Location must be a GeoJSON Point with [lng, lat]."
      );
    }
    const [lng, lat] = coordinates;
    if (typeof lng !== "number" || typeof lat !== "number") {
      throw new ApiError(400, "Location coordinates must be numbers.");
    }
    sanitizedLocation = {
      type: "Point",
      coordinates: [lng, lat],
      address: location.address,
      city: location.city,
      state: location.state,
      country: location.country,
      pincode: location.pincode,
    };
  }

  // Upload attachments to Cloudinary (if any)
  let attachmentUrls: string[] = [];
  const files = (req.files as Express.Multer.File[]) || [];
  if (files.length) {
    const uploads = await Promise.all(
      files.map(async (f) => {
        const res = await uploadOnCloudinary({
          localFilePath: f.path,
          folderPath: FILES_FOLDER_PATH,
        });
        return res?.secure_url || res?.url || null;
      })
    );
    attachmentUrls = uploads.filter((u): u is string => !!u);
  }

  const gig = await Gig.create({
    clientId,
    title,
    description,
    category,
    subCategory,
    skillsRequired,
    experienceLevel,
    budget,
    duration,
    expectedStartDate: new Date(expectedStartDate),
    location: sanitizedLocation,
    status: GigStatus.OPEN,
    deadline: deadline ? new Date(deadline) : undefined,
    attachments: attachmentUrls,
    requirements,
    deliverables,
    isUrgent,
    isFeatured,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, gig, "Gig created successfully"));
});

const getAllGigs = asyncHandler(async (req: Request, res: Response) => {
  // Query params
  const {
    q,
    category,
    subCategory,
    experienceLevel,
    budgetType,
    budgetMin,
    budgetMax,
    skills,
    lat,
    lng,
    distanceKm,
    sort = "recent",
    page = "1",
    limit = "10",
  } = req.query as Record<string, string | undefined>;

  // Base filter: only open gigs
  const filter: any = { status: GigStatus.OPEN };

  // Text search across multiple fields (case-insensitive)
  if (q && q.trim()) {
    const regex = new RegExp(q.trim(), "i");
    filter.$or = [
      { title: regex },
      { description: regex },
      { category: regex },
      { subCategory: regex },
      { skillsRequired: regex },
    ];
  }

  if (category) filter.category = category;
  if (subCategory) filter.subCategory = subCategory;
  if (experienceLevel) filter.experienceLevel = experienceLevel;

  // Budget filtering: support new fixed/hourly min/max OR semantics, plus legacy params
  const fixedMinQ = req.query.fixedMin as string | undefined;
  const fixedMaxQ = req.query.fixedMax as string | undefined;
  const hourlyMinQ = req.query.hourlyMin as string | undefined;
  const hourlyMaxQ = req.query.hourlyMax as string | undefined;

  const fixedMin =
    fixedMinQ !== undefined && fixedMinQ !== "" ? Number(fixedMinQ) : undefined;
  const fixedMax =
    fixedMaxQ !== undefined && fixedMaxQ !== "" ? Number(fixedMaxQ) : undefined;
  const hourlyMin =
    hourlyMinQ !== undefined && hourlyMinQ !== ""
      ? Number(hourlyMinQ)
      : undefined;
  const hourlyMax =
    hourlyMaxQ !== undefined && hourlyMaxQ !== ""
      ? Number(hourlyMaxQ)
      : undefined;

  const budgetOr: any[] = [];
  if (fixedMin !== undefined || fixedMax !== undefined) {
    const cond: any = { "budget.type": "fixed" };
    const amt: any = {};
    if (fixedMin !== undefined) amt.$gte = fixedMin;
    if (fixedMax !== undefined) amt.$lte = fixedMax;
    if (Object.keys(amt).length) cond["budget.amount"] = amt;
    budgetOr.push(cond);
  }
  if (hourlyMin !== undefined || hourlyMax !== undefined) {
    const cond: any = { "budget.type": "hourly" };
    const amt: any = {};
    if (hourlyMin !== undefined) amt.$gte = hourlyMin;
    if (hourlyMax !== undefined) amt.$lte = hourlyMax;
    if (Object.keys(amt).length) cond["budget.amount"] = amt;
    budgetOr.push(cond);
  }

  if (budgetOr.length) {
    filter.$and = filter.$and || [];
    filter.$and.push({ $or: budgetOr });
  } else {
    // Legacy single-type filtering (backward compatible)
    if (budgetType) filter["budget.type"] = budgetType;
    const minNum = budgetMin ? Number(budgetMin) : undefined;
    const maxNum = budgetMax ? Number(budgetMax) : undefined;
    if (minNum !== undefined || maxNum !== undefined) {
      filter["budget.amount"] = {};
      if (minNum !== undefined) filter["budget.amount"].$gte = minNum;
      if (maxNum !== undefined) filter["budget.amount"].$lte = maxNum;
    }
  }

  // Skills (comma-separated)
  if (skills) {
    const list = skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (list.length) {
      filter.skillsRequired = { $all: list };
    }
  }

  // Geospatial filter by distance. Remote gigs (no location set) should be included regardless of distance.
  const latNum = lat ? Number(lat) : undefined;
  const lngNum = lng ? Number(lng) : undefined;
  const distanceKmNum = distanceKm ? Number(distanceKm) : undefined;
  if (
    latNum !== undefined &&
    lngNum !== undefined &&
    !Number.isNaN(latNum) &&
    !Number.isNaN(lngNum) &&
    distanceKmNum !== undefined &&
    !Number.isNaN(distanceKmNum)
  ) {
    const distanceInRadians = distanceKmNum / 6378.1; // Earth's radius in km
    // Include either remote gigs (no coordinates) OR gigs within distance
    filter.$and = filter.$and || [];
    filter.$and.push({
      $or: [
        // Remote: location unset or coordinates missing/empty
        { location: { $exists: false } },
        { "location.coordinates": { $exists: false } },
        { "location.coordinates": { $size: 0 } },
        // Within distance
        {
          location: {
            $geoWithin: {
              $centerSphere: [[lngNum, latNum], distanceInRadians],
            },
          },
        },
      ],
    });
  }

  // Sorting
  const sortMap: Record<string, any> = {
    recent: { createdAt: -1 },
    "budget-high": { "budget.amount": -1 },
    "budget-low": { "budget.amount": 1 },
    proposals: { applicationCount: 1 },
  };
  const sortSpec = sortMap[sort] || sortMap.recent;

  const pageNum = Math.max(1, parseInt(String(page), 10) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(String(limit), 10) || 10));
  const skip = (pageNum - 1) * limitNum;

  const [items, total] = await Promise.all([
    Gig.find(filter)
      .sort(sortSpec)
      .skip(skip)
      .limit(limitNum)
      .populate("clientId", "fullName avatar"),
    Gig.countDocuments(filter),
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { items, total, page: pageNum, limit: limitNum },
        "Gigs fetched successfully"
      )
    );
});

const getGigById = asyncHandler(async (req: Request, res: Response) => {
  const { gigId } = req.params;
  if (!mongoose.isValidObjectId(gigId)) {
    throw new ApiError(400, "Invalid gig ID");
  }

  const gig = await Gig.findById(gigId).populate("clientId", "fullName avatar");
  if (!gig) {
    throw new ApiError(404, "Gig not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, gig, "Gig fetched successfully"));
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

  if (gig.clientId.toString() !== clientId?.toString()) {
    throw new ApiError(403, "Forbidden: You can only update your own gigs");
  }

  // Whitelist updatable fields
  const {
    title,
    description,
    category,
    subCategory,
    skillsRequired,
    experienceLevel,
    budget,
    duration,
    expectedStartDate,
    location,
    deadline,
    attachments,
    requirements,
    deliverables,
    isUrgent,
    isFeatured,
    status,
  } = req.body;

  const updatePayload: any = {};
  if (title !== undefined) updatePayload.title = title;
  if (description !== undefined) updatePayload.description = description;
  if (category !== undefined) updatePayload.category = category;
  if (subCategory !== undefined) updatePayload.subCategory = subCategory;
  if (Array.isArray(skillsRequired))
    updatePayload.skillsRequired = skillsRequired;
  if (experienceLevel !== undefined)
    updatePayload.experienceLevel = experienceLevel;
  if (budget !== undefined) updatePayload.budget = budget;
  if (duration !== undefined) updatePayload.duration = duration;
  if (expectedStartDate !== undefined)
    updatePayload.expectedStartDate = new Date(expectedStartDate);
  if (deadline !== undefined)
    updatePayload.deadline = deadline ? new Date(deadline) : undefined;
  if (Array.isArray(attachments)) updatePayload.attachments = attachments;
  if (Array.isArray(requirements)) updatePayload.requirements = requirements;
  if (Array.isArray(deliverables)) updatePayload.deliverables = deliverables;
  if (typeof isUrgent === "boolean") updatePayload.isUrgent = isUrgent;
  if (typeof isFeatured === "boolean") updatePayload.isFeatured = isFeatured;
  if (status && Object.values(GigStatus).includes(status))
    updatePayload.status = status;

  if (location) {
    const { type, coordinates } = location;
    if (
      type !== "Point" ||
      !Array.isArray(coordinates) ||
      coordinates.length !== 2
    ) {
      throw new ApiError(
        400,
        "Location must be a GeoJSON Point with [lng, lat]."
      );
    }
    const [lng, lat] = coordinates;
    if (typeof lng !== "number" || typeof lat !== "number") {
      throw new ApiError(400, "Location coordinates must be numbers.");
    }
    updatePayload.location = {
      type: "Point",
      coordinates: [lng, lat],
      address: location.address,
      city: location.city,
      state: location.state,
      country: location.country,
      pincode: location.pincode,
    };
  }

  const updatedGig = await Gig.findByIdAndUpdate(
    gigId,
    { $set: updatePayload },
    { new: true, runValidators: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedGig, "Gig updated successfully"));
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

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Gig deleted successfully"));
});

export { createGig, getAllGigs, getGigById, updateGig, deleteGig };
