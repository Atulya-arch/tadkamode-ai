const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Helper to resolve JWT headers dynamically if a user is authenticated
const getHeaders = () => {
  const token = localStorage.getItem('tadka_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

/**
 * Service to handle communication with backend Recipe API endpoints
 */
export const recipeService = {
  /**
   * Triggers a live recipe generation from the ingredients list
   */
  async generateRecipe(ingredients, signal) {
    try {
      const response = await fetch(`${API_BASE_URL}/recipes/generate`, {
        method: 'POST',
        headers: getHeaders(),
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
        headers: getHeaders(),
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
   * Fetches recipe generation history list summaries
   */
  async getHistory(signal) {
    try {
      const response = await fetch(`${API_BASE_URL}/recipes/history`, {
        method: 'GET',
        headers: getHeaders(),
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
  },

  /**
   * Fetches full recipe detail by ID to reload it
   */
  async getRecipeById(id, signal) {
    try {
      const response = await fetch(`${API_BASE_URL}/recipes/history/${id}`, {
        method: 'GET',
        headers: getHeaders(),
        signal,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch recipe details.');
      }

      return result.data.recipe;
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('[Recipe Service] Recipe detail request cancelled.');
      }
      throw error;
    }
  },

  /**
   * Deletes a recipe by its ID
   */
  async deleteRecipe(id) {
    const response = await fetch(`${API_BASE_URL}/recipes/history/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to delete recipe.');
    }

    return result;
  }
};

export default recipeService;
