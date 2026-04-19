"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSession, signIn } from 'next-auth/react';
import Image from 'next/image';
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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleEntry = () => {
    if (session?.user?.name && session?.user?.email) {
      setIsTransitioning(true);
      setTimeout(() => {
        onStart(session.user.name!, session.user.email!);
      }, 500);
    } else {
      signIn('google');
    }
  };

  return (
    <div className="h-[100dvh] w-full relative overflow-hidden bg-[#0A0A1F] font-jakarta flex flex-col items-center justify-between p-6 py-12 lg:py-24">
      {/* Vibrant Celestial Background */}
      <motion.div 
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 z-0 overflow-hidden"
      >
        <Image 
          src="/3.png" 
          alt="Celestial Space" 
          fill
          priority
          className="object-cover opacity-80" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A1F]/40 via-transparent to-[#0A0A1F]/90" />
      </motion.div>
      
      {/* Floating Space Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {hasMounted && [...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              y: [0, -20, 0], 
              opacity: [0.3, 0.6, 0.3],
              rotate: [0, 10, 0]
            }}
            transition={{ 
              duration: 5 + i * 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute rounded-full blur-3xl opacity-30"
            style={{ 
              width: 100 + i * 50, 
              height: 100 + i * 50, 
              top: `${Math.random() * 100}%`, 
              left: `${Math.random() * 100}%`,
              background: `radial-gradient(circle, ${i % 2 === 0 ? '#C026D3' : '#4F46E5'}, transparent)`
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {!isTransitioning && (
          <div className="relative z-10 w-full max-w-sm flex flex-col items-center flex-grow">
            {/* Header / Logo Section */}
            <div className="text-center space-y-10 mt-16">
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-32 h-32 mx-auto bg-white rounded-[2.5rem] flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.1)] border-4 border-white overflow-hidden"
              >
                 <Image src="/logo.png" alt="Bunny" width={128} height={128} className="object-contain p-2" priority />
              </motion.div>
              
              <div className="space-y-4">
                <h1 className="text-5xl font-black text-white tracking-tighter drop-shadow-2xl">
                  Fitness<span className="text-[#8de15c]">Bunny</span>
                </h1>
                <p className="text-xs font-bold text-white/70 uppercase tracking-[0.2em] max-w-[280px] mx-auto leading-relaxed">
                  Free AI Calorie Measurer and Recipe Creator with ai scan
                </p>
              </div>
            </div>

            {/* Entry Action Section */}
            <div className="mt-auto w-full pb-10">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleEntry}
                className="w-full group relative p-6 rounded-full font-black text-white uppercase tracking-[0.15em] transition-all shadow-[0_30px_60px_rgba(0,0,0,0.3)] overflow-hidden"
              >
                {/* Reference-style Button Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#C026D3] via-[#7C3AED] to-[#4F46E5] group-hover:opacity-90 transition-opacity" />
                
                <div className="relative flex items-center justify-center gap-4">
                  <div className="bg-white p-2 rounded-full shadow-lg">
                    {session ? (
                      <ArrowRight className="w-5 h-5 text-[#4F46E5]" />
                    ) : (
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    )}
                  </div>
                  <span className="text-sm">{session ? 'Continue' : 'Continue with Google'}</span>
                </div>
              </motion.button>

              {/* Offline Continue Option */}
              <button
                onClick={() => onStart('Guest User', '')}
                className="text-xs text-gray-500 hover:text-gray-700 transition-colors underline"
              >
                Continue using offline
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
