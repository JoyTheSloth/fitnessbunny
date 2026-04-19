"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Send, Sparkles, BrainCircuit, MessageCircle, 
  TrendingUp, TrendingDown, Info, Apple, Utensils
} from 'lucide-react';
import { useUser } from '../context/UserContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIAssistant({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { profile, biometrics, dynamicTargets, meals, exercises, goal } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Initial greeting with a summary if opened for the first time
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const todayMeals = meals.length;
      setMessages([{
        role: 'assistant',
        content: `Hi ${profile.name}! I'm Bunny, your AI nutrition coach. You've logged ${todayMeals} meals today. How can I help you reach your ${goal} goal?`
      }]);
    }
  }, [isOpen]);

  const handleSend = async (overrideText?: string) => {
    const textToSend = typeof overrideText === 'string' ? overrideText : input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg = textToSend.trim();
    if (typeof overrideText !== 'string') {
      setInput("");
    }
    
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      // Prepare context for Groq
      const context = {
        user: { ...profile, ...biometrics, goal },
        targets: dynamicTargets,
        today_meals: meals,
        today_exercises: exercises,
        current_totals: {
           calories: meals.reduce((sum, m) => sum + m.calories, 0),
           carbs: meals.reduce((sum, m) => sum + (m.carbs || 0), 0),
           protein: meals.reduce((sum, m) => sum + (m.protein || 0), 0),
           fat: meals.reduce((sum, m) => sum + (m.fat || 0), 0)
        }
      };

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY || process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: `You are Bunny, a high-end AI nutrition coach for the Fitness Bunny app.
              CONTEXT: ${JSON.stringify(context)}
              
              PERSONALITY & TONE:
              1. Friendly, encouraging, and never preachy. Use light humor (e.g., "That burger had ambitions 🍔").
              2. Precise with numbers: Never round aggressively (e.g., use 248 kcal, not "about 250").
              3. Celebrate streaks and milestones genuinely.
              4. If unsure about a food item, say so honestly and give a range.
              5. Tone: Professional yet casual and witty.

              RULES & SAFETY:
              1. Always remember today's logs. If asked "totals" or "remaining", calculate exactly.
              2. Weekly Planning: Generate 7-day meal plans within calorie/macro targets. Optimize for minimal food waste by reusing ingredients.
              3. Grocery List: Auto-generate categorized lists (Produce, Protein, Grains, etc.).
              4. Region-Aware Costs: Estimate grocery costs using local currency (INR for India, USD for US).
              5. Seasonal/Local: Flag seasonal produce for freshness and cost-savings.
              6. Exercise: Calculate burn using MET values (MET × weight_kg × duration_hrs).
              7. Coaching: Distinguish Cardio vs Strength. Suggest post-workout protein within 30-45 mins.
              8. Warning: If goal is fat loss, warn against 'eating back' all exercise calories.
              9. Recipe Analysis: If a user describes a recipe, parse all ingredients. Calculate total and per-serving macros.
              10. Swaps & Flags: Identify high-calorie items and suggest healthier swaps.
              11. Format: Output clear 'Nutrition Label Cards' for recipes/meals.
              12. Suggestions: Fit remaining cals, respect protein needs, include Indian regional options.
              13. Safety: No medical diagnosis. Redirect clinical queries. No <1200/1500 kcal per day.
              14. Empathy: Respond with empathy to disordered eating.
              15. Clarify that visual estimates are approximations.

              EXAMPLES:
              - User: "I just finished a 30 min run"
              - Bunny: "Great work! You burned ~280 kcal (MET 9.8). Your net budget is now higher, but remember not to eat it all back if we're focused on that loss! Try a protein shake or some Greek yogurt now to help those muscles recover. 🏃‍♂️"
              - User: "Generate a meal plan for next week in India"
              - Bunny: "Here's a waste-optimized plan for you! I've reused Spinach and Chicken across multiple days to save you money and time. 🥘 [Full Plan follows with Grocery List in INR]"
              - User: "I had 3 cups of chai today"
              - Bunny: "Noted! Logging 3 cups of chai with milk and sugar (~210 kcal total). Want me to adjust if you use less sugar? ☕"`
            },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: "user", content: userMsg }
          ],
          temperature: 0.7,
        })
      });

      const data = await response.json();
      const aiContent = data.choices[0].message.content;
      setMessages(prev => [...prev, { role: 'assistant', content: aiContent }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting to my brain. Please try again in a moment! 🥕" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 h-[85vh] bg-[#eff3f4] rounded-t-[3rem] shadow-2xl z-[101] flex flex-col overflow-hidden border-t-4 border-white"
          >
            {/* Header */}
            <header className="p-6 pb-4 flex items-center justify-between border-b border-white/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg">
                  <BrainCircuit className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-[#3a4746]">Bunny Coach</h2>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#8de15c] animate-pulse" />
                    <span className="text-[10px] uppercase font-black text-[#89979b] tracking-wider">Online & Analyzing</span>
                  </div>
                </div>
              </div>
              <button onClick={onClose} className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#3a4746] shadow-sm hover:bg-gray-50"><X className="w-6 h-6" /></button>
            </header>

            {/* Chat Body */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((m, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i} 
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-4 rounded-[2rem] text-sm font-bold leading-relaxed shadow-sm ${
                    m.role === 'user' 
                    ? 'bg-primary text-white rounded-tr-none' 
                    : 'bg-white text-[#3a4746] rounded-tl-none border border-white'
                  }`}>
                    {m.content}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-4 rounded-[2rem] rounded-tl-none shadow-sm flex gap-2 items-center">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span className="text-xs font-bold text-[#89979b]">Thinking...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="px-6 pb-2 overflow-x-auto no-scrollbar flex gap-2">
               {[
                 { label: "Remaining?", icon: TrendingUp },
                 { label: "What should I eat?", icon: Utensils },
                 { label: "Analyze my week", icon: Sparkles }
               ].map((action, i) => (
                 <button 
                   key={i}
                   onClick={() => handleSend(action.label)}
                   className="whitespace-nowrap px-4 py-2 bg-white/60 backdrop-blur-md border border-white rounded-full text-[11px] font-black text-[#3a4746] flex items-center gap-1.5 hover:bg-white shadow-sm transition-all shadow-primary/5"
                 >
                   <action.icon className="w-3.5 h-3.5 text-primary" />
                   {action.label}
                 </button>
               ))}
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white/50 backdrop-blur-xl border-t border-white pointer-events-auto">
              <div className="relative flex items-center gap-3">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask Bunny anything..."
                  className="w-full h-14 bg-white rounded-2xl px-6 pr-14 text-sm font-bold text-[#3a4746] shadow-inner border border-[#e2e8e9] focus:ring-2 focus:ring-primary/20 outline-none"
                />
                <button 
                  onClick={() => handleSend()}
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Loader2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2v4" />
      <path d="m16.2 7.8 2.9-2.9" />
      <path d="M18 12h4" />
      <path d="m16.2 16.2 2.9 2.9" />
      <path d="M12 18v4" />
      <path d="m4.9 19.1 2.9-2.9" />
      <path d="M2 12h4" />
      <path d="m4.9 4.9 2.9 2.9" />
    </svg>
  )
}
