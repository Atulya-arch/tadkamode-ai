import { useState, useRef, useEffect, useCallback } from 'react';
import { recipeService } from '../services/recipeService';

/**
 * Custom React hook to orchestrate recipe generation API calls, 
 * loading states, error handling, retries, and request cancellations.
 */
export const useRecipeGenerator = () => {
  const [recipe, setRecipe] = useState(null);
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [error, setError] = useState(null);
  const [lastIngredients, setLastIngredients] = useState([]);

  // Store the active AbortController to cancel previous inflight requests
  const activeControllerRef = useRef(null);

  // Clean up any pending request when component unmounts
  useEffect(() => {
    return () => {
      if (activeControllerRef.current) {
        activeControllerRef.current.abort();
      }
    };
  }, []);

  const generate = useCallback(async (ingredientsList, useMock = false) => {
    // 1. Cancel previous pending request to prevent race conditions
    if (activeControllerRef.current) {
      console.log('[useRecipeGenerator] Cancelling pending request...');
      activeControllerRef.current.abort();
    }

    // 2. Create a new controller for this request
    const controller = new AbortController();
    activeControllerRef.current = controller;

    // 3. Update loading states
    setStatus('loading');
    setError(null);
    setLastIngredients(ingredientsList);

    try {
      let data;
      if (useMock) {
        data = await recipeService.getMockRecipe(controller.signal);
      } else {
        data = await recipeService.generateRecipe(ingredientsList, controller.signal);
      }

      // Only update state if this request wasn't aborted
      if (!controller.signal.aborted) {
        setRecipe(data);
        setStatus('success');
        activeControllerRef.current = null;
      }
    } catch (err) {
      // Catch and isolate cancellation events (AbortError)
      if (err.name === 'AbortError') {
        // Do not update state; let the newer request override it
        return;
      }

      // Update state for actual failures
      if (!controller.signal.aborted) {
        setError(err.message || 'An unexpected error occurred. Please try again.');
        setStatus('error');
        activeControllerRef.current = null;
      }
    }
  }, []);

  const retry = useCallback(() => {
    if (lastIngredients.length > 0) {
      generate(lastIngredients);
    }
  }, [lastIngredients, generate]);

  const clear = useCallback(() => {
    setRecipe(null);
    setStatus('idle');
    setError(null);
    setLastIngredients([]);
    if (activeControllerRef.current) {
      activeControllerRef.current.abort();
      activeControllerRef.current = null;
    }
  }, []);

  return {
    recipe,
    status,
    error,
    lastIngredients,
    generate,
    retry,
    clear,
    isLoading: status === 'loading'
  };
};
