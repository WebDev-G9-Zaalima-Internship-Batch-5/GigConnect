// import { Request, Response } from "express";
// import { ApiError } from "../utils/ApiError.js";
// import { ApiResponse } from "../utils/ApiResponse.js";
// import { asyncHandler } from "../utils/asyncHandler.js";
// import { Payment, PaymentStatus } from "../models/payment.model.js";
// import { Contract } from "../models/contract.model.js";
// import Stripe from "stripe";

// // TODO: Add Stripe secret key to environment variables
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
//     apiVersion: '2025-07-30.basil',
// });
// import mongoose from "mongoose";

// // @desc    Create a payment intent (e.g., with Stripe)
// // @route   POST /api/v1/payments/create-intent
// // @access  Private (Client only)
// const createPaymentIntent = asyncHandler(async (req: Request, res: Response) => {
//     const { contractId, amount } = req.body;
//     const clientId = req.user?._id;

//     const contract = await Contract.findById(contractId);
//     if (!contract || contract.clientId.toString() !== clientId.toString()) {
//         throw new ApiError(403, "Forbidden: You can only make payments for your own contracts.");
//     }

//     // TODO: Integrate with Stripe
//     // const paymentIntent = await stripe.paymentIntents.create({
//     //     amount: amount * 100, // Amount in cents
//     //     currency: 'usd',
//     // });

//     const mockPaymentIntent = { id: `pi_${new mongoose.Types.ObjectId()}`, client_secret: `pi_${new mongoose.Types.ObjectId()}_secret_${new mongoose.Types.ObjectId()}` };

//     await Payment.create({
//         contractId,
//         clientId,
//         freelancerId: contract.freelancerId,
//         amount,
//         stripePaymentIntentId: mockPaymentIntent.id,
//         status: 'pending'
//     });

//     res.status(201).json(new ApiResponse(201, { clientSecret: mockPaymentIntent.client_secret }, "Payment intent created successfully"));
// });

// // @desc    Confirm a payment and release funds
// // @route   POST /api/v1/payments/confirm
// // @access  Private (Client only)
// const confirmPayment = asyncHandler(async (req: Request, res: Response) => {
//     const { paymentIntentId } = req.body;
//     const clientId = req.user?._id;

//     // TODO: In a real scenario, you would get this from a Stripe webhook
//     const payment = await Payment.findOne({ stripePaymentIntentId: paymentIntentId, clientId });

//     if (!payment) {
//         throw new ApiError(404, "Payment not found or you are not authorized.");
//     }

//     payment.status = PaymentStatus.COMPLETED;
//     await payment.save();

//     // Update contract status
//     await Contract.findByIdAndUpdate(payment.contractId, { status: 'Completed' });

//     // TODO: Trigger notification to freelancer

//     res.status(200).json(new ApiResponse(200, { success: true }, "Payment confirmed and funds released"));
// });

// // @desc    Get payment history for a user
// // @route   GET /api/v1/payments
// // @access  Private
// const getPaymentHistory = asyncHandler(async (req: Request, res: Response) => {
//     const userId = req.user?._id;

//     const payments = await Payment.find({
//         $or: [{ clientId: userId }, { freelancerId: userId }]
//     }).sort({ createdAt: -1 });

//     return res.status(200).json(new ApiResponse(200, payments, "Payment history fetched successfully"));
// });

// export {
//     createPaymentIntent,
//     confirmPayment,
//     getPaymentHistory
// };
