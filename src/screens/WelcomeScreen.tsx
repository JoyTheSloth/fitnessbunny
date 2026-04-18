"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight,
  Brain,
  ShieldCheck,
  User,
  Mail,
  Carrot
} from 'lucide-react';

interface WelcomeScreenProps {
  onStart: (name: string, email: string) => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);

  const backgrounds = ['/1.png', '/2.png', '/3.png'];

  React.useEffect(() => {
    const timer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 5000); // Cycle every 5 seconds
    return () => clearInterval(timer);
  }, []);

  const handleStart = () => {
    if (!name.trim() || !email.trim()) return;
    setIsTransitioning(true);
    setTimeout(() => {
      onStart(name, email);
    }, 800);
  };

  return (
    <div className="h-screen w-full relative overflow-hidden bg-black font-jakarta flex items-center justify-center p-6">
      {/* Dynamic Background Auto-Carousel with Dampened Opacity */}
      <AnimatePresence mode="sync">
        <motion.img 
          key={backgrounds[bgIndex]}
          src={backgrounds[bgIndex]}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.3, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none" 
        />
      </AnimatePresence>
      
      {/* Dark Gradient Shroud for Maximum Contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none z-0" />

      <AnimatePresence mode="wait">
        {!isTransitioning && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, y: -20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-sm z-10"
          >
            {/* Logo Insignia Card */}
            <div className="mb-10 text-center space-y-6">
              <motion.div 
                initial={{ rotate: -10, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                className="inline-block"
              >
                <div className="w-24 h-24 mx-auto bg-white rounded-[2.5rem] flex items-center justify-center shadow-2xl border border-white relative overflow-hidden">
                   <img src="/logo.png" alt="Bunny" className="w-full h-full object-contain p-2" />
                </div>
              </motion.div>
              
              <div className="space-y-2 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                <div className="flex items-center justify-center gap-2 mb-1">
                   <Carrot size={20} className="text-[#FFA024]" fill="#FFA024" />
                </div>
                <h1 className="text-3xl font-black text-white tracking-tight leading-tight">
                  Hi, I am <span className="text-[#FFA024]">Fitness</span><span className="text-[#7ED957]">Buddy</span>
                </h1>
                <p className="text-sm font-extrabold text-white/90 max-w-[260px] mx-auto leading-normal">
                  Your personal calorie calculator and workout companion.
                </p>
              </div>
            </div>

            {/* Input Form Card - High-Contrast Edition */}
            <div className="bg-white/95 backdrop-blur-3xl p-8 rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.3)] border border-white space-y-5">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest ml-1 flex items-center gap-2">
                    What's your name, Bunny?
                  </label>
                  <input 
                    type="text" 
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-100 border border-transparent rounded-2xl px-5 py-3.5 text-sm font-black text-gray-900 placeholder-gray-400 focus:bg-white focus:border-[#7ED957] focus:outline-none transition-all shadow-inner"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest ml-1 flex items-center gap-2">
                    Bunny's email
                  </label>
                  <input 
                    type="email" 
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-100 border border-transparent rounded-2xl px-5 py-3.5 text-sm font-black text-gray-900 placeholder-gray-400 focus:bg-white focus:border-[#A78BFA] focus:outline-none transition-all shadow-inner"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStart}
                disabled={!name.trim() || !email.trim()}
                className="w-full py-4.5 rounded-2xl font-black text-white uppercase tracking-[0.2em] shadow-xl disabled:opacity-50 transition-all flex items-center justify-center gap-3"
                style={{ background: `linear-gradient(135deg, #7ED957, #B5FF9C)` }}
              >
                <span className="text-xs">Join Bunny</span>
                <ArrowRight size={18} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
