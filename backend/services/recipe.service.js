import { generateRecipeFromAI } from './ai.service.js';
import Recipe from '../models/recipe.model.js';

/**
 * Service to generate recipes based on ingredients list
 * 
 * @param {Array<string>} ingredients - List of ingredients
 * @returns {object} Validated recipe JSON
 */
export const generateRecipeFromIngredients = async (ingredients) => {
  // 1. Call AI service to generate and validate recipe
  const recipe = await generateRecipeFromAI(ingredients);

  // 2. Persist to MongoDB history drawer resiliently.
  // If the DB connection is broken or Atlas URI is not yet supplied, we do NOT crash
  // the request; instead we log a warning and return the generated recipe.
  try {
    const dbRecipe = new Recipe({
      ...recipe,
      inputIngredients: ingredients
    });
    await dbRecipe.save();
    console.log(`[Recipe Service] Successfully saved generated recipe "${recipe.title}" to history with ID: ${dbRecipe._id}`);
  } catch (dbError) {
    console.warn(`[Recipe Service] Resilient Database Warning: Failed to save recipe to history. Error: ${dbError.message}`);
  }

  return recipe;
};
