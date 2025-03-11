import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";  // Import dotenv to load environment variables
import { userRouter } from "./routes/user.js";
import { recipesRouter } from "./routes/recipes.js";

// Load environment variables from .env
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/auth", userRouter);
app.use("/recipes", recipesRouter);

// Database connection with async/await and error handling
const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB connected...");
  } catch (error) {
    console.error("DB connection error: ", error);
    process.exit(1); // Exit the process if the database connection fails
  }
};

// Call the function to connect to the database
connectToDatabase();

// Start the server after successful DB connection
app.listen(3001, () => console.log("Server started on port 3001"));
