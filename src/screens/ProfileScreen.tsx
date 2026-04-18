"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useUser } from '../context/UserContext';
import {
  Settings,
  Mail,
  Calendar,
  Sparkles,
  Smile,
  Activity,
  Cherry,
  Flame,
  BellRing,
  Sun,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Weight,
  User,
  Info,
  CheckCircle2,
  Target
} from 'lucide-react';

type SubPage = 'main' | 'edit_profile' | 'biometrics' | 'macros' | 'activity' | 'theme';

export default function ProfileScreen({ onOpenPremium }: { onOpenPremium?: () => void }) {
  const { profile, biometrics, macros, goal, updateProfile, updateBiometrics, updateMacros, updateGoal } = useUser();
  const [currentPage, setCurrentPage] = useState<SubPage>('main');
  const [aiCoach, setAiCoach] = useState(true);
  const [smartNotif, setSmartNotif] = useState(true);

  // Remaining UI states
  const [activity, setActivity] = useState('Highly Active');
  const [theme, setTheme] = useState('Light');
  const [units, setUnits] = useState('kg ft/in');

  const containerVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  const renderHeader = (title: string, showBack: boolean = false) => (
    <header className="fixed top-0 left-0 w-full z-40 bg-[#eff3f4] pt-8 pb-3 px-4 shadow-none border-b border-black/5">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4 mt-2">
           <div className="flex items-center gap-3">
              {showBack ? (
                <button 
                  onClick={() => setCurrentPage('main')}
                  className="w-10 h-10 rounded-full bg-white/60 border border-white flex items-center justify-center text-[#3a4746] hover:bg-white transition-colors active:scale-90"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              ) : (
                <div className="w-10 h-10 flex items-center justify-center text-[#3a4746]">
                </div>
              )}
              {/* No Title in simple view if tabs are present */}
           </div>
           
           {!showBack && (
            <button onClick={onOpenPremium} className="bg-gradient-to-r from-[#ffa024] to-[#f55938] text-white text-[10px] uppercase font-extrabold px-3 py-1.5 rounded-full shadow-[0_4px_10px_rgba(255,160,36,0.3)] hover:-translate-y-0.5 transition-transform flex items-center gap-1 active:scale-95">
              <Sparkles className="w-3 h-3" fill="currentColor" /> Premium
            </button>
           )}
        </div>

        {currentPage === 'main' && (
          <div className="flex items-center justify-center gap-12 pb-1">
            <button className="text-[#89979b] font-bold text-sm hover:text-[#3a4746] transition-colors relative pb-2 group">Usage</button>
            <button className="text-[#3a4746] font-black text-xl relative pb-2">
              Settings
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#8de15c] rounded-full"></div>
            </button>
          </div>
        )}
        
        {showBack && (
          <div className="flex items-center justify-center pb-2">
            <h1 className="text-xl font-black text-[#3a4746] tracking-tight">{title}</h1>
          </div>
        )}
      </div>
    </header>
  );

  const renderMainSettings = () => (
    <motion.div 
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-8"
    >
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div 
          onClick={() => setCurrentPage('edit_profile')}
          className="bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.05)] p-6 rounded-[2.5rem] space-y-4 hover:bg-white/50 transition-colors cursor-pointer group"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-on-surface-variant text-[10px] font-extrabold uppercase tracking-widest">Status</p>
              <h2 className="text-2xl font-extrabold text-on-surface tracking-tight mt-1 group-hover:text-primary transition-colors">{profile.name}</h2>
            </div>
            <span className="px-3 py-1 bg-[#c8f16c] text-[#144500] shadow-sm border border-white/50 text-[10px] font-extrabold rounded-full tracking-widest flex items-center h-6 uppercase">PREMIUM</span>
          </div>
          
          <div className="space-y-2.5 mt-4">
            <div className="flex items-center gap-3 text-on-surface-variant text-sm font-bold">
              <div className="bg-white/60 p-1.5 rounded-lg shadow-sm border border-white/40"><Mail className="w-4 h-4 text-primary" /></div>
              <span>{profile.email}</span>
            </div>
            <div className="flex items-center gap-3 text-on-surface-variant text-sm font-bold">
              <div className="bg-white/60 p-1.5 rounded-lg shadow-sm border border-white/40"><Calendar className="w-4 h-4 text-primary" /></div>
              <span>Joined March 2024</span>
            </div>
          </div>
        </div>

        <div className="bg-[#ff9656]/20 backdrop-blur-xl p-6 rounded-[2.5rem] flex flex-col justify-between border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.05)] relative overflow-hidden group">
          <Sparkles className="absolute -top-4 -right-4 w-32 h-32 text-white/30 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700" />
          <div className="flex justify-between items-start relative z-10">
            <div className="w-12 h-12 bg-white/60 shadow-sm border border-white/50 rounded-2xl flex items-center justify-center">
              <Sparkles className="text-[#db6a18] w-6 h-6" fill="currentColor" />
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer hover:scale-105 active:scale-95 transition-transform drop-shadow-sm">
              <input type="checkbox" className="sr-only peer" checked={aiCoach} onChange={() => setAiCoach(!aiCoach)} />
              <div className="w-14 h-8 bg-black/10 shadow-inner peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:shadow-[0_2px_4px_rgba(0,0,0,0.1)] after:border after:border-zinc-100 after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#ff9656]"></div>
            </label>
          </div>
          <div className="mt-4 relative z-10 text-[#542200]">
            <h3 className="font-extrabold text-lg drop-shadow-sm">AI Coach Assistant</h3>
            <p className="text-xs font-bold leading-relaxed mt-1 opacity-80">Smart insights and friendly motivational nudges. 🐾</p>
          </div>
        </div>
      </section>

      <section className="bg-white/40 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.05)] border border-white/60 hover:bg-white/50 transition-colors">
        <div className="flex justify-between items-end mb-6">
          <div>
            <p className="text-on-surface-variant text-[10px] font-extrabold uppercase tracking-widest mb-1">Weight Goal</p>
            <h3 className="text-4xl font-extrabold text-on-surface tracking-tighter drop-shadow-sm">
              {biometrics.weight}<span className="text-lg font-bold text-on-surface-variant tracking-normal"> / 70.0kg</span>
            </h3>
          </div>
          <div className="pb-1 bg-[#1d5c00]/10 px-3 py-1 bg-white/60 border border-white shadow-sm rounded-full">
            <span className="text-[#1d5c00] font-extrabold text-[10px] tracking-widest uppercase flex items-center gap-1"><Flame className="w-3 h-3 text-[#1d5c00]" fill="currentColor"/> 2.5kg to go</span>
          </div>
        </div>

        <div className="h-5 w-full bg-white/50 shadow-inner rounded-full overflow-hidden p-1 border border-white/60">
          <div className="h-full bg-primary rounded-full shadow-sm" style={{width: '75%'}}></div>
        </div>
        
        <div className="flex justify-between mt-3 text-[10px] font-extrabold text-on-surface-variant uppercase tracking-widest">
          <span>Start: 80kg</span>
          <span className="text-[#144500]">Goal: 70kg</span>
        </div>
      </section>

      <div className="space-y-6">
        <div>
          <h4 className="text-[12px] font-extrabold text-on-surface-variant uppercase tracking-widest mb-4 ml-2 flex items-center gap-2"><Smile className="w-4 h-4"/> Profile Data</h4>
          <div className="bg-white/40 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.05)] border border-white/60">
            {[
              { label: 'Gender', value: biometrics.gender, icon: User, page: 'biometrics' },
              { label: 'Height', value: biometrics.height === '170' ? '5ft 6in' : biometrics.height + 'cm', icon: Activity, page: 'biometrics' },
              { label: 'Age', value: biometrics.age, icon: Calendar, page: 'biometrics' },
              { label: 'Weight', value: biometrics.weight + ' kg', icon: Weight, page: 'biometrics' },
              { label: 'Activity level', value: activity, icon: Flame, page: 'activity' },
              { label: 'Units', value: units, icon: Settings, page: 'main' },
              { label: 'Goals', value: goal, icon: Target, page: 'main' },
            ].map((item, idx, arr) => (
              <React.Fragment key={item.label}>
                <button 
                  onClick={() => item.page !== 'main' && setCurrentPage(item.page as SubPage)}
                  className="w-full flex items-center justify-between p-5 hover:bg-white/60 transition-colors text-left group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 shadow-sm border border-white/40 rounded-2xl bg-white/60 flex items-center justify-center text-on-surface-variant group-hover:bg-primary-container group-hover:text-primary transition-colors">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="block font-extrabold text-on-surface text-base">{item.label}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#3a4746] font-black text-sm">{item.value}</span>
                    <ChevronRight className="w-5 h-5 text-surface-dim" />
                  </div>
                </button>
                {idx < arr.length - 1 && <div className="h-px w-full bg-white/40" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div>
           <h4 className="text-[12px] font-extrabold text-on-surface-variant uppercase tracking-widest mb-4 ml-2 flex items-center gap-2"><BellRing className="w-4 h-4"/> App Services</h4>
           <div className="bg-white/40 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.05)] border border-white/60">
              {[
                { label: 'Reminder', icon: BellRing },
                { label: 'Restore Purchases', icon: Sparkles },
                { label: 'PhoneID', icon: Info },
              ].map((item, idx, arr) => (
                <React.Fragment key={item.label}>
                  <button className="w-full flex items-center justify-between p-5 hover:bg-white/60 transition-colors text-left group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 shadow-sm border border-white/40 rounded-2xl bg-white/60 flex items-center justify-center text-on-surface-variant group-hover:bg-primary-container group-hover:text-primary transition-colors">
                        <item.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="block font-extrabold text-on-surface text-base">{item.label}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-surface-dim" />
                  </button>
                  {idx < arr.length - 1 && <div className="h-px w-full bg-white/40" />}
                </React.Fragment>
              ))}
           </div>
        </div>

        <div>
           <h4 className="text-[12px] font-extrabold text-on-surface-variant uppercase tracking-widest mb-4 ml-2 flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> Support & Legal</h4>
           <div className="bg-white/40 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.05)] border border-white/60">
              {[
                { label: 'Rate Us', icon: Sparkles },
                { label: 'Feedback', icon: Mail },
                { label: 'Terms of Use', icon: Info },
                { label: 'Privacy Policy', icon: CheckCircle2 },
              ].map((item, idx, arr) => (
                <React.Fragment key={item.label}>
                  <button className="w-full flex items-center justify-between p-5 hover:bg-white/60 transition-colors text-left group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 shadow-sm border border-white/40 rounded-2xl bg-white/60 flex items-center justify-center text-on-surface-variant group-hover:bg-primary-container group-hover:text-primary transition-colors">
                        <item.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="block font-extrabold text-on-surface text-base">{item.label}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-surface-dim" />
                  </button>
                  {idx < arr.length - 1 && <div className="h-px w-full bg-white/40" />}
                </React.Fragment>
              ))}
           </div>
        </div>

        <div>
          <h4 className="text-[12px] font-extrabold text-on-surface-variant uppercase tracking-widest mb-4 ml-2 flex items-center gap-2"><Settings className="w-4 h-4"/> Appearance</h4>
          <div className="bg-white/40 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.05)] border border-white/60">
            <div className="flex items-center justify-between p-5 text-left hover:bg-white/60 transition-colors cursor-pointer" onClick={() => setSmartNotif(!smartNotif)}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 shadow-sm border border-white/40 rounded-2xl bg-white/60 flex items-center justify-center text-on-surface-variant">
                  <BellRing className="w-6 h-6" />
                </div>
                <div>
                  <span className="block font-extrabold text-on-surface text-base">Smart Notifications</span>
                  <span className="text-xs font-bold text-on-surface-variant mt-0.5 block">{smartNotif ? 'Active' : 'Muted'}</span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer hover:scale-105 active:scale-95 transition-transform">
                <input type="checkbox" className="sr-only peer" checked={smartNotif} readOnly />
                <div className="w-14 h-8 bg-black/10 shadow-inner peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:shadow-[0_2px_4px_rgba(0,0,0,0.1)] after:border after:border-zinc-100 after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="h-px w-full bg-white/40" />

            <button onClick={() => setCurrentPage('theme')} className="w-full flex items-center justify-between p-5 hover:bg-white/60 transition-colors text-left group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 shadow-sm border border-white/40 rounded-2xl bg-white/60 flex items-center justify-center text-on-surface-variant group-hover:bg-blue-500/10 group-hover:text-blue-500 transition-colors">
                  <Sun className="w-6 h-6" />
                </div>
                <div>
                  <span className="block font-extrabold text-on-surface text-base">Theme</span>
                  <span className="text-xs font-bold text-on-surface-variant mt-0.5 block">{theme}</span>
                </div>
              </div>
              <span className="text-[10px] font-extrabold text-primary px-3 py-1.5 bg-white/80 border border-white shadow-sm rounded-xl tracking-widest uppercase">{theme}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <button className="w-full p-4 bg-white/40 backdrop-blur-md border border-white/60 hover:bg-red-50 text-red-500 font-extrabold rounded-[2rem] shadow-[0_4px_12px_rgba(0,0,0,0.02)] transition-all flex items-center justify-center gap-2 hover:shadow-[0_8px_24px_rgba(239,68,68,0.15)] hover:border-red-200 active:scale-95">
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
        <p className="text-center text-zinc-400 font-bold text-[10px] mt-6 tracking-widest uppercase">fitnessbunny Version 2.4.1 (Build 890)</p>
      </div>
    </motion.div>
  );

  const renderEditProfile = () => (
    <motion.div variants={containerVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
      <div className="bg-white/60 backdrop-blur-xl p-8 rounded-[3rem] border border-white shadow-[0_8px_32px_rgba(0,0,0,0.05)] space-y-6">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-primary-container border-4 border-white shadow-lg flex items-center justify-center relative group overflow-hidden">
              <img 
                src="/logo.png" 
                alt="Fitness Bunny" 
                className="w-16 h-16 object-contain"
              />
             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white text-[10px] font-bold uppercase tracking-widest">Edit</div>
          </div>
          <p className="mt-3 text-[10px] font-extrabold text-on-surface-variant uppercase tracking-widest">Profile Identity</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-widest ml-2">Display Name</label>
            <input 
              type="text" 
              value={profile.name}
              onChange={(e) => updateProfile({ name: e.target.value })}
              className="w-full bg-white/80 border border-white/40 rounded-2xl px-5 py-4 text-sm font-bold text-[#3a4746] focus:ring-2 focus:ring-primary focus:outline-none shadow-sm"
              placeholder="Your name"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-widest ml-2">Email Address</label>
            <input 
              type="email" 
              value={profile.email}
              onChange={(e) => updateProfile({ email: e.target.value })}
              className="w-full bg-white/80 border border-white/40 rounded-2xl px-5 py-4 text-sm font-bold text-[#3a4746] focus:ring-2 focus:ring-primary focus:outline-none shadow-sm"
              placeholder="Email"
            />
          </div>
        </div>

        <button onClick={() => setCurrentPage('main')} className="w-full bg-primary text-white font-extrabold py-4 rounded-2xl shadow-lg hover:shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          Update Identity
        </button>
      </div>
    </motion.div>
  );

  const renderBiometrics = () => (
    <motion.div variants={containerVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
       <div className="bg-white/60 backdrop-blur-xl p-8 rounded-[3rem] border border-white shadow-[0_8px_32px_rgba(0,0,0,0.05)] space-y-6">
          <div className="flex items-center gap-4 p-4 bg-primary-container/20 rounded-2xl border border-primary-container/30">
             <Info className="w-6 h-6 text-primary shrink-0" />
             <p className="text-xs font-bold text-[#144500] leading-relaxed">Your BMI and calorie targets are calculated based on these vital stats.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-widest ml-2">Height (cm)</label>
              <input 
                type="number" 
                value={biometrics.height}
                onChange={(e) => updateBiometrics({ height: e.target.value })}
                className="w-full bg-white/80 border border-white/40 rounded-2xl px-5 py-4 text-sm font-bold text-[#3a4746] focus:ring-2 focus:ring-primary focus:outline-none shadow-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-widest ml-2">Weight (kg)</label>
              <input 
                type="number" 
                value={biometrics.weight}
                onChange={(e) => updateBiometrics({ weight: e.target.value })}
                className="w-full bg-white/80 border border-white/40 rounded-2xl px-5 py-4 text-sm font-bold text-[#3a4746] focus:ring-2 focus:ring-primary focus:outline-none shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
              <label className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-widest ml-2">Age</label>
              <input 
                type="number" 
                value={biometrics.age}
                onChange={(e) => updateBiometrics({ age: e.target.value })}
                className="w-full bg-white/80 border border-white/40 rounded-2xl px-5 py-4 text-sm font-bold text-[#3a4746] focus:ring-2 focus:ring-primary focus:outline-none shadow-sm"
              />
          </div>

          <button onClick={() => setCurrentPage('main')} className="w-full bg-primary text-white font-extrabold py-4 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            Save Biometrics
          </button>
       </div>
    </motion.div>
  );

  const renderMacros = () => (
    <motion.div variants={containerVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
       <div className="bg-white/60 backdrop-blur-xl p-8 rounded-[3rem] border border-white shadow-[0_8px_32px_rgba(0,0,0,0.05)] space-y-8">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-[#ff9656]/20 flex items-center justify-center text-[#ff9656] mb-3">
              <Cherry className="w-8 h-8" />
            </div>
            <h3 className="font-extrabold text-xl text-[#3a4746]">Macro Split</h3>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center px-2">
                <span className="text-[11px] font-extrabold text-[#edc541] uppercase tracking-widest">Carbohydrates</span>
                <span className="text-sm font-bold text-[#3a4746]">{macros.carbs}g</span>
              </div>
              <input 
                type="range" min="50" max="300"
                value={macros.carbs}
                onChange={(e) => updateMacros({ carbs: e.target.value })}
                className="w-full h-2 bg-zinc-100 rounded-full appearance-none cursor-pointer accent-[#edc541]" 
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center px-2">
                <span className="text-[11px] font-extrabold text-[#64a6ed] uppercase tracking-widest">Protein</span>
                <span className="text-sm font-bold text-[#3a4746]">{macros.protein}g</span>
              </div>
              <input 
                type="range" min="50" max="250"
                value={macros.protein}
                onChange={(e) => updateMacros({ protein: e.target.value })}
                className="w-full h-2 bg-zinc-100 rounded-full appearance-none cursor-pointer accent-[#64a6ed]" 
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center px-2">
                <span className="text-[11px] font-extrabold text-[#f9aa42] uppercase tracking-widest">Healthy Fats</span>
                <span className="text-sm font-bold text-[#3a4746]">{macros.fat}g</span>
              </div>
              <input 
                type="range" min="20" max="150"
                value={macros.fat}
                onChange={(e) => updateMacros({ fat: e.target.value })}
                className="w-full h-2 bg-zinc-100 rounded-full appearance-none cursor-pointer accent-[#f9aa42]" 
              />
            </div>
          </div>

          <button onClick={() => setCurrentPage('main')} className="w-full bg-primary text-white font-extrabold py-4 rounded-2xl shadow-lg transition-all active:scale-95">
            Optimize Nutrition
          </button>
       </div>
    </motion.div>
  );

  const renderActivity = () => (
    <motion.div variants={containerVariants} initial="initial" animate="animate" exit="exit" className="space-y-4">
       {['Sedentary', 'Lightly Active', 'Active', 'Very Active', 'Athlete'].map((level) => (
         <button 
           key={level}
           onClick={() => {
             setActivity(level);
             setCurrentPage('main');
           }}
           className={`w-full p-6 text-left rounded-[2rem] border transition-all flex items-center justify-between group ${activity === level ? 'bg-primary border-primary shadow-lg scale-102' : 'bg-white/60 border-white hover:bg-white'}`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${activity === level ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary group-hover:bg-primary/20'}`}>
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <span className={`block font-extrabold text-lg ${activity === level ? 'text-white' : 'text-[#3a4746]'}`}>{level}</span>
                <p className={`text-xs font-bold leading-tight ${activity === level ? 'text-white/80' : 'text-[#89979b]'}`}>
                  {level === 'Sedentary' && 'Desk job, little to no exercise.'}
                  {level === 'Lightly Active' && 'Light exercise 1-3 days/week.'}
                  {level === 'Active' && 'Moderate exercise 3-5 days/week.'}
                  {level === 'Very Active' && 'Hard exercise 6-7 days/week.'}
                  {level === 'Athlete' && 'Professional level workouts daily.'}
                </p>
              </div>
            </div>
            {activity === level && <CheckCircle2 className="w-6 h-6 text-white" fill="currentColor" />}
         </button>
       ))}
    </motion.div>
  );

  const renderTheme = () => (
    <motion.div variants={containerVariants} initial="initial" animate="animate" exit="exit" className="space-y-4">
       {['Light', 'Dark', 'System'].map((t) => (
         <button 
           key={t}
           onClick={() => {
             setTheme(t);
             setCurrentPage('main');
           }}
           className={`w-full p-6 text-left rounded-[2rem] border transition-all flex items-center justify-between group ${theme === t ? 'bg-[#309af0] border-[#309af0] shadow-lg scale-102' : 'bg-white/60 border-white hover:bg-white'}`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${theme === t ? 'bg-white/20 text-white' : 'bg-blue-500/10 text-blue-500 group-hover:bg-blue-500/20'}`}>
                <Sun className="w-6 h-6" />
              </div>
              <span className={`block font-extrabold text-lg ${theme === t ? 'text-white' : 'text-[#3a4746]'}`}>{t} Mode</span>
            </div>
            {theme === t && <CheckCircle2 className="w-6 h-6 text-white" fill="currentColor" />}
         </button>
       ))}
    </motion.div>
  );

  const getPageTitle = () => {
    switch(currentPage) {
      case 'edit_profile': return 'Edit Identity';
      case 'biometrics': return 'Vital Stats';
      case 'macros': return 'Nutrition Targets';
      case 'activity': return 'Energy Level';
      case 'theme': return 'Appearance';
      default: return 'Settings';
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      {renderHeader(getPageTitle(), currentPage !== 'main')}

      <main className="pt-40 px-6 max-w-2xl mx-auto pb-32">
        <AnimatePresence mode="wait">
          {currentPage === 'main' && renderMainSettings()}
          {currentPage === 'edit_profile' && renderEditProfile()}
          {currentPage === 'biometrics' && renderBiometrics()}
          {currentPage === 'macros' && renderMacros()}
          {currentPage === 'activity' && renderActivity()}
          {currentPage === 'theme' && renderTheme()}
        </AnimatePresence>
      </main>
    </div>
  );
}

