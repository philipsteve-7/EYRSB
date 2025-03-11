import mongoose from "mongoose";

// Define the User schema
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  savedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
});

// Create the User model based on the schema
const UserModel = mongoose.model("User", UserSchema); // "User" collection will be automatically pluralized to "users"

// Export the model (you can use default export for simplicity)
export default UserModel;
