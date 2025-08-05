import mongoose from "mongoose";

const connectDB = async (
  retries: number = 5,
  waitTime: number = 5000
): Promise<void> => {
  const MONGO_URI = process.env.MONGO_URI;

  if (!MONGO_URI) {
    console.error("MONGO_URI is not defined in environment variables.");
    process.exit(1);
  }

  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(MONGO_URI, {
        dbName: process.env.DB_NAME ?? "GigConnect",
      });
      console.log("MongoDB connected successfully.");
      return;
    } catch (error) {
      console.error(
        `MongoDB connection attempt ${i + 1} failed. Retrying in ${
          waitTime / 1000
        }s...`
      );
      await new Promise((res) => setTimeout(res, waitTime));
    }
  }

  console.error("MongoDB connection failed after all retries. Exiting...");
  process.exit(1);
};

// Handle connection events
mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to DB");
});

mongoose.connection.on("error", (err: Error) => {
  console.error(`Mongoose connection error: ${err.message}`);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected from DB");
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("Mongoose connection closed due to application termination");
  process.exit(0);
});

export default connectDB;
