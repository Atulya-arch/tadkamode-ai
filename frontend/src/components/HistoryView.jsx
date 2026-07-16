import React, { useState, useEffect, useRef } from 'react';
import { recipeService } from '../services/recipeService';
import { RotateCw, AlertTriangle, Clock } from 'lucide-react';

export const HistoryView = ({ onSelectRecipe }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'quick' | 'easy'
  const activeControllerRef = useRef(null);

  useEffect(() => {
    fetchHistory();
    return () => {
      if (activeControllerRef.current) activeControllerRef.current.abort();
    };
  }, []);

  const fetchHistory = async () => {
    if (activeControllerRef.current) activeControllerRef.current.abort();
    const controller = new AbortController();
    activeControllerRef.current = controller;

    setLoading(true);
    setError(null);
    try {
      const items = await recipeService.getHistory(controller.signal);
      if (!controller.signal.aborted) {
        setHistory(items);
        setLoading(false);
      }
    } catch (err) {
      if (err.name === 'AbortError') return;
      if (!controller.signal.aborted) {
        setError('Failed to load recipe history from Atlas.');
        setLoading(false);
      }
    }
  };

  // Assign beautiful Unsplash editorial culinary images based on ingredients
  const getRecipeImage = (title = '', index = 0) => {
    const t = title.toLowerCase();
    const images = [
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400", // Salad
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=400", // Paneer
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&q=80&w=400", // Cakes
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=400", // Searing
      "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&q=80&w=400"  // Dessert
    ];

    if (t.includes('pasta') || t.includes('penne') || t.includes('noodle')) {
      return "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=400";
    }
    if (t.includes('salad') || t.includes('bowl') || t.includes('citrus')) {
      return "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=400";
    }
    if (t.includes('curry') || t.includes('daal') || t.includes('paneer') || t.includes('masala')) {
      return "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=400";
    }
    if (t.includes('cake') || t.includes('lava') || t.includes('dessert') || t.includes('sweet')) {
      return "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=400";
    }

    return images[index % images.length];
  };

  // Client-side filtration logic
  const filteredHistory = history.filter(item => {
    if (activeFilter === 'quick') {
      const cookTimeNum = parseInt(item.cookTime || '0', 10);
      return cookTimeNum <= 20 && cookTimeNum > 0;
    }
    if (activeFilter === 'easy') {
      return (item.difficulty || '').toLowerCase() === 'easy';
    }
    return true;
  });

  return (
    <div className="max-w-[1440px] mx-auto px-container-padding py-12">
      
      {/* Header & filters */}
      <section className="mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary font-label-md rounded-full mb-3 text-xs font-bold uppercase tracking-wider">
              Kitchen Archive
            </span>
            <h2 className="font-display text-3xl font-black text-on-surface mb-2">Recipe History</h2>
            <p className="text-sm text-on-surface-variant max-w-xl font-medium">
              Explore your past creations, rediscovered favorites, and AI-enhanced culinary experiments.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={fetchHistory}
              className="flex items-center gap-2 px-5 py-2.5 glass-card rounded-full text-on-surface hover:text-primary active:scale-95 border-none cursor-pointer text-xs font-bold bg-transparent"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Sync Archive</span>
            </button>
          </div>
        </div>

        {/* Chips/Filters */}
        <div className="flex gap-3 mt-8 overflow-x-auto pb-2">
          <button 
            onClick={() => setActiveFilter('all')}
            className={`px-6 py-2 rounded-full text-xs font-bold transition-all border-none cursor-pointer ${
              activeFilter === 'all' 
                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                : 'glass-card text-on-surface-variant hover:text-primary bg-transparent'
            }`}
          >
            All Recipes
          </button>
          <button 
            onClick={() => setActiveFilter('quick')}
            className={`px-6 py-2 rounded-full text-xs font-bold transition-all border-none cursor-pointer ${
              activeFilter === 'quick' 
                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                : 'glass-card text-on-surface-variant hover:text-primary bg-transparent'
            }`}
          >
            Quick Cooking (&le; 20 min)
          </button>
          <button 
            onClick={() => setActiveFilter('easy')}
            className={`px-6 py-2 rounded-full text-xs font-bold transition-all border-none cursor-pointer ${
              activeFilter === 'easy' 
                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                : 'glass-card text-on-surface-variant hover:text-primary bg-transparent'
            }`}
          >
            Easy Difficulty
          </button>
        </div>
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
          <span className="material-symbols-outlined text-4xl text-primary mb-3">kitchen</span>
          <p className="text-sm font-bold text-on-surface">No recipes found matching this filter.</p>
          <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
            Specify ingredients in the Kitchen workspace and cook to generate your first recipe card.
          </p>
        </div>
      ) : (
        /* Bento grid list */
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredHistory.map((item, index) => {
            const isFeatured = index === 0 && activeFilter === 'all';
            
            if (isFeatured) {
              return (
                <div 
                  key={item._id}
                  onClick={() => onSelectRecipe(item._id)}
                  className="glass-card rounded-[24px] p-4 flex flex-col gap-4 lg:col-span-2 lg:row-span-2 border border-white/35 cursor-pointer shadow-sm hover:shadow-xl group"
                >
                  <div className="recipe-image-container h-[350px] md:h-[400px] relative overflow-hidden rounded-2xl">
                    <img 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      alt={item.title} 
                      src={getRecipeImage(item.title, index)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6 z-10">
                      <button className="bg-white/95 text-primary font-bold px-5 py-2.5 rounded-xl shadow-lg flex items-center gap-2 border-none cursor-pointer text-xs">
                        <span className="material-symbols-outlined text-sm">menu_book</span>
                        <span>View Full Recipe</span>
                      </button>
                    </div>
                  </div>
                  <div className="px-2">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-headline-md text-lg font-black text-on-surface group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <span className="text-xs font-bold text-on-surface-variant bg-surface-container rounded-full px-3 py-1">
                        {item.cookTime || '20m'}
                      </span>
                    </div>
                    <div className="flex gap-2 mb-3">
                      <span className="px-2.5 py-0.5 bg-primary/10 text-primary text-[10px] font-black rounded-md uppercase tracking-wider">
                        {item.difficulty || 'Easy'}
                      </span>
                      <span className="px-2.5 py-0.5 bg-tertiary/10 text-tertiary text-[10px] font-black rounded-md uppercase tracking-wider">
                        AI Choice
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
                onClick={() => onSelectRecipe(item._id)}
                className="glass-card rounded-[24px] p-4 flex flex-col gap-4 border border-white/35 cursor-pointer shadow-sm hover:shadow-xl group bg-transparent"
              >
                <div className="recipe-image-container h-48 overflow-hidden rounded-2xl">
                  <img 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    alt={item.title} 
                    src={getRecipeImage(item.title, index)}
                  />
                </div>
                <div>
                  <h3 className="font-headline-sm font-black text-sm text-on-surface mb-1 truncate group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-on-surface-variant opacity-75 mb-3">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    <span>{item.cookTime || '20m'}</span>
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

      {/* Footer statistics */}
      {!loading && !error && filteredHistory.length > 0 && (
        <div className="mt-16 flex flex-col items-center gap-2">
          <p className="text-[11px] text-on-surface-variant opacity-60 font-bold uppercase tracking-wider">
            Displaying {filteredHistory.length} creations from Tadka database
          </p>
        </div>
      )}
    </div>
  );
};

export default HistoryView;
