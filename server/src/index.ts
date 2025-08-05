import "dotenv/config";
import connectDB from "./db/index.js";
import app from "./app.js";

// Explicitly type the port as a number
const port: number = Number(process.env.PORT) || 8000;

connectDB()
  .then(() => {
    app.on("error", (error: unknown) => {
      console.error("Server error:", error);
    });

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error: unknown) => {
    console.error("MongoDB connection FAILED:", error);
  });
