
import React, { useState, useCallback, useEffect } from 'react';
import Layout from './components/Layout';
import FridgeScanner from './components/FridgeScanner';
import RecipeCard from './components/RecipeCard';
import StepByStepMode from './components/StepByStepMode';
import ShoppingList from './components/ShoppingList';
import PantryView from './components/PantryView';
import { Recipe, DietaryRestriction, AppState, AppTab } from './types';
import { analyzeFridgeImage, generateRecipes } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    scannedIngredients: [],
    pantryIngredients: [],
    recipes: [],
    favoriteRecipes: [],
    shoppingList: [],
    filter: 'None',
    isScanning: false,
    selectedRecipe: null
  });

  const [activeTab, setActiveTab] = useState<AppTab>('fridge');

  // Initialization & Sync
  useEffect(() => {
    const pantry = localStorage.getItem('pantry_list');
    const favorites = localStorage.getItem('favorite_recipes');
    const shopping = localStorage.getItem('shopping_list');
    
    setState(prev => ({
      ...prev,
      pantryIngredients: pantry ? JSON.parse(pantry) : [],
      favoriteRecipes: favorites ? JSON.parse(favorites) : [],
      shoppingList: shopping ? JSON.parse(shopping) : []
    }));
  }, []);

  useEffect(() => {
    localStorage.setItem('pantry_list', JSON.stringify(state.pantryIngredients));
  }, [state.pantryIngredients]);

  useEffect(() => {
    localStorage.setItem('favorite_recipes', JSON.stringify(state.favoriteRecipes));
  }, [state.favoriteRecipes]);

  useEffect(() => {
    localStorage.setItem('shopping_list', JSON.stringify(state.shoppingList));
  }, [state.shoppingList]);

  const handleScan = async (base64Image: string) => {
    setState(prev => ({ ...prev, isScanning: true }));
    try {
      const ingredients = await analyzeFridgeImage(base64Image);
      const recipes = await generateRecipes(ingredients, state.pantryIngredients, state.filter);
      setState(prev => ({
        ...prev,
        scannedIngredients: ingredients,
        recipes: recipes,
        isScanning: false
      }));
    } catch (err) {
      console.error("Scan failed", err);
      setState(prev => ({ ...prev, isScanning: false }));
      alert("Something went wrong analyzing the image. Please try again.");
    }
  };

  const updateRecipesWithFilter = useCallback(async (newFilter: DietaryRestriction) => {
    if (state.scannedIngredients.length === 0) return;
    
    setState(prev => ({ ...prev, isScanning: true, filter: newFilter }));
    try {
      const recipes = await generateRecipes(state.scannedIngredients, state.pantryIngredients, newFilter);
      setState(prev => ({
        ...prev,
        recipes: recipes,
        isScanning: false
      }));
    } catch (err) {
      console.error("Filter update failed", err);
      setState(prev => ({ ...prev, isScanning: false }));
    }
  }, [state.scannedIngredients, state.pantryIngredients]);

  const handleFilterChange = (filter: DietaryRestriction) => {
    setState(prev => ({ ...prev, filter }));
    if (state.scannedIngredients.length > 0) {
      updateRecipesWithFilter(filter);
    }
  };

  const handleAddToShoppingList = (ingredient: string) => {
    setState(prev => {
      if (prev.shoppingList.includes(ingredient)) return prev;
      return { ...prev, shoppingList: [...prev.shoppingList, ingredient] };
    });
  };

  const toggleFavorite = (e: React.MouseEvent, recipe: Recipe) => {
    e.stopPropagation();
    setState(prev => {
      const isFav = prev.favoriteRecipes.some(r => r.id === recipe.id);
      if (isFav) {
        return { ...prev, favoriteRecipes: prev.favoriteRecipes.filter(r => r.id !== recipe.id) };
      } else {
        return { ...prev, favoriteRecipes: [...prev.favoriteRecipes, recipe] };
      }
    });
  };

  return (
    <Layout 
      activeFilter={state.filter} 
      onFilterChange={handleFilterChange}
      onTabChange={setActiveTab}
      activeTab={activeTab}
      shoppingCount={state.shoppingList.length}
      favoritesCount={state.favoriteRecipes.length}
    >
      {activeTab === 'fridge' && (
        <div className="space-y-10">
          <header>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">What's in your fridge?</h2>
            <p className="text-gray-500 mt-2">AI-powered suggestions using your fridge scan + pantry items.</p>
          </header>

          <FridgeScanner onScan={handleScan} isLoading={state.isScanning} />

          {state.scannedIngredients.length > 0 && !state.isScanning && (
            <section className="space-y-6 animate-in slide-in-from-bottom duration-500">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <i className="fa-solid fa-sparkles text-amber-500"></i>
                  Tailored Suggestions
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {state.recipes.map(recipe => (
                  <RecipeCard 
                    key={recipe.id} 
                    recipe={recipe} 
                    isFavorite={state.favoriteRecipes.some(r => r.id === recipe.id)}
                    onSelect={(r) => setState(prev => ({ ...prev, selectedRecipe: r }))}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            </section>
          )}

          {state.scannedIngredients.length > 0 && (
            <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
              <h4 className="font-bold text-emerald-800 mb-3 text-sm uppercase tracking-wide">Detected in Photo</h4>
              <div className="flex flex-wrap gap-2">
                {state.scannedIngredients.map((item, idx) => (
                  <span key={idx} className="bg-white px-3 py-1 rounded-full text-xs font-medium text-emerald-700 shadow-sm border border-emerald-100">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'favorites' && (
        <div className="space-y-10 animate-in fade-in duration-300">
          <header>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Favorite Recipes</h2>
            <p className="text-gray-500 mt-2">Quick access to the meals you love.</p>
          </header>

          {state.favoriteRecipes.length === 0 ? (
            <div className="text-center py-32 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <i className="fa-solid fa-heart text-gray-100 text-6xl mb-6 block"></i>
              <p className="text-gray-400 font-medium">No favorites yet.</p>
              <button onClick={() => setActiveTab('fridge')} className="mt-4 text-emerald-600 font-bold hover:underline">Start scanning to find some!</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {state.favoriteRecipes.map(recipe => (
                <RecipeCard 
                  key={recipe.id} 
                  recipe={recipe} 
                  isFavorite={true}
                  onSelect={(r) => setState(prev => ({ ...prev, selectedRecipe: r }))}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'pantry' && (
        <PantryView 
          ingredients={state.pantryIngredients}
          onAdd={(item) => setState(prev => ({ ...prev, pantryIngredients: [...prev.pantryIngredients, item] }))}
          onRemove={(item) => setState(prev => ({ ...prev, pantryIngredients: prev.pantryIngredients.filter(i => i !== item) }))}
          onClear={() => setState(prev => ({ ...prev, pantryIngredients: [] }))}
        />
      )}

      {activeTab === 'shopping' && (
        <div className="animate-in slide-in-from-right duration-300">
          <ShoppingList 
            items={state.shoppingList} 
            onRemove={(item) => setState(prev => ({ ...prev, shoppingList: prev.shoppingList.filter(i => i !== item) }))} 
            onClear={() => setState(prev => ({ ...prev, shoppingList: [] }))} 
          />
        </div>
      )}

      {state.selectedRecipe && (
        <StepByStepMode 
          recipe={state.selectedRecipe} 
          shoppingList={state.shoppingList}
          onClose={() => setState(prev => ({ ...prev, selectedRecipe: null }))} 
          onAddToShoppingList={handleAddToShoppingList}
        />
      )}
    </Layout>
  );
};

export default App;
