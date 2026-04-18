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
    <div className="h-full bg-[#f8fafb] flex flex-col relative overflow-hidden">
      {/* Dynamic Background Hint */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-[#8de15c]/10 to-transparent pointer-events-none" />

      {/* Compact Header Area */}
      <header className="px-6 pt-10 pb-4 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#8de15c] rounded-xl flex items-center justify-center shadow-lg shadow-[#8de15c]/20">
             <div className="text-white text-[8px] font-black leading-tight text-center">FB</div>
          </div>
          <h1 className="text-xl font-black text-[#3a4746] tracking-tight">{greeting}!</h1>
        </div>
        <div className="flex items-center gap-2">
           <div className="px-3 py-1 bg-white/50 backdrop-blur-md rounded-full border border-white/80 flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-[#8de15c]" fill="currentColor" />
              <span className="text-[10px] font-black text-[#3a4746] uppercase">AI Hub</span>
           </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 pb-32 space-y-5">
        {/* Main Practical Tracking Box */}
        <motion.div 
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-3xl p-5 shadow-sm border border-white relative group"
        >
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What's for breakfast? (e.g. 2 eggs & coffee)"
            className="w-full h-24 text-lg font-bold text-[#3a4746] placeholder-[#b9c3c1] resize-none outline-none leading-relaxed bg-transparent"
          />
          
          <div className="flex items-center justify-between pt-3 border-t border-gray-50/50 mt-1">
            <div className="flex gap-2">
              <button className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-[#89979b] hover:text-[#8de15c] transition-colors"><Mic className="w-5 h-5" /></button>
              <button onClick={onNavigateToScan} className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-[#89979b] hover:text-[#8de15c] transition-colors"><Camera className="w-5 h-5" /></button>
            </div>
            
            <motion.button 
              whileTap={{ scale: 0.95 }}
              className="bg-[#8de15c] text-white px-6 py-2.5 rounded-xl font-black text-sm flex items-center gap-2 shadow-lg shadow-[#8de15c]/20 hover:brightness-105"
            >
              Analyze & Log <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>

        {/* Practical Suggestion Chips */}
        <div className="flex flex-wrap gap-2">
           {suggestions.map((s, i) => (
             <button key={i} className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-[12px] font-bold text-[#3a4746] shadow-xs flex items-center gap-2 active:bg-gray-50 transition-all">
                <span>{s.icon}</span> {s.text}
             </button>
           ))}
        </div>

        {/* Feature Cards Loop - More Practical & Slim */}
        <div className="grid grid-cols-1 gap-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="w-full bg-[#3a4746] rounded-3xl p-6 text-white relative flex items-center justify-between"
          >
            <div className="max-w-[70%]">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-[#8de15c]" />
                <span className="text-[10px] font-black uppercase text-[#8de15c] tracking-widest">Macro Tip</span>
              </div>
              <p className="text-xs font-bold text-white/80 leading-relaxed">Boost metabolism by 15% with lukewarm lemon water now!</p>
            </div>
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center"><ChevronRight className="w-5 h-5" /></div>
          </motion.div>

          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full bg-[#fef2e8] rounded-3xl p-6 border border-[#fce4d1]/30 flex items-center gap-5"
          >
             <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#ffa024] shadow-sm"><span className="font-black text-lg">🔥</span></div>
             <div>
               <h4 className="font-black text-[#3a4746] text-sm">Morning Streak</h4>
               <p className="text-[10px] font-black text-[#f1904a] uppercase tracking-widest leading-none">5 Days Active</p>
             </div>
          </motion.div>
        </div>

        {/* New Utility: Quick Access Profile */}
        <div className="flex items-center justify-between px-2 pt-4 opacity-60">
           <button className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b9c3c1]">History Logs</button>
           <button className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b9c3c1]">Daily Plan</button>
        </div>
      </div>
    </div>
  );
}
