"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { 
  ChevronLeft, ChevronRight, ChevronRight as ChevronRightSm, Trophy, Utensils, 
  Flame, Camera, Plus, Scale, Sparkles, Heart, X, Trash2, Clock, Activity, 
  Coffee, Sandwich, Soup, Apple, Salad, Beef, Fish, Milk, Pizza, Cookie, Egg, 
  Leaf, Info, Timer, Loader2 
} from 'lucide-react';
import PullToRefresh from '../components/PullToRefresh';
import { useUser } from '../context/UserContext';
import AIAssistant from '../components/AIAssistant';
import CuteCalendarModal from '../components/CuteCalendarModal';

interface DiaryScreenProps {
  onOpenPremium?: () => void;
  onNavigateToAdd?: (category: string) => void;
  onOpenScan?: () => void;
}

const FavoriteButton = ({ isFavorite, onClick }: { isFavorite: boolean; onClick: (e: React.MouseEvent) => void }) => {
  return (
    <motion.button 
      whileTap={{ scale: 0.7 }}
      whileHover={{ scale: 1.15 }}
      onClick={onClick} 
      className="focus:outline-none relative flex items-center justify-center w-6 h-6"
    >
      <motion.div
        animate={{ 
          scale: isFavorite ? [1, 1.6, 0.8, 1.2, 1] : 1,
          rotate: isFavorite ? [0, 15, -15, 0] : 0
        }}
        transition={{ duration: 0.5, type: "spring", stiffness: 300 }}
      >
        <Heart 
          className={`w-4 h-4 transition-colors duration-200 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-[#a4afb3] hover:text-red-400'}`} 
        />
      </motion.div>
    </motion.button>
  );
};


