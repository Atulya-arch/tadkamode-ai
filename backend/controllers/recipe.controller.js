import { generateRequestSchema } from '../validators/recipe.validator.js';
import * as recipeService from '../services/recipe.service.js';
import AppError from '../utils/appError.js';
import Recipe from '../models/recipe.model.js';
import mongoose from 'mongoose';

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

    // 2. Call service to generate recipe (saves to DB inside service)
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

/**
 * Retrieves a list of generated recipes for history list summary
 */
export const getRecipeHistory = async (req, res, next) => {
  try {
    // Select summary fields to keep list response payload minimal
    const recipes = await Recipe.find({}, 'title description difficulty createdAt inputIngredients')
      .sort({ createdAt: -1 })
      .limit(30);

    return res.status(200).json({
      status: 'success',
      data: {
        recipes
      }
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Retrieves a single recipe detail from history
 */
export const getRecipeById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ObjectId structure to prevent database cast errors
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError('Invalid Recipe ID format.', 400));
    }

    const recipe = await Recipe.findById(id);

    if (!recipe) {
      return next(new AppError('Recipe not found in history.', 404));
    }

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
 * Centralized endpoint to delete a recipe from history database
 */
export const deleteRecipeById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError('Invalid Recipe ID format.', 400));
    }

    const recipe = await Recipe.findByIdAndDelete(id);

    if (!recipe) {
      return next(new AppError('Recipe not found in history.', 404));
    }

    return res.status(200).json({
      status: 'success',
      message: 'Recipe deleted successfully from history.'
    });
  } catch (error) {
    return next(error);
  }
};
