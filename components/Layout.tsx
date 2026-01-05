
import React from 'react';
import { DietaryRestriction, AppTab } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeFilter: DietaryRestriction;
  onFilterChange: (filter: DietaryRestriction) => void;
  onTabChange: (tab: AppTab) => void;
  activeTab: AppTab;
  shoppingCount: number;
  favoritesCount: number;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeFilter, 
  onFilterChange, 
  onTabChange, 
  activeTab,
  shoppingCount,
  favoritesCount
}) => {
  const filters: DietaryRestriction[] = ['None', 'Vegetarian', 'Vegan', 'Keto', 'Gluten-Free', 'Paleo'];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 text-slate-800">
      {/* Sidebar - Desktop */}
      <aside className="w-full md:w-64 bg-white border-b md:border-r border-gray-200 p-6 flex-shrink-0">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-emerald-500 p-2 rounded-xl text-white">
            <i className="fa-solid fa-wand-magic-sparkles text-xl"></i>
          </div>
          <h1 className="text-xl font-bold tracking-tight">FridgeGenie</h1>
        </div>

        <nav className="space-y-6">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Navigation</p>
            <div className="space-y-1">
              <button 
                onClick={() => onTabChange('fridge')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeTab === 'fridge' ? 'bg-emerald-50 text-emerald-600 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <i className="fa-solid fa-camera w-5"></i>
                Scan & Cook
              </button>
              <button 
                onClick={() => onTabChange('favorites')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${activeTab === 'favorites' ? 'bg-emerald-50 text-emerald-600 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-heart w-5 text-rose-500"></i>
                  Favorites
                </div>
                {favoritesCount > 0 && (
                  <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                    {favoritesCount}
                  </span>
                )}
              </button>
              <button 
                onClick={() => onTabChange('pantry')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeTab === 'pantry' ? 'bg-emerald-50 text-emerald-600 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <i className="fa-solid fa-box-archive w-5"></i>
                My Pantry
              </button>
              <button 
                onClick={() => onTabChange('shopping')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${activeTab === 'shopping' ? 'bg-emerald-50 text-emerald-600 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-cart-shopping w-5"></i>
                  Shopping List
                </div>
                {shoppingCount > 0 && (
                  <span className="bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                    {shoppingCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Dietary Filter</p>
            <div className="space-y-1">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => onFilterChange(f)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all ${activeFilter === f ? 'bg-emerald-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  {f === 'None' ? 'All Recipes' : f}
                </button>
              ))}
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
