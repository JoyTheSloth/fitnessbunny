"use client";
import React from 'react';
import { motion } from 'motion/react';
import { 
  User, Bell, Shield, Moon, CircleHelp, LogOut, ChevronRight, 
  Sparkles, Globe, Smartphone, Heart, Share2, Info
} from 'lucide-react';
import { useUser } from '../context/UserContext';

export default function SettingsScreen() {
  const { biometrics } = useUser();

  const MENU_SECTIONS = [
    {
      title: "Sanctuary Account",
      items: [
        { icon: User, label: "Profile Details", value: biometrics.name || "Bunny User", color: "text-[#309af0]" },
        { icon: Sparkles, label: "Premium Status", value: "Legendary", color: "text-[#ffa024]" },
        { icon: Shield, label: "Privacy & DNA", color: "text-[#8de15c]" },
      ]
    },
    {
      title: "Telemetry & Auras",
      items: [
        { icon: Bell, label: "Vibration Notifications", value: "Active", color: "text-red-400" },
        { icon: Moon, label: "Midnight Mode", value: "Auto", color: "text-purple-400" },
        { icon: Globe, label: "Language", value: "English", color: "text-emerald-400" },
      ]
    },
    {
      title: "Support Sanctuary",
      items: [
        { icon: CircleHelp, label: "Help Center", color: "text-zinc-400" },
        { icon: Share2, label: "Broadcast Bunny", color: "text-[#309af0]" },
        { icon: Info, label: "Version Protocol", value: "2.8.4-Clinical", color: "text-zinc-300" },
      ]
    }
  ];

  return (
    <div className="relative h-full overflow-hidden">
      {/* Cosmic Background Layer */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-100" 
        style={{ backgroundImage: "url('/3.png')" }}
      />
      
      {/* Dark Overlay for Readability */}
      <div className="absolute inset-0 z-10 bg-black/10 backdrop-blur-[2px]" />

      <div className="relative z-20 h-full overflow-y-auto pt-24 pb-32 px-6">
        <header className="fixed top-0 left-0 w-full z-40 bg-transparent pt-8 pb-3 px-4 shadow-none">
          <div className="flex items-center justify-center relative max-w-2xl mx-auto">
            <h1 className="text-lg font-black text-white tracking-tight drop-shadow-md">Settings</h1>
          </div>
        </header>

        <main className="max-w-2xl mx-auto space-y-8">
          {/* Profile Quick Glance */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-5 p-6 bg-white/10 backdrop-blur-3xl rounded-[2.5rem] border border-white/20 shadow-2xl"
          >
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#8de15c] to-[#309af0] flex items-center justify-center text-white text-2xl font-black shadow-lg">
              {biometrics.name?.[0] || 'B'}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-black text-white leading-tight">{biometrics.name || "Bunny User"}</h2>
              <p className="text-xs font-bold text-white/60 mt-0.5">Physicality Level: Prime</p>
            </div>
            <button className="p-3 bg-white/20 rounded-2xl text-white hover:bg-white/30 transition-all">
              <LogOut size={20} />
            </button>
          </motion.div>

          {/* Settings Lists */}
          <div className="space-y-6">
            {MENU_SECTIONS.map((section, idx) => (
              <motion.div 
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="space-y-3"
              >
                <h3 className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] ml-6">{section.title}</h3>
                <div className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] overflow-hidden border border-white shadow-xl shadow-black/5">
                  {section.items.map((item, i) => (
                    <button 
                      key={item.label}
                      className={`w-full flex items-center justify-between p-5 hover:bg-zinc-50 transition-all group ${i !== section.items.length - 1 ? 'border-b border-zinc-100/50' : ''}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2.5 rounded-xl bg-zinc-50 ${item.color} group-hover:scale-110 transition-transform`}>
                          <item.icon size={20} />
                        </div>
                        <span className="text-sm font-bold text-[#3a4746]">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.value && <span className="text-[10px] font-black text-[#b9c3c1] uppercase tracking-widest">{item.value}</span>}
                        <ChevronRight size={16} className="text-[#b9c3c1]" />
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="pt-4 text-center">
            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] flex items-center justify-center gap-2">
              <Heart size={10} fill="currentColor" /> Crafted by Antigravity 🐰
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
