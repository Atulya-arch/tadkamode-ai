/**
 * recipeHistory.js
 * 
 * Centralized localStorage utility for TadkaMode recipe history.
 * All components interact with history ONLY through these functions.
 * 
 * Storage key: 'tadkamode_recipe_history'
 * Format: Array of full recipe objects, sorted newest-first.
 * Cap: 50 recipes (~3-5KB each, well within the 5MB browser limit).
 */

const STORAGE_KEY = 'tadkamode_recipe_history';
const MAX_HISTORY = 50;

/**
 * Loads the full recipe history list from localStorage.
 * @returns {Array} Array of recipe objects, newest first. Never throws.
 */
export const loadRecipes = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn('[recipeHistory] Failed to parse history from localStorage:', e.message);
    return [];
  }
};

/**
 * Saves a new recipe to the front of the history list.
 * Assigns a stable unique ID using crypto.randomUUID().
 * Trims history to MAX_HISTORY entries to prevent localStorage overflow.
 * 
 * @param {object} recipe - Validated recipe object from the API
 * @param {Array<string>} inputIngredients - The ingredients the user typed in
 * @returns {object} The saved recipe object (with id and createdAt attached)
 */
export const saveRecipe = (recipe, inputIngredients = []) => {
  try {
    const existing = loadRecipes();

    const savedRecipe = {
      ...recipe,
      id: crypto.randomUUID(),
      inputIngredients,
      createdAt: new Date().toISOString(),
    };

    // Prepend newest first, trim to cap
    const updated = [savedRecipe, ...existing].slice(0, MAX_HISTORY);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    return savedRecipe;
  } catch (e) {
    console.warn('[recipeHistory] Failed to save recipe to localStorage:', e.message);
    // Return the recipe without persistence — app keeps working
    return { ...recipe, id: crypto.randomUUID(), inputIngredients, createdAt: new Date().toISOString() };
  }
};

/**
 * Retrieves a single full recipe object from localStorage by its id.
 * 
 * @param {string} id - The recipe's unique id
 * @returns {object|null} The recipe object, or null if not found
 */
export const getRecipeById = (id) => {
  const all = loadRecipes();
  return all.find(r => r.id === id) || null;
};

/**
 * Deletes a recipe from localStorage by its id.
 * 
 * @param {string} id - The recipe's unique id
 * @returns {boolean} true if found and deleted, false if not found
 */
export const deleteRecipe = (id) => {
  try {
    const existing = loadRecipes();
    const filtered = existing.filter(r => r.id !== id);
    if (filtered.length === existing.length) return false; // Not found
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (e) {
    console.warn('[recipeHistory] Failed to delete recipe from localStorage:', e.message);
    return false;
  }
};

/**
 * Clears the entire recipe history from localStorage.
 */
export const clearRecipeHistory = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('[recipeHistory] Failed to clear history from localStorage:', e.message);
  }
};