export default function DiaryScreen({ onOpenPremium, onNavigateToAdd, onOpenScan }: DiaryScreenProps) {
  const { biometrics, meals, exercises, deleteMeal, addExercise, updateBiometrics, dynamicTargets, addWeightLog, weightLogs, goal: userGoal, waterLogs, updateWater } = useUser();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  
  // Modals & State
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  
  // Form States
  const [newWeight, setNewWeight] = useState(biometrics.weight);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [exForm, setExForm] = useState({ name: '', duration: '' });
  const [isCalculatingEx, setIsCalculatingEx] = useState(false);

  // Date formatted for filtering
  const selectedDateStr = currentDate.toISOString().split('T')[0];

  // Logic to check days with logs
  const daysWithLogs = useMemo(() => {
    const dates = new Set<string>();
    meals.forEach(m => dates.add(m.fullDate));
    exercises.forEach(ex => dates.add(ex.fullDate));
    return dates;
  }, [meals, exercises]);

  // Filtered telemetry
  const filteredMeals = meals.filter(m => m.fullDate === selectedDateStr);
  const filteredExercises = exercises.filter(ex => ex.fullDate === selectedDateStr);

  const totalFoodCals = filteredMeals.reduce((acc, meal) => acc + (meal.calories || 0), 0);
  const totalCarbs = filteredMeals.reduce((acc, meal) => acc + (meal.carbs || 0), 0);
  const totalProtein = filteredMeals.reduce((acc, meal) => acc + (meal.protein || 0), 0);
  const totalFat = filteredMeals.reduce((acc, meal) => acc + (meal.fat || 0), 0);
  const totalExerciseCals = filteredExercises.reduce((acc, ex) => acc + (ex.calories || 0), 0);
  const goalCals = dynamicTargets.cals; 
  const remainingCals = goalCals - totalFoodCals + totalExerciseCals;
  const currentWater = waterLogs.find(l => l.date === selectedDateStr)?.glasses || 0;

  const handleWeightSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(newWeight) addWeightLog(parseFloat(newWeight), selectedDateStr);
    setShowWeightModal(false);
  };

  const handleExerciseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exForm.name || !exForm.duration) return;
    setIsCalculatingEx(true);
    try {
      const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}` },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "system", content: "Estimate calories. Return JSON: { \"calories\": number }" }, { role: "user", content: `Activity: ${exForm.name}, Duration: ${exForm.duration}` }],
          temperature: 0, response_format: { type: "json_object" }
        })
      });
      const data = await resp.json();
      const parsed = JSON.parse(data.choices[0].message.content);
      addExercise({ 
        name: exForm.name, 
        duration: `${exForm.duration} min`, 
        calories: parsed.calories || 100 
      }, selectedDateStr);
      setExForm({ name: '', duration: '' });
      setShowExerciseModal(false);
    } catch (e) { setShowExerciseModal(false); } finally { setIsCalculatingEx(false); }
  };

  const formatDisplayDate = (date: Date) => {
    const today = new Date();
    if (date.toDateString() === today.toDateString()) return 'Today';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const changeDate = (days: number) => {
    const nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + days);
    setCurrentDate(nextDate);
  };

  const getMealIcon = (name: string) => {
    const l = name.toLowerCase();
    if (l.includes('egg')) return <Egg className="w-5 h-5" />;
    if (l.includes('coffee') || l.includes('latte') || l.includes('tea')) return <Coffee className="w-5 h-5" />;
    if (l.includes('salad') || l.includes('veg')) return <Salad className="w-5 h-5" />;
    if (l.includes('bread') || l.includes('toast') || l.includes('sandwich')) return <Sandwich className="w-5 h-5" />;
    if (l.includes('yogurt') || l.includes('milk') || l.includes('dairy')) return <Milk className="w-5 h-5" />;
    if (l.includes('meat') || l.includes('chicken') || l.includes('beef')) return <Beef className="w-5 h-5" />;
    if (l.includes('apple') || l.includes('banana') || l.includes('fruit')) return <Apple className="w-5 h-5" />;
    return <Utensils className="w-5 h-5" />;
  };

  const renderCustomMeals = (category: string) => {
    const categoryMeals = filteredMeals.filter(m => m.type === category);
    
    if (categoryMeals.length === 0) {
      return (
        <div className="py-4 px-2">
          <p className="text-[11px] font-black text-[#b9c3c1] uppercase tracking-widest italic opacity-60">Nothing logged yet...</p>
        </div>
      );
    }

    return (
      <div className="space-y-3 mt-4">
        {categoryMeals.map((meal) => (
          <motion.div key={meal.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="group">
            <div onClick={() => setExpandedItems(p => ({...p, [meal.id]: !p[meal.id]}))} className="flex items-center justify-between bg-[#f8fafb] hover:bg-[#f0f4f5] border border-[#f1f4f5] p-4 rounded-3xl transition-all cursor-pointer shadow-xs active:scale-[0.98]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#a4afb3] shadow-sm group-hover:text-[#8de15c] transition-colors">{getMealIcon(meal.name)}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-[#3a4746] text-sm">{meal.name}</h4>
                    <FavoriteButton isFavorite={favorites[meal.id]} onClick={(e) => { e.stopPropagation(); setFavorites(p => ({...p, [meal.id]: !p[meal.id]})); }} />
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <div className="flex items-center gap-1 bg-white/50 px-1.5 py-0.5 rounded-md border border-gray-100"><span className="text-[8px] font-black text-[#309af0] uppercase">P</span><span className="text-[9px] font-black text-[#3a4746]">{meal.protein}g</span></div>
                    <div className="flex items-center gap-1 bg-white/50 px-1.5 py-0.5 rounded-md border border-gray-100"><span className="text-[8px] font-black text-[#ffa024] uppercase">C</span><span className="text-[9px] font-black text-[#3a4746]">{meal.carbs}g</span></div>
                    <p className="text-[#b9c3c1] text-[9px] font-black ml-1 uppercase">{meal.time}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                 <div className="text-right"><p className="text-sm font-black text-[#3a4746]">{meal.calories} <span className="text-[9px] text-[#89979b] uppercase">Cal</span></p></div>
                 <motion.div animate={{ rotate: expandedItems[meal.id] ? 180 : 0 }} className="text-gray-300"><ChevronRightSm className="w-5 h-5 rotate-90" /></motion.div>
              </div>
            </div>
            
            <AnimatePresence>
              {expandedItems[meal.id] && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="mx-4 mt-1 p-4 bg-white border-x border-b border-[#f1f4f5] rounded-b-3xl grid grid-cols-3 gap-4 shadow-sm">
                    <div className="text-center font-black"><div className="text-[8px] text-[#b9c3c1] uppercase tracking-widest mb-0.5">Carbs</div><div className="text-xs text-blue-500">{meal.carbs}g</div></div>
                    <div className="text-center font-black"><div className="text-[8px] text-[#b9c3c1] uppercase tracking-widest mb-0.5">Protein</div><div className="text-xs text-orange-500">{meal.protein}g</div></div>
                    <div className="text-center font-black"><div className="text-[8px] text-[#b9c3c1] uppercase tracking-widest mb-0.5">Fat</div><div className="text-xs text-purple-500">{meal.fat}g</div></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className="relative h-full overflow-hidden">
      {/* Diary Sanctuary Background */}
      <Image 
        src="/diary_bg.png" 
        alt="Diary Background" 
        fill
        priority
        className="object-cover object-center z-0" 
      />

      <div className="absolute inset-0 z-10">
        <PullToRefresh onRefresh={async () => await new Promise(r => setTimeout(r, 1500))}>
          <header className="w-full mt-8 mb-3 px-4">
            <div className="flex items-center justify-center gap-6 relative max-w-2xl mx-auto">
              <button onClick={() => changeDate(-1)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/50 text-[#3a4746] transition-colors"><ChevronLeft className="w-5 h-5" /></button>
              
              <motion.div 
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCalendar(true)}
                className="cursor-pointer group relative px-4 py-1.5 rounded-2xl hover:bg-white/40 transition-all flex flex-col items-center"
              >
                <h1 className="text-lg font-black text-[#3a4746] tracking-tight">{formatDisplayDate(currentDate)}</h1>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="w-1 h-1 rounded-full bg-[#8de15c]" />
                   <span className="text-[7px] font-black uppercase tracking-widest text-[#8de15c]">View Calendar</span>
                </div>
              </motion.div>

              <button onClick={() => changeDate(1)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/50 text-[#3a4746] transition-colors"><ChevronRight className="w-5 h-5" /></button>
            </div>
          </header>

          <main className="px-4 max-w-2xl mx-auto space-y-4 pb-32">
            {/* Calories Summary Profile Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#f7fff9] rounded-[2.5rem] p-6 shadow-[0_15px_40px_-15px_rgba(141,225,92,0.1)] border border-white/80 overflow-hidden relative">
              <div className="flex justify-between items-start mb-6 px-1">
                <div>
                  <h2 className="text-2xl font-black text-[#3a4746] tracking-tight">Calories</h2>
                  <p className="text-[10px] font-black text-[#b9c3c1] uppercase tracking-[0.2em] mt-0.5">Summary Profile</p>
                </div>
                <motion.div whileTap={{ scale: 0.95 }} onClick={onOpenPremium} className="bg-[#fef2e8] px-3 py-1.5 rounded-xl flex items-center gap-2 cursor-pointer border border-[#fce4d1]/30">
                  <span className="text-[#f1904a] text-[10px] font-black uppercase">{userGoal}</span>
                  <ChevronRightSm className="w-3 h-3 text-[#f1904a]" />
                </motion.div>
              </div>

               <div className="flex items-center gap-8 mb-8 px-2">
                 <div className="relative w-36 h-36 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle className="text-[#eff3f4] stroke-current" cx="72" cy="72" r="62" strokeWidth="12" fill="none" />
                      <motion.circle initial={{ strokeDashoffset: 390 }} animate={{ strokeDashoffset: 390 - (390 * Math.min(totalFoodCals / goalCals, 1)) }} className={`${remainingCals < 200 ? 'text-orange-400' : 'text-[#8de15c]'} stroke-current`} cx="72" cy="72" r="62" strokeWidth="12" fill="none" strokeDasharray="390" strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                       <span className="text-3xl font-black text-[#3a4746] tracking-tighter">{remainingCals}</span>
                       <span className="text-[9px] font-black text-[#b9c3c1] uppercase tracking-widest -mt-1">Remaining</span>
                    </div>
                 </div>
 
                 <div className="flex-1 space-y-3">
                    {[
                      { label: 'Goal', val: goalCals, i: Trophy, bg: 'bg-[#fff5eb]', c: 'text-[#ffa024]' },
                      { label: 'Food', val: totalFoodCals, i: Utensils, bg: 'bg-[#f0f7ff]', c: 'text-[#309af0]' },
                      { label: 'Exercise', val: totalExerciseCals, i: Flame, bg: 'bg-[#fff1f1]', c: 'text-[#ef4444]' }
                    ].map((s, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${s.bg} ${s.c} flex items-center justify-center shadow-sm border border-white`}><s.i className="w-5 h-5" /></div>
                        <div>
                          <p className="text-[8px] font-black text-[#b9c3c1] uppercase tracking-widest">{s.label}</p>
                          <p className="text-base font-black text-[#3a4746] -mt-0.5">{s.val}</p>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="bg-[#f8fafb]/60 border border-[#f1f4f5] rounded-[2rem] p-5">
                <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                   {[
                     { l: 'Carbs', v: totalCarbs, t: dynamicTargets.carbs, col: 'bg-[#ffa024]', dot: '#ffa024' },
                     { l: 'Protein', v: totalProtein, t: dynamicTargets.protein, col: 'bg-[#309af0]', dot: '#309af0' },
                     { l: 'Fat', v: totalFat, t: dynamicTargets.fat, col: 'bg-[#ff9d2d]', dot: '#ff9d2d' },
                     { l: 'Fiber', v: 2, t: 25, col: 'bg-[#8de15c]', dot: '#8de15c' }
                   ].map((m, i) => (
                     <div key={i} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: m.dot }} />
                            <span className="text-[9px] font-black text-[#3a4746] uppercase">{m.l}</span>
                          </div>
                          <span className="text-[8px] font-black text-[#3a4746]">{m.v}g <span className="text-[#b9c3c1]">/{m.t}g</span></span>
                        </div>
                        <div className="h-1.5 bg-gray-100/50 rounded-full overflow-hidden border border-white">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min((m.v/m.t)*100, 100)}%` }} className={`h-full ${m.col}`} />
                        </div>
                     </div>
                   ))}
                </div>
              </div>
            </motion.div>

            {/* Daily Report Card */}
            <div onClick={() => setIsAssistantOpen(true)} className="bg-[#f7fff9] rounded-[2rem] p-6 shadow-sm border border-white/80 cursor-pointer active:scale-[0.99] transition-all">
              <div className="flex justify-between items-center mb-6 px-1"><h3 className="text-xl font-black text-[#3a4746] tracking-tight">Daily Report</h3><div className="bg-[#8de15c]/10 text-[#8de15c] px-3 py-1 rounded-full font-black text-[9px] uppercase tracking-widest">Ask Bunny</div></div>
              <div className="space-y-4">
                {[{ l: 'Nutrition', v: 'Excellent', i: Utensils, c: 'text-[#8de15c]', bg: 'bg-[#8de15c]/5' }, { l: 'Activity', v: 'On track', i: Activity, c: 'text-[#309af0]', bg: 'bg-[#309af0]/5' }, { l: 'Mood', v: 'Energetic', i: Sparkles, c: 'text-[#ffa024]', bg: 'bg-[#ffa024]/5' }].map((it, i) => (
                  <div key={i} className="flex items-center justify-between"><div className="flex items-center gap-3"><div className={`w-10 h-10 rounded-xl ${it.bg} flex items-center justify-center ${it.c} border border-white shadow-xs`}><it.i className="w-5 h-5" /></div><span className="font-black text-[#3a4746] text-sm">{it.l}</span></div><div className="flex items-center gap-2"><span className="text-[10px] font-black text-[#b9c3c1] uppercase tracking-wider">{it.v}</span><ChevronRightSm className="w-3 h-3 text-gray-200" /></div></div>
                ))}
              </div>
            </div>

            {/* Meal Sections */}
            {[
              { id: 'Breakfast', icon: Coffee, col: 'text-orange-400', bg: 'bg-orange-50' },
              { id: 'Lunch', icon: Sandwich, col: 'text-blue-500', bg: 'bg-blue-50' },
              { id: 'Dinner', icon: Soup, col: 'text-purple-500', bg: 'bg-purple-50' },
              { id: 'Snacks', icon: Apple, col: 'text-red-500', bg: 'bg-red-50' }
            ].map((cat) => (
              <div key={cat.id} className="bg-[#f7fff9] rounded-[2rem] p-6 shadow-sm border border-white/80 transition-all">
                <div className="flex justify-between items-center px-1">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl ${cat.bg} ${cat.col} flex items-center justify-center shadow-xs border border-white`}><cat.icon className="w-6 h-6" /></div>
                    <h3 className="text-xl font-black text-[#3a4746] tracking-tight">{cat.id}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.button whileTap={{ scale: 0.85 }} onClick={(e) => { e.stopPropagation(); onOpenScan?.(); }} className="relative w-9 h-9 rounded-lg border border-[#8de15c] flex items-center justify-center text-[#8de15c] transition-colors"><Camera size={16} /><div className="absolute -top-1.5 -right-1.5 bg-[#ffa024] text-white text-[7px] font-extrabold px-1 py-0.5 rounded shadow-xs border border-white">AI</div></motion.button>
                    <motion.button whileTap={{ scale: 0.85 }} onClick={(e) => { e.stopPropagation(); onNavigateToAdd?.(cat.id); }} className="w-9 h-9 rounded-full border border-[#8de15c] text-[#8de15c] flex items-center justify-center transition-colors"><Plus size={20} /></motion.button>
                  </div>
                </div>
                {renderCustomMeals(cat.id)}
              </div>
            ))}

            <div className="bg-[#f7fff9] rounded-[2rem] p-6 shadow-sm border border-white/80">
              <div className="flex justify-between items-center mb-6 px-1 text-[#3a4746]">
                <div className="flex items-center gap-3"><div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shadow-xs border border-white"><Flame className="w-6 h-6" /></div><h3 className="text-xl font-black tracking-tight">Exercises</h3></div>
                <button onClick={() => setShowExerciseModal(true)} className="w-9 h-9 rounded-full border border-[#8de15c]/20 text-[#8de15c] flex items-center justify-center hover:bg-[#8de15c]/5 transition-colors"><Plus size={22} /></button>
              </div>
              <div className="space-y-3">
                {filteredExercises.map(ex => (
                  <div key={ex.id} className="bg-[#fcf8f8] rounded-[1.5rem] p-4 flex justify-between items-center border border-red-50/30">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-lg bg-white flex items-center justify-center text-red-500 shadow-xs border border-gray-50"><Activity size={20} /></div>
                      <div><h4 className="font-black text-[#3a4746] text-sm">{ex.name}</h4><p className="text-[#b9c3c1] text-[9px] font-black uppercase tracking-widest">{ex.duration} • {ex.time}</p></div>
                    </div>
                    <span className="text-[#ef4444] font-black text-base">-{ex.calories} <span className="text-[9px] opacity-60">CAL</span></span>
                  </div>
                ))}
                {filteredExercises.length === 0 && <p className="text-center py-2 text-[10px] font-black text-[#b9c3c1] uppercase tracking-widest italic opacity-60">No exercises logged...</p>}
              </div>
            </div>

            <div className="bg-[#f7fff9] rounded-[2rem] p-6 shadow-sm border border-white/80 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#ffe9c9] rounded-xl flex items-center justify-center shadow-xs border border-white"><Scale className="w-7 h-7 text-[#ffa024]" /></div>
                <div><h4 className="font-black text-[#3a4746] text-lg tracking-tight">Weigh-in</h4><p className="text-[#b9c3c1] text-xs font-black uppercase tracking-wider">{weightLogs[0]?.weight || biometrics.weight} <span className="text-[9px]">KG</span></p></div>
              </div>
              <button onClick={() => setShowWeightModal(true)} className="px-6 py-2.5 bg-[#f8fafb] border border-[#f1f4f5] rounded-xl text-[#3a4746] font-black text-[10px] hover:bg-[#eff3f4] transition-all active:scale-95 shadow-xs">Record</button>
            </div>

            <div className="bg-[#f7fff9] rounded-[2rem] p-6 shadow-sm border border-white/80 transition-all">
              <div className="flex justify-between items-center mb-6 px-1">
                <div>
                  <h3 className="text-xl font-black text-[#3a4746] tracking-tight">Water</h3>
                  <div className="bg-[#e9f4ff] text-[#309af0] text-[8px] font-black px-3 py-1 rounded-md uppercase tracking-widest mt-1 border border-blue-50">Goal: 2000ml</div>
                </div>
                <div className="bg-[#f8fafb] text-[#309af0] px-4 py-2 rounded-xl font-black text-base border border-white shadow-xs">{Math.min(Math.round((currentWater/8)*100), 100)}% <span className="text-[9px] text-gray-300 ml-1">Daily</span></div>
              </div>
              <div className="flex justify-between items-center gap-2 px-1">
                {Array.from({ length: 8 }).map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => updateWater(currentWater === i + 1 ? i : i + 1, selectedDateStr)}
                    className="relative w-8 h-12 flex flex-col items-center group active:scale-95 transition-transform"
                  >
                    {/* Premium Glass Vessel */}
                    <div className="w-full h-full relative">
                      {/* Glass Body */}
                      <div className="absolute inset-0 bg-white/40 backdrop-blur-sm border-2 border-white/60 rounded-b-xl rounded-t-[2px] shadow-sm overflow-hidden">
                        {/* Liquid Content */}
                        <motion.div 
                          initial={false}
                          animate={{ height: currentWater > i ? '70%' : '0%' }}
                          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#309af0] to-[#60b3f5] opacity-80"
                        >
                           {/* Shine/Reflection on Water */}
                           <div className="absolute top-0 left-0 w-full h-1 bg-white/20 blur-[1px]" />
                        </motion.div>
                        
                        {/* Glass Reflection Shine */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
                        <div className="absolute top-1 left-1 w-1 h-[60%] bg-white/20 rounded-full blur-[0.5px] pointer-events-none" />
                      </div>
                      
                      {/* Glass Lip */}
                      <div className="absolute -top-[1px] left-0 right-0 h-[2px] bg-white/80 rounded-full shadow-[0_0_5px_rgba(255,255,255,0.5)]" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </main>
        </PullToRefresh>
      </div>

      <CuteCalendarModal 
        isOpen={showCalendar} 
        onClose={() => setShowCalendar(false)} 
        currentDate={currentDate} 
        onSelectDate={(d) => setCurrentDate(d)}
        daysWithLogs={daysWithLogs}
      />

      <AnimatePresence>
        {showWeightModal && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowWeightModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.form onSubmit={handleWeightSubmit} initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-sm bg-white rounded-[3.5rem] p-12 shadow-2xl flex flex-col items-center border border-white">
              <div className="w-20 h-20 bg-[#fff7ed] rounded-[2rem] flex items-center justify-center text-[#ffa024] mb-6 shadow-sm border border-white"><Scale className="w-10 h-10" /></div>
              <h3 className="text-3xl font-black text-[#3a4746] mb-2 tracking-tight">Record Weight</h3>
              <p className="text-[11px] text-[#b9c3c1] font-black mb-10 text-center uppercase tracking-[0.2em]">Hop on the sanctuary scale!</p>
              <div className="w-full relative mb-10">
                <input type="number" step="0.1" value={newWeight} onChange={(e) => setNewWeight(e.target.value)} className="w-full bg-[#f8fafb] border border-[#f1f4f5] rounded-3xl px-8 py-6 text-5xl font-black text-center text-[#3a4746] outline-none shadow-inner" autoFocus />
                <span className="absolute right-10 top-1/2 -translate-y-1/2 font-black text-[#b9c3c1] tracking-widest text-sm">KG</span>
              </div>
              <button type="submit" className="w-full bg-[#8de15c] py-6 rounded-3xl text-white font-black text-xl shadow-xl shadow-[#8de15c]/30 active:scale-95 transition-all">Save Progress</button>
            </motion.form>
          </div>
        )}

        {showExerciseModal && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowExerciseModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.form onSubmit={handleExerciseSubmit} initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-sm bg-white rounded-[3.5rem] p-12 shadow-2xl flex flex-col border border-white">
              <div className="flex items-center gap-5 mb-10">
                 <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 shadow-sm border border-white"><Activity className="w-9 h-9" /></div>
                 <div><h3 className="text-3xl font-black text-[#3a4746] tracking-tight">Log Energy</h3><p className="text-[11px] text-[#b9c3c1] font-black uppercase tracking-widest mt-1">Smart Burn Calc</p></div>
              </div>
              <div className="space-y-8 mb-12">
                <div className="space-y-3"><label className="text-[11px] font-black text-[#b9c3c1] uppercase ml-1 tracking-[0.2em]">Activity Name</label><input type="text" placeholder="e.g. Brisk Walk" value={exForm.name} onChange={(e) => setExForm({...exForm, name: e.target.value})} className="w-full bg-[#f8fafb] border border-[#f1f4f5] rounded-2xl px-7 py-5 text-sm font-black outline-none shadow-xs" autoFocus /></div>
                <div className="space-y-3"><label className="text-[11px] font-black text-[#b9c3c1] uppercase ml-1 tracking-[0.2em]">Minutes</label><div className="relative"><input type="number" placeholder="0" value={exForm.duration} onChange={(e) => setExForm({...exForm, duration: e.target.value})} className="w-full bg-[#f8fafb] border border-[#f1f4f5] rounded-2xl px-7 py-5 text-sm font-black outline-none shadow-xs" /><Timer className="absolute right-7 top-1/2 -translate-y-1/2 w-7 h-7 text-[#b9c3c1]" /></div></div>
              </div>
              <button disabled={isCalculatingEx} type="submit" className="w-full bg-[#8de15c] py-6 rounded-3xl text-white font-black text-xl shadow-xl shadow-[#8de15c]/30 flex items-center justify-center gap-4 active:scale-95 transition-all">
                {isCalculatingEx ? <Loader2 className="w-7 h-7 animate-spin" /> : <><Flame className="w-6 h-6" /> Calculate & Add</>}
              </button>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

      <AIAssistant isOpen={isAssistantOpen} onClose={() => setIsAssistantOpen(false)} />
    </div>
  );
}
