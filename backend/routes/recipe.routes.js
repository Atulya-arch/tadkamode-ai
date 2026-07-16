import express from 'express';
import { generateRecipe } from '../controllers/recipe.controller.js';

const router = express.Router();

// POST /api/recipes/generate
// Receives ingredients, calls Groq, returns structured recipe JSON
router.post('/generate', generateRecipe);

export default router;
