"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChefHat, Search, Filter, Ghost, ChevronLeft, ChevronRight, Sparkles, Clock, Flame, Heart, PlayCircle, BrainCircuit, Loader2 } from 'lucide-react';
interface Recipe {
  id: string;
  name: string;
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
  };
}

const MOCK_RECIPES: Recipe[] = [
  {
    id: '1',
    name: 'Avocado Zest Toast',
    calories: 342,
    time: '10 min',
    category: 'Breakfast',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=2080&auto=format&fit=crop',
    tags: ['Vegan', 'Quick'],
    isFavorite: true,
    ingredients: ['2 slices Sourdough Bread', '1 ripe Avocado', 'Red Pepper Flakes', 'Lemon Zest', 'Extra Virgin Olive Oil'],
    instructions: [
      'Toast the sourdough bread until golden brown.',
      'Mash the avocado in a small bowl with lemon zest and a pinch of salt.',
      'Spread mashed avocado onto the toast.',
      'Sprinkle with red pepper flakes and a drizzle of olive oil.'
    ],
    macros: { carbs: 32, protein: 8, fat: 22 }
  },
  {
    id: '2',
    name: 'Honey Glazed Salmon',
    calories: 485,
    time: '25 min',
    category: 'Dinner',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=2074&auto=format&fit=crop',
    tags: ['High Protein', 'Omega-3'],
    isFavorite: false,
    ingredients: ['6oz Salmon Fillet', '1 tbsp Honey', '1 tbsp Soy Sauce', '1 tsp Ginger (grated)', 'Asparagus spears'],
    instructions: [
      'Preheat oven to 400°F (200°C).',
      'Mix honey, soy sauce, and ginger for the glaze.',
      'Place salmon and asparagus on a baking sheet.',
      'Brush salmon with glaze and bake for 12-15 minutes.'
    ],
    macros: { carbs: 12, protein: 42, fat: 28 }
  },
  {
    id: '3',
    name: 'Rainbow Buddha Bowl',
    calories: 320,
    time: '15 min',
    category: 'Lunch',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop',
    tags: ['Gluten Free', 'Fresh'],
    isFavorite: true,
    ingredients: ['Quinoa', 'Purple Cabbage', 'Carrots', 'Chickpeas', 'Tahini Dressing'],
    instructions: [
      'Cook quinoa according to package instructions.',
      'Shred cabbage and julienne the carrots.',
      'Assemble bowl with quinoa base and toppings.',
      'Drizzle with tahini dressing.'
    ],
    macros: { carbs: 48, protein: 12, fat: 10 }
  },
  {
    id: '4',
    name: 'Sweet Potato Wedges',
    calories: 210,
    time: '30 min',
    category: 'Snack',
    image: 'https://images.unsplash.com/photo-1596097635121-14b63b7a0c19?q=80&w=2070&auto=format&fit=crop',
    tags: ['Fiber', 'Low Fat'],
    isFavorite: false,
    ingredients: ['2 medium Sweet Potatoes', '1 tbsp Olive Oil', 'Smoked Paprika', 'Garlic Powder'],
    instructions: [
      'Cut sweet potatoes into wedges.',
      'Toss with olive oil and spices.',
      'Bake at 425°F for 25-30 minutes until crispy.',
      'Flip halfway through cooking.'
    ],
    macros: { carbs: 38, protein: 2, fat: 7 }
  },
  {
    id: '5',
    name: 'Berry Protein Blast',
    calories: 180,
    time: '5 min',
    category: 'Breakfast',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?q=80&w=1965&auto=format&fit=crop',
    tags: ['Shake', 'Keto'],
    isFavorite: false,
    ingredients: ['Mixed Berries', 'Vanilla Protein Powder', 'Almond Milk', 'Chia Seeds'],
    instructions: [
      'Combine all ingredients in a high-speed blender.',
      'Blend until smooth.',
      'Adjust milk for desired consistency.',
      'Serve immediately.'
    ],
    macros: { carbs: 18, protein: 24, fat: 4 }
  },
  {
    id: '6',
    name: 'Mediterranean Quinoa',
    calories: 410,
    time: '20 min',
    category: 'Lunch',
    image: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?q=80&w=2070&auto=format&fit=crop',
    tags: ['Healthy', 'Fiber'],
    isFavorite: false,
    ingredients: ['Quinoa', 'Cucumber', 'Cherry Tomatoes', 'Feta Cheese', 'Olives'],
    instructions: [
      'Cook quinoa and let cool.',
      'Chop cucumber and tomatoes.',
      'Mix with quinoa, feta, and halved olives.',
      'Season with salt, pepper, and lemon juice.'
    ],
    macros: { carbs: 54, protein: 14, fat: 16 }
  }
];

const CATEGORIES = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack'];

const ALL_TAGS = [
  'Vegan', 'Quick', 'High Protein', 'Gluten Free', 'Fresh', 
  'Fiber', 'Low Fat', 'Keto', 'Healthy'
];

export default function MealsScreen({ onOpenPremium }: { onOpenPremium?: () => void }) {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState(MOCK_RECIPES);
  


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

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[#fffbeb] p-4 rounded-[2rem] text-center border border-[#fef3c7]">
              <span className="block text-[10px] font-extrabold text-[#d97706] uppercase tracking-[0.15em] mb-1">Carbs</span>
              <span className="text-lg font-black text-[#3a4746]">{selectedRecipe.macros.carbs}g</span>
            </div>
            <div className="bg-[#eff6ff] p-4 rounded-[2rem] text-center border border-[#dbeafe]">
              <span className="block text-[10px] font-extrabold text-[#2563eb] uppercase tracking-[0.15em] mb-1">Protein</span>
              <span className="text-lg font-black text-[#3a4746]">{selectedRecipe.macros.protein}g</span>
            </div>
            <div className="bg-[#fff7ed] p-4 rounded-[2rem] text-center border border-[#ffedd5]">
              <span className="block text-[10px] font-extrabold text-[#ea580c] uppercase tracking-[0.15em] mb-1">Fat</span>
              <span className="text-lg font-black text-[#3a4746]">{selectedRecipe.macros.fat}g</span>
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
    <div className="h-full overflow-y-auto">
      <header className="fixed top-0 left-0 w-full z-40 bg-[#eff3f4]/80 backdrop-blur-md pt-8 pb-3 px-4 shadow-none">
        <div className="flex items-center justify-center gap-4 relative max-w-2xl mx-auto">
          <ChevronLeft className="w-5 h-5 text-[#3a4746]" />
          <h1 className="text-xl font-bold text-[#3a4746]">Library</h1>
          <ChevronRight className="w-5 h-5 text-[#b9c3c1]" />
          
          <button onClick={onOpenPremium} className="absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-r from-[#ffa024] to-[#f55938] text-white text-[10px] uppercase font-extrabold px-3 py-1.5 rounded-full shadow-[0_4px_10px_rgba(255,160,36,0.3)] hover:-translate-y-[calc(50%+1px)] transition-transform flex items-center gap-1 active:scale-95">
            <Sparkles className="w-3 h-3" fill="currentColor" /> Premium
          </button>
        </div>
      </header>

      <main className="pt-24 px-6 max-w-2xl mx-auto space-y-6 pb-32">
        <div className="space-y-4">
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
  );
}

