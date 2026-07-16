import express from 'express';
import * as recipeController from '../controllers/recipe.controller.js';

const router = express.Router();

// Generate recipe
router.post('/generate', recipeController.generateRecipe);

// Get mock recipe for testing
router.get('/mock', recipeController.getMockRecipe);

// Get history list summaries
router.get('/history', recipeController.getRecipeHistory);

// Get a single recipe by ID
router.get('/history/:id', recipeController.getRecipeById);

export default router;
