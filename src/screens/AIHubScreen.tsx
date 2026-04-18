"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mic, Camera, Sparkles, ChevronRight } from 'lucide-react';

interface AIHubScreenProps {
  onNavigateToScan: () => void;
  onNavigateToAdd: (category: string) => void;
}

export default function AIHubScreen({ onNavigateToScan, onNavigateToAdd }: AIHubScreenProps) {
  const [input, setInput] = useState("");
  const [greeting, setGreeting] = useState("Good afternoon");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  const suggestions = [
    { text: "2 eggs", icon: "🍳" },
    { text: "Chicken 100g", icon: "🍗" },
    { text: "Greek Yogurt", icon: "🥛" }
  ];

  return (
    <div className="h-full bg-gradient-to-b from-[#f0f9f1] to-white px-6 pt-20 flex flex-col items-center overflow-y-auto">
      {/* Bunny Icon/Logo */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-24 h-24 bg-[#8de15c] rounded-[2.2rem] border-[4px] border-white flex items-center justify-center mb-6 shadow-2xl shadow-[#8de15c]/20"
      >
        <div className="text-white font-black text-center text-xs leading-tight tracking-tight">
          FITNESS<br/>BUNNY
        </div>
      </motion.div>

      {/* Greeting */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-center mb-10 max-w-[280px]"
      >
        <h1 className="text-4xl font-black text-[#3a4746] mb-2 tracking-tight">{greeting}!</h1>
        <p className="text-[#89979b] font-bold text-sm leading-relaxed">Ready to track? Tell me what's on your plate today. ✨</p>
      </motion.div>

      {/* AI Search Card */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full bg-white rounded-[2.8rem] p-8 shadow-[0_40px_80px_rgba(141,225,92,0.1)] mb-8 border border-white relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#8de15c]/5 to-transparent rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-700" />
        
        <textarea 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What did you eat today?"
          className="w-full h-32 text-2xl font-bold text-[#3a4746] placeholder-[#d1d9db] resize-none outline-none leading-tight bg-transparent relative z-10"
        />
        
        <div className="flex justify-between items-center mt-4 relative z-10">
          <div className="flex gap-2">
            <span className="w-2 h-2 rounded-full bg-[#8de15c] animate-pulse" />
            <span className="text-[10px] font-black text-[#8de15c] uppercase tracking-widest">AI Hub Online</span>
          </div>
          <div className="flex gap-3">
            <motion.button whileTap={{ scale: 0.9 }} className="w-12 h-12 bg-[#f8fafb] rounded-2xl flex items-center justify-center text-[#8de15c] hover:bg-[#8de15c] hover:text-white transition-all shadow-sm">
              <Mic className="w-6 h-6" />
            </motion.button>
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={onNavigateToScan}
              className="w-12 h-12 bg-[#8de15c] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#8de15c]/30 hover:brightness-105 transition-all"
            >
              <Camera className="w-6 h-6" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Suggestions Chips */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-wrap gap-2.5 justify-center mb-10 px-2"
      >
        {suggestions.map((s, i) => (
          <motion.button 
            key={i}
            whileTap={{ scale: 0.95 }}
            className="px-5 py-3 bg-white border border-gray-100/80 rounded-2xl text-[13px] font-black text-[#3a4746] shadow-sm flex items-center gap-2 hover:border-[#8de15c]/30 hover:shadow-md transition-all group"
          >
            <span className="text-lg group-hover:scale-125 transition-transform">{s.icon}</span>
            {s.text}
          </motion.button>
        ))}
      </motion.div>

      {/* Feature Cards Loop */}
      <div className="w-full space-y-4 mb-10">
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full bg-gradient-to-r from-[#3a4746] to-[#4a5a59] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20 blur-2xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md">
                <Sparkles className="w-5 h-5 text-[#8de15c]" />
              </div>
              <h3 className="text-lg font-black tracking-tight">Daily Smart Tip</h3>
            </div>
            <p className="text-white/80 text-sm leading-relaxed font-bold">
              "Drinking a glass of lukewarm water with lemon right now can jumpstart your metabolism by <span className="text-[#8de15c]">15%</span> for the next hour!"
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="w-full bg-[#eef8eb] rounded-[2.5rem] p-8 border border-white shadow-sm flex items-center justify-between"
        >
          <div className="flex items-center gap-5">
             <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#8de15c] shadow-sm">
               <span className="text-2xl">🔥</span>
             </div>
             <div>
               <h4 className="font-black text-[#3a4746] text-lg">Morning Streak</h4>
               <p className="text-[#89979b] font-bold text-xs uppercase tracking-widest">5 Days Logged</p>
             </div>
          </div>
          <ChevronRight className="w-6 h-6 text-[#8de15c]" />
        </motion.div>
      </div>

      {/* Action Footer */}
      <motion.button 
        whileTap={{ scale: 0.98 }}
        className="w-full bg-white border-2 border-dashed border-gray-100 rounded-[2rem] py-6 text-[#b9c3c1] font-black text-xs uppercase tracking-[0.2em] mb-12"
      >
        + Explore More Insights
      </motion.button>
    </div>
  );
}
