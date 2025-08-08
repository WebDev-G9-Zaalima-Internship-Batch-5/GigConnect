import express, { Application } from "express";
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./services/swagger.service.js";

const app: Application = express();

// Handle CORS
const allowedOrigins: (string | undefined)[] = [
  process.env.CORS_ORIGIN_LOCAL, // Localhost (for development)
  process.env.CORS_ORIGIN_PROD, // Vercel frontend (for production)
];

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

// swagger route
if (process.env.NODE_ENV === "development") {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("Swagger docs available at /api-docs");
}

// routes

import userRouter from "./routes/user.route.js";
import healthcheckRouter from "./routes/healthcheck.route.js";

app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/users", userRouter);

// error handling
app.use(errorHandler);
export default app;
