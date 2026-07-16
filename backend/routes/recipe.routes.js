import express from 'express';
import * as recipeController from '../controllers/recipe.controller.js';

const router = express.Router();

// Route for generation
router.post('/generate', recipeController.generateRecipe);

// Route for testing mock schema directly
router.get('/mock', recipeController.getMockRecipe);

export default router;
