import { z } from 'zod';

/**
 * Validator schema for individual recipe ingredients
 */
export const ingredientSchema = z.object({
  name: z.string().trim().min(1, 'Ingredient name cannot be empty'),
  quantity: z.string().trim().default('to taste'),
  optional: z.boolean().default(false)
});

/**
 * Validator schema for recipe preparation steps
 */
export const stepSchema = z.object({
  step: z.coerce.number().int().positive(),
  instruction: z.string().trim().min(1, 'Step instruction cannot be empty')
});

/**
 * Validator schema for ingredient substitutions
 */
export const substitutionSchema = z.object({
  ingredient: z.string().trim().min(1, 'Target ingredient is required for substitutions'),
  alternatives: z.array(z.string().trim()).default([])
});

/**
 * Main recipe Zod schema returned by the LLM
 */
export const recipeSchema = z.object({
  title: z.string().trim().min(1, 'Recipe title is required'),
  description: z.string().trim().default(''),
  prepTime: z.string().trim().default('N/A'),
  cookTime: z.string().trim().default('N/A'),
  servings: z.coerce.number().int().positive().default(2),
  difficulty: z.string().trim().default('Easy'),
  ingredients: z.array(ingredientSchema).min(1, 'At least one ingredient is required'),
  steps: z.array(stepSchema).min(1, 'At least one step is required'),
  substitutions: z.array(substitutionSchema).default([]),
  tips: z.array(z.string().trim()).default([])
});

/**
 * Validator schema for API request payload (user ingredients input)
 */
export const generateRequestSchema = z.object({
  ingredients: z.array(z.string().trim().min(1, 'Ingredient entry cannot be empty'))
    .min(1, 'At least one ingredient must be provided')
});
