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

  let finalRecipe = { ...recipe };

  // 2. Persist to MongoDB history drawer resiliently.
  try {
    const dbRecipe = new Recipe({
      ...recipe,
      inputIngredients: ingredients
    });
    await dbRecipe.save();
    console.log(`[Recipe Service] Successfully saved generated recipe "${recipe.title}" to history with ID: ${dbRecipe._id}`);
    finalRecipe._id = dbRecipe._id;
  } catch (dbError) {
    console.warn(`[Recipe Service] Resilient Database Warning: Failed to save recipe to history. Error: ${dbError.message}`);
  }

  return finalRecipe;
};
