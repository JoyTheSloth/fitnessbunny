"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChefHat, Search, Filter, Ghost, ChevronLeft, ChevronRight, Sparkles, Clock, Flame, Heart, PlayCircle, BrainCircuit, Loader2, Plus, ArrowRight, Utensils } from 'lucide-react';
import { generateRecipesAI } from '../services/aiService';
interface Recipe {
  id: string;
  name: string;
  coreEmojis?: string;
  calories: number;
  time: string;
  category: string;
  image: string;
  tags: string[];
  isFavorite: boolean;
  ingredients: string[];
  instructions: string[];
  macros: {
    carbs: number;
    protein: number;
    fat: number;
    fiber: number;
  };
}

const MOCK_RECIPES: Recipe[] = [
  {
    id: '1',
    name: 'Avocado Zest Toast',
    coreEmojis: '🥑🍞',
    calories: 342,
    time: '10 min',
    category: 'Breakfast',
    image: '/recipes/recipe1.png',
    tags: ['Vegan', 'Quick'],
    isFavorite: true,
    ingredients: ['2 slices Sourdough Bread', '1 ripe Avocado', 'Red Pepper Flakes', 'Lemon Zest', 'Extra Virgin Olive Oil'],
    instructions: [
      'Toast the sourdough bread until golden brown.',
      'Mash the avocado in a small bowl with lemon zest and a pinch of salt.',
      'Spread mashed avocado onto the toast.',
      'Sprinkle with red pepper flakes and a drizzle of olive oil.'
    ],
    macros: { carbs: 32, protein: 8, fat: 22, fiber: 7 }
  },
  {
    id: '2',
    name: 'Honey Glazed Salmon',
    coreEmojis: '🍣🍯',
    calories: 485,
    time: '25 min',
    category: 'Dinner',
    image: '/recipes/recipe3.png',
    tags: ['High Protein', 'Omega-3'],
    isFavorite: false,
    ingredients: ['6oz Salmon Fillet', '1 tbsp Honey', '1 tbsp Soy Sauce', '1 tsp Ginger (grated)', 'Asparagus spears'],
    instructions: [
      'Preheat oven to 400°F (200°C).',
      'Mix honey, soy sauce, and ginger for the glaze.',
      'Place salmon and asparagus on a baking sheet.',
      'Brush salmon with glaze and bake for 12-15 minutes.'
    ],
    macros: { carbs: 12, protein: 42, fat: 28, fiber: 4 }
  },
  {
    id: '3',
    name: 'Rainbow Buddha Bowl',
    coreEmojis: '🥗🌈',
    calories: 320,
    time: '15 min',
    category: 'Lunch',
    image: '/recipes/recipe7.png',
    tags: ['Gluten Free', 'Fresh'],
    isFavorite: true,
    ingredients: ['Quinoa', 'Purple Cabbage', 'Carrots', 'Chickpeas', 'Tahini Dressing'],
    instructions: [
      'Cook quinoa according to package instructions.',
      'Shred cabbage and julienne the carrots.',
      'Assemble bowl with quinoa base and toppings.',
      'Drizzle with tahini dressing.'
    ],
    macros: { carbs: 48, protein: 12, fat: 10, fiber: 14 }
  },
  {
    id: '4',
    name: 'Sweet Potato Wedges',
    calories: 210,
    time: '30 min',
    category: 'Snack',
    image: '/recipes/recipe8.png',
    tags: ['Fiber', 'Low Fat'],
    isFavorite: false,
    ingredients: ['2 medium Sweet Potatoes', '1 tbsp Olive Oil', 'Smoked Paprika', 'Garlic Powder'],
    instructions: [
      'Cut sweet potatoes into wedges.',
      'Toss with olive oil and spices.',
      'Bake at 425°F for 25-30 minutes until crispy.',
      'Flip halfway through cooking.'
    ],
    macros: { carbs: 38, protein: 2, fat: 7, fiber: 6 }
  },
  {
    id: '5',
    name: 'Berry Protein Blast',
    calories: 180,
    time: '5 min',
    category: 'Breakfast',
    image: '/recipes/recipe4.png',
    tags: ['Shake', 'Keto'],
    isFavorite: false,
    ingredients: ['Mixed Berries', 'Vanilla Protein Powder', 'Almond Milk', 'Chia Seeds'],
    instructions: [
      'Combine all ingredients in a high-speed blender.',
      'Blend until smooth.',
      'Adjust milk for desired consistency.',
      'Serve immediately.'
    ],
    macros: { carbs: 18, protein: 24, fat: 4, fiber: 5 }
  },
  {
    id: '6',
    name: 'Mediterranean Quinoa',
    calories: 410,
    time: '20 min',
    category: 'Lunch',
    image: '/recipes/recipe10.png',
    tags: ['Healthy', 'Fiber'],
    isFavorite: false,
    ingredients: ['Quinoa', 'Cucumber', 'Cherry Tomatoes', 'Feta Cheese', 'Olives'],
    instructions: [
      'Cook quinoa and let cool.',
      'Chop cucumber and tomatoes.',
      'Mix with quinoa, feta, and halved olives.',
      'Season with salt, pepper, and lemon juice.'
    ],
    macros: { carbs: 54, protein: 14, fat: 16, fiber: 11 }
  }
];

