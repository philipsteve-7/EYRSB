import express from "express";
import mongoose from "mongoose";
import { RecipesModel } from "../models/Recipes.js";
import { UserModel } from "../models/Users.js";
import { verifyToken } from "./user.js";

const router = express.Router();

// Get all recipes
router.get("/", async (req, res) => {
  try {
    const result = await RecipesModel.find({});
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve recipes", error: err.message });
  }
});

// Create a new recipe
router.post("/", verifyToken, async (req, res) => {
  const { name, image, ingredients, instructions, imageUrl, cookingTime, userOwner } = req.body;
  
  // Basic validation to ensure data is provided
  if (!name || !ingredients || !instructions) {
    return res.status(400).json({ message: "Name, ingredients, and instructions are required" });
  }

  const recipe = new RecipesModel({
    _id: new mongoose.Types.ObjectId(),
    name,
    image,
    ingredients,
    instructions,
    imageUrl,
    cookingTime,
    userOwner,
  });

  try {
    const result = await recipe.save();
    res.status(201).json({
      createdRecipe: {
        name: result.name,
        image: result.image,
        ingredients: result.ingredients,
        instructions: result.instructions,
        _id: result._id,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to create recipe", error: err.message });
  }
});

// Get a recipe by ID
router.get("/:recipeId", async (req, res) => {
  try {
    const result = await RecipesModel.findById(req.params.recipeId);
    if (!result) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve recipe", error: err.message });
  }
});

// Save a recipe (to user's saved recipes)
router.put("/", async (req, res) => {
  const { recipeID, userID } = req.body;

  try {
    const recipe = await RecipesModel.findById(recipeID);
    const user = await UserModel.findById(userID);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.savedRecipes.push(recipe);
    await user.save();
    res.status(200).json({ savedRecipes: user.savedRecipes });
  } catch (err) {
    res.status(500).json({ message: "Failed to save recipe", error: err.message });
  }
});

// Get ids of saved recipes
router.get("/savedRecipes/ids/:userId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ savedRecipes: user.savedRecipes });
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve saved recipes IDs", error: err.message });
  }
});

// Get saved recipes for a user
router.get("/savedRecipes/:userId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const savedRecipes = await RecipesModel.find({ _id: { $in: user.savedRecipes } });
    res.status(200).json({ savedRecipes });
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve saved recipes", error: err.message });
  }
});

export { router as recipesRouter };
