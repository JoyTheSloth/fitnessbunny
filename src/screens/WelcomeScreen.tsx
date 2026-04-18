"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSession, signIn } from 'next-auth/react';
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
  const { data: session } = useSession();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);

  const backgrounds = ['/1.png', '/2.png', '/3.png'];

  useEffect(() => {
    const timer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 5000); 
    return () => clearInterval(timer);
  }, []);

  // Auto-start if Google Session is active
  useEffect(() => {
    if (session?.user?.name && session?.user?.email) {
      setIsTransitioning(true);
      setTimeout(() => {
        onStart(session.user!.name!, session.user!.email!);
      }, 500);
    }
  }, [session, onStart]);

  const handleStart = () => {
    if (!name.trim() || !email.trim()) return;
    setIsTransitioning(true);
    setTimeout(() => {
      onStart(name, email);
    }, 800);
  };

  return (
    <div className="h-screen w-full relative overflow-hidden bg-black font-jakarta flex items-center justify-center p-6">
      {/* Dynamic Background */}
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

              <div className="space-y-3 pt-2">
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

                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                  <div className="relative flex justify-center text-[8px] uppercase font-black tracking-widest text-gray-300">
                    <span className="bg-white px-2">Social Hub</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => signIn('google')}
                  className="w-full py-4 rounded-2xl font-black text-gray-700 bg-white border-2 border-gray-100 hover:border-gray-200 transition-all flex items-center justify-center gap-3 shadow-sm"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-xs">Continue with Google</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
