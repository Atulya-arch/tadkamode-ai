const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

/**
 * Service to handle communication with backend Recipe API endpoints
 */
export const recipeService = {
  /**
   * Triggers a live recipe generation from the ingredients list
   * 
   * @param {Array<string>} ingredients - List of ingredients (e.g. ['rice', 'cheese'])
   * @param {AbortSignal} signal - AbortSignal to cancel active requests
   * @returns {Promise<object>} Generated recipe object
   */
  async generateRecipe(ingredients, signal) {
    try {
      const response = await fetch(`${API_BASE_URL}/recipes/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients }),
        signal,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to generate recipe from AI.');
      }

      return result.data.recipe;
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('[Recipe Service] Generation request cancelled successfully.');
      }
      throw error;
    }
  },

  /**
   * Retrieves a mock recipe validating our schema on the backend
   */
  async getMockRecipe(signal) {
    try {
      const response = await fetch(`${API_BASE_URL}/recipes/mock`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch mock recipe.');
      }

      return result.data.recipe;
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('[Recipe Service] Mock request cancelled successfully.');
      }
      throw error;
    }
  },

  /**
   * Fetches recipe generation history (Phase 6 feature)
   */
  async getHistory(signal) {
    try {
      const response = await fetch(`${API_BASE_URL}/recipes/history`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch history.');
      }

      return result.data.recipes || [];
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('[Recipe Service] History request cancelled.');
      }
      throw error;
    }
  }
};
