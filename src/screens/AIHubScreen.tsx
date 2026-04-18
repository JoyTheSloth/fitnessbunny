"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { 
  Sparkles, 
  Brain,
  Orbit,
  History,
  Activity,
  Mic,
  ChevronRight,
  Lightbulb,
  Utensils,
  Carrot,
  Loader2,
  Trash2
} from 'lucide-react';
import { useUser } from '../context/UserContext';

// Luminous Sanctuary Design Tokens
const COLORS = {
  background: '#F9FAFB',
  text: '#3a4746',
  mint: '#7ED957',
  lavender: '#A78BFA',
  accentMint: 'rgba(126, 217, 87, 0.15)',
};

interface AIHubScreenProps {
  onNavigateToScan: () => void;
  onNavigateToAdd: (category: string) => void;
}

export default function AIHubScreen({ onNavigateToScan, onNavigateToAdd }: AIHubScreenProps) {
  const { meals, updateWater } = useUser();
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [greeting, setGreeting] = useState("Good evening");
  const [isRecording, setIsRecording] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

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
    setAiResponse(null);
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{
            role: "system",
            content: `You are Bunny, a highly professional yet incredibly sarcastic gym trainer. 
            Speak in Hinglish (Hindi + English). 
            Use lots of emojis like 💪, 🔥, 🏋️. 
            
            CORE REQUIREMENT: You must be SCIENTIFICALLY ACCURATE. 
            - If a user mentions food (e.g., 10 eggs, 500g chicken), calculate the macros EXACTLY (e.g., 1 egg ≈ 6g protein, 10 eggs = 60g protein).
            - Do not answer "in the air". Use standard nutritional data for your calculations.
            - Provide a quick breakdown of calories, protein, carbs, and fat when food is mentioned.
            
            PERSONA: Be helpful but sarcastic. Make fun of the user if they are eating junk or slacking, but always give them the real numbers they need to hear.
            Keep responses concise and punchy.`
          }, {
            role: "user",
            content: input
          }],
          temperature: 0.7
        })
      });
      const data = await response.json();
      const content = data.choices[0].message.content;
      setAiResponse(content);
    } catch (error) {
      console.error('AI Hub Error:', error);
      setAiResponse("Bhai, server down hai lagta hai. Thoda wait karlo! 😤");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-full relative overflow-hidden font-jakarta">
      {/* AI Hub Sanctuary Background */}
      <Image 
        src="/bg.png" 
        alt="Sanctuary Background" 
        fill
        priority
        className="object-cover object-center z-0" 
      />
      
      {/* Soft Overlay */}
      <div className="absolute inset-0 z-10 bg-white/10 backdrop-blur-[2px]" />

      <div className="relative z-20 p-6 space-y-8 h-full overflow-y-auto pb-32">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Carrot size={20} className="text-[#FFA024]" fill="#FFA024" />
            <h1 className="text-xl font-extrabold text-white tracking-tight">{greeting} Bunny!</h1>
          </div>
          <motion.div 
            whileHover={{ rotate: 180 }}
            className="p-3 rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl shadow-sm"
          >
            <Orbit size={24} className="text-white/60" />
          </motion.div>
        </header>

        {/* Hero Section */}
        <div className="space-y-8">
          <div className="text-center space-y-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-block"
            >
              <div className="relative w-28 h-28 mx-auto bg-white rounded-[2.5rem] flex items-center justify-center shadow-xl border border-white/80 overflow-hidden">
                 <Image src="/logo.png" alt="Bunny" width={112} height={112} className="object-contain relative z-10" />
              </div>
            </motion.div>
            
            <div className="space-y-2">
              <h2 className="text-4xl font-black text-white tracking-tight leading-none">
                What can I <br/><span style={{ color: COLORS.mint }}>record for you?</span>
              </h2>
              <p className="text-sm font-bold text-white/60">Instantly log food or activities using natural language.</p>
            </div>
          </div>

          {/* Ask Bunny Input Card */}
          <div className="relative group">
            {/* Ambient Aura Glow */}
            <motion.div 
              animate={{ opacity: [0.1, 0.2, 0.1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -inset-1 rounded-[2.5rem] blur-2xl group-focus-within:opacity-40 transition-opacity"
              style={{ background: `linear-gradient(45deg, ${COLORS.mint}, ${COLORS.lavender})` }}
            />
            
            <div className="relative bg-[#f7fff9] rounded-[2.5rem] p-8 border border-white/80 shadow-[0_20px_40px_rgba(0,0,0,0.02)] overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-[0.03]">
                <Sparkles className="w-24 h-24 text-primary" />
              </div>

              <form onSubmit={handleAISubmit} className="relative z-10 space-y-6">
                <div className="relative">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="I'm eating an avocado bagel and a small latte..."
                    className="w-full bg-white/40 border border-white/80 rounded-[2rem] px-8 py-6 text-xl font-bold text-[#3a4746] placeholder:text-[#b9c3c1] focus:ring-4 focus:ring-primary/5 transition-all resize-none min-h-[160px] shadow-inner outline-none leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={isRecording ? () => {} : startSpeechRecognition}
                    className={`p-4 rounded-2xl border transition-all active:scale-90 ${
                      isRecording 
                        ? 'bg-red-500 border-red-400 text-white animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.3)]' 
                        : 'bg-white border-white/60 text-[#b9c3c1] hover:text-[#3a4746] shadow-sm'
                    }`}
                  >
                    <Mic size={22} />
                  </button>

                  <button
                    type="submit"
                    disabled={isProcessing || !input.trim()}
                    className="flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-white active:scale-95 transition-all shadow-[0_15px_35px_rgba(126,217,87,0.3)] disabled:opacity-50"
                    style={{ background: `linear-gradient(135deg, ${COLORS.mint}, #B5FF9C)` }}
                  >
                    {isProcessing ? <Loader2 className="animate-spin" size={20} /> : <Brain size={22} />}
                    <span className="text-[12px] uppercase tracking-[0.2em]">{isProcessing ? 'Consulting' : 'Ask Bunny'}</span>
                  </button>
              </div>
            </form>
          </div>
        </div>

          <AnimatePresence>
            {aiResponse && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#f7fff9] border border-white/80 rounded-[2.5rem] p-8 shadow-sm relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-6 opacity-5">
                  <Brain className="w-24 h-24 text-[#7ED957]" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-[#7ED957] flex items-center justify-center text-white shadow-sm">
                      <Sparkles size={18} fill="currentColor" />
                    </div>
                    <span className="text-[11px] font-black uppercase text-[#7ED957] tracking-[0.3em]">Trainer Bunny</span>
                    
                    <button 
                      onClick={() => setAiResponse(null)}
                      className="ml-auto p-2 bg-white/50 text-[#3a4746]/20 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-95"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <p className="text-[#3a4746] font-bold text-lg leading-relaxed whitespace-pre-wrap">
                    {aiResponse}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Feature Cards (Solid Restoration) */}
        <div className="space-y-6">
          <motion.div 
            whileHover={{ y: -5 }}
            className="p-8 rounded-[2.5rem] border border-white/80 bg-[#f7fff9] relative overflow-hidden group shadow-sm"
          >
            <div className="absolute top-0 left-0 w-1.5 h-full" style={{ background: `linear-gradient(to bottom, #7ED957, #A78BFA)` }}></div>
            <div className="flex items-start gap-5">
              <div className="p-3 rounded-2xl" style={{ backgroundColor: 'rgba(126, 217, 87, 0.1)', color: '#7ED957' }}>
                <Lightbulb size={28} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#7ED957]">Growth Mindset</span>
                </div>
                <h4 className="text-xl font-extrabold text-[#3a4746] tracking-tight">Stay sharp today.</h4>
                <p className="text-sm text-[#89979b] leading-relaxed font-medium">
                  Boost metabolism by 15% with a quick morning walk or cold water.
                </p>
              </div>
              <div className="ml-auto p-2 rounded-full bg-white/50 text-[#3a4746]/20">
                <ChevronRight size={20} />
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-5">
            <motion.div whileHover={{ y: -5 }} className="bg-[#f7fff9] p-8 rounded-[2.5rem] border border-white/80 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-red-500 bg-red-50">
                <Activity size={24} />
              </div>
              <div>
                <h5 className="text-[10px] font-black text-[#b9c3c1] uppercase tracking-widest mb-1">Biometric Sync</h5>
                <p className="text-3xl font-black text-[#3a4746]">98%</p>
              </div>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="bg-[#f7fff9] p-8 rounded-[2.5rem] border border-white/80 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-blue-500 bg-blue-50">
                <Utensils size={24} />
              </div>
              <div>
                <h5 className="text-[10px] font-black text-[#b9c3c1] uppercase tracking-widest mb-1">Nutritional Precision</h5>
                <p className="text-3xl font-black text-[#3a4746]">Stable</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Recent Telemetry - History Card */}
        <div className="p-8 rounded-[2.5rem] border border-white/80 bg-[#f7fff9] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h5 className="text-[10px] font-black text-[#b9c3c1] uppercase tracking-[0.3em]">Recent Telemetry</h5>
            <History size={16} className="text-[#b9c3c1]" />
          </div>
          
          <div className="space-y-4">
            {meals.length > 0 ? (
              meals.slice(0, 3).map((meal) => (
                <div key={meal.id} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#f8fafb] flex items-center justify-center text-2xl border border-[#f1f4f5] shadow-sm">
                    {meal.emoji || '🥕'}
                  </div>
                  <div className="flex-grow">
                    <h6 className="text-sm font-bold text-[#3a4746]">{meal.name}</h6>
                    <p className="text-[10px] font-bold text-[#b9c3c1] uppercase tracking-wider">{meal.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-[#3a4746]">+{meal.calories}</p>
                    <p className="text-[10px] font-bold text-[#b9c3c1] uppercase">kcal</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm font-medium text-[#b9c3c1] py-4 text-center italic">No telemetry recorded yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