const CATEGORIES = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack'];

const ALL_TAGS = [
  'Vegan', 'Quick', 'High Protein', 'Gluten Free', 'Fresh', 
  'Fiber', 'Low Fat', 'Keto', 'Healthy'
];

interface MealsScreenProps {
  onOpenPremium?: () => void;
}

export default function MealsScreen({ onOpenPremium }: MealsScreenProps) {
  const [ingredients, setIngredients] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestedRecipes, setSuggestedRecipes] = useState<any[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState(MOCK_RECIPES);

  const handleGenerate = async () => {
    if (!ingredients.trim()) return;
    setIsGenerating(true);
    
    const aiRecipes = await generateRecipesAI(ingredients);
    if (aiRecipes && Array.isArray(aiRecipes)) {
      const formatted = aiRecipes.map((r: any) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: r.title || "AI Recipe",
        coreEmojis: r.coreEmojis || "🥗",
        calories: r.cals || 0,
        time: "15 min",
        category: "AI Crafted",
        image: r.img || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=200",
        tags: ["AI Suggestion"],
        isFavorite: false,
        ingredients: r.ingredients || [],
        instructions: r.instructions || [],
        macros: { 
          carbs: r.macros?.carbs || 0,
          protein: r.macros?.protein || 0,
          fat: r.macros?.fat || 0,
          fiber: r.macros?.fiber || 0
        }
      }));
      setSuggestedRecipes([...formatted, ...suggestedRecipes]);
    }
    setIsGenerating(false);
  };
  


  const filteredRecipes = recipes.filter(recipe => {
    const matchesCategory = activeCategory === 'All' || recipe.category === activeCategory;
    const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags = selectedTags.length === 0 || selectedTags.every(tag => recipe.tags.includes(tag));
    return matchesCategory && matchesSearch && matchesTags;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setRecipes(prev => prev.map(r => r.id === id ? { ...r, isFavorite: !r.isFavorite } : r));
    if (selectedRecipe?.id === id) {
      setSelectedRecipe(prev => prev ? { ...prev, isFavorite: !prev.isFavorite } : null);
    }
  };

  if (selectedRecipe) {
    return (
      <div className="h-full overflow-y-auto bg-white">
        <div className="relative h-[45vh] w-full">
          <img 
            src={selectedRecipe.image} 
            alt={selectedRecipe.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent"></div>
          
          <button 
            onClick={() => setSelectedRecipe(null)}
            className="absolute top-10 left-6 w-10 h-10 rounded-full bg-white/60 backdrop-blur-md flex items-center justify-center text-[#3a4746] hover:bg-white transition-colors active:scale-95"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button 
            onClick={(e) => toggleFavorite(e, selectedRecipe.id)}
            className="absolute top-10 right-6 w-10 h-10 rounded-full bg-white/60 backdrop-blur-md flex items-center justify-center transition-transform hover:scale-110 active:scale-90"
          >
            <Heart className={`w-5 h-5 ${selectedRecipe.isFavorite ? 'text-red-500 fill-current' : 'text-zinc-600'}`} />
          </button>
        </div>

        <div className="px-6 py-8 -mt-12 bg-white rounded-t-[3rem] relative z-10 space-y-8 pb-32">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-black text-[#3a4746] tracking-tight">{selectedRecipe.name}</h1>
            </div>
            
            <div className="flex gap-4">
              <div className="flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-2xl border border-primary/10">
                <Flame className="w-5 h-5 text-primary" />
                <span className="text-sm font-black text-[#3a4746]">{selectedRecipe.calories} kcal</span>
              </div>
              <div className="flex items-center gap-2 bg-zinc-50 px-4 py-2 rounded-2xl border border-zinc-100">
                <Clock className="w-5 h-5 text-zinc-400" />
                <span className="text-sm font-black text-[#89979b]">{selectedRecipe.time}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            <div className="bg-[#fffbeb] p-3 rounded-[1.5rem] text-center border border-[#fef3c7]">
              <span className="block text-[8px] font-extrabold text-[#d97706] uppercase tracking-[0.1em] mb-0.5">Carbs</span>
              <span className="text-sm font-black text-[#3a4746]">{selectedRecipe.macros.carbs}g</span>
            </div>
            <div className="bg-[#eff6ff] p-3 rounded-[1.5rem] text-center border border-[#dbeafe]">
              <span className="block text-[8px] font-extrabold text-[#2563eb] uppercase tracking-[0.1em] mb-0.5">Protein</span>
              <span className="text-sm font-black text-[#3a4746]">{selectedRecipe.macros.protein}g</span>
            </div>
            <div className="bg-[#fff7ed] p-3 rounded-[1.5rem] text-center border border-[#ffedd5]">
              <span className="block text-[8px] font-extrabold text-[#ea580c] uppercase tracking-[0.1em] mb-0.5">Fat</span>
              <span className="text-sm font-black text-[#3a4746]">{selectedRecipe.macros.fat}g</span>
            </div>
            <div className="bg-[#f0fdf4] p-3 rounded-[1.5rem] text-center border border-[#dcfce7]">
              <span className="block text-[8px] font-extrabold text-[#16a34a] uppercase tracking-[0.1em] mb-0.5">Fiber</span>
              <span className="text-sm font-black text-[#3a4746]">{selectedRecipe.macros.fiber}g</span>
            </div>
          </div>



          <div className="space-y-4">
            <h2 className="text-xl font-black text-[#3a4746] tracking-tight flex items-center gap-2">
              <span className="w-1.5 h-6 bg-primary rounded-full"></span>
              Ingredients
            </h2>
            <div className="space-y-2">
              {selectedRecipe.ingredients.map((ing, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-[#f8fafb] rounded-2xl border border-[#e2e8e9]">
                  <div className="w-2 h-2 rounded-full bg-primary/40"></div>
                  <span className="text-sm font-bold text-[#3a4746]">{ing}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-black text-[#3a4746] tracking-tight flex items-center gap-2">
              <span className="w-1.5 h-6 bg-primary rounded-full"></span>
              Instructions
            </h2>
            <div className="space-y-6">
              {selectedRecipe.instructions.map((step, i) => (
                <div key={i} className="flex gap-4">
                  <span className="w-8 h-8 shrink-0 rounded-full bg-primary text-white flex items-center justify-center font-black text-xs shadow-lg shadow-primary/20">
                    {i + 1}
                  </span>
                  <p className="text-sm font-bold text-[#596664] leading-relaxed pt-1.5">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full relative overflow-hidden">
      {/* Recipe Sanctuary Background */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-100" 
        style={{ backgroundImage: "url('/11.png')" }}
      />
      
      {/* Soft Overlay */}
      <div className="absolute inset-0 z-10 bg-black/5 backdrop-blur-[1px]" />

      <div className="relative z-20 h-full overflow-y-auto pt-8 pb-32">
      <header className="w-full z-40 bg-transparent mb-3 px-4 shadow-none">
        <div className="flex items-center justify-center gap-6 relative max-w-2xl mx-auto">
          <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/50 text-[#3a4746] transition-colors"><ChevronLeft className="w-5 h-5" /></button>
          <h1 className="text-lg font-black text-[#3a4746] tracking-tight">Recipes</h1>
          <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/50 text-[#b9c3c1] transition-colors"><ChevronRight className="w-5 h-5" /></button>
          
          <button onClick={onOpenPremium} className="absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-r from-[#ffa024] to-[#f55938] text-white text-[10px] uppercase font-extrabold px-3 py-1.5 rounded-full shadow-[0_4px_10px_rgba(255,160,36,0.3)] hover:-translate-y-[calc(50%+1px)] transition-transform flex items-center gap-1 active:scale-95">
            <Sparkles className="w-3 h-3" fill="currentColor" /> Premium
          </button>
        </div>
      </header>

      <main className="px-6 max-w-2xl mx-auto space-y-8">
        <div className="space-y-4 pt-8">
          <div className="flex gap-3">
              <div className="flex-1 bg-white border border-white/80 shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex items-center px-5 py-3 rounded-[1.5rem] gap-3 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                  <Search className="w-5 h-5 text-zinc-400" />
                  <input 
                    type="text" 
                    placeholder="Search recipes..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 w-full text-base font-bold outline-none text-[#3a4746] placeholder:text-zinc-400" 
                  />
              </div>
              <button className="bg-white border border-white/80 p-4 rounded-[1.5rem] shadow-[0_4px_24px_rgba(0,0,0,0.03)] text-[#3a4746] hover:text-primary hover:bg-white transition-colors">
                  <Filter className="w-5 h-5" />
              </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2.5 rounded-full text-xs font-extrabold transition-all whitespace-nowrap shadow-sm border ${
                  activeCategory === category 
                  ? 'bg-primary text-white border-primary shadow-primary/20 scale-105' 
                  : 'bg-white text-zinc-400 border-white/80 hover:border-primary/30 hover:text-[#3a4746]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-6 px-6 pt-1">
            <div className="flex gap-2 min-w-max">
              {ALL_TAGS.map(tag => {
                const isActive = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-all border whitespace-nowrap ${
                      isActive 
                      ? 'bg-[#ffa024] text-white border-[#ffa024] shadow-[0_4px_12px_rgba(255,160,36,0.3)]' 
                      : 'bg-white text-zinc-400 border-white/80 hover:border-[#ffa024]/40 hover:text-[#ffa024]'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
              {selectedTags.length > 0 && (
                <button 
                  onClick={() => setSelectedTags([])}
                  className="px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider bg-[#eff3f4] text-[#89979b] hover:text-[#3a4746] transition-colors whitespace-nowrap mr-6"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>

        {/* AI Recipe Creator Section - Now as the First Card after filters */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-[#f7fff9] rounded-[2.5rem] p-7 shadow-[0_8px_30px_rgba(141,225,92,0.1)] border border-white space-y-5"
        >
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-[#8de15c]/10 rounded-2xl flex items-center justify-center text-[#8de15c]"><Utensils className="w-5 h-5" /></div>
             <div>
               <h3 className="font-black text-[#3a4746] text-lg leading-tight">Recipe Creator</h3>
               <p className="text-[10px] font-extrabold text-[#89979b] uppercase tracking-widest">AI Culinary Assistant</p>
             </div>
          </div>
          
          <div className="space-y-3">
            <textarea 
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="List your ingredients... (e.g. egg, bread, butter)"
              className="w-full h-24 bg-white border border-[#e2e8e9] rounded-2xl p-4 text-sm font-bold text-[#3a4746] placeholder-[#b9c3c1] resize-none outline-none focus:ring-2 focus:ring-[#8de15c]/20 transition-all"
            />
            
            <motion.button 
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-[#8de15c] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-[#8de15c]/20 flex items-center justify-center gap-3 hover:brightness-105 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Chef is searching...</span>
                </>
              ) : (
                <>
                  <BrainCircuit className="w-4 h-4" />
                  <span>Generate AI Recipe</span>
                </>
              )}
            </motion.button>
          </div>

          <AnimatePresence>
            {suggestedRecipes.length > 0 && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="pt-4 border-t border-gray-50 flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
              >
                {suggestedRecipes.map((r, i) => (
                  <motion.div 
                    key={r.id}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => setSelectedRecipe(r as Recipe)}
                    className="flex-shrink-0 w-48 bg-[#f8fafb] p-3 rounded-2xl border border-[#e2e8e9] group cursor-pointer"
                  >
                    <div className="h-24 rounded-xl overflow-hidden mb-2 relative">
                       <img src={r.image} alt={r.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                       <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-md text-[8px] font-black text-[#8de15c]">AI CHOICE</div>
                       {r.coreEmojis && (
                         <div className="absolute top-2 left-2 bg-black/20 backdrop-blur-md px-2 py-1 rounded-lg text-xs shadow-lg">
                            {r.coreEmojis}
                         </div>
                       )}
                    </div>
                    <h4 className="font-extrabold text-[#3a4746] text-xs leading-tight mb-1 truncate">{r.name}</h4>
                    <div className="flex justify-between items-center">
                       <span className="text-[9px] font-black text-[#89979b]">{r.calories} kcal</span>
                       <Plus className="w-3.5 h-3.5 text-[#8de15c]" />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredRecipes.length > 0 ? (
              filteredRecipes.map((recipe, idx) => (
                <motion.div
                  key={recipe.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setSelectedRecipe(recipe)}
                  className="bg-white rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white/80 group hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all cursor-pointer"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img src={recipe.image} alt={recipe.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    {recipe.coreEmojis && (
                      <div className="absolute top-4 left-4 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-xl text-lg shadow-xl z-20">
                         {recipe.coreEmojis}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <button className="bg-white shadow-lg text-primary rounded-full px-4 py-2 text-[10px] font-extrabold flex items-center gap-1 hover:scale-105 active:scale-95 transition-transform">
                        <PlayCircle className="w-3 h-3" /> View Recipe
                      </button>
                    </div>
                    <button 
                      onClick={(e) => toggleFavorite(e, recipe.id)}
                      className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center transition-transform hover:scale-110 active:scale-90"
                    >
                      <Heart className={`w-5 h-5 transition-colors ${recipe.isFavorite ? 'text-red-500 fill-current' : 'text-zinc-400'}`} />
                    </button>
                    <div className="absolute bottom-4 left-4 flex gap-1">
                      {recipe.tags.map(tag => (
                        <span key={tag} className="bg-white/90 backdrop-blur-sm text-[#3a4746] text-[9px] font-extrabold px-2 py-1 rounded-lg shadow-sm border border-white/50">{tag}</span>
                      ))}
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="font-extrabold text-[#3a4746] text-lg leading-tight group-hover:text-primary transition-colors">{recipe.name}</h3>
                    </div>
                    
                    <div className="flex items-center gap-4 text-zinc-400 text-[10px] font-bold uppercase tracking-widest">
                      <div className="flex items-center gap-1.5 bg-zinc-50 px-2 py-1 rounded-md">
                        <Flame className="w-3.5 h-3.5 text-primary" />
                        <span>{recipe.calories} kcal</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-zinc-50 px-2 py-1 rounded-md">
                        <Clock className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{recipe.time}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full h-64 flex flex-col items-center justify-center text-center space-y-4 opacity-70"
              >
                <div className="w-24 h-24 bg-white/50 backdrop-blur-md rounded-full border border-white/60 shadow-sm flex items-center justify-center">
                    <Ghost className="w-10 h-10 text-on-surface-variant" fill="currentColor" opacity={0.2} />
                </div>
                <div>
                    <p className="font-extrabold text-on-surface text-xl">No recipes found</p>
                    <p className="text-sm text-on-surface-variant mt-2 font-bold max-w-[200px]">Try searching for something else or change categories.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  </div>
);
}

