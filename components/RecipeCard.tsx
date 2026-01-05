
import React from 'react';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  isFavorite: boolean;
  onSelect: (recipe: Recipe) => void;
  onToggleFavorite: (e: React.MouseEvent, recipe: Recipe) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, isFavorite, onSelect, onToggleFavorite }) => {
  const difficultyColors = {
    Easy: 'bg-green-100 text-green-700',
    Medium: 'bg-orange-100 text-orange-700',
    Hard: 'bg-red-100 text-red-700'
  };

  return (
    <div 
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all cursor-pointer flex flex-col h-full group relative"
      onClick={() => onSelect(recipe)}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={recipe.image} 
          alt={recipe.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <button 
            onClick={(e) => onToggleFavorite(e, recipe)}
            className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${isFavorite ? 'bg-rose-500 text-white' : 'bg-white/80 text-gray-400 hover:text-rose-500'}`}
          >
            <i className={`fa-${isFavorite ? 'solid' : 'regular'} fa-heart`}></i>
          </button>
        </div>
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${difficultyColors[recipe.difficulty]}`}>
            {recipe.difficulty}
          </span>
          <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
            {recipe.calories} kcal
          </span>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold mb-2 group-hover:text-emerald-600 transition-colors">{recipe.title}</h3>
        
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1.5">
            <i className="fa-regular fa-clock"></i>
            {recipe.prepTime}
          </div>
          <div className="flex items-center gap-1.5">
            <i className="fa-solid fa-list-check"></i>
            {recipe.ingredients.length} ingredients
          </div>
        </div>

        <div className="mt-auto pt-4 flex flex-wrap gap-2">
          {recipe.dietaryTags.slice(0, 3).map(tag => (
            <span key={tag} className="text-[10px] uppercase font-bold text-gray-400 border border-gray-200 px-2 py-0.5 rounded">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
