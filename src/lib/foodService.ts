import { supabase } from './supabaseClient';

export interface Nutrition {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
}

export interface FoodItem {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  brand: string | null;
  is_branded: boolean;
  state: string;
  quantity: {
    unit: string;
    value: number;
    grams: number;
  };
  nutrition: Nutrition;
}

export const searchFood = async (query: string): Promise<FoodItem[]> => {
  if (!query) return [];
  
  const { data, error } = await supabase
    .from('foods')
    .select('*')
    .textSearch('fts', query, {
      type: 'websearch',
      config: 'english'
    })
    .limit(20);

  if (error) {
    console.error('Error searching food:', error);
    return [];
  }

  return data as FoodItem[];
};

export const getFoodById = async (foodId: string): Promise<FoodItem | null> => {
  const { data, error } = await supabase
    .from('foods')
    .select('*')
    .eq('id', foodId)
    .single();

  if (error) {
    console.error('Error fetching food by ID:', error);
    return null;
  }

  return data as FoodItem;
};

export const calculateNutrition = (food: FoodItem, customGrams?: number): Nutrition => {
  if (!customGrams) return food.nutrition;

  const ratio = customGrams / food.quantity.grams;
  return {
    calories: Math.round(food.nutrition.calories * ratio),
    protein: Number((food.nutrition.protein * ratio).toFixed(1)),
    carbs: Number((food.nutrition.carbs * ratio).toFixed(1)),
    fats: Number((food.nutrition.fats * ratio).toFixed(1)),
    fiber: Number((food.nutrition.fiber * ratio).toFixed(1)),
  };
};

export const getAllFoods = async (): Promise<FoodItem[]> => {
  const { data, error } = await supabase
    .from('foods')
    .select('*')
    .limit(100);
    
  if (error) {
    console.error('Error fetching all foods:', error);
    return [];
  }
  
  return data as FoodItem[];
};
