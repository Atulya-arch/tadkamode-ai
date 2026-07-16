import { generateRequestSchema } from '../validators/recipe.validator.js';
import { generateRecipeFromAI } from '../services/ai.service.js';
import AppError from '../utils/appError.js';

/**
 * Controller to handle recipe generation requests.
 * 
 * Responsibilities:
 * 1. Validate the incoming ingredients payload via Zod
 * 2. Call the AI service to generate and validate a structured recipe JSON
 * 3. Return the validated recipe to the client
 * 
 * History persistence is handled client-side via localStorage.
 */
export const generateRecipe = async (req, res, next) => {
  try {
    // 1. Validate request body
    const parsedBody = generateRequestSchema.safeParse(req.body);
    if (!parsedBody.success) {
      const errorMsg = parsedBody.error.errors.map(err => err.message).join(', ');
      return next(new AppError(`Validation Error: ${errorMsg}`, 400));
    }

    const { ingredients } = parsedBody.data;

    // 2. Generate recipe via AI (Groq primary → Gemini fallback)
    const recipe = await generateRecipeFromAI(ingredients);

    // 3. Return structured JSON
    return res.status(200).json({
      status: 'success',
      data: { recipe }
    });
  } catch (error) {
    return next(error);
  }
};
