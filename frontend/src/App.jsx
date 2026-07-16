import React, { useState } from 'react';
import { useRecipeGenerator } from './hooks/useRecipeGenerator';
import { RecipeSkeleton } from './components/RecipeSkeleton';
import { RecipeView } from './components/RecipeView';
import { HistoryDrawer } from './components/HistoryDrawer';
import { ShaderBackground } from './components/ShaderBackground';
import { X, AlertTriangle, Plus } from 'lucide-react';

function App() {
  const [inputText, setInputText] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'kitchen'
  const [customInputOpen, setCustomInputOpen] = useState(false);
  const [newCustomTag, setNewCustomTag] = useState('');
  const { recipe, status, error, generate, loadRecipeFromHistory, retry, clear, isLoading } = useRecipeGenerator();

  // Preset categorized ingredients matching Stitch mockup
  const presetIngredients = {
    vegetables: ['Tomatoes', 'Spinach', 'Bell Peppers', 'Red Onions', 'Garlic'],
    dairy: ['Greek Yogurt', 'Paneer', 'Cream', 'Butter', 'Cheese'],
    spices: ['Cumin Seeds', 'Turmeric', 'Cardamom', 'Chili Flakes', 'Ginger', 'Garam Masala'],
    grains: ['Basmati Rice', 'Quinoa', 'Penne Pasta', 'Flour']
  };

  const handleGenerate = (e, useMock = false) => {
    e?.preventDefault();
    const parsed = inputText
      .split(',')
      .map(i => i.trim())
      .filter(i => i.length > 0);

    if (parsed.length === 0 && ingredients.length === 0) return;
    const combined = [...new Set([...ingredients, ...parsed])];
    
    // Switch to active cooking detail state
    generate(combined, useMock);
  };

  const handlePresetToggle = (presetName) => {
    const normalized = presetName.toLowerCase();
    setIngredients(prev => {
      if (prev.includes(normalized)) {
        return prev.filter(i => i !== normalized);
      } else {
        return [...prev, normalized];
      }
    });
  };

  const addCustomTag = (e) => {
    e?.preventDefault();
    if (!newCustomTag.trim()) return;
    const normalized = newCustomTag.trim().toLowerCase();
    if (!ingredients.includes(normalized)) {
      setIngredients(prev => [...prev, normalized]);
    }
    setNewCustomTag('');
    setCustomInputOpen(false);
  };

  const handleShowcaseClick = (showcaseIngredients) => {
    setIngredients(showcaseIngredients.map(i => i.toLowerCase()));
    setCurrentView('kitchen');
  };

  const handleReset = () => {
    clear();
    setIngredients([]);
    setInputText('');
    setCurrentView('landing');
  };

  const removeTag = (indexToRemove) => {
    setIngredients(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Check if we render the side-nav layout or full-screen landing layout
  const isDashboardLayout = currentView !== 'landing';

  return (
    <div className="bg-background text-on-background min-h-screen relative flex flex-col font-sans selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Shader Background Canvas */}
      <ShaderBackground />

      {/* Main Layout Grid */}
      <div className={`flex flex-1 ${isDashboardLayout ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
        
        {/* Sticky Sidebar Navigation (Anchor) */}
        {isDashboardLayout && (
          <aside className="fixed left-0 top-0 h-screen w-64 glass-panel border-r border-white/20 shadow-xl z-40 hidden md:flex flex-col p-4 gap-4 animate-slide-in-right">
            <div className="mb-8 px-2 flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-container rounded-xl flex items-center justify-center text-white">
                <span className="material-symbols-outlined font-bold">restaurant</span>
              </div>
              <div>
                <h1 className="font-headline-md text-primary leading-tight text-sm font-black">Tadka Kitchen</h1>
                <p className="text-[11px] text-on-surface-variant/70 font-bold uppercase tracking-wider">AI Chef Active</p>
              </div>
            </div>
            
            <nav className="flex-grow flex flex-col gap-2">
              <button 
                onClick={() => setCurrentView('landing')}
                className="flex items-center gap-4 p-3 text-on-surface-variant hover:bg-surface-container-high rounded-xl hover:translate-x-1 transition-all duration-300 border-none bg-transparent cursor-pointer text-left w-full"
              >
                <span className="material-symbols-outlined">home</span>
                <span className="font-label-md">Home</span>
              </button>
              <button 
                onClick={() => { clear(); setCurrentView('kitchen'); }}
                className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-300 border-none cursor-pointer text-left w-full ${
                  currentView === 'kitchen' 
                    ? 'bg-primary-container text-white shadow-inner font-bold' 
                    : 'text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                <span className="material-symbols-outlined">restaurant</span>
                <span className="font-label-md">Ingredients</span>
              </button>
              <button 
                onClick={() => setIsDrawerOpen(true)}
                className="flex items-center gap-4 p-3 text-on-surface-variant hover:bg-surface-container-high rounded-xl hover:translate-x-1 transition-all duration-300 border-none bg-transparent cursor-pointer text-left w-full"
              >
                <span className="material-symbols-outlined">history</span>
                <span className="font-label-md">History Archive</span>
              </button>
            </nav>
            
            <div className="mt-auto border-t border-outline-variant/30 pt-4 flex flex-col gap-2">
              <button 
                onClick={handleReset}
                className="flex items-center gap-4 p-3 text-on-surface-variant hover:bg-surface-container-high rounded-xl transition-all border-none bg-transparent cursor-pointer text-left w-full"
              >
                <span className="material-symbols-outlined text-error">logout</span>
                <span className="font-label-md">Reset Kitchen</span>
              </button>
            </div>
          </aside>
        )}

        {/* Main Content Area */}
        <main className={`flex-1 flex flex-col h-full relative ${isDashboardLayout ? 'ml-0 md:ml-64 overflow-hidden' : ''}`}>
          
          {/* Top navigation Header Bar */}
          <header className="sticky top-0 z-30 glass-panel shadow-sm px-container-padding py-4 flex justify-between items-center w-full">
            <div className="flex items-center gap-8">
              <span 
                onClick={handleReset}
                className="text-headline-md font-headline-md font-black text-primary cursor-pointer select-none"
              >
                TadkaMode AI
              </span>
              <nav className="hidden md:flex gap-8">
                <button 
                  onClick={() => setCurrentView('landing')}
                  className={`font-body-md text-body-md transition-colors border-none bg-transparent cursor-pointer ${
                    currentView === 'landing' 
                      ? 'text-primary font-bold border-b-2 border-primary pb-1' 
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  Discover
                </button>
                <button 
                  onClick={() => { clear(); setCurrentView('kitchen'); }}
                  className={`font-body-md text-body-md transition-colors border-none bg-transparent cursor-pointer ${
                    currentView === 'kitchen' 
                      ? 'text-primary font-bold border-b-2 border-primary pb-1' 
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  Kitchen Workspace
                </button>
                <button 
                  onClick={() => setIsDrawerOpen(true)}
                  className="text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md border-none bg-transparent cursor-pointer"
                >
                  History
                </button>
              </nav>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => { clear(); setCurrentView('kitchen'); }}
                className="bg-primary text-on-primary font-label-md text-label-md px-6 py-2.5 rounded-full hover:scale-105 transition-transform active:scale-95 premium-shadow cursor-pointer border-none"
              >
                Create Recipe
              </button>
              <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center cursor-pointer overflow-hidden border-2 border-white">
                <img 
                  className="w-full h-full object-cover" 
                  alt="chef-profile"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuByIXi95glGh2AEndY1L05OpPwfJkiJvF4h3_1J-8vWfbYcinXwtzhJFr8kuP4m8AIxdOytd60FV26_2ydnspbJlXAqeBOagNAASi5iDtSvcDOkspDXcU3qpA0G3baoB878tvJeM7-irrPumcrAMMQ4hoEGobTRNEtrEPwJqmGZUkGbTp2V7eaMLgF8PqAgbsN641nLj5bpfVaGoaGX-FcTI77W_YTeTuWniSb5CQSsU0qACoEeb1F4nQ"
                />
              </div>
            </div>
          </header>

          {/* Dynamic Content Views */}
          {currentView === 'landing' ? (
            /* PAGE 1: SPLASH LANDING VIEW */
            <div className="flex-1 overflow-y-auto pt-16 pb-12">
              <section className="max-w-4xl mx-auto text-center px-margin-mobile mb-24 animate-scale-in">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-fixed text-on-primary-fixed-variant rounded-full text-label-md font-label-md mb-8 shadow-sm">
                  <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                  <span>Powered by Culinary Intelligence 2.0</span>
                </div>
                <h1 className="font-display text-display hero-gradient-text mb-6">
                  Turn ingredients into delicious possibilities.
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-12">
                  Paste whatever ingredients you have. TadkaMode transforms them into interactive AI-powered recipes.
                </p>

                <form 
                  onSubmit={(e) => { handleGenerate(e, false); setCurrentView('kitchen'); }}
                  className="glass-panel p-2 rounded-3xl flex items-center gap-2 max-w-2xl mx-auto premium-shadow border-white/50 group focus-within:ring-2 focus-within:ring-primary/20 transition-all"
                >
                  <div className="flex-1 px-6 flex items-center gap-3">
                    <span className="material-symbols-outlined text-outline-variant">restaurant_menu</span>
                    <input 
                      id="search-input"
                      className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-body-lg font-body-lg text-on-surface placeholder:text-outline-variant py-4 font-sans" 
                      placeholder="tomatoes, cheese, onion, mushrooms..." 
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={isLoading || !inputText.trim()}
                    className="bg-primary text-on-primary font-headline-md text-headline-md px-8 py-4 rounded-2xl flex items-center gap-2 hover:bg-primary/90 transition-all active:scale-95 cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed animate-pulse-slow"
                  >
                    Generate
                    <span className="material-symbols-outlined">bolt</span>
                  </button>
                </form>

                <div className="mt-3 text-center">
                  <button
                    type="button"
                    onClick={(e) => { handleGenerate(e, true); setCurrentView('kitchen'); }}
                    disabled={isLoading || !inputText.trim()}
                    className="text-xs text-on-surface-variant hover:text-primary transition-colors cursor-pointer border-none bg-transparent underline font-medium"
                  >
                    Or Generate Mock Recipe (Demo Mode)
                  </button>
                </div>
              </section>

              {/* Showcase trending cards */}
              <section className="px-container-padding max-w-[1440px] mx-auto animate-fade-in-up">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                  
                  {/* Penne */}
                  <div className="glass-panel p-6 rounded-[28px] premium-shadow group hover:-translate-y-2 transition-all duration-500">
                    <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden mb-6">
                      <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Pasta" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNHw1uaq98dAINS0AA5hu5hsPHSZ_c3iktzhEMpZm-nMg0Z0ShuOxXegtPinQlTz21pLYY_tBjAeTs_ZgVQwJa-8suI7N0AWb9ETBcGkV-z015QiW9rYgPVKvRkP0OMtvD9ejeVwebPIsU8VC8GFNfrAilf09OJLeId33ybqZQRhh84VBvEhQzVC6zT38CEv_0SiZ7DhSzKPPoiy_2YXiRpzPkJlSYxNE52zKbpzDuZJ-s8rszRmWLyA"/>
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-label-md font-label-md text-primary">Pasta</span>
                        <span className="bg-black/20 backdrop-blur-md px-3 py-1 rounded-full text-label-md font-label-md text-white">15 min</span>
                      </div>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Sun-Dried Tomato Penne</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-6">A velvet-smooth cream sauce infused with roasted garlic and Mediterranean herbs.</p>
                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-surface-container overflow-hidden">
                          <img className="w-full h-full object-cover" alt="chef" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCfNfh0QW-1tdCyxzfHVhX3Be8MBdIWT2pBeOulO7QrT6OenDLTwLOSI6pLey7ki-BHsse8ZeIvMupIC_4mPY-6g59Qk3VaXU-wYoq37GOfzjvxM--_UeYOrQgNec7v9ClZMwOjUFxHopol26jeGdVUgV_3vKljh8dUlbYHXbKBWq0BK0crMDVlk6Z36ICqUnaIgE_2Ptu6YzCc1eAXcyJGoqu3rg7Ny41TDrMbohn29Fx5dHvWGeOxQ"/>
                        </div>
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-surface-container-high flex items-center justify-center text-[10px] font-bold text-on-surface-variant">+12</div>
                      </div>
                      <button 
                        onClick={() => handleShowcaseClick(['penne', 'tomatoes', 'garlic', 'cream', 'basil', 'cheese'])}
                        className="text-primary font-label-md text-label-md flex items-center gap-1 hover:underline cursor-pointer border-none bg-transparent"
                      >
                        View Recipe <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                      </button>
                    </div>
                  </div>

                  {/* Harvest Bowl */}
                  <div className="glass-panel p-6 rounded-[28px] premium-shadow group hover:-translate-y-2 transition-all duration-500">
                    <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden mb-6">
                      <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Salad" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDo-JXf9_pv8UxPpxhoAcQ1nDbCxNXThH3zQ83DjDqTPbnvSZAGan5NOASJY8FdAklGfet_X5dcbYcH5gpWzNMF8HK_EgwEuBF5D3NUHRGuZbzLBmiekEpQxTHgIYgdQkz85TFaj2Q8nBiqLGZ6B6Az88KVfdAJ1uiqykw0Nt0fijYjV8gLROMh4_Jgbo12wrXm8njt6nhVISgvwVlZ5eYLhGvToP7d5F1GfMaxPXAnVoCSHL_J-t0FFA"/>
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-label-md font-label-md text-primary">Salad</span>
                        <span className="bg-black/20 backdrop-blur-md px-3 py-1 rounded-full text-label-md font-label-md text-white">10 min</span>
                      </div>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Harvest Green Bowl</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-6">Light and refreshing with a zesty lemon-tahini dressing and crunchy seeds.</p>
                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-surface-container overflow-hidden">
                          <img className="w-full h-full object-cover" alt="chef" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsvhJ7EQl1o7r1Cn7PkXHjKMnG2iIzNVfBa74C8WHRVD9fdea-KhzU715GJw-h9G2ZHSTK8OjIPId2-KiAHA6-mOJ_qVyk5YqOwqQDehzhCwY88FSkfv-pQQklXyLkF17eqSjWpM9-z8Jn0T6yYrl9YQq4eOdxxnUnBkUyp4pN_p6welOd9cU_nFGmYoZLbTrx-WxgrIW7VtUzl1HtCW7F6lNKnd-F1vv0SJJ_SbdjW8PTmF7owODXHQ"/>
                        </div>
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-surface-container-high flex items-center justify-center text-[10px] font-bold text-on-surface-variant">+45</div>
                      </div>
                      <button 
                        onClick={() => handleShowcaseClick(['avocado', 'roasted chickpeas', 'greens', 'pomegranate seeds', 'lemon', 'tahini'])}
                        className="text-primary font-label-md text-label-md flex items-center gap-1 hover:underline cursor-pointer border-none bg-transparent"
                      >
                        View Recipe <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                      </button>
                    </div>
                  </div>

                  {/* Slow Cooked Daal */}
                  <div className="glass-panel p-6 rounded-[28px] premium-shadow group hover:-translate-y-2 transition-all duration-500">
                    <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden mb-6">
                      <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Curry" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCexxQErbW0lJhA5nvQPrgmgN4Osn6I_2RJ0Al4Ow6n7yLbymSXeKRbg4G5uJ9rpTR15IhBtysQRITG4vHPBfJJJgEDTddoFfUxvP3YJTYKzyKb7seHf-IojcpAQLKVjxENERPhXdDs-1yY_HF9nIsQP6QpppMSUVwV8eTdsiBNtt8x7O87oEd90iaiaglEVbnjUf3Cb92F7U534-Xh6kKUA3TktQfmRtRN5b8paPL7qLGehIRWZg4RdA"/>
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-label-md font-label-md text-primary">Curry</span>
                        <span className="bg-black/20 backdrop-blur-md px-3 py-1 rounded-full text-label-md font-label-md text-white">25 min</span>
                      </div>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Slow-Cooked Tadka Daal</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-6">Infused with smoky spices and tempered with burnt garlic and ghee.</p>
                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-surface-container overflow-hidden">
                          <img className="w-full h-full object-cover" alt="chef" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkiKQOVFysVGDqdL9MbSB2nAXqFgg-ngDQUFIaVXYcfWTblfrzaDJz5HRDkd_k47uDgK6sy0qLzvKO85dlVDih-6dVd5zhnvqFXHvndLftKSMVBs3nNmJjxBFyFt1VLy1endU0jAWNT4-EKr6ae9DDOlPWAwvLPeySSvKB9tkIcLmdeqOR1x-O2fhKPJHRWexXKo5PFfSUOvvnx_08kqmVNiij5fu3-jDRn24MCT_H1C4gvIb9C3n6Cw"/>
                        </div>
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-surface-container-high flex items-center justify-center text-[10px] font-bold text-on-surface-variant">+82</div>
                      </div>
                      <button 
                        onClick={() => handleShowcaseClick(['lentils', 'ghee', 'garlic', 'cumin', 'turmeric', 'chili'])}
                        className="text-primary font-label-md text-label-md flex items-center gap-1 hover:underline cursor-pointer border-none bg-transparent"
                      >
                        View Recipe <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                      </button>
                    </div>
                  </div>

                </div>
              </section>

              {/* Landing Page Footer */}
              <footer className="w-full py-12 px-container-padding bg-surface-container-lowest border-t border-outline-variant/30 mt-20">
                <div className="flex flex-col md:flex-row justify-between items-center gap-gutter max-w-[1440px] mx-auto">
                  <div className="flex flex-col gap-2 text-center md:text-left">
                    <span className="font-headline-md text-primary font-bold">TadkaMode AI</span>
                    <p className="font-body-md text-body-md text-on-surface-variant">© 2024 TadkaMode AI. Premium Culinary Precision.</p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-8">
                    <a className="text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md hover:underline" href="#">Privacy Policy</a>
                    <a className="text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md hover:underline" href="#">Terms of Service</a>
                    <a className="text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md hover:underline" href="#">Contact Support</a>
                  </div>
                </div>
              </footer>
            </div>
          ) : (
            /* PAGE 2: INTERACTIVE KITCHEN WORKSPACE & BENTO GRID */
            <div className="flex-grow overflow-y-auto p-8 lg:p-12">
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 h-full items-start">
                
                {/* Left Panel: Ingredient Categorized Selectors */}
                <section className="lg:col-span-5 flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <h2 className="font-headline-lg text-on-surface">Kitchen Inventory</h2>
                    <p className="text-body-md text-on-surface-variant">Select ingredients available in your pantry. AI Chef will generate matches.</p>
                  </div>

                  <div className="glass-panel p-8 rounded-[32px] flex flex-col gap-8 shadow-[0_20px_40px_rgba(0,0,0,0.03)] border-white/40">
                    
                    {/* Category: Vegetables */}
                    <div className="space-y-4">
                      <h3 className="font-label-md font-bold text-on-surface uppercase tracking-wider text-xs">Vegetables</h3>
                      <div className="flex flex-wrap gap-2">
                        {presetIngredients.vegetables.map(v => {
                          const normalized = v.toLowerCase();
                          const isActive = ingredients.includes(normalized);
                          return (
                            <button
                              key={v}
                              type="button"
                              onClick={() => handlePresetToggle(v)}
                              className={`ingredient-chip px-5 py-2.5 rounded-full font-label-md border active:scale-95 transition-all text-xs cursor-pointer ${
                                isActive 
                                  ? 'bg-primary-container text-white border-primary shadow-sm' 
                                  : 'bg-surface-container-high text-on-surface-variant border-white/50 hover:bg-white'
                              }`}
                            >
                              {v}
                            </button>
                          );
                        })}
                        {/* Inline custom addition tag triggers */}
                        {customInputOpen ? (
                          <form onSubmit={addCustomTag} className="inline-flex items-center gap-1.5">
                            <input
                              className="px-3 py-1 bg-white border border-outline rounded-full text-xs text-on-surface max-w-[120px] focus:outline-none focus:ring-1 focus:ring-primary"
                              value={newCustomTag}
                              onChange={(e) => setNewCustomTag(e.target.value)}
                              placeholder="Add tag..."
                              autoFocus
                              onBlur={addCustomTag}
                            />
                          </form>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setCustomInputOpen(true)}
                            className="ingredient-chip px-4 py-2 rounded-full border-2 border-dashed border-outline-variant text-on-surface-variant font-label-md hover:bg-white transition-colors cursor-pointer flex items-center justify-center"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Category: Dairy */}
                    <div className="space-y-4">
                      <h3 className="font-label-md font-bold text-on-surface uppercase tracking-wider text-xs">Dairy & Alternatives</h3>
                      <div className="flex flex-wrap gap-2">
                        {presetIngredients.dairy.map(d => {
                          const normalized = d.toLowerCase();
                          const isActive = ingredients.includes(normalized);
                          return (
                            <button
                              key={d}
                              type="button"
                              onClick={() => handlePresetToggle(d)}
                              className={`ingredient-chip px-5 py-2.5 rounded-full font-label-md border active:scale-95 transition-all text-xs cursor-pointer ${
                                isActive 
                                  ? 'bg-primary-container text-white border-primary shadow-sm' 
                                  : 'bg-surface-container-high text-on-surface-variant border-white/50 hover:bg-white'
                              }`}
                            >
                              {d}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Category: Spices */}
                    <div className="space-y-4">
                      <h3 className="font-label-md font-bold text-on-surface uppercase tracking-wider text-xs">Spices</h3>
                      <div className="flex flex-wrap gap-2">
                        {presetIngredients.spices.map(s => {
                          const normalized = s.toLowerCase();
                          const isActive = ingredients.includes(normalized);
                          return (
                            <button
                              key={s}
                              type="button"
                              onClick={() => handlePresetToggle(s)}
                              className={`ingredient-chip px-5 py-2.5 rounded-full font-label-md border active:scale-95 transition-all text-xs cursor-pointer ${
                                isActive 
                                  ? 'bg-primary-container text-white border-primary shadow-sm' 
                                  : 'bg-surface-container-high text-on-surface-variant border-white/50 hover:bg-white'
                              }`}
                            >
                              {s}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Category: Grains */}
                    <div className="space-y-4 mb-4">
                      <h3 className="font-label-md font-bold text-on-surface uppercase tracking-wider text-xs">Grains</h3>
                      <div className="flex flex-wrap gap-2">
                        {presetIngredients.grains.map(g => {
                          const normalized = g.toLowerCase();
                          const isActive = ingredients.includes(normalized);
                          return (
                            <button
                              key={g}
                              type="button"
                              onClick={() => handlePresetToggle(g)}
                              className={`ingredient-chip px-5 py-2.5 rounded-full font-label-md border active:scale-95 transition-all text-xs cursor-pointer ${
                                isActive 
                                  ? 'bg-primary-container text-white border-primary shadow-sm' 
                                  : 'bg-surface-container-high text-on-surface-variant border-white/50 hover:bg-white'
                              }`}
                            >
                              {g}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Custom Tag Strip showing selected custom items */}
                    {ingredients.length > 0 && (
                      <div className="border-t border-outline-variant/20 pt-4 animate-scale-in">
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-2">Active Ingredients List</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {ingredients.map((tag, idx) => (
                            <span 
                              key={idx}
                              className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container border border-outline-variant/30 rounded-full text-xs font-bold text-on-surface-variant capitalize"
                            >
                              {tag}
                              <button 
                                type="button" 
                                onClick={() => removeTag(idx)}
                                className="hover:bg-primary/10 rounded-full p-0.5 text-on-surface-variant border-none bg-transparent cursor-pointer"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex flex-col gap-2 mt-auto">
                      <button 
                        onClick={(e) => handleGenerate(e, true)}
                        disabled={isLoading || ingredients.length === 0}
                        className="w-full py-3.5 bg-surface-container hover:bg-surface-container-high text-on-surface-variant rounded-2xl font-bold transition-all active:scale-95 cursor-pointer border-none text-xs disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Generate Mock Recipe (Demo Mode)
                      </button>
                      <button 
                        onClick={(e) => handleGenerate(e, false)}
                        disabled={isLoading || ingredients.length === 0}
                        className="primary-gradient-btn w-full py-4.5 rounded-2xl text-white font-headline-md flex items-center justify-center gap-2 group border-none cursor-pointer text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <span className="material-symbols-outlined group-hover:rotate-180 transition-transform duration-500">auto_awesome</span>
                        <span>Generate Recipe</span>
                      </button>
                    </div>

                  </div>
                </section>

                {/* Right Panel: Output Canvas */}
                <section className="lg:col-span-7 h-full min-h-[500px] flex flex-col justify-center">
                  {status === 'idle' && (
                    <div className="h-full flex flex-col items-center justify-center text-center px-12 py-16 glass-panel rounded-[32px] border-white/30 shadow-inner animate-scale-in">
                      <div className="relative w-full max-w-sm mb-8">
                        <div className="absolute inset-0 bg-primary/5 blur-[80px] rounded-full scale-125"></div>
                        <img 
                          className="w-full max-w-xs mx-auto drop-shadow-xl relative z-10" 
                          alt="chef mixing bowl illustration" 
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQv9xVR5Uq7b6V467p4V2nrAjSV6rspYjWlnIsiWgIV3fzgdVGjAi-QgXU7E2vmjU3oS5dwCnkV0_LrEzFYISoP9UL469XDaO5TgWd-FpxLP7PrAi8F8WyzgPe1xkKAwo0tqclHBWWIhEXJ89Bh0IQGRUgMjc0TKJfXhA2-HXAQzCx6A_1gZlSru2G7tgkq0VqZs1Uvsw1SSB9-1U5xf2cUY7e7aSCRE4LPkOLI_FzK6LvjoJZQQVY0g"
                        />
                      </div>
                      <h2 className="font-display text-on-surface mb-2 text-2xl font-bold">Let's cook something amazing</h2>
                      <p className="text-body-md text-on-surface-variant max-w-md mx-auto mb-8">Select your available ingredients on the left and our AI Chef will craft a personalized premium recipe just for you.</p>
                      
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center gap-1.5 p-4 rounded-2xl bg-surface-container-lowest/50 border border-white/40 w-24">
                          <span className="material-symbols-outlined text-primary text-xl">timer</span>
                          <span className="text-[10px] font-bold text-on-surface-variant">Under 30m</span>
                        </div>
                        <div className="flex flex-col items-center gap-1.5 p-4 rounded-2xl bg-surface-container-lowest/50 border border-white/40 w-24">
                          <span className="material-symbols-outlined text-tertiary text-xl">restaurant_menu</span>
                          <span className="text-[10px] font-bold text-on-surface-variant">Healthy</span>
                        </div>
                        <div className="flex flex-col items-center gap-1.5 p-4 rounded-2xl bg-surface-container-lowest/50 border border-white/40 w-24">
                          <span className="material-symbols-outlined text-secondary text-xl">eco</span>
                          <span className="text-[10px] font-bold text-on-surface-variant">Vegan Opt</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {status === 'loading' && <RecipeSkeleton />}

                  {status === 'error' && (
                    <div className="bg-error-container border border-error/20 rounded-[32px] p-8 flex flex-col gap-4 shadow-xl animate-scale-in">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-error/15 rounded-2xl text-error border border-error/20 flex items-center justify-center">
                          <AlertTriangle className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-headline-md text-headline-md text-on-error-container">Generation Failed</h3>
                          <p className="text-body-md text-on-error-container mt-2 leading-relaxed">{error}</p>
                        </div>
                      </div>
                      <div className="flex gap-3 self-end">
                        <button
                          onClick={clear}
                          className="bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-bold py-2.5 px-6 rounded-2xl text-xs transition-all cursor-pointer border-none"
                        >
                          Go Back
                        </button>
                        <button
                          onClick={retry}
                          className="bg-primary hover:bg-primary/90 text-on-primary font-bold py-2.5 px-6 rounded-2xl text-xs transition-all cursor-pointer shadow-md shadow-primary/20 border-none"
                        >
                          Retry Generation
                        </button>
                      </div>
                    </div>
                  )}

                  {status === 'success' && recipe && (
                    <RecipeView recipe={recipe} onReset={clear} />
                  )}
                </section>

              </div>
            </div>
          )}

        </main>
      </div>

      {/* Global Slide-out Drawer Panel */}
      <HistoryDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSelectRecipe={loadRecipeFromHistory}
      />
    </div>
  );
}

export default App;
