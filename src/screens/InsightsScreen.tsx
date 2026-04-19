"use client";
import React, { useState } from 'react';
import { Egg, Sparkles, Flame, Apple, ChevronLeft, ChevronRight, Utensils, Leaf, Target, X, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { useUser } from '../context/UserContext';
import CuteCalendarModal from '../components/CuteCalendarModal';
import useLocalStorage from '../hooks/useLocalStorage';

export default function InsightsScreen({ onOpenPremium }: { onOpenPremium?: () => void }) {
  const { meals, dynamicTargets, weightLogs, biometrics } = useUser();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [weightGoal, setWeightGoal] = useLocalStorage<string>('fb_weight_goal', '');
  const [proteinGoal, setProteinGoal] = useLocalStorage<string>('fb_protein_goal', '');
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [showProteinModal, setShowProteinModal] = useState(false);
  const [localWeightGoal, setLocalWeightGoal] = useState('');
  const [localProteinGoal, setLocalProteinGoal] = useState('');
  const [magicInsightIdx, setMagicInsightIdx] = useState(0);
  
  const MAGIC_INSIGHTS = [
    "You consume more carbs on weekends. Try balancing with an extra egg or two! 🥚🍳",
    "Your protein intake is consistently below target. Consider adding Greek yogurt to your routine! 🥛💪",
    "You tend to eat larger meals at dinner. Try distributing calories more evenly throughout the day! 🌅",
    "Your best workout days align with higher carb intake — great intuitive eating! 🏋️🔥",
    "Hydration tip: Eating more fiber without enough water can slow your digestion. Drink up! 💧🌿",
    "Your fat intake spikes on rest days. Channel that energy with a quick 20-min walk instead! 🚶‍♂️",
    "You're crushing it this week! Your macro consistency is in the top 15% of Bunny users. 🐰🏆",
    "Missing breakfast? Studies show it improves focus and reduces overeating by evening! 🌄🍳",
  ];

  const selectedDateStr = currentDate.toISOString().split('T')[0];
  const selectedDateMeals = meals.filter(m => m.fullDate === selectedDateStr);
  const totalFoodCals = selectedDateMeals.reduce((acc, m) => acc + m.calories, 0);
  const totalCarbs = selectedDateMeals.reduce((acc, m) => acc + m.carbs, 0);
  const totalProtein = selectedDateMeals.reduce((acc, m) => acc + m.protein, 0);
  const totalFat = selectedDateMeals.reduce((acc, m) => acc + m.fat, 0);
  const totalFiber = selectedDateMeals.reduce((acc, m) => acc + (m.fiber || 0), 0);
  
  const weekStart = new Date(currentDate);
  weekStart.setDate(currentDate.getDate() - currentDate.getDay());
  const weekDays = Array.from({ length: 7 }).map((_, idx) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + idx);
    const dateStr = date.toISOString().split('T')[0];
    const dailyMeals = meals.filter(m => m.fullDate === dateStr);
    return {
      date,
      dateStr,
      calories: dailyMeals.reduce((acc, m) => acc + m.calories, 0),
      carbs: dailyMeals.reduce((acc, m) => acc + m.carbs, 0),
      protein: dailyMeals.reduce((acc, m) => acc + m.protein, 0),
      fat: dailyMeals.reduce((acc, m) => acc + m.fat, 0),
    };
  });
  
  const goalCals = dynamicTargets.cals;
  const macroTotal = (totalCarbs * 4) + (totalProtein * 4) + (totalFat * 9) || 1;
  const carbPct = Math.round(((totalCarbs * 4) / macroTotal) * 100);
  const proteinPct = Math.round(((totalProtein * 4) / macroTotal) * 100);
  const fatPct = Math.max(0, 100 - carbPct - proteinPct);

  const targetProtein = dynamicTargets.protein;
  const targetCarbs = dynamicTargets.carbs;
  const targetFat = dynamicTargets.fat;
  const targetMacroTotal = (targetCarbs * 4) + (targetProtein * 4) + (targetFat * 9) || 1;
  const targetCarbPct = Math.round(((targetCarbs * 4) / targetMacroTotal) * 100);
  const targetProteinPct = Math.round(((targetProtein * 4) / targetMacroTotal) * 100);
  const targetFatPct = Math.max(0, 100 - targetCarbPct - targetProteinPct);
  const avgFoodCals = Math.round(weekDays.reduce((sum, day) => sum + day.calories, 0) / weekDays.length || 0);
  const netChange = avgFoodCals - goalCals;
  const netChangeLabel = `${netChange >= 0 ? '+' : ''}${netChange} Cal`;
  const netChangePositive = netChange >= 0;

  return (
    <div className="h-full relative overflow-hidden">
      {/* Insights Sanctuary Background */}
      <Image 
        src="/10.png" 
        alt="Insights Background" 
        fill
        priority
        className="object-cover object-center z-0" 
      />
      
      {/* Soft Overlay */}
      <div className="absolute inset-0 z-10 bg-black/5 backdrop-blur-[1px]" />

      <div className="relative z-20 h-full overflow-y-auto pt-8 pb-32">
      <header className="w-full z-40 bg-transparent mb-3 px-4 shadow-none">
        <div className="flex items-center justify-center gap-6 relative max-w-2xl mx-auto">
          <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/50 text-[#3a4746] transition-colors"><ChevronLeft className="w-5 h-5" /></button>
          <motion.div 
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCalendar(true)}
            className="cursor-pointer group relative px-4 py-1.5 rounded-2xl hover:bg-white/40 transition-all flex flex-col items-center"
          >
            <h1 className="text-lg font-black text-[#3a4746] tracking-tight">Insights</h1>
          </motion.div>
          <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/50 text-[#b9c3c1] transition-colors"><ChevronRight className="w-5 h-5" /></button>
          
          <button onClick={onOpenPremium} className="absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-r from-[#ffa024] to-[#f55938] text-white text-[10px] uppercase font-extrabold px-3 py-1.5 rounded-full shadow-[0_4px_10px_rgba(255,160,36,0.3)] hover:-translate-y-[calc(50%+1px)] transition-transform flex items-center gap-1 active:scale-95">
            <Sparkles className="w-3 h-3" fill="currentColor" /> Premium
          </button>
        </div>
      </header>

      <main className="px-4 max-w-2xl mx-auto space-y-8">
        <section className="space-y-1 px-2 pt-10">
          <h2 className="text-4xl font-extrabold text-[#3a4746] tracking-tighter leading-tight drop-shadow-sm">Your Weekly <br/><span className="text-white">Vitality Report</span></h2>
          <p className="text-sm font-bold text-white/70 flex items-center gap-1.5 pt-1">You're doing great this week! <Sparkles className="w-4 h-4 text-[#ff9656]" fill="currentColor"/></p>
        </section>
        <section className="space-y-6">
          {/* Calories Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-[0_15px_40px_rgba(0,0,0,0.04)] border border-[#eff3f4] relative overflow-hidden group"
          >
            <div className="relative z-10 w-full">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-[17px] font-black text-[#4b5563]">Calories Consumption</h2>
                <div className="text-[10px] font-black uppercase tracking-widest text-[#6b7280] bg-[#f3f4f6] px-4 py-2 rounded-xl">Last 7 Days</div>
              </div>
              
              <div className="flex flex-col gap-10 lg:flex-row lg:items-center w-full">
                <div className="flex flex-col items-center gap-6 w-full lg:w-1/3">
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90 absolute">
                      <circle className="text-[#f3f4f6] stroke-current" cx="64" cy="64" r="54" strokeWidth="12" fill="none" />
                      <motion.circle 
                        initial={{ strokeDashoffset: 339.3 }}
                        animate={{ strokeDashoffset: 339.3 * (1 - Math.min(avgFoodCals / goalCals, 1)) }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="text-[#8de15c] stroke-current" 
                        cx="64" cy="64" r="54" strokeWidth="12" fill="none" 
                        strokeDasharray="339.3" strokeLinecap="round" 
                      />
                    </svg>
                    <div className="flex flex-col items-center justify-center text-center mt-1 z-10">
                      <span className="text-3xl font-black text-[#1f2937] leading-none tracking-tighter">{avgFoodCals.toLocaleString()}</span>
                      <span className="text-[9px] text-[#9ca3af] font-black uppercase mt-1 tracking-widest">AVG CAL</span>
                    </div>
                  </div>
                  
                  <div className="bg-white border border-[#e5e7eb] rounded-2xl px-5 py-3 flex flex-col items-center shadow-sm w-full max-w-[140px]">
                    <span className="text-[9px] text-[#9ca3af] font-black uppercase tracking-widest">Net Change</span>
                    <span className="text-sm font-black text-[#4b5563] mt-0.5 flex items-center gap-1">
                      {netChangeLabel} <span className={`${netChangePositive ? 'text-[#ef4444]' : 'text-[#8de15c]'} text-[10px]`}>{netChangePositive ? '▲' : '▼'}</span>
                    </span>
                  </div>
                </div>

                <div className="flex-1 flex justify-between items-end h-36 px-2 w-full lg:w-2/3">
                  {weekDays.map((day, i) => {
                    const h = Math.max((day.calories / goalCals) * 100, 3);
                    const isToday = day.date.toDateString() === currentDate.toDateString();
                    return (
                      <div key={day.dateStr} className="flex flex-col items-center gap-3">
                        <div className="w-4 bg-[#f3f4f6] rounded-full relative overflow-hidden h-28">
                          <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            transition={{ duration: 1, delay: i * 0.05 }}
                            className={`absolute bottom-0 left-0 w-full rounded-full ${isToday ? 'bg-[#8de15c]' : 'bg-[#d1d5db]'}`}
                          />
                        </div>
                        <span className={`${isToday ? 'text-[#8de15c] font-black' : 'text-[#9ca3af] font-bold'} text-[10px]`}>
                          {day.date.toLocaleDateString('en-US', { weekday: 'short' })}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Nutrients Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-[0_15px_40px_rgba(0,0,0,0.04)] border border-[#eff3f4] relative overflow-hidden group"
          >
            <div className="relative z-10 w-full">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-[17px] font-black text-[#4b5563]">Nutrient Balance</h2>
                <div className="text-[10px] font-black uppercase tracking-widest text-[#8de15c] bg-[#eefaf2] px-4 py-2 rounded-xl">Optimal</div>
              </div>
              
              <div className="flex flex-col gap-10 lg:flex-row lg:items-center w-full">
                <div className="flex flex-col items-center gap-8 w-full lg:w-[40%]">
                  <div className="relative w-36 h-36">
                    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#fcd34d" strokeWidth="16" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - (carbPct / 100))} strokeLinecap="round" />
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3b82f6" strokeWidth="16" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - (proteinPct / 100))} strokeLinecap="round" style={{ transform: `rotate(${carbPct * 3.6}deg)`, transformOrigin: 'center' }} />
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f97316" strokeWidth="16" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - (fatPct / 100))} strokeLinecap="round" style={{ transform: `rotate(${(carbPct + proteinPct) * 3.6}deg)`, transformOrigin: 'center' }} />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <Sparkles className="w-6 h-6 text-[#8de15c]" fill="currentColor" />
                    </div>
                  </div>
                  
                  <div className="flex justify-center gap-4 w-full">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-[#fcd34d]"></div>
                      <span className="text-[#4b5563] text-[11px] font-black tracking-wide">{carbPct}% Carbs</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-[#3b82f6]"></div>
                      <span className="text-[#4b5563] text-[11px] font-black tracking-wide">{proteinPct}% Protein</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-[#f97316]"></div>
                      <span className="text-[#4b5563] text-[11px] font-black tracking-wide">{fatPct}% Fat</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 space-y-8 lg:w-[60%]">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="flex items-center gap-3 font-black text-[#4b5563] tracking-widest"><Apple className="w-4 h-4 text-[#fcd34d]" fill="currentColor" /> CARBS</span>
                      <span className="font-black text-[#1f2937] text-sm">{carbPct}% <span className="text-[#9ca3af] font-medium text-[11px] ml-1 tracking-widest">/ {targetCarbPct}% TARGET</span></span>
                    </div>
                    <div className="h-3.5 w-full bg-[#f3f4f6] rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${carbPct}%` }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="h-full bg-[#fcd34d] rounded-full"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="flex items-center gap-3 font-black text-[#4b5563] tracking-widest"><Egg className="w-4 h-4 text-[#3b82f6]" fill="currentColor" /> PROTEIN</span>
                      <span className="font-black text-[#1f2937] text-sm">{proteinPct}% <span className="text-[#9ca3af] font-medium text-[11px] ml-1 tracking-widest">/ {targetProteinPct}% TARGET</span></span>
                    </div>
                    <div className="h-3.5 w-full bg-[#f3f4f6] rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${proteinPct}%` }}
                        transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                        className="h-full bg-[#3b82f6] rounded-full"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="flex items-center gap-3 font-black text-[#4b5563] tracking-widest"><Flame className="w-4 h-4 text-[#f97316]" fill="currentColor" /> FAT</span>
                      <span className="font-black text-[#1f2937] text-sm">{fatPct}% <span className="text-[#9ca3af] font-medium text-[11px] ml-1 tracking-widest">/ {targetFatPct}% TARGET</span></span>
                    </div>
                    <div className="h-3.5 w-full bg-[#f3f4f6] rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${fatPct}%` }}
                        transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
                        className="h-full bg-[#f97316] rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Weight Trajectory Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-white to-[#f8fafb] rounded-[2.5rem] p-6 shadow-[0_15px_40px_rgba(0,0,0,0.06)] border border-white/80 relative overflow-hidden group"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-baseline gap-2">
                <h2 className="text-[17px] font-bold text-[#3a4746]">Weight Trajectory</h2>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black text-[#3a4746]">{weightLogs[0]?.weight ?? biometrics.weight ?? '--'} <span className="text-xs font-bold text-[#a4afb3]">kg</span></span>
                <button
                  onClick={() => { setLocalWeightGoal(weightGoal); setShowWeightModal(true); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f0f3f4] hover:bg-[#8de15c] hover:text-white text-[#89979b] rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  <Target size={12} /> Set Goal
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              {weightGoal ? (
                <div className="flex items-center justify-between px-1">
                  <span className="text-[11px] font-black text-[#89979b] uppercase tracking-widest">Current</span>
                  <span className="text-[11px] font-black text-[#89979b] uppercase tracking-widest">Goal: {weightGoal}kg</span>
                </div>
              ) : (
                <p className="text-[11px] font-bold text-[#b9c3c1] text-center py-2">Tap "Set Goal" to track your weight target 🎯</p>
              )}

              {weightLogs.length > 0 ? (
                <div className="flex items-end justify-between gap-2 h-20 pt-2">
                  {weightLogs.slice(0, 7).reverse().map((log, i, arr) => {
                    const weights = arr.map(l => l.weight);
                    const minW = Math.min(...weights);
                    const maxW = Math.max(...weights);
                    const range = maxW - minW || 1;
                    const h = ((log.weight - minW) / range) * 60 + 20;
                    const isLatest = i === arr.length - 1;
                    return (
                      <div key={log.date} className="flex flex-col items-center gap-1 flex-1">
                        <div 
                          className={`w-full rounded-full transition-all ${isLatest ? 'bg-[#8de15c]' : 'bg-[#dce5e7]'}`} 
                          style={{ height: `${h}%` }}
                        />
                        <span className="text-[9px] font-bold text-[#a4afb3]">{log.weight}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="h-20 flex items-center justify-center">
                  <p className="text-[11px] font-bold text-[#b9c3c1] italic">No weight logs yet. Update your weight in Profile!</p>
                </div>
              )}

              {weightGoal && weightLogs[0]?.weight && (
                <div className="mt-2">
                  <div className="flex justify-between text-[10px] font-black text-[#89979b] mb-1">
                    <span>Progress to goal</span>
                    <span>{Math.abs(weightLogs[0].weight - parseFloat(weightGoal)).toFixed(1)}kg to go</span>
                  </div>
                  <div className="h-2 w-full bg-[#f0f3f4] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#8de15c] rounded-full transition-all"
                      style={{ 
                        width: `${Math.min(100, Math.max(0, (1 - Math.abs(weightLogs[0].weight - parseFloat(weightGoal)) / Math.abs(parseFloat(biometrics.weight || weightLogs[0].weight.toString()) - parseFloat(weightGoal))) * 100))}%` 
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </section>

        {/* Weight Goal Modal */}
        <AnimatePresence>
          {showWeightModal && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="w-full max-w-sm rounded-[3rem] bg-white p-8 shadow-2xl">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 mb-6">
                    <Target size={32} />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-1">Weight Goal</h3>
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-8">Set your target body weight</p>
                  <div className="w-full relative mb-8">
                    <input 
                      type="number" step="0.1"
                      value={localWeightGoal}
                      onChange={e => setLocalWeightGoal(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-5 text-3xl font-black text-center text-gray-900 outline-none focus:border-[#8de15c] transition-all"
                      autoFocus
                      placeholder="70"
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-gray-300 text-xs">KG</span>
                  </div>
                  <div className="w-full grid grid-cols-2 gap-3">
                    <button onClick={() => setShowWeightModal(false)} className="py-4 rounded-xl text-gray-400 font-black text-xs uppercase tracking-widest bg-gray-50">Cancel</button>
                    <button onClick={() => { setWeightGoal(localWeightGoal); setShowWeightModal(false); }} className="py-4 rounded-xl bg-[#8de15c] text-white font-black text-xs uppercase tracking-widest">
                      Save Goal
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* --- PREEXISTING INSIGHTS UI --- */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="col-span-2 p-6 bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.05)] rounded-[2.5rem] flex flex-col gap-6 relative overflow-hidden"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[#3a4746] text-[10px] font-extrabold uppercase tracking-widest mb-1 shadow-white">Logged Today</p>
                <h3 className="text-4xl font-extrabold text-[#3a4746] mt-1 drop-shadow-sm">{totalFoodCals} <span className="text-base font-bold text-[#89979b]">kcal</span></h3>
              </div>
              <div className="bg-white/80 border border-white shadow-sm px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-500" fill="currentColor" />
                <span className="text-[10px] uppercase tracking-widest font-extrabold text-orange-600">On Fire!</span>
              </div>
            </div>
            <div className="h-36 w-full flex items-end justify-between px-2 relative z-10">
              <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                <div className="w-full h-[2px] bg-[#8de15c] border-b border-white shadow-sm"></div>
              </div>
              {/* Bars with cute rounded tops */}
              <div className="w-6 bg-[#8de15c]/50 rounded-full border border-white/40 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:scale-110 transition-transform origin-bottom cursor-pointer" style={{height: '40%'}}></div>
              <div className="w-6 bg-[#8de15c]/50 rounded-full border border-white/40 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:scale-110 transition-transform origin-bottom cursor-pointer" style={{height: '65%'}}></div>
              <div className="w-6 bg-[#8de15c]/50 rounded-full border border-white/40 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:scale-110 transition-transform origin-bottom cursor-pointer" style={{height: '55%'}}></div>
              <div className="w-6 bg-[#8de15c]/50 rounded-full border border-white/40 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:scale-110 transition-transform origin-bottom cursor-pointer" style={{height: '85%'}}></div>
              <div className="w-6 bg-[#8de15c]/50 rounded-full border border-white/40 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:scale-110 transition-transform origin-bottom cursor-pointer" style={{height: '70%'}}></div>
              <div className="w-6 bg-[#8de15c]/50 rounded-full border border-white/40 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:scale-110 transition-transform origin-bottom cursor-pointer" style={{height: '60%'}}></div>
              <div className="w-6 bg-[#8de15c] rounded-full border border-white shadow-[0_8px_16px_rgba(141,225,92,0.3)] hover:scale-110 transition-transform origin-bottom relative cursor-pointer" style={{height: '95%'}}>
                 <div className="absolute -top-3 -right-2 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md border border-white/50">
                    <Sparkles className="w-3.5 h-3.5 text-[#ff9656]" />
                 </div>
              </div>
            </div>
            <div className="flex justify-between text-[10px] text-[#89979b] font-extrabold px-3 uppercase tracking-widest mt-2">
              <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span className="text-[#8de15c] text-xl -mt-1 drop-shadow-sm">&bull;</span>
            </div>
          </motion.div>

          {/* Vibe Card - Dynamic based on macro balance */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-6 bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.05)] rounded-[2.5rem] flex flex-col items-center justify-center gap-4 text-center hover:bg-white/50 transition-colors group"
          >
            {(() => {
              const hasData = totalFoodCals > 0;
              const carbOk = carbPct >= 30 && carbPct <= 60;
              const protOk = proteinPct >= 20 && proteinPct <= 50;
              const fatOk = fatPct >= 10 && fatPct <= 35;
              const balanced = carbOk && protOk && fatOk;
              const vibeLabel = !hasData ? 'No Data' : balanced ? 'Optimal' : proteinPct < 20 ? 'Low Protein' : fatPct > 40 ? 'High Fat' : 'Unbalanced';
              const vibeColor = !hasData ? '#a4afb3' : balanced ? '#8de15c' : '#ffa024';
              const carbStop = carbPct;
              const protStop = carbPct + proteinPct;
              const gradient = hasData
                ? `conic-gradient(from 0deg, #fcd34d 0%, #fcd34d ${carbStop}%, #3b82f6 ${carbStop}%, #3b82f6 ${protStop}%, #f97316 ${protStop}%, #f97316 100%)`
                : `conic-gradient(from 0deg, #e5e7eb 0%, #e5e7eb 100%)`;
              return (
                <>
                  <div className="relative w-24 h-24 flex items-center justify-center rounded-full shadow-inner overflow-hidden" style={{ background: gradient }}>
                    <div className="absolute inset-[6px] bg-white/90 backdrop-blur-md rounded-full border-2 border-white/80 flex flex-col items-center justify-center shadow-sm">
                      <span className="text-xs font-extrabold tracking-widest leading-none drop-shadow-sm group-hover:scale-110 transition-transform" style={{ color: vibeColor }}>VIBE</span>
                    </div>
                  </div>
                  <div className="mt-2 text-[#3a4746]">
                    <p className="text-sm font-extrabold leading-none" style={{ color: vibeColor }}>{vibeLabel}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest mt-1.5 flex items-center justify-center gap-1 opacity-60"><Sparkles className="w-3 h-3 text-[#8de15c]"/>Weekly Balance</p>
                  </div>
                </>
              );
            })()}
          </motion.div>

          {/* Protein Goal Card - Editable */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            onClick={() => { setLocalProteinGoal(proteinGoal); setShowProteinModal(true); }}
            className="p-6 bg-[#8de15c]/10 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.05)] rounded-[2.5rem] flex flex-col justify-between relative overflow-hidden group cursor-pointer active:scale-95 transition-all"
          >
            <Egg className="absolute -bottom-4 -right-4 w-28 h-28 text-white/40 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 drop-shadow-none" />
            <div className="flex justify-between items-start relative z-10">
              <div className="p-2.5 bg-white/80 rounded-2xl shadow-sm border border-white">
                  <Egg className="text-[#3a4746] w-6 h-6" />
              </div>
              <span className="text-[10px] font-extrabold text-[#3a4746] bg-white/80 px-2 py-1 rounded-full uppercase tracking-widest shadow-sm border border-white">GOAL</span>
            </div>
            <div className="mt-6 relative z-10 text-[#3a4746]">
              <h4 className="text-3xl font-extrabold tracking-tighter drop-shadow-sm">{proteinGoal ? `${proteinGoal}g` : `${dynamicTargets.protein}g`}</h4>
              <p className="text-[11px] font-extrabold mt-1 tracking-widest uppercase opacity-80">Protein Goal · Tap to Edit</p>
            </div>
          </motion.div>

          {/* Protein Goal Modal */}
          <AnimatePresence>
            {showProteinModal && (
              <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="w-full max-w-sm rounded-[3rem] bg-white p-8 shadow-2xl">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 mb-6">
                      <Egg size={32} />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-1">Protein Goal</h3>
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-8">Set your daily protein target</p>
                    <div className="w-full relative mb-8">
                      <input 
                        type="number" step="1"
                        value={localProteinGoal}
                        onChange={e => setLocalProteinGoal(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-5 text-3xl font-black text-center text-gray-900 outline-none focus:border-[#8de15c] transition-all"
                        autoFocus
                        placeholder={dynamicTargets.protein.toString()}
                      />
                      <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-gray-300 text-xs">GRAMS</span>
                    </div>
                    <div className="w-full grid grid-cols-2 gap-3">
                      <button onClick={() => setShowProteinModal(false)} className="py-4 rounded-xl text-gray-400 font-black text-xs uppercase tracking-widest bg-gray-50">Cancel</button>
                      <button onClick={() => { setProteinGoal(localProteinGoal); setShowProteinModal(false); }} className="py-4 rounded-xl bg-[#8de15c] text-white font-black text-xs uppercase tracking-widest">
                        Save Goal
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>


        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onClick={() => setMagicInsightIdx(i => (i + 1) % MAGIC_INSIGHTS.length)}
          className="p-6 bg-white/60 backdrop-blur-3xl shadow-[0_16px_48px_rgba(0,0,0,0.08)] rounded-[2.5rem] border border-white relative overflow-hidden group cursor-pointer active:scale-[0.98] transition-all"
        >
          <div className="absolute top-0 right-0 p-4 opacity-30 group-hover:opacity-60 transition-opacity translate-x-4 -translate-y-4">
            <Sparkles className="w-28 h-28 text-[#ffa024]" />
          </div>
          <div className="flex items-start gap-4 relative z-10">
            <div className="bg-[#ffa024] p-3 rounded-2xl shadow-[0_4px_16px_rgba(255,160,36,0.5)] border border-[#ffa024]/50">
              <Sparkles className="text-white w-6 h-6" fill="currentColor" />
            </div>
            <div className="space-y-1 mt-1 flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-extrabold text-[#ffa024] uppercase tracking-widest">Magic Insight</h4>
                <div className="flex items-center gap-1 text-[9px] font-black text-[#ffa024]/60 uppercase tracking-widest">
                  <RefreshCw size={10} /> Tap to refresh
                </div>
              </div>
              <AnimatePresence mode="wait">
                <motion.p 
                  key={magicInsightIdx}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="text-[#3a4746] text-[15px] leading-snug font-bold mt-1 max-w-[240px]"
                >
                  {MAGIC_INSIGHTS[magicInsightIdx]}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </motion.section>


        <section className="space-y-4 pb-8">
          <div className="flex justify-between items-end px-2">
            <h3 className="text-2xl font-extrabold text-[#3a4746] tracking-tight">Macro Progress</h3>
            <button className="text-[10px] font-extrabold text-[#8de15c] uppercase tracking-widest bg-white/60 hover:bg-white px-3 py-1.5 rounded-full border border-white shadow-sm flex items-center gap-1 transition-colors">Details <ChevronRight className="w-3 h-3" /></button>
          </div>
          
          <div className="p-6 bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.05)] rounded-[2.5rem] space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-extrabold text-[#3a4746]">
                <span className="flex items-center gap-2"><Utensils className="w-4 h-4 text-[#309af0]" fill="currentColor" /> Protein</span>
                <span className="font-bold">{totalProtein}g <span className="text-[#89979b] font-medium text-xs">/ {targetProtein}g</span></span>
              </div>
              <div className="h-4 w-full bg-white/50 shadow-inner rounded-full overflow-hidden p-0.5 border border-white/60">
                <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${Math.min((totalProtein / targetProtein) * 100, 100)}%` }}
                   className="h-full bg-[#309af0] rounded-full shadow-sm"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-extrabold text-[#3a4746]">
                <span className="flex items-center gap-2"><Apple className="w-4 h-4 text-[#edc541]" fill="currentColor"/> Carbs</span>
                <span className="font-bold">{totalCarbs}g <span className="text-[#89979b] font-medium text-xs">/ {targetCarbs}g</span></span>
              </div>
              <div className="h-4 w-full bg-white/50 shadow-inner rounded-full overflow-hidden p-0.5 border border-white/60">
                <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${Math.min((totalCarbs / targetCarbs) * 100, 100)}%` }}
                   className="h-full bg-[#edc541] rounded-full shadow-sm"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-extrabold text-[#3a4746]">
                <span className="flex items-center gap-2"><Flame className="w-4 h-4 text-[#ffa024]" fill="currentColor"/> Fats</span>
                <span className="font-bold">{totalFat}g <span className="text-[#89979b] font-medium text-xs">/ {targetFat}g</span></span>
              </div>
              <div className="h-4 w-full bg-white/50 shadow-inner rounded-full overflow-hidden p-0.5 border border-white/60">
                <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${Math.min((totalFat / targetFat) * 100, 100)}%` }}
                   className="h-full bg-[#ffa024] rounded-full shadow-sm"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <CuteCalendarModal 
        isOpen={showCalendar} 
        onClose={() => setShowCalendar(false)} 
        currentDate={currentDate} 
        onSelectDate={(d) => setCurrentDate(d)}
      />
    </div>
  </div>
);
}
