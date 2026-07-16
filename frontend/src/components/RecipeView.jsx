import React, { useState, useEffect } from 'react';
import { scaleQuantity } from '../utils/quantityScaler';
import { 
  Users, Plus, Minus, CheckSquare, Square, 
  Lightbulb, Sparkles, RefreshCw, CheckCircle2 
} from 'lucide-react';

/**
 * Interactive Recipe View Component.
 * Supports servings adjustment, ingredient scaling, checklist progress tracking, 
 * substitutions, and tips rendering.
 */
export const RecipeView = ({ recipe, onReset }) => {
  const [servings, setServings] = useState(recipe.servings || 2);
  const [checkedSteps, setCheckedSteps] = useState({});

  // Reset checked steps and servings whenever a new recipe is loaded
  useEffect(() => {
    setServings(recipe.servings || 2);
    setCheckedSteps({});
  }, [recipe]);

  const toggleStep = (stepNumber) => {
    setCheckedSteps(prev => ({
      ...prev,
      [stepNumber]: !prev[stepNumber]
    }));
  };

  const adjustServings = (amount) => {
    setServings(prev => Math.max(1, Math.min(24, prev + amount)));
  };

  // Progress Calculations
  const totalSteps = recipe.steps?.length || 0;
  const completedSteps = Object.values(checkedSteps).filter(Boolean).length;
  const progressPercent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  return (
    <div className="w-full flex flex-col gap-6 animate-scale-in">
      {/* Recipe Meta Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        {/* Visual Tadka accent glow */}
        <div className="absolute -right-16 -top-16 w-36 h-36 bg-amber-500/10 rounded-full blur-3xl"></div>
        
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-500 px-3 py-1 bg-amber-500/10 rounded-full border border-amber-500/10">
            {recipe.difficulty || 'Easy'}
          </span>
          
          <button
            onClick={onReset}
            className="text-xs font-bold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-950/40 border border-slate-850 hover:border-slate-800 transition-all cursor-pointer"
          >
            Generate Another
          </button>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight font-sans">
          {recipe.title}
        </h2>
        <p className="text-slate-400 text-sm mt-2 leading-relaxed font-medium">
          {recipe.description}
        </p>

        {/* Cook Time Grid */}
        <div className="grid grid-cols-3 gap-4 border-t border-slate-850 pt-5 mt-5 text-center">
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Prep Time</p>
            <p className="text-sm sm:text-base font-black text-slate-100 mt-1">{recipe.prepTime}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Cook Time</p>
            <p className="text-sm sm:text-base font-black text-slate-100 mt-1">{recipe.cookTime}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Original Servings</p>
            <p className="text-sm sm:text-base font-black text-slate-100 mt-1">{recipe.servings}</p>
          </div>
        </div>
      </div>

      {/* Cooking Experience Columns */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        
        {/* LEFT COLUMN: Ingredients & Scaler (2/5 span) */}
        <div className="md:col-span-2 flex flex-col gap-6">
          {/* Servings Adjuster & Ingredients list */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-850 pb-4 mb-4">
              <h3 className="font-extrabold text-white text-sm uppercase tracking-wider">
                Ingredients
              </h3>
              
              {/* Serving Selector Controls */}
              <div className="flex items-center gap-3 bg-slate-950/60 border border-slate-850 rounded-xl px-2.5 py-1">
                <button
                  onClick={() => adjustServings(-1)}
                  disabled={servings <= 1}
                  className="p-1 rounded-md text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <div className="flex items-center gap-1.5 select-none">
                  <Users className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-xs font-black text-white w-4 text-center">{servings}</span>
                </div>
                <button
                  onClick={() => adjustServings(1)}
                  disabled={servings >= 24}
                  className="p-1 rounded-md text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Scaled Ingredients checklist */}
            <ul className="space-y-3">
              {recipe.ingredients.map((ing, idx) => {
                const scaledQty = scaleQuantity(ing.quantity, recipe.servings, servings);
                return (
                  <li 
                    key={idx} 
                    className="flex justify-between items-start text-sm border-b border-slate-850/30 pb-2.5 last:border-b-0 last:pb-0"
                  >
                    <span className="text-slate-350 font-medium capitalize">
                      {ing.name}
                      {ing.optional && (
                        <span className="text-[10px] text-slate-500 font-normal italic ml-1.5">(optional)</span>
                      )}
                    </span>
                    <span className="text-slate-100 font-extrabold bg-slate-950/40 px-2 py-0.5 rounded border border-slate-850/60 text-xs">
                      {scaledQty}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Ingredient Substitutions Card */}
          {recipe.substitutions && recipe.substitutions.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <h3 className="font-extrabold text-white text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-amber-500" />
                Substitutions
              </h3>
              <div className="flex flex-col gap-3">
                {recipe.substitutions.map((sub, idx) => (
                  <div 
                    key={idx}
                    className="bg-slate-950/40 border border-slate-850/80 rounded-xl p-3"
                  >
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                      Instead of <span className="text-amber-500 capitalize">{sub.ingredient}</span>:
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {sub.alternatives.map((alt, aIdx) => (
                        <span 
                          key={aIdx} 
                          className="px-2 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-bold text-slate-200 capitalize"
                        >
                          {alt}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Interactive Checklist (3/5 span) */}
        <div className="md:col-span-3 flex flex-col gap-6">
          
          {/* Progress Indicator Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col gap-3">
            <div className="flex justify-between items-center text-sm font-bold">
              <span className="text-white">Cooking Steps Progress</span>
              <span className="text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full text-xs font-black">
                {progressPercent}% Complete
              </span>
            </div>
            
            {/* Progress Bar container */}
            <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-850 p-0.5">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-500 ease-out shadow-sm"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>

            {progressPercent === 100 && (
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-xl mt-1 animate-scale-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Tadka applied! Chef, your meal is ready to be plated and served. Bon appétit!</span>
              </div>
            )}
          </div>

          {/* Steps Checklist Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex-1">
            <h3 className="font-extrabold text-white text-sm uppercase tracking-wider mb-4">
              Instructions Checklist
            </h3>
            
            <div className="flex flex-col gap-3.5">
              {recipe.steps.map((stepItem) => {
                const isChecked = !!checkedSteps[stepItem.step];
                return (
                  <button
                    key={stepItem.step}
                    onClick={() => toggleStep(stepItem.step)}
                    className={`w-full text-left p-4 rounded-xl border flex gap-3.5 items-start transition-all cursor-pointer duration-200 ${
                      isChecked
                        ? 'bg-slate-950/30 border-slate-850/60 opacity-60 hover:opacity-80'
                        : 'bg-slate-950/60 border-slate-850 hover:border-slate-800 hover:bg-slate-950/80 shadow-sm'
                    }`}
                  >
                    {/* Checkbox Icon */}
                    <div className="mt-0.5 flex-shrink-0">
                      {isChecked ? (
                        <CheckSquare className="w-5 h-5 text-amber-500 fill-amber-500/10" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-500 hover:text-slate-400" />
                      )}
                    </div>

                    {/* Step instruction text */}
                    <div className="flex-1">
                      <p className={`text-xs font-bold uppercase tracking-wide mb-1 ${
                        isChecked ? 'text-slate-500' : 'text-slate-400'
                      }`}>
                        Step {stepItem.step}
                      </p>
                      <p className={`text-sm leading-relaxed font-medium ${
                        isChecked ? 'text-slate-550 line-through' : 'text-slate-200'
                      }`}>
                        {stepItem.instruction}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chef Tips Card */}
          {recipe.tips && recipe.tips.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <h3 className="font-extrabold text-white text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                Chef's Secret Tips
              </h3>
              <ul className="space-y-2.5">
                {recipe.tips.map((tip, idx) => (
                  <li key={idx} className="flex gap-2.5 items-start text-sm">
                    <Sparkles className="w-4 h-4 text-amber-500/70 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-350 font-medium leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
export default RecipeView;
