"use client";
import React, { useState } from 'react';
import { Egg, Sparkles, Flame, Apple, ChevronLeft, ChevronRight, Utensils, Leaf } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { useUser } from '../context/UserContext';
import CuteCalendarModal from '../components/CuteCalendarModal';

export default function InsightsScreen({ onOpenPremium }: { onOpenPremium?: () => void }) {
  const { meals, dynamicTargets, weightLogs } = useUser();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  
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
            className="bg-white rounded-[2.5rem] p-6 shadow-[0_15px_40px_rgba(0,0,0,0.04)] border border-[#eff3f4] relative overflow-hidden group"
          >
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-[17px] font-bold text-[#3a4746]">Calories Consumption</h2>
                <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#89979b] bg-[#f0f3f4] px-3 py-1.5 rounded-xl">Last 7 Days</div>
              </div>
              
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
                <div className="flex flex-col items-center gap-4 w-full lg:w-auto">
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90 absolute">
                      <circle className="text-[#f0f3f4] stroke-current" cx="56" cy="56" r="48" strokeWidth="10" fill="none" />
                      <motion.circle 
                        initial={{ strokeDashoffset: 301.6 }}
                        animate={{ strokeDashoffset: 301.6 * (1 - Math.min(avgFoodCals / goalCals, 1)) }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="text-[#8de15c] stroke-current" 
                        cx="56" cy="56" r="48" strokeWidth="10" fill="none" 
                        strokeDasharray="301.6" strokeLinecap="round" 
                      />
                    </svg>
                    <div className="flex flex-col items-center justify-center text-center mt-1 z-10">
                      <span className="text-3xl font-black text-[#3a4746] leading-none">{avgFoodCals}</span>
                      <span className="text-[9px] text-[#89979b] font-extrabold uppercase mt-1 tracking-wider">AVG CAL</span>
                    </div>
                  </div>
                  
                  <div className="bg-white border border-[#eff3f4] rounded-[2rem] px-4 py-3 flex flex-col items-center shadow-[0_10px_25px_rgba(141,225,92,0.08)]">
                    <span className="text-[9px] text-[#89979b] font-extrabold uppercase tracking-wider">Net Change</span>
                    <span className="text-sm font-black text-[#3a4746] mt-1">{netChangeLabel} <span className={`${netChangePositive ? 'text-red-400' : 'text-[#8de15c]'} text-[10px]`}>{netChangePositive ? '▲' : '▼'}</span></span>
                  </div>
                </div>

                <div className="flex-1 flex justify-between items-end h-28 px-1">
                  {weekDays.map((day, i) => {
                    const h = Math.max((day.calories / goalCals) * 100, 3);
                    const isToday = day.date.toDateString() === currentDate.toDateString();
                    return (
                      <div key={day.dateStr} className="flex flex-col items-center gap-3">
                        <div className="w-[12px] bg-[#f0f3f4] rounded-full relative overflow-hidden h-24">
                          <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            transition={{ duration: 1, delay: i * 0.05 }}
                            className={`absolute bottom-0 left-0 w-full rounded-full ${isToday ? 'bg-[#8de15c]' : 'bg-[#dce5e7]'} opacity-80`}
                          />
                        </div>
                        <span className={`${isToday ? 'text-[#8de15c] font-black' : 'text-[#a4afb3] font-bold'} text-[10px]`}>{day.date.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 1)}</span>
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
            className="bg-white rounded-[2.5rem] p-6 shadow-[0_15px_40px_rgba(0,0,0,0.04)] border border-[#eff3f4] relative overflow-hidden group"
          >
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-[17px] font-bold text-[#3a4746]">Nutrient Balance</h2>
                <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#8de15c] bg-[#eefaf2] px-3 py-1.5 rounded-xl">Optimal</div>
              </div>
              
              <div className="flex flex-col gap-8 lg:flex-row lg:items-center w-full">
                <div className="flex flex-col items-center gap-6 w-full lg:w-auto">
                  <div className="relative w-28 h-28 sm:w-32 sm:h-32">
                    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                      {/* Carbs */}
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#edc541" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - (carbPct / 100))} strokeLinecap="round" />
                      {/* Protein */}
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#309af0" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - (proteinPct / 100))} strokeLinecap="round" style={{ transform: `rotate(${carbPct * 3.6}deg)`, transformOrigin: 'center' }} />
                      {/* Fat */}
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#ffa024" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - (fatPct / 100))} strokeLinecap="round" style={{ transform: `rotate(${(carbPct + proteinPct) * 3.6}deg)`, transformOrigin: 'center' }} />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <Sparkles className="w-5 h-5 text-[#8de15c]" fill="currentColor" />
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap justify-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#edc541]"></div>
                      <span className="text-[#3a4746] text-[10px] font-bold">{carbPct}% Carbs</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#309af0]"></div>
                      <span className="text-[#3a4746] text-[10px] font-bold">{proteinPct}% Protein</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#ffa024]"></div>
                      <span className="text-[#3a4746] text-[10px] font-bold">{fatPct}% Fat</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 space-y-5">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-extrabold uppercase tracking-wider text-[#3a4746]">
                      <span className="flex items-center gap-2 text-[#edc541]"><Apple className="w-3.5 h-3.5" fill="currentColor" /> <span className="text-[#3a4746]">Carbs</span></span>
                      <span>{carbPct}% <span className="text-[#89979b] font-medium ml-1">/ {targetCarbPct}% Target</span></span>
                    </div>
                    <div className="h-2.5 w-full bg-[#f0f3f4] rounded-full overflow-hidden relative p-[1px]">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${carbPct}%` }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="h-full bg-[#edc541] rounded-full"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-extrabold uppercase tracking-wider text-[#3a4746]">
                      <span className="flex items-center gap-2 text-[#309af0]"><Egg className="w-3.5 h-3.5" fill="currentColor" /> <span className="text-[#3a4746]">Protein</span></span>
                      <span>{proteinPct}% <span className="text-[#89979b] font-medium ml-1">/ {targetProteinPct}% Target</span></span>
                    </div>
                    <div className="h-2.5 w-full bg-[#f0f3f4] rounded-full overflow-hidden relative p-[1px]">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${proteinPct}%` }}
                        transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                        className="h-full bg-[#309af0] rounded-full"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-extrabold uppercase tracking-wider text-[#3a4746]">
                      <span className="flex items-center gap-2 text-[#ffa024]"><Flame className="w-3.5 h-3.5" fill="currentColor" /> <span className="text-[#3a4746]">Fat</span></span>
                      <span>{fatPct}% <span className="text-[#89979b] font-medium ml-1">/ {targetFatPct}% Target</span></span>
                    </div>
                    <div className="h-2.5 w-full bg-[#f0f3f4] rounded-full overflow-hidden relative p-[1px]">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${fatPct}%` }}
                        transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
                        className="h-full bg-[#ffa024] rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Weight Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-white to-[#f8fafb] rounded-[2.5rem] p-6 shadow-[0_15px_40px_rgba(0,0,0,0.06)] border border-white/80 hover:shadow-[0_20px_50px_rgba(20,69,0,0.08)] hover:-translate-y-1 transition-all duration-500 relative overflow-hidden group"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-baseline gap-2">
                <h2 className="text-[17px] font-bold text-[#3a4746]">Weight Trend</h2>
                <span className="text-[#89979b] text-[11px] font-extrabold uppercase tracking-widest">(Latest Logs)</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-[#3a4746]">{weightLogs[0]?.weight} <span className="text-xs font-bold text-[#a4afb3]">kg</span></span>
              </div>
            </div>
            
            <div className="relative h-44 w-full mt-2 pr-2">
              <div className="absolute inset-0 flex flex-col justify-between pt-2 pb-8">
                  <div className="border-b border-dashed border-[#e2e8e9] w-full flex items-center h-0"><span className="absolute left-0 -mt-2 text-[10px] font-bold text-[#a4afb3]">79</span></div>
                  <div className="border-b border-dashed border-[#e2e8e9] w-full flex items-center h-0"><span className="absolute left-0 -mt-2 text-[10px] font-bold text-[#a4afb3]">74</span></div>
                  <div className="border-b border-dashed border-[#e2e8e9] w-full flex items-center h-0"><span className="absolute left-0 -mt-2 text-[10px] font-bold text-[#a4afb3]">70</span></div>
                  <div className="border-b border-dashed border-[#e2e8e9] w-full flex items-center h-0"><span className="absolute left-0 -mt-2 text-[10px] font-bold text-[#a4afb3]">65 kg</span></div>
              </div>
              <div className="absolute inset-0 pl-10 pr-4 flex items-end justify-end pb-20">
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.8 }}
                    className="w-4 h-4 rounded-full bg-red-500 border-[3px] border-white shadow-lg z-10"
                  ></motion.div>
                  {/* Decorative line to show potential future trend */}
                  <svg className="absolute w-full h-[60%] inset-x-0 bottom-8 px-10 overflow-visible opacity-20">
                    <motion.path 
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, ease: "easeInOut" }}
                      d="M 10 50 Q 80 10 150 40 T 250 20 T 350 30"
                      fill="none" 
                      stroke="red" 
                      strokeWidth="2" 
                      strokeDasharray="4 4"
                    />
                  </svg>
              </div>
              <div className="absolute bottom-0 inset-x-0 flex justify-between pl-10 pr-2 pt-2">
                {['Jan', 'Feb', 'Mar'].map(m => <span key={m} className="text-[10px] font-bold text-[#a4afb3]">{m}</span>)}
              </div>
            </div>
          </motion.div>
        </section>

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

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-6 bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.05)] rounded-[2.5rem] flex flex-col items-center justify-center gap-4 text-center hover:bg-white/50 transition-colors group"
          >
            <div className="relative w-24 h-24 flex items-center justify-center rounded-full shadow-inner overflow-hidden" style={{ background: 'conic-gradient(from 0deg, #8de15c 0%, #8de15c 65%, #edc541 65%, #edc541 85%, #ffa024 85%, #ffa024 100%)' }}>
              <div className="absolute inset-[6px] bg-white/90 backdrop-blur-md rounded-full border-2 border-white/80 flex flex-col items-center justify-center shadow-sm">
                <span className="text-xs font-extrabold text-[#3a4746] tracking-widest leading-none drop-shadow-sm group-hover:scale-110 transition-transform">VIBE</span>
              </div>
            </div>
            <div className="mt-2 text-[#3a4746]">
              <p className="text-sm font-extrabold leading-none">Optimal Focus</p>
              <p className="text-[10px] font-bold uppercase tracking-widest mt-1.5 flex items-center justify-center gap-1 opacity-60"><Sparkles className="w-3 h-3 text-[#8de15c]"/>Weekly Balance</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="p-6 bg-[#8de15c]/10 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.05)] rounded-[2.5rem] flex flex-col justify-between relative overflow-hidden group"
          >
            <Egg className="absolute -bottom-4 -right-4 w-28 h-28 text-white/40 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 drop-shadow-none" />
            <div className="flex justify-between items-start relative z-10">
              <div className="p-2.5 bg-white/80 rounded-2xl shadow-sm border border-white">
                  <Egg className="text-[#3a4746] w-6 h-6" />
              </div>
              <span className="text-[10px] font-extrabold text-[#3a4746] bg-white/80 px-2 py-1 rounded-full uppercase tracking-widest shadow-sm border border-white">GOAL</span>
            </div>
            <div className="mt-6 relative z-10 text-[#3a4746]">
              <h4 className="text-3xl font-extrabold tracking-tighter drop-shadow-sm">142g</h4>
              <p className="text-[11px] font-extrabold mt-1 tracking-widest uppercase opacity-80">Protein Target</p>
            </div>
          </motion.div>
        </div>

        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-6 bg-white/60 backdrop-blur-3xl shadow-[0_16px_48px_rgba(0,0,0,0.08)] rounded-[2.5rem] border border-white relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-30 group-hover:opacity-60 transition-opacity translate-x-4 -translate-y-4">
            <Sparkles className="w-28 h-28 text-[#ffa024]" />
          </div>
          <div className="flex items-start gap-4 relative z-10">
            <div className="bg-[#ffa024] p-3 rounded-2xl shadow-[0_4px_16px_rgba(255,160,36,0.5)] border border-[#ffa024]/50">
              <Sparkles className="text-white w-6 h-6" fill="currentColor" />
            </div>
            <div className="space-y-1 mt-1">
              <h4 className="text-[10px] font-extrabold text-[#ffa024] uppercase tracking-widest flex items-center gap-1.5 shadow-white">Magic Insight</h4>
              <p className="text-[#3a4746] text-[15px] leading-snug font-bold mt-1 max-w-[220px]">
                You consume more carbs on weekends. Try balancing with an extra egg or two! 🥚🍳
              </p>
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
