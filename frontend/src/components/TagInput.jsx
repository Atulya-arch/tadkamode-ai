import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

/**
 * Premium Tag Input Component for free-form ingredient collection.
 * Supports comma separation, keyboard entry (Enter/Comma), bulk paste, and duplication checks.
 */
export const TagInput = ({ tags, onTagsChange, placeholder = "Add ingredients..." }) => {
  const [inputValue, setInputValue] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(null);

  const addTag = (text) => {
    const cleaned = text.trim().toLowerCase();
    if (!cleaned) return;

    // Duplication Check
    const index = tags.findIndex(tag => tag.toLowerCase() === cleaned);
    if (index !== -1) {
      // Temporarily highlight the existing tag to warn the user
      setHighlightedIndex(index);
      setTimeout(() => setHighlightedIndex(null), 1000);
      return;
    }

    onTagsChange([...tags, cleaned]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
      setInputValue('');
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text');
    
    // Split by comma or newline and add each item
    const items = pasteData
      .split(/[,\n]/)
      .map(item => item.trim())
      .filter(item => item.length > 0);
      
    if (items.length > 0) {
      const uniqueNewItems = items.filter(
        item => !tags.some(tag => tag.toLowerCase() === item.toLowerCase())
      );
      // Remove duplicates within the pasted data itself
      const dedupedNewItems = [...new Set(uniqueNewItems)];
      
      onTagsChange([...tags, ...dedupedNewItems]);
      setInputValue('');
    }
  };

  const removeTag = (indexToRemove) => {
    onTagsChange(tags.filter((_, index) => index !== indexToRemove));
  };

  const clearAll = () => {
    onTagsChange([]);
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Tag Display Area */}
      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-2.5 min-h-[46px] p-3 bg-slate-950/40 rounded-xl border border-slate-800/80">
          {tags.map((tag, index) => {
            const isHighlighted = highlightedIndex === index;
            return (
              <span
                key={index}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all duration-200 ${
                  isHighlighted
                    ? 'bg-red-500 text-white scale-105 shadow-md shadow-red-500/20'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:border-amber-500/50 hover:bg-amber-500/15'
                }`}
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="hover:bg-amber-500/20 rounded p-0.5 text-amber-400 hover:text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            );
          })}
        </div>
      ) : (
        <div className="flex items-center justify-center py-6 bg-slate-950/20 rounded-xl border border-slate-800/40 border-dashed text-slate-500 text-xs font-medium">
          No ingredients added yet. Type them below!
        </div>
      )}

      {/* Input Field Area */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder={placeholder}
            className="w-full bg-slate-950 border border-slate-850 rounded-xl pl-4 pr-10 py-3 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-sans text-sm"
          />
          <button
            type="button"
            onClick={() => {
              addTag(inputValue);
              setInputValue('');
            }}
            disabled={!inputValue.trim()}
            className="absolute right-2.5 top-1/2 transform -translate-y-1/2 p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-slate-950 disabled:opacity-0 transition-all duration-200"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {tags.length > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="px-4 py-3 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-xl border border-red-500/20 hover:border-red-500 transition-all duration-200 flex items-center justify-center gap-1.5 text-sm font-semibold"
            title="Clear all ingredients"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        )}
      </div>
    </div>
  );
};
