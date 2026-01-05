
export interface Ingredient {
  name: string;
  quantity?: string;
  isMissing?: boolean;
  substitutions?: string[]; // New: list of potential alternatives
}

export interface RecipeStep {
  text: string;
  audioData?: string;
}

export interface Recipe {
  id: string;
  title: string;
  image: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  prepTime: string;
  calories: number;
  ingredients: Ingredient[];
  steps: string[];
  dietaryTags: string[];
}

export type DietaryRestriction = 'None' | 'Vegetarian' | 'Vegan' | 'Keto' | 'Gluten-Free' | 'Paleo';

export type AppTab = 'fridge' | 'favorites' | 'pantry' | 'shopping';

export interface AppState {
  scannedIngredients: string[];
  pantryIngredients: string[]; // New: manually added items
  recipes: Recipe[];
  favoriteRecipes: Recipe[]; // New: saved recipes
  shoppingList: string[];
  filter: DietaryRestriction;
  isScanning: boolean;
  selectedRecipe: Recipe | null;
}
