import express from 'express';
import * as recipeController from '../controllers/recipe.controller.js';
import { optionalAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

// Generate recipe
router.post('/generate', optionalAuth, recipeController.generateRecipe);

// Get mock recipe for testing
router.get('/mock', recipeController.getMockRecipe);

// Get history list summaries
router.get('/history', optionalAuth, recipeController.getRecipeHistory);

// Get a single recipe by ID
router.get('/history/:id', optionalAuth, recipeController.getRecipeById);

// Delete a recipe from history
router.delete('/history/:id', optionalAuth, recipeController.deleteRecipeById);

export default router;
