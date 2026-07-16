import React, { useState, useEffect } from 'react';
import { scaleQuantity } from '../utils/quantityScaler';
import { Users, Plus, Minus, X } from 'lucide-react';

export const RecipeView = ({ recipe, onReset }) => {
  const [servings, setServings] = useState(recipe.servings || 2);
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [checkedSteps, setCheckedSteps] = useState({});

  useEffect(() => {
    setServings(recipe.servings || 2);
    setCheckedIngredients({});
    setCheckedSteps({});
  }, [recipe]);

  const toggleIngredient = (idx) => {
    setCheckedIngredients(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleStep = (stepNumber) => {
    setCheckedSteps(prev => ({ ...prev, [stepNumber]: !prev[stepNumber] }));
  };

  const adjustServings = (amount) => {
    setServings(prev => Math.max(1, Math.min(24, prev + amount)));
  };

  // Estimate macros dynamically based on ingredients to keep Stitch bars populated
  const getMacroProfile = () => {
    const title = (recipe.title || '').toLowerCase();
    let protein = 14;
    let carbs = 22;
    let fat = 10;
    
    if (title.includes('paneer') || title.includes('egg') || title.includes('tofu') || title.includes('chicken') || title.includes('daal')) {
      protein = 24;
      fat = 14;
      carbs = 12;
    } else if (title.includes('pasta') || title.includes('rice') || title.includes('bread') || title.includes('penne')) {
      carbs = 48;
      protein = 8;
      fat = 6;
    } else if (title.includes('salad') || title.includes('bowl')) {
      carbs = 16;
      protein = 6;
      fat = 8;
    }
    
    return { protein, carbs, fat };
  };

  const macros = getMacroProfile();

  const totalSteps = recipe.steps?.length || 0;
  const completedSteps = Object.values(checkedSteps).filter(Boolean).length;
  const progressPercent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  return (
    <div className="w-full flex flex-col gap-6 animate-scale-in">
      
      {/* Recipe Hero Section */}
      <section className="relative rounded-[32px] overflow-hidden shadow-[0_30px_60px_-15px_rgba(160,65,0,0.12)] glass-card">
        <div className="relative h-[300px] md:h-[400px] w-full overflow-hidden">
          {/* Overlay gradient backdrops */}
          <div className="absolute inset-0 bg-gradient-to-t from-on-surface/90 via-on-surface/40 to-transparent z-10" />
          
          <img 
            className="w-full h-full object-cover" 
            alt={recipe.title} 
            src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1200" 
          />
          
          {/* Text and Actions overlay */}
          <div className="absolute bottom-0 left-0 p-8 md:p-12 text-white z-20 w-full flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <span className="bg-primary/95 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3 inline-block">
                {recipe.difficulty || 'Easy'}
              </span>
              <h1 className="font-display text-2xl md:text-display font-black leading-tight text-white mb-2">
                {recipe.title}
              </h1>
              <p className="text-sm text-slate-200/90 max-w-xl font-medium line-clamp-2">
                {recipe.description}
              </p>
            </div>

            {/* Servings Modifier */}
            <div className="flex flex-col gap-2 shrink-0">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-350">Adjust Servings</span>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2">
                <button
                  onClick={() => adjustServings(-1)}
                  disabled={servings <= 1}
                  className="p-1 rounded-full text-white hover:bg-white/10 disabled:opacity-30 transition-colors border-none bg-transparent cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-1.5 select-none font-bold">
                  <Users className="w-4 h-4 text-primary-container" />
                  <span className="text-sm font-black w-6 text-center">{servings}</span>
                </div>
                <button
                  onClick={() => adjustServings(1)}
                  disabled={servings >= 24}
                  className="p-1 rounded-full text-white hover:bg-white/10 disabled:opacity-30 transition-colors border-none bg-transparent cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick info row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-surface-container-low/40 border-t border-white/20 text-center">
          <div className="border-r border-outline-variant/30 last:border-r-0">
            <p className="text-[10px] text-on-surface-variant/60 uppercase tracking-widest font-bold">Prep Time</p>
            <p className="text-sm font-black text-on-surface mt-0.5">{recipe.prepTime || '10m'}</p>
          </div>
          <div className="border-r border-outline-variant/30 last:border-r-0">
            <p className="text-[10px] text-on-surface-variant/60 uppercase tracking-widest font-bold">Cook Time</p>
            <p className="text-sm font-black text-on-surface mt-0.5">{recipe.cookTime || '20m'}</p>
          </div>
          <div className="border-r border-outline-variant/30 last:border-r-0">
            <p className="text-[10px] text-on-surface-variant/60 uppercase tracking-widest font-bold">Total Time</p>
            <p className="text-sm font-black text-on-surface mt-0.5">{recipe.totalTime || '30m'}</p>
          </div>
          <div>
            <p className="text-[10px] text-on-surface-variant/60 uppercase tracking-widest font-bold">Calories</p>
            <p className="text-sm font-black text-on-surface mt-0.5">{macros.protein * 4 + macros.carbs * 4 + macros.fat * 9} kcal</p>
          </div>
        </div>
      </section>

      {/* Main details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        
        {/* Left Column: checklist & timeline instructions */}
        <div className="lg:col-span-8 space-y-section-gap">
          
          {/* Section: Ingredients checklist */}
          <section>
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="font-headline-lg text-lg md:text-headline-lg text-on-surface font-bold">Essential Ingredients</h2>
                <p className="text-on-surface-variant text-xs mt-1">Check items off as you prepare them in your kitchen.</p>
              </div>
              <button 
                onClick={onReset}
                className="text-primary font-label-md text-xs font-bold hover:underline border-none bg-transparent cursor-pointer"
              >
                Cook New Recipe
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recipe.ingredients.map((ing, idx) => {
                const isChecked = !!checkedIngredients[idx];
                const scaledQty = scaleQuantity(ing.quantity, recipe.servings, servings);
                return (
                  <div 
                    key={idx}
                    onClick={() => toggleIngredient(idx)}
                    className={`glass-card p-5 rounded-[24px] flex items-center justify-between group hover:bg-white transition-all cursor-pointer shadow-sm hover:shadow-md border border-white/30 ${
                      isChecked ? 'opacity-50 grayscale-[0.4]' : ''
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary shrink-0">
                        <span className="material-symbols-outlined text-sm">restaurant</span>
                      </div>
                      <div>
                        <h4 className={`font-label-md text-sm font-bold text-on-surface capitalize ${isChecked ? 'line-through text-on-surface-variant' : ''}`}>
                          {ing.name}
                        </h4>
                        <p className="text-on-surface-variant text-[11px] font-medium mt-0.5">
                          {scaledQty} {ing.optional && <span className="italic opacity-60 ml-1">(optional)</span>}
                        </p>
                      </div>
                    </div>
                    <input 
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="w-5 h-5 rounded-lg border-outline text-primary focus:ring-primary cursor-pointer pointer-events-none"
                    />
                  </div>
                );
              })}
            </div>
          </section>

          {/* Section: Methodology Timeline */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-headline-lg text-lg md:text-headline-lg text-on-surface font-bold">Cooking Methodology</h2>
              <span className="bg-primary/10 text-primary text-xs font-black px-3.5 py-1 rounded-full">
                {progressPercent}% completed
              </span>
            </div>
            
            <div className="relative pl-12 space-y-6">
              {/* Vertical connection track */}
              <div className="absolute left-[21px] top-4 bottom-4 w-0.5 bg-outline-variant/30" />
              
              {recipe.steps.map((stepItem, index) => {
                const isChecked = !!checkedSteps[stepItem.step];
                return (
                  <div key={stepItem.step} className="relative">
                    {/* step dot marker */}
                    <div 
                      onClick={() => toggleStep(stepItem.step)}
                      className={`absolute -left-12 w-10 h-10 rounded-full flex items-center justify-center font-black text-sm cursor-pointer z-10 transition-all select-none ${
                        isChecked 
                          ? 'bg-primary-container text-white active-dot' 
                          : 'bg-white border-2 border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
                      }`}
                    >
                      {index + 1}
                    </div>

                    {/* step box */}
                    <div 
                      onClick={() => toggleStep(stepItem.step)}
                      className={`glass-card p-6 rounded-[28px] hover:translate-x-1.5 transition-all duration-300 shadow-sm border border-white/20 cursor-pointer ${
                        isChecked ? 'bg-white/40 opacity-60' : 'hover:shadow-md'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2.5">
                        <h3 className={`font-headline-md text-sm font-black text-on-surface ${isChecked ? 'line-through text-on-surface-variant' : ''}`}>
                          Instruction Step {stepItem.step}
                        </h3>
                        {stepItem.time && (
                          <span className="bg-surface-container px-2.5 py-0.5 rounded-full text-on-surface-variant text-[10px] font-bold">
                            {stepItem.time}
                          </span>
                        )}
                      </div>
                      <p className={`text-on-surface-variant text-xs leading-relaxed ${isChecked ? 'line-through opacity-70' : ''}`}>
                        {stepItem.instruction}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Right Column: Sidebar summaries & secret tips */}
        <aside className="lg:col-span-4 space-y-gutter">
          
          {/* Card: Macros progress bars */}
          <div className="glass-card p-8 rounded-[32px] shadow-sm border border-white/30">
            <h3 className="font-headline-md text-sm font-black text-on-surface mb-6 uppercase tracking-wider">Nutrition Profile</h3>
            <div className="space-y-5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-on-surface-variant font-bold">Protein</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-500" style={{ width: `${Math.min(100, (macros.protein / 30) * 100)}%` }} />
                  </div>
                  <span className="text-on-surface font-black">{macros.protein}g</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-on-surface-variant font-bold">Carbs</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-tertiary transition-all duration-500" style={{ width: `${Math.min(100, (macros.carbs / 60) * 100)}%` }} />
                  </div>
                  <span className="text-on-surface font-black">{macros.carbs}g</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-on-surface-variant font-bold">Healthy Fats</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-primary-container transition-all duration-500" style={{ width: `${Math.min(100, (macros.fat / 25) * 100)}%` }} />
                  </div>
                  <span className="text-on-surface font-black">{macros.fat}g</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card: Substitutions Panel */}
          {recipe.substitutions && recipe.substitutions.length > 0 && (
            <div className="glass-card p-8 rounded-[32px] shadow-sm border border-white/30">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-primary">swap_horiz</span>
                <h3 className="font-headline-md text-sm font-black text-on-surface uppercase tracking-wider">Substitutions</h3>
              </div>
              <ul className="space-y-4">
                {recipe.substitutions.map((sub, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs leading-relaxed">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    <p className="text-on-surface-variant">
                      <strong className="text-on-surface capitalize">{sub.ingredient}:</strong> Swap with{' '}
                      <span className="text-primary font-bold">{sub.alternatives.join(' or ')}</span>.
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Card: Chef Vikram secret tips */}
          {recipe.tips && recipe.tips.length > 0 && (
            <div className="glass-card p-8 rounded-[32px] bg-primary/5 border border-primary/20 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary">lightbulb</span>
                <h3 className="font-headline-md text-sm font-black text-on-surface uppercase tracking-wider">Chef's Secret</h3>
              </div>
              
              <p className="text-on-surface-variant text-xs italic leading-relaxed mb-6 font-medium">
                "{recipe.tips[0]}"
              </p>

              <div className="flex items-center gap-3 border-t border-primary/10 pt-4">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-primary/20">
                  <img 
                    className="w-full h-full object-cover" 
                    alt="Vikram resident chef"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA526ciu0XfmaJk7IDRgmXr0Mj6a0LleRpZN6w6YedPpBxYGIVfkT8DWU2UNcLMFVRoEItUreEY2a2CMBdJR6x8LHqLwqqTdEGKEb1HKTW5W0NRewzkuFQk_w7TKjB7EBKOIlz9NjEG6WnfVuO2EOy4lnNz_NOJAyoCf8v5MFvy8avpiPfbE6AqPOZpNQ4mr1w7_EJ7-PJbY7aTsRhNNgZNes5FRk2q5gakaSpC1cc2eF-D4ZFSLtuiDQ" 
                  />
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface">Chef Vikram</p>
                  <p className="text-[10px] text-on-surface-variant font-medium">TadkaMode Resident Chef</p>
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default RecipeView;
