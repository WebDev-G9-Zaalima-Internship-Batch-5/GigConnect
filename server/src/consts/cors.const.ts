export const corsOrigin =
  process.env.NODE_ENV === "development"
    ? process.env.CORS_ORIGIN_LOCAL
    : process.env.CORS_ORIGIN_PROD;
