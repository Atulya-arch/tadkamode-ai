/**
 * recipeService.js
 * 
 * Frontend service layer for communicating with the TadkaMode backend.
 * Responsibility: Call the backend's single recipe generation endpoint.
 * History, persistence, and deletion are handled locally via recipeHistory.js.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Service to handle communication with the backend Recipe API.
 */
export const recipeService = {
  /**
   * Sends the ingredients list to the backend, which calls Groq and returns
   * a validated, structured recipe JSON.
   * 
   * @param {Array<string>} ingredients - List of ingredients from the user
   * @param {AbortSignal} signal - AbortController signal for request cancellation
   * @returns {object} Validated recipe object
   */
  async generateRecipe(ingredients, signal) {
    try {
      const response = await fetch(`${API_BASE_URL}/recipes/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients }),
        signal,
      });

      const result = await response.json();

      if (!response.ok) {
        // Surface the backend's error message if available
        throw new Error(result.message || `Server error ${response.status}: Failed to generate recipe.`);
      }

      return result.data.recipe;
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('[recipeService] Generation request cancelled.');
      }
      throw error;
    }
  },
};

export default recipeService;
