import { generateRequestSchema } from '../validators/recipe.validator.js';
import * as recipeService from '../services/recipe.service.js';
import AppError from '../utils/appError.js';

/**
 * Controller to handle recipe generation requests
 */
export const generateRecipe = async (req, res, next) => {
  try {
    // 1. Validate request body against schema
    const parsedBody = generateRequestSchema.safeParse(req.body);
    if (!parsedBody.success) {
      const errorMsg = parsedBody.error.errors.map(err => err.message).join(', ');
      return next(new AppError(`Validation Error: ${errorMsg}`, 400));
    }

    const { ingredients } = parsedBody.data;

    // 2. Call service to generate recipe (currently mock)
    const recipe = await recipeService.generateRecipeFromIngredients(ingredients);

    // 3. Return JSON response
    return res.status(200).json({
      status: 'success',
      data: {
        recipe
      }
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Mock endpoint directly serving the validated mock data
 */
export const getMockRecipe = async (req, res, next) => {
  try {
    const recipe = await recipeService.generateRecipeFromIngredients(['mock']);
    return res.status(200).json({
      status: 'success',
      data: {
        recipe
      }
    });
  } catch (error) {
    return next(error);
  }
};
