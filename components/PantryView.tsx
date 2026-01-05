
import React, { useState } from 'react';

interface PantryViewProps {
  ingredients: string[];
  onAdd: (item: string) => void;
  onRemove: (item: string) => void;
  onClear: () => void;
}

const PantryView: React.FC<PantryViewProps> = ({ ingredients, onAdd, onRemove, onClear }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAdd(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-left duration-300">
      <header>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Manage Pantry</h2>
        <p className="text-gray-500 mt-2">Add ingredients you always have in stock for better recipe matches.</p>
      </header>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <i className="fa-solid fa-plus absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Add pantry item (e.g. Olive Oil, Flour, Salt...)" 
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all shadow-sm"
          />
        </div>
        <button 
          type="submit"
          className="bg-emerald-500 text-white px-8 py-4 rounded-2xl font-bold hover:bg-emerald-600 shadow-md transition-all active:scale-95 shrink-0"
        >
          Add Item
        </button>
      </form>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 min-h-[400px]">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-gray-800">Your Stock</h3>
          {ingredients.length > 0 && (
            <button onClick={onClear} className="text-xs font-bold text-red-500 hover:underline uppercase tracking-wider">
              Clear All
            </button>
          )}
        </div>

        {ingredients.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-xl">
            <i className="fa-solid fa-box-open text-4xl text-gray-100 mb-4 block"></i>
            <p className="text-gray-400">Your pantry is empty.</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {ingredients.map((item, idx) => (
              <div 
                key={idx} 
                className="group flex items-center gap-2 bg-gray-50 pl-4 pr-2 py-2 rounded-xl border border-gray-200 text-gray-700 font-medium hover:border-emerald-200 hover:bg-emerald-50 transition-all"
              >
                {item}
                <button 
                  onClick={() => onRemove(item)}
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-300 group-hover:text-red-500 transition-colors"
                >
                  <i className="fa-solid fa-xmark text-xs"></i>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PantryView;
