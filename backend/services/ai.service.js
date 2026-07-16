import Groq from 'groq-sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { recipeSchema } from '../validators/recipe.validator.js';
import { extractAndParseJSON } from '../utils/jsonParser.js';
import AppError from '../utils/appError.js';

// Initialize SDKs lazily to avoid crashing if keys are not present at startup
let groqClient = null;
let geminiClient = null;

const getGroqClient = () => {
  if (!groqClient) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.warn('[AI Service] WARNING: GROQ_API_KEY environment variable is not defined.');
      return null;
    }
    groqClient = new Groq({ apiKey });
  }
  return groqClient;
};

const getGeminiClient = () => {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('[AI Service] WARNING: GEMINI_API_KEY environment variable is not defined.');
      return null;
    }
    geminiClient = new GoogleGenerativeAI(apiKey);
  }
  return geminiClient;
};

// Timeout helper (defaults to 10 seconds)
const withTimeout = (promise, ms = 10000) => {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new AppError('AI model request timed out. Please try again.', 504));
    }, ms);
  });

  return Promise.race([
    promise.then((result) => {
      clearTimeout(timeoutId);
      return result;
    }),
    timeoutPromise
  ]);
};

// Strict recipe schema definition instructions for the prompt
const SYSTEM_PROMPT = `You are a professional chef. Your task is to generate a recipe based on the list of ingredients provided by the user.
You must construct a creative, delicious recipe utilizing as many of the provided ingredients as possible, alongside common pantry staples (salt, pepper, oil, water, spices, etc.).

Return ONLY a valid JSON object matching the schema below. Do not wrap in markdown block (like \`\`\`json). Do not add any conversational text before or after the JSON.

JSON Schema format:
{
  "title": "Name of the recipe",
  "description": "A short, engaging description of the recipe",
  "prepTime": "Prep time (e.g. 10 mins)",
  "cookTime": "Cook time (e.g. 20 mins)",
  "servings": 2, // Integer number of servings
  "difficulty": "Easy", // Easy, Medium, or Hard
  "ingredients": [
    {
      "name": "Name of the ingredient",
      "quantity": "Quantity (e.g. 200g, 1 cup, 2 tbsp)",
      "optional": false // Boolean: true if it is not strictly required (like garnishing, or easily skipped elements)
    }
  ],
  "steps": [
    {
      "step": 1, // Step number starting from 1
      "instruction": "Step instruction details"
    }
  ],
  "substitutions": [
    {
      "ingredient": "Name of the main ingredient to substitute",
      "alternatives": ["Alternative ingredient 1", "Alternative ingredient 2"]
    }
  ],
  "tips": [
    "Chef tip 1",
    "Chef tip 2"
  ]
}

Provided ingredients: `;

/**
 * Attempts to generate a recipe using Groq API (Primary)
 */
const generateWithGroq = async (ingredients) => {
  const client = getGroqClient();
  if (!client) {
    throw new AppError('Groq API Key is not configured.', 500);
  }

  const promptText = `${SYSTEM_PROMPT}${ingredients.join(', ')}`;

  // Using Llama-3.3-70b-versatile because of its superior reasoning and JSON compatibility
  const response = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'user',
        content: promptText
      }
    ],
    // Force Groq to return JSON
    response_format: { type: 'json_object' },
    temperature: 0.7,
    max_tokens: 1500
  });

  return response.choices[0]?.message?.content;
};

/**
 * Attempts to generate a recipe using Gemini API (Fallback)
 */
const generateWithGemini = async (ingredients) => {
  const client = getGeminiClient();
  if (!client) {
    throw new AppError('Gemini API Key is not configured.', 500);
  }

  const promptText = `${SYSTEM_PROMPT}${ingredients.join(', ')}`;
  const model = client.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.7,
      maxOutputTokens: 1500
    }
  });

  const response = await model.generateContent(promptText);
  return response.response.text();
};

/**
 * Orchestrates recipe generation with fallback support and schema validation.
 * 
 * @param {Array<string>} ingredients - List of input ingredients
 * @returns {object} Validated recipe JSON
 */
export const generateRecipeFromAI = async (ingredients) => {
  let rawResponse = '';
  let primaryError = null;

  // 1. Try Groq (Primary)
  try {
    console.log('[AI Service] Attempting recipe generation using Groq (Primary)...');
    rawResponse = await withTimeout(generateWithGroq(ingredients), 10000);
    console.log('[AI Service] Groq response received successfully.');
  } catch (error) {
    primaryError = error;
    console.error(`[AI Service] Groq failed. Reason: ${error.message}.`);
    
    // Check if error is due to missing configuration or rate limiting (429) or timeout (504)
    // We log it and trigger fallback
  }

  // 2. Try Gemini (Fallback) if Groq failed
  if (primaryError) {
    try {
      console.log('[AI Service] Falling back to Gemini (Secondary)...');
      rawResponse = await withTimeout(generateWithGemini(ingredients), 12000);
      console.log('[AI Service] Gemini response received successfully.');
    } catch (fallbackError) {
      console.error(`[AI Service] Gemini fallback failed too. Reason: ${fallbackError.message}.`);
      
      // If both fail, throw the error that provides the most context
      throw new AppError(
        `AI recipe generation failed on both primary and fallback engines. Primary error: ${primaryError.message}. Fallback error: ${fallbackError.message}`,
        502
      );
    }
  }

  // 3. Extract and parse the raw JSON
  const parsedJSON = extractAndParseJSON(rawResponse);

  // 4. Validate output schema using Zod
  try {
    const validatedRecipe = recipeSchema.parse(parsedJSON);
    return validatedRecipe;
  } catch (zodError) {
    console.error('[AI Service] AI response failed Zod validation schema check:', zodError.errors);
    
    // We attempt to return a repaired object by merging defaults if it has partial data, 
    // or raise a 502 Bad Gateway error.
    throw new AppError(
      `AI generated JSON schema was invalid: ${zodError.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`,
      502
    );
  }
};
