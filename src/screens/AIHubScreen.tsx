"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ArrowRight,
  Brain,
  CircleDot,
  Orbit,
  Dna,
  ShieldCheck,
  History,
  TrendingUp,
  Activity,
  Mic,
  Camera,
  ChevronRight,
  Lightbulb,
  Utensils,
  Carrot,
  Loader2
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { analyzeMeal } from '../services/aiService';

// Luminous Sanctuary Design Tokens
const COLORS = {
  background: '#F9FAFB',
  text: '#1A1A1C',
  mint: '#7ED957',
  lavender: '#A78BFA',
  glass: 'rgba(255, 255, 255, 0.7)',
  glassBorder: 'rgba(0, 0, 0, 0.05)',
  accentMint: 'rgba(126, 217, 87, 0.15)',
  accentLavender: 'rgba(167, 139, 250, 0.15)'
};

interface AIHubScreenProps {
  onNavigateToScan: () => void;
  onNavigateToAdd: (category: string) => void;
}

export default function AIHubScreen({ onNavigateToScan, onNavigateToAdd }: AIHubScreenProps) {
  const { addMeal, meals, dynamicTargets } = useUser();
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastLogged, setLastLogged] = useState<any>(null);
  const [greeting, setGreeting] = useState("Good evening");
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  const startSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.start();
  };

  const handleAISubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isProcessing) return;

    setIsProcessing(true);
    try {
      const items = await analyzeMeal(input);
      if (items && Array.isArray(items)) {
        items.forEach(item => {
          const mealData = {
            name: item.name || "Unknown item",
            calories: item.calories || 0,
            protein: item.protein || 0,
            carbs: item.carbs || 0,
            fat: item.fat || 0,
            fiber: item.fiber || 0,
            type: 'Lunch' as any,
            emoji: '🐰'
          };
          addMeal(mealData);
          setLastLogged({ ...mealData, id: 'temp', time: 'Just now' }); // Keep for UI feedback
        });
        
        setShowSuccess(true);
        setInput('');
        setTimeout(() => setShowSuccess(false), 5000);
      }
    } catch (error) {
      console.error('AI Processing Error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const currentMacros = meals.reduce((acc, meal) => ({
    calories: acc.calories + meal.calories,
    protein: acc.protein + meal.protein,
    carbs: acc.carbs + meal.carbs,
    fat: acc.fat + meal.fat
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  return (
    <div className="h-full relative overflow-hidden font-jakarta" style={{ backgroundColor: COLORS.background }}>
      {/* Luminous Aura Orbs */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15], x: [0, 40, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-20%] w-[100%] h-[70%] rounded-full pointer-events-none blur-[120px]" 
        style={{ background: `radial-gradient(circle, ${COLORS.mint}, transparent)` }} 
      />
      <motion.div 
        animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1], x: [0, -50, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-10%] right-[-20%] w-[100%] h-[70%] rounded-full pointer-events-none blur-[150px]" 
        style={{ background: `radial-gradient(circle, ${COLORS.lavender}, transparent)` }} 
      />

      <div className="relative z-10 p-6 space-y-8 h-full overflow-y-auto pb-32">
        {/* Header - Redesigned with requested text */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Carrot size={20} className="text-[#FFA024]" fill="#FFA024" />
            <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">{greeting} Bunny!</h1>
          </div>
          <motion.div 
            whileHover={{ rotate: 180 }}
            className="p-3 rounded-2xl border border-black/5 bg-white/40 backdrop-blur-xl shadow-sm"
          >
            <Orbit size={24} className="text-gray-400" />
          </motion.div>
        </header>

        {/* Hero: High Fidelity Input with requested text */}
        <div className="space-y-8">
          <div className="text-center space-y-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-block"
            >
              <div className="w-28 h-28 mx-auto bg-white rounded-[2.5rem] flex items-center justify-center shadow-xl border border-white/80 relative overflow-hidden group">
                 <div className="absolute inset-0 bg-[#7ED957]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                 <img src="/logo.png" alt="Bunny" className="w-full h-full object-contain relative z-10" />
              </div>
            </motion.div>
            
            <div className="space-y-2">
              <h2 className="text-4xl font-black text-gray-900 tracking-tight leading-none">
                What can I <br/><span style={{ color: COLORS.mint }}>record for you?</span>
              </h2>
              <p className="text-sm font-bold text-gray-400">Instantly log food or activities using natural language.</p>
            </div>
          </div>

          <div className="relative group">
            <motion.div 
              animate={{ opacity: [0.2, 0.3, 0.2] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -inset-1 rounded-[2.5rem] blur-2xl group-focus-within:opacity-100 transition-opacity"
              style={{ background: `linear-gradient(45deg, ${COLORS.mint}, ${COLORS.lavender})` }}
            />
            
            <form onSubmit={handleAISubmit} className="relative bg-white/80 border border-white/80 rounded-[2.5rem] p-8 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.03)] focus-within:shadow-[0_25px_60px_rgba(0,0,0,0.06)] transition-all">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="I'm eating an avocado bagel and a small latte..."
                className="w-full bg-transparent text-gray-900 placeholder-gray-300 resize-none h-28 focus:outline-none text-xl font-bold leading-relaxed"
              />

              <div className="mt-6 flex items-center justify-between">
                <div className="flex gap-4">
                  <button 
                    type="button" 
                    onClick={startSpeechRecognition}
                    className={`p-3 rounded-2xl transition-all shadow-sm border border-gray-100 ${isRecording ? 'bg-red-50 text-red-500 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'bg-gray-50 hover:bg-white text-gray-300 hover:text-gray-900'}`}
                  >
                    <Mic size={22} />
                  </button>
                  <button 
                    type="button" 
                    onClick={onNavigateToScan}
                    className="p-3 rounded-2xl bg-gray-50 hover:bg-white text-gray-300 hover:text-gray-900 transition-all shadow-sm border border-gray-100"
                  >
                    <Camera size={22} />
                  </button>
                </div>
                
                <button
                  type="submit"
                  disabled={isProcessing || !input.trim()}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-2xl font-black text-white active:scale-95 transition-all shadow-[0_10px_30px_rgba(126,217,87,0.3)] disabled:opacity-50"
                  style={{ background: `linear-gradient(135deg, ${COLORS.mint}, #B5FF9C)` }}
                >
                  {isProcessing ? <Activity className="animate-spin" size={18} /> : <ArrowRight size={20} />}
                  <span className="text-[11px] uppercase tracking-[0.15em]">{isProcessing ? 'Analyzing' : 'Log Everything'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Feature Cards with requested text */}
        <div className="space-y-6">
          <motion.div 
            whileHover={{ y: -5 }}
            className="p-8 rounded-[2.5rem] border border-gray-100 bg-white/60 backdrop-blur-xl relative overflow-hidden group shadow-sm"
          >
            <div className="absolute top-0 left-0 w-1.5 h-full" style={{ background: `linear-gradient(to bottom, ${COLORS.mint}, ${COLORS.lavender})` }}></div>
            <div className="flex items-start gap-5">
              <div className="p-3 rounded-2xl" style={{ backgroundColor: COLORS.accentMint, color: COLORS.mint }}>
                <Lightbulb size={28} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: COLORS.mint }}>Growth Mindset</span>
                </div>
                <h4 className="text-xl font-extrabold text-gray-900 tracking-tight">Stay sharp today.</h4>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">
                  Boost metabolism by 15% with a quick morning walk or cold water.
                </p>
              </div>
              <div className="ml-auto p-2 rounded-full bg-gray-50 text-gray-300">
                <ChevronRight size={20} />
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-5">
            <motion.div whileHover={{ y: -5 }} className="bg-white/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-red-500 bg-red-50">
                <Activity size={24} />
              </div>
              <div>
                <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Biometric Sync</h5>
                <p className="text-3xl font-black text-gray-900">98%</p>
              </div>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="bg-white/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-blue-500 bg-blue-50">
                <Utensils size={24} />
              </div>
              <div>
                <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Nutritional Precision</h5>
                <p className="text-3xl font-black text-gray-900">Stable</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Recent Telemetry - History Card */}
        <div className="p-8 rounded-[2.5rem] border border-gray-100 bg-white/60 backdrop-blur-2xl group overflow-hidden shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Recent Telemetry</h5>
            <History size={16} className="text-gray-300" />
          </div>
          
          <div className="space-y-4">
            {meals.length > 0 ? (
              meals.slice(0, 3).map((meal, i) => (
                <div key={meal.id} className="flex items-center gap-4 group/item">
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-2xl border border-gray-50 shadow-inner">
                    {meal.emoji || '🥕'}
                  </div>
                  <div className="flex-grow">
                    <h6 className="text-sm font-bold text-gray-900">{meal.name}</h6>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{meal.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-gray-900">+{meal.calories}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">kcal</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm font-medium text-gray-400 py-4 text-center">No telemetry recorded yet.</p>
            )}
          </div>
        </div>

        {/* Success Confirmation Overlay */}
        <AnimatePresence>
          {showSuccess && lastLogged && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed bottom-32 left-6 right-6 z-50 p-6 rounded-[2.5rem] border border-gray-100 bg-white/95 backdrop-blur-3xl shadow-[0_40px_100px_rgba(0,0,0,0.1)]"
            >
              <div className="flex items-center gap-5">
                <div className="flex-shrink-0 w-16 h-16 rounded-3xl flex items-center justify-center text-4xl bg-gray-50 border border-gray-100">
                  {lastLogged.emoji || '🥕'}
                </div>
                <div className="flex-grow">
                  <p className="text-[10px] tracking-[0.4em] font-black text-gray-300 uppercase mb-1">Telemetry Logged</p>
                  <h4 className="text-gray-900 font-extrabold text-xl">{lastLogged.name}</h4>
                  <p className="text-sm font-bold" style={{ color: COLORS.mint }}>Verified Entry</p>
                </div>
                <div className="p-3 rounded-full bg-emerald-50" style={{ color: COLORS.mint }}>
                  <ShieldCheck size={32} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
