import React, { useState, useEffect } from 'react';
import { loadRecipes } from '../utils/recipeHistory';
import { X, Calendar, Flame, ChefHat } from 'lucide-react';

/**
 * Slide-out Drawer showing recipe history from localStorage.
 * Reads history synchronously on open — no network call needed.
 */
export const HistoryDrawer = ({ isOpen, onClose, onSelectRecipe }) => {
  const [history, setHistory] = useState([]);

  // Reload history from localStorage every time the drawer opens
  useEffect(() => {
    if (isOpen) {
      setHistory(loadRecipes());
    }
  }, [isOpen]);

  const handleSelect = (recipe) => {
    onClose();
    // Pass the full recipe object — no network fetch required
    onSelectRecipe(recipe);
  };

  // Helper to format ISO date string
  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <>
      {/* Backdrop Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      ></div>

      {/* Slide-out Drawer Panel */}
      <aside
        className={`fixed right-0 top-0 bottom-0 w-full sm:w-[420px] bg-slate-900 border-l border-slate-800 shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-out transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/40">
          <div className="flex items-center gap-2.5">
            <Flame className="w-5 h-5 text-amber-500 fill-amber-500/10" />
            <h3 className="font-extrabold text-white text-base uppercase tracking-wider">
              Recipe History
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">

          {history.length === 0 && (
            <div className="text-center py-16 text-slate-500 flex flex-col items-center justify-center gap-3">
              <ChefHat className="w-12 h-12 stroke-[1.2] text-slate-600" />
              <div className="max-w-[200px]">
                <p className="font-bold text-sm text-slate-400">Drawer is Empty</p>
                <p className="text-xs text-slate-500 mt-1">
                  Once you successfully generate recipes, they will appear here.
                </p>
              </div>
            </div>
          )}

          {history.length > 0 && (
            <div className="space-y-3">
              {history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="w-full text-left p-4 bg-slate-950/40 border border-slate-850 hover:border-slate-750 hover:bg-slate-950/80 rounded-xl transition-all cursor-pointer flex flex-col gap-2 group"
                >
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-bold text-white text-sm leading-tight group-hover:text-amber-500 transition-colors">
                      {item.title}
                    </h4>
                    <span className="text-[10px] font-black uppercase text-amber-500 px-2 py-0.5 bg-amber-500/10 rounded-full border border-amber-500/10 flex-shrink-0">
                      {item.difficulty || 'Easy'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-450 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between border-t border-slate-850/50 pt-2.5 mt-1 text-[10px] text-slate-500 font-bold">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-600" />
                      {formatDate(item.createdAt)}
                    </span>
                    <span className="truncate max-w-[150px] text-right font-medium">
                      {item.inputIngredients?.join(', ') || 'No inputs'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

        </div>
      </aside>
    </>
  );
};

export default HistoryDrawer;
