"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Utensils, Loader2, CheckCircle2, Wand2, Sparkles, MessageSquare } from 'lucide-react';
import { useUser } from '../context/UserContext';

interface AddScreenProps {
  initialCategory?: string;
  onBack: () => void;
  onScanClick: () => void;
}

export default function AddScreen({ initialCategory = 'Breakfast', onBack, onScanClick }: AddScreenProps) {
  const { addMeal } = useUser();
  const [activeTab, setActiveTab] = useState(initialCategory);
  
  // AI Parsing State
  const [aiInput, setAiInput] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [parseSuccess, setParseSuccess] = useState(false);
  const [aiFollowUp, setAiFollowUp] = useState<string | null>(null);

  // Form State
  const [mealForm, setMealForm] = useState({
    name: '',
    calories: '',
    carbs: '',
    protein: '',
    fat: '',
    ingredients: ''
  });

  const handleAiParse = async () => {
    if (!aiInput.trim()) return;
    setIsParsing(true);
    setAiFollowUp(null);
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{
            role: "system",
            content: `Analyze the meal description. Return ONLY JSON: { "name": string, "calories": number, "carbs": number, "protein": number, "fat": number, "ingredients": string, "follow_up": string | null }`
          }, {
            role: "user",
            content: aiInput
          }],
          temperature: 0,
          response_format: { type: "json_object" }
        })
      });
      const data = await response.json();
      const parsed = JSON.parse(data.choices[0].message.content);
      
      setMealForm({
        name: parsed.name || '',
        calories: parsed.calories?.toString() || '',
        carbs: parsed.carbs?.toString() || '',
        protein: parsed.protein?.toString() || '',
        fat: parsed.fat?.toString() || '',
        ingredients: parsed.ingredients || ''
      });
      
      if (parsed.follow_up) setAiFollowUp(parsed.follow_up);
      setParseSuccess(true);
      setTimeout(() => setParseSuccess(false), 2000);
    } catch (error) {
       console.error(error);
    } finally {
      setIsParsing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealForm.name || !mealForm.calories) return;
    
    addMeal({
      name: mealForm.name,
      calories: parseInt(mealForm.calories),
      carbs: parseInt(mealForm.carbs || '0'),
      protein: parseInt(mealForm.protein || '0'),
      fat: parseInt(mealForm.fat || '0'),
      type: activeTab as any,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    onBack();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onBack}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
      />
      
      {/* Dialog Box */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="p-5 flex items-center justify-between border-b border-gray-50/50">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-[#e8f8e1] rounded-xl flex items-center justify-center text-[#8de15c] shadow-sm">
               <Utensils className="w-5 h-5" />
             </div>
             <h2 className="text-xl font-black text-[#3a4746]">Add to {activeTab}</h2>
          </div>
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center text-gray-300 hover:text-gray-500 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[70vh] custom-scrollbar">
          {/* AI Quick Input */}
          <div className="bg-[#f8fafb] rounded-2xl p-4 border border-gray-100/30">
            <div className="flex items-center justify-between mb-2 px-1">
               <div className="flex items-center gap-2">
                 <Sparkles className="w-3.5 h-3.5 text-[#8de15c]" fill="currentColor" />
                 <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">AI Quick Log</span>
               </div>
               {aiFollowUp && <span className="text-[9px] font-bold text-[#8de15c] italic">{aiFollowUp}</span>}
            </div>
            <div className="relative">
              <input 
                type="text"
                placeholder="Ex: 2 boiled eggs and oats..."
                className="w-full bg-white border border-gray-100 rounded-xl p-3 pr-12 text-sm font-bold focus:ring-2 focus:ring-[#8de15c]/10 outline-none"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
              />
              <button 
                type="button"
                onClick={handleAiParse}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#8de15c] text-white rounded-lg flex items-center justify-center shadow-lg"
              >
                {isParsing ? <Loader2 className="w-4 h-4 animate-spin" /> : (parseSuccess ? <CheckCircle2 className="w-4 h-4" /> : <Wand2 className="w-4 h-4" />)}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
               <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Meal Name</label>
               <input 
                 type="text" placeholder="e.g. Avocado Toast" 
                 value={mealForm.name}
                 onChange={e => setMealForm({...mealForm, name: e.target.value})}
                 className="w-full bg-[#f8fafb] border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-[#8de15c]/30" 
               />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Calories</label>
                  <input 
                    type="number" placeholder="kcal" 
                    value={mealForm.calories}
                    onChange={e => setMealForm({...mealForm, calories: e.target.value})}
                    className="w-full bg-[#f8fafb] border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-[#8de15c]/30" 
                  />
               </div>
               <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Carbs (g)</label>
                  <input 
                    type="number" placeholder="g" 
                    value={mealForm.carbs}
                    onChange={e => setMealForm({...mealForm, carbs: e.target.value})}
                    className="w-full bg-[#f8fafb] border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-[#8de15c]/30" 
                  />
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Protein (g)</label>
                  <input 
                    type="number" placeholder="g" 
                    value={mealForm.protein}
                    onChange={e => setMealForm({...mealForm, protein: e.target.value})}
                    className="w-full bg-[#f8fafb] border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-[#8de15c]/30" 
                  />
               </div>
               <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Fat (g)</label>
                  <input 
                    type="number" placeholder="g" 
                    value={mealForm.fat}
                    onChange={e => setMealForm({...mealForm, fat: e.target.value})}
                    className="w-full bg-[#f8fafb] border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-[#8de15c]/30" 
                  />
               </div>
            </div>

            <div className="space-y-1.5">
               <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Ingredients (Optional)</label>
               <textarea 
                 placeholder="e.g. Avocado, Bread, Salt" 
                 rows={1}
                 value={mealForm.ingredients}
                 onChange={e => setMealForm({...mealForm, ingredients: e.target.value})}
                 className="w-full bg-[#f8fafb] border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-[#8de15c]/30 resize-none" 
               />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#8de15c] py-4 rounded-2xl text-white font-black text-lg shadow-lg shadow-[#8de15c]/10 hover:brightness-105 active:scale-[0.98] transition-all mt-2"
          >
            Save {activeTab}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
