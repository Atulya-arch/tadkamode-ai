import React, { useState } from 'react';
import { useRecipeGenerator } from './hooks/useRecipeGenerator';
import { RecipeSkeleton } from './components/RecipeSkeleton';
import { RecipeView } from './components/RecipeView';
import { HistoryDrawer } from './components/HistoryDrawer';
import { ShaderBackground } from './components/ShaderBackground';
import { X, AlertTriangle } from 'lucide-react';

function App() {
  const [inputText, setInputText] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { recipe, status, error, generate, loadRecipeFromHistory, retry, clear, isLoading } = useRecipeGenerator();

  const handleGenerate = (e, useMock = false) => {
    e?.preventDefault();
    
    // Split input text by comma to parse bulk items
    const parsed = inputText
      .split(',')
      .map(i => i.trim())
      .filter(i => i.length > 0);

    if (parsed.length === 0 && ingredients.length === 0) return;

    // Merge manual text and existing inventory arrays
    const combined = [...new Set([...ingredients, ...parsed])];
    
    generate(combined, useMock);
  };

  const handleShowcaseClick = (showcaseIngredients) => {
    setInputText(showcaseIngredients.join(', '));
    // Focus search bar
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.focus();
  };

  const removeTag = (indexToRemove) => {
    setIngredients(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="bg-background text-on-background min-h-screen relative flex flex-col justify-between selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Shader Background Canvas */}
      <ShaderBackground />

      {/* Sticky Global Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(160,65,0,0.08)]">
        <div className="flex justify-between items-center px-container-padding py-4 w-full max-w-[1440px] mx-auto">
          <div className="flex items-center gap-8">
            <span 
              onClick={clear}
              className="text-headline-md font-headline-md font-black text-primary cursor-pointer select-none"
            >
              TadkaMode AI
            </span>
            <nav className="hidden md:flex gap-8">
              <button 
                onClick={clear}
                className={`font-body-md text-body-md transition-colors cursor-pointer border-none bg-transparent ${
                  status === 'idle' 
                    ? 'text-primary font-bold border-b-2 border-primary pb-1' 
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                Discover
              </button>
              <button 
                onClick={() => setIsDrawerOpen(true)}
                className="text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md cursor-pointer border-none bg-transparent"
              >
                History
              </button>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={clear}
              className="bg-primary text-on-primary font-label-md text-label-md px-6 py-2.5 rounded-full hover:scale-105 transition-transform active:scale-95 premium-shadow cursor-pointer border-none"
            >
              Create Recipe
            </button>
            <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center cursor-pointer overflow-hidden border-2 border-white">
              <img 
                className="w-full h-full object-cover" 
                alt="culinary artist"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuByIXi95glGh2AEndY1L05OpPwfJkiJvF4h3_1J-8vWfbYcinXwtzhJFr8kuP4m8AIxdOytd60FV26_2ydnspbJlXAqeBOagNAASi5iDtSvcDOkspDXcU3qpA0G3baoB878tvJeM7-irrPumcrAMMQ4hoEGobTRNEtrEPwJqmGZUkGbTp2V7eaMLgF8PqAgbsN641nLj5bpfVaGoaGX-FcTI77W_YTeTuWniSb5CQSsU0qACoEeb1F4nQ"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative pt-32 pb-section-gap flex-grow flex flex-col justify-center">
        {status === 'idle' && (
          <div className="w-full">
            {/* Hero Entry Panel */}
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

              {/* Controlled Glass-panel Search Bar */}
              <form 
                onSubmit={(e) => handleGenerate(e, false)}
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
                  className="bg-primary text-on-primary font-headline-md text-headline-md px-8 py-4 rounded-2xl flex items-center gap-2 hover:bg-primary/90 transition-all active:scale-95 cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Generate
                  <span className="material-symbols-outlined">bolt</span>
                </button>
              </form>

              {/* Demo Recipe Secondary Link */}
              <div className="mt-3 text-center">
                <button
                  type="button"
                  onClick={(e) => handleGenerate(e, true)}
                  disabled={isLoading || !inputText.trim()}
                  className="text-xs text-on-surface-variant hover:text-primary transition-colors cursor-pointer border-none bg-transparent underline font-medium disabled:opacity-40 disabled:no-underline"
                >
                  Or Generate Mock Recipe (Demo Mode)
                </button>
              </div>

              {/* Controlled Inventory tag strip if tags are active */}
              {ingredients.length > 0 && (
                <div className="max-w-2xl mx-auto mt-4 flex flex-wrap gap-2 justify-center">
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
              )}
            </section>

            {/* Showcase trending recipe cards grid */}
            <section className="px-container-padding max-w-[1440px] mx-auto animate-fade-in-up">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                
                {/* Showcase 1 */}
                <div className="glass-panel p-6 rounded-[28px] premium-shadow group hover:-translate-y-2 transition-all duration-500">
                  <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden mb-6">
                    <img 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      alt="Pasta" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNHw1uaq98dAINS0AA5hu5hsPHSZ_c3iktzhEMpZm-nMg0Z0ShuOxXegtPinQlTz21pLYY_tBjAeTs_ZgVQwJa-8suI7N0AWb9ETBcGkV-z015QiW9rYgPVKvRkP0OMtvD9ejeVwebPIsU8VC8GFNfrAilf09OJLeId33ybqZQRhh84VBvEhQzVC6zT38CEv_0SiZ7DhSzKPPoiy_2YXiRpzPkJlSYxNE52zKbpzDuZJ-s8rszRmWLyA"
                    />
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

                {/* Showcase 2 */}
                <div className="glass-panel p-6 rounded-[28px] premium-shadow group hover:-translate-y-2 transition-all duration-500">
                  <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden mb-6">
                    <img 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      alt="Salad" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDo-JXf9_pv8UxPpxhoAcQ1nDbCxNXThH3zQ83DjDqTPbnvSZAGan5NOASJY8FdAklGfet_X5dcbYcH5gpWzNMF8HK_EgwEuBF5D3NUHRGuZbzLBmiekEpQxTHgIYgdQkz85TFaj2Q8nBiqLGZ6B6Az88KVfdAJ1uiqykw0Nt0fijYjV8gLROMh4_Jgbo12wrXm8njt6nhVISgvwVlZ5eYLhGvToP7d5F1GfMaxPXAnVoCSHL_J-t0FFA"
                    />
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

                {/* Showcase 3 */}
                <div className="glass-panel p-6 rounded-[28px] premium-shadow group hover:-translate-y-2 transition-all duration-500">
                  <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden mb-6">
                    <img 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      alt="Curry" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCexxQErbW0lJhA5nvQPrgmgN4Osn6I_2RJ0Al4Ow6n7yLbymSXeKRbg4G5uJ9rpTR15IhBtysQRITG4vHPBfJJJgEDTddoFfUxvP3YJTYKzyKb7seHf-IojcpAQLKVjxENERPhXdDs-1yY_HF9nIsQP6QpppMSUVwV8eTdsiBNtt8x7O87oEd90iaiaglEVbnjUf3Cb92F7U534-Xh6kKUA3TktQfmRtRN5b8paPL7qLGehIRWZg4RdA"
                    />
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
          </div>
        )}

        {/* Dynamic Display Area (Skeleton Loader, Recipe Details, Errors) */}
        {status !== 'idle' && (
          <section className="max-w-6xl mx-auto w-full px-container-padding animate-scale-in">
            {status === 'loading' && <RecipeSkeleton />}

            {status === 'error' && (
              <div className="bg-error-container border border-error/20 rounded-[32px] p-8 flex flex-col gap-4 shadow-xl">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-error/15 rounded-2xl text-error border border-error/20 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-headline-md text-headline-md text-on-error-container">Generation Failed</h3>
                    <p className="text-body-md text-body-md text-on-error-container mt-2 leading-relaxed">{error}</p>
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
        )}
      </main>

      {/* Global Slide-out Drawer Panel */}
      <HistoryDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSelectRecipe={loadRecipeFromHistory}
      />

      {/* Footer */}
      <footer className="w-full py-12 px-container-padding bg-surface-container-lowest border-t border-outline-variant/30">
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
  );
}

export default App;
