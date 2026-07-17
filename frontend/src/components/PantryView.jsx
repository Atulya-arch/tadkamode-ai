import React, { useState, useEffect } from 'react';
import { ChefHat, Check, RotateCcw } from 'lucide-react';

export const PantryView = ({ setIngredients, setCurrentView }) => {
  // Preset list of standard household pantry items
  const pantryCategories = {
    "Staples & Grains": ["Basmati Rice", "Penne Pasta", "Flour", "Quinoa", "Oats"],
    "Vegetables & Aromatics": ["Garlic", "Ginger", "Red Onions", "Tomatoes", "Potatoes", "Spinach"],
    "Dairy & Oils": ["Butter", "Greek Yogurt", "Paneer", "Olive Oil", "Cheese", "Cream"],
    "Basic Spices": ["Salt", "Cumin Seeds", "Turmeric", "Chili Flakes", "Cardamom", "Garam Masala"]
  };

  // Load pantry stock from localStorage
  const [stock, setStock] = useState(() => {
    try {
      const saved = localStorage.getItem('tadka_pantry_stock');
      return saved ? JSON.parse(saved) : ["Garlic", "Ginger", "Salt", "Olive Oil", "Red Onions"]; // defaults
    } catch (e) {
      return ["Garlic", "Ginger", "Salt", "Olive Oil", "Red Onions"];
    }
  });

  useEffect(() => {
    localStorage.setItem('tadka_pantry_stock', JSON.stringify(stock));
  }, [stock]);

  const toggleStockItem = (item) => {
    setStock(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item) 
        : [...prev, item]
    );
  };

  const handleImportToKitchen = () => {
    // Overwrite the current active ingredients workspace list with our pantry stock
    setIngredients([...stock]);
    // Navigate back to the kitchen workspace
    setCurrentView('kitchen');
  };

  const handleClearStock = () => {
    setStock([]);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-container-padding py-12">
      
      {/* Header section */}
      <section className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="inline-block px-3 py-1 bg-primary/10 text-primary font-label-md rounded-full mb-3 text-xs font-bold uppercase tracking-wider">
            Household Stock
          </span>
          <h2 className="font-display text-3xl font-black text-on-surface mb-2">My Smart Pantry</h2>
          <p className="text-sm text-on-surface-variant max-w-xl font-medium opacity-80">
            Keep track of items you always have at home. Import them to your workspace in one click.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={handleClearStock}
            className="flex items-center gap-2 px-5 py-2.5 glass-card rounded-full text-on-surface hover:text-error active:scale-95 border-none cursor-pointer text-xs font-bold bg-transparent"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="font-label-md">Clear Stock</span>
          </button>
          <button 
            onClick={handleImportToKitchen}
            disabled={stock.length === 0}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full text-xs font-black shadow-lg shadow-primary/20 border-none cursor-pointer hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            <ChefHat className="w-4 h-4" />
            <span className="font-label-md uppercase tracking-wider">Load Stock into Kitchen</span>
          </button>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {Object.entries(pantryCategories).map(([categoryName, items]) => (
          <div 
            key={categoryName}
            className="glass-card rounded-[32px] p-8 border border-white/20 shadow-sm"
          >
            <h3 className="font-headline-md text-sm font-black text-on-surface mb-6 uppercase tracking-wider border-b border-outline-variant/30 pb-3">
              {categoryName}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {items.map((item) => {
                const inStock = stock.includes(item);
                return (
                  <div 
                    key={item}
                    onClick={() => toggleStockItem(item)}
                    className={`p-4 rounded-2xl flex items-center justify-between cursor-pointer border transition-all duration-300 ${
                      inStock 
                        ? 'bg-primary/5 border-primary text-primary font-bold shadow-sm' 
                        : 'bg-surface-container-low border-white/30 text-on-surface-variant hover:bg-white hover:border-outline'
                    }`}
                  >
                    <span className="text-xs">{item}</span>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                      inStock 
                        ? 'bg-primary border-primary text-white' 
                        : 'border-outline-variant bg-transparent'
                    }`}>
                      {inStock && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </section>



    </div>
  );
};

export default PantryView;
