import React, { useState } from 'react';
import { useRecipeGenerator } from './hooks/useRecipeGenerator';
import { TagInput } from './components/TagInput';
import { RecipeSkeleton } from './components/RecipeSkeleton';
import { ChefHat, RotateCw, AlertTriangle, Play, Sparkles, HelpCircle } from 'lucide-react';

function App() {
  const [ingredients, setIngredients] = useState(['rice', 'onion', 'tomatoes', 'cheese', 'mushrooms']);
  const { recipe, status, error, generate, retry, clear, isLoading } = useRecipeGenerator();

  const handleGenerate = (useMock) => {
    if (ingredients.length === 0) return;
    generate(ingredients, useMock);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Header */}
      <header className="border-b border-slate-900 bg-slate-950/60 backdrop-blur-md sticky top-0 z-10 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500 rounded-xl text-slate-950 shadow-lg shadow-amber-500/20">
              <ChefHat className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-white">
                Tadka<span className="text-amber-500">Mode</span>
              </h1>
              <p className="text-xs text-slate-400 font-medium">Turn ingredients into recipes</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-6 flex flex-col gap-6 justify-center">
        {/* Ingredient Dashboard Input Card */}
        <section className="glass-card rounded-2xl p-6 border border-slate-900 shadow-2xl animate-scale-in">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                Fridge Inventory
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Add ingredients you have in your fridge or pantry to generate a recipe.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {/* Tag chip input component */}
            <TagInput
              tags={ingredients}
              onTagsChange={setIngredients}
              placeholder="e.g. garlic, tomato, cilantro (Press Enter or Comma)"
            />

            {/* CTA Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <button
                type="button"
                onClick={() => handleGenerate(true)}
                disabled={isLoading || ingredients.length === 0}
                className="flex-1 bg-slate-900 hover:bg-slate-850 disabled:opacity-40 disabled:hover:bg-slate-900 text-slate-300 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                {isLoading ? <RotateCw className="w-4 h-4 animate-spin text-slate-400" /> : <Play className="w-4 h-4 text-slate-400" />}
                Generate Mock Recipe
              </button>

              <button
                type="button"
                onClick={() => handleGenerate(false)}
                disabled={isLoading || ingredients.length === 0}
                className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:opacity-40 disabled:from-amber-500 disabled:to-amber-600 text-slate-950 font-extrabold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/10 cursor-pointer disabled:cursor-not-allowed"
              >
                {isLoading ? <RotateCw className="w-4 h-4 animate-spin text-slate-950" /> : <Sparkles className="w-4 h-4 text-slate-950" />}
                Cook with Tadka Mode
              </button>
            </div>
          </div>
        </section>

        {/* Dynamic Display Area */}
        <section className="flex-1 flex flex-col justify-center min-h-[300px]">
          {status === 'idle' && (
            <div className="text-center py-16 border-2 border-dashed border-slate-900/60 bg-slate-900/10 rounded-2xl flex flex-col items-center justify-center gap-3 text-slate-500 animate-fade-in-up">
              <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-850">
                <ChefHat className="w-10 h-10 text-slate-400 stroke-[1.5]" />
              </div>
              <div className="max-w-xs mt-2">
                <p className="font-bold text-slate-350 text-sm">Add ingredients to begin</p>
                <p className="text-xs text-slate-500 mt-1">
                  Once you specify what ingredients you have, click a button to generate recipe steps.
                </p>
              </div>
            </div>
          )}

          {status === 'loading' && <RecipeSkeleton />}

          {status === 'error' && (
            <div className="bg-red-950/20 border border-red-500/20 rounded-2xl p-6 flex flex-col gap-4 animate-scale-in">
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-red-500/10 rounded-xl text-red-400 border border-red-500/20">
                  <AlertTriangle className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <h3 className="font-bold text-red-200 text-base">Generation Failed</h3>
                  <p className="text-sm text-red-400/90 mt-1 font-medium leading-relaxed">{error}</p>
                </div>
              </div>
              <button
                onClick={retry}
                className="self-end bg-red-550 hover:bg-red-650 text-white font-bold py-2 px-5 rounded-xl text-xs transition-all border border-red-500/30 cursor-pointer"
              >
                Retry Generation
              </button>
            </div>
          )}

          {status === 'success' && recipe && (
            <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 shadow-2xl animate-fade-in-up">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-500 px-3 py-1 bg-amber-500/10 rounded-full border border-amber-500/10">
                    {recipe.difficulty}
                  </span>
                  <h3 className="text-2xl font-extrabold text-white mt-3 font-sans leading-tight">{recipe.title}</h3>
                  <p className="text-sm text-slate-400 mt-2 font-medium leading-relaxed">{recipe.description}</p>
                </div>
                <button
                  onClick={clear}
                  className="text-xs font-bold text-slate-400 hover:text-white px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
                >
                  Clear Results
                </button>
              </div>

              {/* Stats Metadata Grid */}
              <div className="grid grid-cols-3 gap-4 border-y border-slate-850 py-4 mb-6">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Prep Time</p>
                  <p className="text-sm font-extrabold text-slate-200 mt-1">{recipe.prepTime}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Cook Time</p>
                  <p className="text-sm font-extrabold text-slate-200 mt-1">{recipe.cookTime}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Servings</p>
                  <p className="text-sm font-extrabold text-slate-200 mt-1">{recipe.servings}</p>
                </div>
              </div>

              {/* Display Ingredients for Verification */}
              <div className="space-y-3">
                <h4 className="font-bold text-white text-sm uppercase tracking-wider text-slate-350">
                  Ingredients Needed ({recipe.ingredients.length})
                </h4>
                <ul className="text-sm text-slate-400 list-disc list-inside space-y-1.5 pl-1">
                  {recipe.ingredients.map((ing, index) => (
                    <li key={index}>
                      <span className="text-slate-200 font-bold">{ing.name}</span>: {ing.quantity} {ing.optional && <span className="text-xs text-slate-500 font-normal italic">(optional)</span>}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
