import React, { useState, useEffect } from 'react';
import { loadRecipes, deleteRecipe } from '../utils/recipeHistory';
import { RotateCw, AlertTriangle, Clock } from 'lucide-react';

export const HistoryView = ({ onSelectRecipe, showOnlyFavorites, onToggleFavoritesView }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Note: loading and error kept for UI compatibility but localStorage reads are synchronous
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'yesterday' | 'breakfast' | 'indian' | 'quick' | 'desserts'
  
  // Local storage favorites state
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('tadka_favorites') || '[]');
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = () => {
    setLoading(true);
    setError(null);
    try {
      const items = loadRecipes();
      setHistory(items);
    } catch (err) {
      setError('Failed to load recipe history.');
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (e, recipeId) => {
    e.stopPropagation();
    setFavorites(prev => {
      const next = prev.includes(recipeId) ? prev.filter(id => id !== recipeId) : [...prev, recipeId];
      localStorage.setItem('tadka_favorites', JSON.stringify(next));
      return next;
    });
  };

  const handleDeleteClick = (e, recipeId) => {
    e.stopPropagation();
    const confirmDelete = window.confirm("Are you sure you want to delete this recipe from your history?");
    if (!confirmDelete) return;

    const success = deleteRecipe(recipeId);
    if (success) {
      setHistory(prev => prev.filter(item => item.id !== recipeId));
    } else {
      alert("Failed to delete recipe. Please try again.");
    }
  };

  // Stable deterministic image lookup based on recipe title & database ObjectId hash
  const getRecipeImage = (title = '', id = '') => {
    const t = title.toLowerCase();
    
    // Stitch Mockup images map
    const images = [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCSMtRTkGYg55sGjuiGCIlhF1z6ulPh3hpzUgE4R-YYLu8W0xvnlWT3Oo8_8ST0pn_Zi557Ucr6z-Q-f7jDWhDRnXnSq_VrQFXKYMDCKdeDN9AL7VFCx0VRcgrG9xF8hU2f_VsDlW7SYcg9FfmoiTrf6MP8a455jVv-52CGqJKvWeI0wYciUScjR2fsx0ZgNKeujZqYP6HJPdkbUFweJZCA1Y9KUNVKPiFpiKi4Ha25yZm3BUF-fGPxDA", // Tikka Tofu
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC1HhqnPbVEcTCzIzw-MHjHcOnGmNr5kwS5FU2enbhaidZzYq7Dv_kRyWucjG7VBBUXoaXC93GoUwpI5VGnUslVHgLZlqM8uc87zdm7OmD6zZAVFamuAwmAXHe8NptB7nuGCc2a7Yj3sOfILR0-EUH8XQzbdTxcKsCvZYfKWOKddAHLLDpdeaOWshUWyxP2XIzQn_xso43JgoioDsIl6RFnVN16QshGp1x612x-sciXdAmb_rX9Rna5Xw", // Avo Toast
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDgA81ImlYWPqnGUvCcTe_86fyNNYkTTX_b54L1Z_YK4pdsHt8MAiGtlNTPz8XvRrRAksd61e5OyB6Vhaz8_QTbBvky3scB3InZEM5VNOETKnCDi053MWOEhFghTA5RlyYJNR0A69CYhdGBnuEvM8exykF2djp_sMtgQXfbcDzY4QxVEqLlwHW0ZDEL8ZXirArUMMYf1epzp-tPKCZpqBASeuCqNe57eTpInq_foBC0LqzD9GW4ZFY_vg", // Lava Cake
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCsX8Sm0y_EX4ztiG4q2gCmUg3XdMy3WqmZXa137SdLIT7rJefsxTXIDaHcy7NHa_nDSUMvIsjo3HrxjwuiwUJlnEBK_OiO-dvQDUW5KeE2Vt2UBNQGr3YAbiA_6DgNCmkMoOjhvs--o2VJMzY873_PGfzDY3jK0V9Ix_PSU8BmQtNKknGYfKx0iEYeMUSsE85a1Qg2qNPe8qqpbU85ars9p8V07I_4amDqon9xr8rKHMw1245B2AhHmA", // Citrus Salad
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDXgs4l58XRlcyu9IHsEEZLEiCjH74_BStvfkusb7cXrxpU1AYD_oIW_SUklMsClzvBzeH7D4FZCqESDtNZqv7xUTWX8hS1CqJ2nMIDg8TAjuU7-E_WWSw3o24XaqfWqav8a4uOGX3b23fAR60XgMufs3v_wuxlX1CdvJATT6S2rIAmT4vQS8IujiQ0BmS6RZXdv9rhCfG-GnYi8xcPiGrMNXZlk1gGiaLsuVx2B-4gejMOPWwdd9qH2Q"  // Tomato bisque
    ];

    // Precise keyword matching
    if (t.includes('risotto') || t.includes('scallop') || t.includes('seafood') || t.includes('fish')) {
      return "https://lh3.googleusercontent.com/aida-public/AB6AXuBG8N4HU4PpqtUvNb-_v9rPoW5DoYMmq46mQtf5Os3jVj7D3pXJI-AgVy04HvF6Hxm0xcpROA4bfzjcec0Ycu7FsMEOt0N5I801CSy7NaPA1rxz0atBK9gUCgVyoOqgy0xYuejfGmR-DpGOd9-f8xzEGmTjyOq8QsjSmyKVofFGAptYD5oCbfRokP7cDB72LyZcwnftZFAyofjo3oJgiT1XTpv2VGTbGgeKd45Y6s8lW_aq_0DFdS-nSQ";
    }
    if (t.includes('tofu') || t.includes('tikka') || t.includes('paneer') || t.includes('masala') || t.includes('curry') || t.includes('daal')) {
      return "https://lh3.googleusercontent.com/aida-public/AB6AXuCSMtRTkGYg55sGjuiGCIlhF1z6ulPh3hpzUgE4R-YYLu8W0xvnlWT3Oo8_8ST0pn_Zi557Ucr6z-Q-f7jDWhDRnXnSq_VrQFXKYMDCKdeDN9AL7VFCx0VRcgrG9xF8hU2f_VsDlW7SYcg9FfmoiTrf6MP8a455jVv-52CGqJKvWeI0wYciUScjR2fsx0ZgNKeujZqYP6HJPdkbUFweJZCA1Y9KUNVKPiFpiKi4Ha25yZm3BUF-fGPxDA";
    }
    if (t.includes('toast') || t.includes('avo') || t.includes('egg') || t.includes('omelette') || t.includes('scramble')) {
      return "https://lh3.googleusercontent.com/aida-public/AB6AXuC1HhqnPbVEcTCzIzw-MHjHcOnGmNr5kwS5FU2enbhaidZzYq7Dv_kRyWucjG7VBBUXoaXC93GoUwpI5VGnUslVHgLZlqM8uc87zdm7OmD6zZAVFamuAwmAXHe8NptB7nuGCc2a7Yj3sOfILR0-EUH8XQzbdTxcKsCvZYfKWOKddAHLLDpdeaOWshUWyxP2XIzQn_xso43JgoioDsIl6RFnVN16QshGp1x612x-sciXdAmb_rX9Rna5Xw";
    }
    if (t.includes('cake') || t.includes('lava') || t.includes('dessert') || t.includes('sweet') || t.includes('chocolate')) {
      return "https://lh3.googleusercontent.com/aida-public/AB6AXuDgA81ImlYWPqnGUvCcTe_86fyNNYkTTX_b54L1Z_YK4pdsHt8MAiGtlNTPz8XvRrRAksd61e5OyB6Vhaz8_QTbBvky3scB3InZEM5VNOETKnCDi053MWOEhFghTA5RlyYJNR0A69CYhdGBnuEvM8exykF2djp_sMtgQXfbcDzY4QxVEqLlwHW0ZDEL8ZXirArUMMYf1epzp-tPKCZpqBASeuCqNe57eTpInq_foBC0LqzD9GW4ZFY_vg";
    }
    if (t.includes('salad') || t.includes('citrus') || t.includes('bowl') || t.includes('green') || t.includes('harvest')) {
      return "https://lh3.googleusercontent.com/aida-public/AB6AXuCsX8Sm0y_EX4ztiG4q2gCmUg3XdMy3WqmZXa137SdLIT7rJefsxTXIDaHcy7NHa_nDSUMvIsjo3HrxjwuiwUJlnEBK_OiO-dvQDUW5KeE2Vt2UBNQGr3YAbiA_6DgNCmkMoOjhvs--o2VJMzY873_PGfzDY3jK0V9Ix_PSU8BmQtNKknGYfKx0iEYeMUSsE85a1Qg2qNPe8qqpbU85ars9p8V07I_4amDqon9xr8rKHMw1245B2AhHmA";
    }
    if (t.includes('tomato') || t.includes('soup') || t.includes('bisque') || t.includes('broth')) {
      return "https://lh3.googleusercontent.com/aida-public/AB6AXuDXgs4l58XRlcyu9IHsEEZLEiCjH74_BStvfkusb7cXrxpU1AYD_oIW_SUklMsClzvBzeH7D4FZCqESDtNZqv7xUTWX8hS1CqJ2nMIDg8TAjuU7-E_WWSw3o24XaqfWqav8a4uOGX3b23fAR60XgMufs3v_wuxlX1CdvJATT6S2rIAmT4vQS8IujiQ0BmS6RZXdv9rhCfG-GnYi8xcPiGrMNXZlk1gGiaLsuVx2B-4gejMOPWwdd9qH2Q";
    }
    if (t.includes('ramen') || t.includes('noodle') || t.includes('miso') || t.includes('japanese') || t.includes('soup')) {
      return "https://lh3.googleusercontent.com/aida-public/AB6AXuA6rpSedwDBOBpk3y42TP757sqQ1de9xvMZlSVz5bLFIR38OTXFLWnk7EzNppaklCMBXkjWZ4vjRTjTA547n2DCBzWB5ZlgMWHkSxgs0L_HN78R5fAZqg650bRXohuSxvV_jHcysByqOXlW48BX4MlQD1n-SAXUKww37EcOlMbE_0nAVi7Ya4GDvrYa2OChipTzTHg3Zdo4GU5ui0axPKyw6xxUOzNiVfgxSo2_nTLoZJID26OxdtMK0A";
    }

    // Stable Hash fallback based on Database ID string
    let stableIndex = 0;
    if (id) {
      let hash = 0;
      for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
      }
      stableIndex = Math.abs(hash);
    }
    return images[stableIndex % images.length];
  };

  // Client-side filtration logic matching Stitch categories
  const filteredHistory = history.filter(item => {
    // If favorites mode is activated via sidebar
    if (showOnlyFavorites) {
      return favorites.includes(item.id);
    }

    const t = item.title?.toLowerCase() || '';
    const ingredientsText = (item.inputIngredients || []).join(' ').toLowerCase();

    if (activeFilter === 'yesterday') {
      return (item.difficulty || '').toLowerCase() === 'easy';
    }
    if (activeFilter === 'breakfast') {
      return t.includes('egg') || t.includes('omelette') || t.includes('toast') || t.includes('salad') || ingredientsText.includes('egg');
    }
    if (activeFilter === 'indian') {
      return t.includes('tikka') || t.includes('paneer') || t.includes('masala') || t.includes('daal') || t.includes('curry') || ingredientsText.includes('paneer') || ingredientsText.includes('lentils');
    }
    if (activeFilter === 'quick') {
      const cookTimeNum = parseInt(item.cookTime || '0', 10);
      return cookTimeNum <= 20 && cookTimeNum > 0;
    }
    if (activeFilter === 'desserts') {
      return t.includes('cake') || t.includes('dessert') || t.includes('lava') || t.includes('sweet');
    }
    return true;
  });

  const handleClearFavoritesFilter = () => {
    if (onToggleFavoritesView) {
      onToggleFavoritesView(false);
    }
    setActiveFilter('all');
  };

  return (
    <div className="max-w-[1440px] mx-auto px-container-padding py-12">
      
      {/* Page Header & Filters */}
      <section className="mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="inline-block px-3 py-1 bg-tertiary-container/10 text-tertiary font-label-md rounded-full mb-3 text-xs font-bold uppercase tracking-wider">
              {showOnlyFavorites ? 'Personal Favorites' : 'Kitchen Archive'}
            </span>
            <h2 className="font-display text-3xl font-black text-on-surface mb-2">
              {showOnlyFavorites ? 'Saved Recipes' : 'Recipe History'}
            </h2>
            <p className="text-sm text-on-surface-variant max-w-xl font-medium opacity-80">
              {showOnlyFavorites 
                ? 'Your handpicked selections and highest-rated AI creations.' 
                : 'Explore your past creations, rediscovered favorites, and AI-enhanced culinary experiments.'
              }
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {showOnlyFavorites && (
              <button 
                onClick={handleClearFavoritesFilter}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-full text-xs font-bold border-none cursor-pointer shadow-md text-center"
              >
                <span>Show All History</span>
              </button>
            )}
            <button 
              onClick={fetchHistory}
              className="flex items-center gap-2 px-5 py-2.5 glass-card rounded-full text-on-surface hover:text-primary active:scale-95 border-none cursor-pointer text-xs font-bold bg-transparent"
            >
              <span className="material-symbols-outlined text-[20px]">filter_list</span>
              <span className="font-label-md">Filter</span>
            </button>
            <button 
              onClick={fetchHistory}
              className="flex items-center gap-2 px-5 py-2.5 glass-card rounded-full text-on-surface hover:text-primary active:scale-95 border-none cursor-pointer text-xs font-bold bg-transparent"
            >
              <span className="material-symbols-outlined text-[20px]">sort</span>
              <span className="font-label-md">Most Recent</span>
            </button>
          </div>
        </div>

        {/* Chips/Categories matching Stitch mockup (hidden when showing only favorites) */}
        {!showOnlyFavorites && (
          <div className="flex gap-3 mt-8 overflow-x-auto pb-2 no-scrollbar">
            <button 
              onClick={() => setActiveFilter('all')}
              className={`px-6 py-2 rounded-full text-xs font-bold transition-all border-none cursor-pointer whitespace-nowrap ${
                activeFilter === 'all' 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'glass-card text-on-surface-variant hover:text-primary bg-transparent'
              }`}
            >
              All Recipes
            </button>
            <button 
              onClick={() => setActiveFilter('yesterday')}
              className={`px-6 py-2 rounded-full text-xs font-bold transition-all border-none cursor-pointer whitespace-nowrap ${
                activeFilter === 'yesterday' 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'glass-card text-on-surface-variant hover:text-primary bg-transparent'
              }`}
            >
              Generated Yesterday
            </button>
            <button 
              onClick={() => setActiveFilter('breakfast')}
              className={`px-6 py-2 rounded-full text-xs font-bold transition-all border-none cursor-pointer whitespace-nowrap ${
                activeFilter === 'breakfast' 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'glass-card text-on-surface-variant hover:text-primary bg-transparent'
              }`}
            >
              Breakfast Classics
            </button>
            <button 
              onClick={() => setActiveFilter('indian')}
              className={`px-6 py-2 rounded-full text-xs font-bold transition-all border-none cursor-pointer whitespace-nowrap ${
                activeFilter === 'indian' 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'glass-card text-on-surface-variant hover:text-primary bg-transparent'
              }`}
            >
              Spicy Indian
            </button>
            <button 
              onClick={() => setActiveFilter('quick')}
              className={`px-6 py-2 rounded-full text-xs font-bold transition-all border-none cursor-pointer whitespace-nowrap ${
                activeFilter === 'quick' 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'glass-card text-on-surface-variant hover:text-primary bg-transparent'
              }`}
            >
              Quick Bites
            </button>
            <button 
              onClick={() => setActiveFilter('desserts')}
              className={`px-6 py-2 rounded-full text-xs font-bold transition-all border-none cursor-pointer whitespace-nowrap ${
                activeFilter === 'desserts' 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'glass-card text-on-surface-variant hover:text-primary bg-transparent'
              }`}
            >
              Desserts
            </button>
          </div>
        )}
      </section>

      {/* Grid displays */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-on-surface-variant">
          <RotateCw className="w-8 h-8 animate-spin text-primary" />
          <p className="text-xs font-bold">Querying MongoDB Atlas...</p>
        </div>
      ) : error ? (
        <div className="bg-error-container border border-error/20 rounded-[32px] p-8 flex items-start gap-4 max-w-2xl mx-auto shadow-md">
          <AlertTriangle className="w-6 h-6 text-error shrink-0" />
          <div>
            <h3 className="font-bold text-on-error-container text-sm">Failed to Load History</h3>
            <p className="text-xs text-on-error-container mt-1">{error}</p>
          </div>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="text-center py-20 glass-panel rounded-[32px] max-w-xl mx-auto border border-white/20 p-8 shadow-sm">
          <span className="material-symbols-outlined text-4xl text-primary mb-3">favorite</span>
          <p className="text-sm font-bold text-on-surface">
            {showOnlyFavorites ? 'No saved recipes found.' : 'No recipes found matching this filter.'}
          </p>
          <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
            {showOnlyFavorites 
              ? 'Click the heart icon on any recipe card in your history archive to save it here.' 
              : 'Specify ingredients in the Kitchen workspace and cook to generate your first recipe card.'
            }
          </p>
        </div>
      ) : (
        /* Bento grid list */
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredHistory.map((item, index) => {
            const isFeatured = index === 0 && activeFilter === 'all' && !showOnlyFavorites;
            const isFav = favorites.includes(item._id);

            if (isFeatured) {
              return (
                <div 
                  key={item._id}
                  onClick={() => onSelectRecipe(item)}
                  className="glass-card rounded-[24px] p-4 flex flex-col gap-4 lg:col-span-2 lg:row-span-2 border border-white/35 cursor-pointer shadow-sm hover:shadow-xl group relative animate-scale-in"
                >
                  <div className="recipe-image-container h-[400px] relative overflow-hidden rounded-2xl">
                    <img 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      alt={item.title} 
                      src={getRecipeImage(item.title, item._id)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6 z-10">
                      <button className="bg-white/90 backdrop-blur-md text-primary font-bold px-6 py-3 rounded-xl shadow-xl flex items-center gap-2 border-none cursor-pointer">
                        <span className="material-symbols-outlined text-sm">menu_book</span>
                        <span>View Full Recipe</span>
                      </button>
                    </div>
                    {/* Absolute Heart button for favoriting */}
                    <button 
                      onClick={(e) => toggleFavorite(e, item._id)}
                      className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-primary shadow-sm border-none cursor-pointer z-20 hover:scale-110 active:scale-95 transition-transform"
                    >
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: isFav ? "'FILL' 1" : "'FILL' 0" }}>
                        favorite
                      </span>
                    </button>
                    {/* Absolute Trash button for deleting */}
                    <button 
                      onClick={(e) => handleDeleteClick(e, item._id)}
                      className="absolute top-4 right-16 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-error shadow-sm border-none cursor-pointer z-20 hover:scale-115 active:scale-90 transition-transform hover:bg-error-container hover:text-on-error-container"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        delete
                      </span>
                    </button>
                  </div>
                  <div className="px-2">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-headline-md text-lg font-black text-on-surface group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <span className="text-xs font-bold text-on-surface-variant bg-surface-container rounded-full px-3 py-1 italic">
                        {item.cookTime || '45 mins'}
                      </span>
                    </div>
                    <div className="flex gap-2 mb-3">
                      <span className="px-3 py-1 bg-primary/5 text-primary text-[12px] font-bold rounded-full uppercase tracking-wider">
                        Premium AI
                      </span>
                      <span className="px-3 py-1 bg-secondary-container/30 text-secondary text-[12px] font-bold rounded-full uppercase tracking-wider">
                        Fusion
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed opacity-85">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            }

            return (
              <div 
                key={item._id}
                onClick={() => onSelectRecipe(item)}
                className="glass-card rounded-[24px] p-4 flex flex-col gap-4 border border-white/35 cursor-pointer shadow-sm hover:shadow-xl group bg-transparent relative animate-scale-in"
              >
                <div className="recipe-image-container h-48 overflow-hidden rounded-2xl relative">
                  <img 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    alt={item.title} 
                    src={getRecipeImage(item.title, item._id)}
                  />
                  {/* Absolute Heart button for favoriting */}
                  <button 
                    onClick={(e) => toggleFavorite(e, item._id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-primary shadow-sm border-none cursor-pointer z-20 hover:scale-110 active:scale-95 transition-transform"
                  >
                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: isFav ? "'FILL' 1" : "'FILL' 0" }}>
                      favorite
                    </span>
                  </button>
                  {/* Absolute Trash button for deleting */}
                  <button 
                    onClick={(e) => handleDeleteClick(e, item._id)}
                    className="absolute top-3 right-13 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-error shadow-sm border-none cursor-pointer z-20 hover:scale-115 active:scale-90 transition-transform hover:bg-error-container hover:text-on-error-container"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      delete
                    </span>
                  </button>
                </div>
                <div>
                  <h3 className="font-headline-sm font-bold text-sm text-on-surface mb-1 truncate group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-on-surface-variant opacity-75 mb-3">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    <span>{item.cookTime || '20 mins'}</span>
                    <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                    <span className="capitalize">{item.difficulty || 'Easy'}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <span className="px-2 py-0.5 bg-surface-container text-on-surface-variant text-[10px] font-bold rounded-md uppercase">
                      Recipe Card
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      )}

      {/* Explore More Section */}
      {!loading && !error && filteredHistory.length > 0 && (
        <div className="mt-20 flex flex-col items-center gap-4">
          <button 
            onClick={fetchHistory}
            className="px-10 py-4 glass-card rounded-full text-primary font-bold hover:bg-primary hover:text-white transition-all flex items-center gap-3 border-none cursor-pointer bg-transparent"
          >
            <span className="material-symbols-outlined">sync</span>
            <span>Explore More History</span>
          </button>
          <p className="text-xs text-on-surface-variant opacity-50 font-bold uppercase tracking-wider">
            Showing {filteredHistory.length} of 142 recipes generated this year.
          </p>
        </div>
      )}

      {/* Footer Section */}
      <footer className="mt-24 py-12 px-container-padding bg-surface-container-lowest border-t border-outline-variant/30 rounded-[32px]">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-gutter">
          <div>
            <h3 className="font-headline-md text-primary font-black mb-2 text-base">TadkaMode AI</h3>
            <p className="text-xs text-on-surface-variant max-w-xs">
              © 2024 TadkaMode AI. Premium Culinary Precision for the Modern Kitchen.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-12 gap-y-6">
            <div className="flex flex-col gap-3">
              <h4 className="text-xs text-on-surface font-black uppercase tracking-wider">Platform</h4>
              <a className="text-xs text-on-surface-variant hover:text-primary transition-colors" href="#">Privacy Policy</a>
              <a className="text-xs text-on-surface-variant hover:text-primary transition-colors" href="#">Terms of Service</a>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="text-xs text-on-surface font-black uppercase tracking-wider">Connect</h4>
              <a className="text-xs text-on-surface-variant hover:text-primary transition-colors" href="#">Press Kit</a>
              <a className="text-xs text-on-surface-variant hover:text-primary transition-colors" href="#">Contact Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HistoryView;
