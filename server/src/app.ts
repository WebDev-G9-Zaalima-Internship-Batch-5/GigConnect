import express, { Application } from "express";
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./services/swagger.service.js";

const app: Application = express();

// Handle CORS
const allowedOrigins: (string | undefined)[] = [
  process.env.CORS_ORIGIN_LOCAL,
  process.env.CORS_ORIGIN_PROD,
].filter(Boolean) as string[];

const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(express.static("public"));
app.use(cookieParser());

// routes

import userRouter from "./routes/user.route.js";
import profileRouter from "./routes/profile.route.js";
import gigRouter from "./routes/gig.route.js";
import contractRouter from "./routes/contract.route.js";
import reviewRouter from "./routes/review.route.js";
import messageRouter from "./routes/message.route.js";
// import paymentRouter from "./routes/payment.route.js";
import notificationRouter from "./routes/notification.route.js";
import healthcheckRouter from "./routes/healthcheck.route.js";
import dashboardRouter from "./routes/dashboard.route.js";

app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/profiles", profileRouter);
app.use("/api/v1/gigs", gigRouter);
app.use("/api/v1/contracts", contractRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/messages", messageRouter);
// app.use("/api/v1/payments", paymentRouter);
app.use("/api/v1/notifications", notificationRouter);
app.use("/api/v1/dashboard", dashboardRouter);

// error handling
app.use(errorHandler);
export default app;
