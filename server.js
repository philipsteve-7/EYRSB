import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from 'dotenv';  // Import dotenv to use the .env file
import { userRouter } from "./routes/user.js";
import { recipesRouter } from "./routes/recipes.js";

dotenv.config();  // Load the .env file

const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", userRouter);
app.use("/recipes", recipesRouter);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("DB connected...");
}).catch(err => {
  console.error("DB connection error:", err);
});

app.listen(5000, () => console.log("Server started on port 5000"));
