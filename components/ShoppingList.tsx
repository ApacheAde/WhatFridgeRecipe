
import React from 'react';

interface ShoppingListProps {
  items: string[];
  onRemove: (item: string) => void;
  onClear: () => void;
}

const ShoppingList: React.FC<ShoppingListProps> = ({ items, onRemove, onClear }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <i className="fa-solid fa-cart-shopping text-emerald-500"></i>
          My Shopping List
        </h2>
        {items.length > 0 && (
          <button 
            onClick={onClear}
            className="text-sm text-red-500 font-medium hover:underline"
          >
            Clear All
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <div className="w-16 h-16 bg-gray-100 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-basket-shopping text-2xl"></i>
          </div>
          <p className="text-gray-400 font-medium">Your shopping list is empty</p>
          <p className="text-sm text-gray-300 mt-1">Start scanning recipes to add missing ingredients</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-100">
          {items.map((item, idx) => (
            <li key={idx} className="py-4 flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500" />
                <span className="text-gray-700 font-medium">{item}</span>
              </div>
              <button 
                onClick={() => onRemove(item)}
                className="text-gray-300 hover:text-red-500 transition-colors md:opacity-0 group-hover:opacity-100"
              >
                <i className="fa-solid fa-trash-can"></i>
              </button>
            </li>
          ))}
        </ul>
      )}

      {items.length > 0 && (
        <div className="mt-8 pt-8 border-t border-gray-100">
          <button className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
            <i className="fa-solid fa-share-nodes"></i>
            Export List
          </button>
        </div>
      )}
    </div>
  );
};

export default ShoppingList;
