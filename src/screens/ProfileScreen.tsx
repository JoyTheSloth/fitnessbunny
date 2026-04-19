"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useUser } from '../context/UserContext';
import { signOut } from 'next-auth/react';
import {
  Settings,
  Mail,
  Calendar,
  Sparkles,
  Smile,
  Activity,
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
  Target,
  ShieldCheck,
  Brain,
  Utensils,
  PieChart
} from 'lucide-react';

type SubPage = 'main' | 'biometrics' | 'macros' | 'activity' | 'theme';

export default function ProfileScreen({ onOpenPremium }: { onOpenPremium?: () => void }) {
  const { profile, biometrics, macros, goal, updateBiometrics, updateMacros } = useUser();
  const [currentPage, setCurrentPage] = useState<SubPage>('main');
  const [aiCoach, setAiCoach] = useState(true);
  const [smartNotif, setSmartNotif] = useState(true);
  const [genderModalOpen, setGenderModalOpen] = useState(false);
  const [heightModalOpen, setHeightModalOpen] = useState(false);
  const [ageModalOpen, setAgeModalOpen] = useState(false);
  const [weightModalOpen, setWeightModalOpen] = useState(false);

  // Values for local editing before save
  const [localHeight, setLocalHeight] = useState(biometrics.height);
  const [localAge, setLocalAge] = useState(biometrics.age);
  const [localWeight, setLocalWeight] = useState(biometrics.weight);

  // Remaining UI states
  const [activity, setActivity] = useState('Highly Active');
  const [theme, setTheme] = useState('Light');

  const containerVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  };

  const renderHeader = (title: string, showBack: boolean = false) => (
    <header className="w-full z-40 bg-transparent backdrop-blur-md pb-6 px-6 border-b border-white/10">
      <div className="max-w-xl mx-auto flex items-center justify-between">
        {showBack ? (
          <button 
            onClick={() => setCurrentPage('main')}
            className="flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft size={20} />
            <span className="text-xs font-black uppercase tracking-widest">Return</span>
          </button>
        ) : (
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Settings</h1>
        )}
        
        {!showBack && (
          <button onClick={onOpenPremium} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#7ED957] to-[#B5FF9C] text-white rounded-2xl shadow-lg active:scale-95 transition-all">
            <Sparkles size={14} fill="white" />
            <span className="text-[10px] font-black uppercase tracking-widest">Premium</span>
          </button>
        )}

        {showBack && (
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em]">{title}</h2>
        )}
      </div>
    </header>
  );

  const renderMainSettings = () => (
    <motion.div variants={containerVariants} initial="initial" animate="animate" exit="exit" className="space-y-8">
      {/* Identity Summary */}
      <div className="flex items-center gap-5 p-2">
        <div className="w-20 h-20 rounded-3xl bg-white shadow-xl flex items-center justify-center border border-white p-2">
          <img src="/logo.png" alt="Bunny" className="w-full h-full object-contain" />
        </div>
        <div>
          <h3 className="text-2xl font-black text-gray-900 leading-none">{profile.name}</h3>
          <p className="text-sm font-bold text-gray-400 mt-1">{profile.email}</p>
          <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100">
            <ShieldCheck size={12} fill="currentColor" className="opacity-50" />
            <span className="text-[9px] font-black uppercase tracking-widest">Verified Human</span>
          </div>
        </div>
      </div>

      {/* AI Mastery Toggle */}
      <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-[#7ED957] to-[#B5FF9C] shadow-[0_20px_40px_rgba(126,217,87,0.2)] text-white relative overflow-hidden group">
        <Brain className="absolute -bottom-6 -right-6 w-32 h-32 opacity-20 group-hover:scale-110 transition-transform duration-700" />
        <div className="relative z-10 flex justify-between items-start">
          <div className="space-y-1">
            <h4 className="text-xl font-black tracking-tight">AI Coach Protocol</h4>
            <p className="text-xs font-bold text-white/80 max-w-[200px]">Neural insights and real-time metabolic optimization.</p>
          </div>
          <button 
            onClick={() => setAiCoach(!aiCoach)}
            className={`w-14 h-8 rounded-full relative transition-colors border-2 border-white/20 ${aiCoach ? 'bg-white' : 'bg-black/10'}`}
          >
            <motion.div 
              animate={{ x: aiCoach ? 24 : 4 }}
              className={`absolute top-1 w-5 h-5 rounded-full shadow-lg ${aiCoach ? 'bg-[#7ED957]' : 'bg-white'}`}
            />
          </button>
        </div>
      </div>

      {/* Primary Telemetry Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {[
          { label: 'Nutrition', icon: Utensils, page: 'macros', color: '#3B82F6' },
          { label: 'Energy Level', icon: Flame, page: 'activity', color: '#F59E0B' }
        ].map((item) => (
          <button 
            key={item.label}
            onClick={() => setCurrentPage(item.page as SubPage)}
            className="p-6 rounded-[2rem] bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left group"
          >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors bg-gray-50 group-hover:bg-white border border-gray-50" style={{ color: item.color }}>
              <item.icon size={22} />
            </div>
            <h5 className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">{item.label}</h5>
            <p className="text-sm font-black text-gray-900 group-hover:text-emerald-500 transition-colors">Configure System</p>
          </button>
        ))}
      </div>

      {/* Weight Target Tracking */}
      <div className="p-8 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target size={18} className="text-[#7ED957]" />
            <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Weight Trajectory</h5>
          </div>
          <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
            <span className="text-[9px] font-black uppercase tracking-widest">2.5kg to goal</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-baseline px-1">
            <h3 className="text-4xl font-black text-gray-900 tracking-tighter">72.5<span className="text-xl text-gray-300 ml-1">kg</span></h3>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Target: 70kg</span>
          </div>
          <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#7ED957] to-[#B5FF9C] rounded-full" style={{ width: '75%' }} />
          </div>
        </div>
      </div>

      {/* Body Profile List */}
      <div className="space-y-4">
        <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-4">Body Profile</h5>
        <div className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm">
          {[
            { label: 'Gender', icon: User, value: biometrics.gender, action: 'gender' },
            { label: 'Height', icon: Activity, value: biometrics.height + ' cm', action: 'height' },
            { label: 'Age', icon: Calendar, value: biometrics.age, action: 'age' },
            { label: 'Weight', icon: Weight, value: biometrics.weight + ' kg', action: 'weight' },
            { label: 'Activity level', icon: Flame, value: activity, action: 'activity' },
            { label: 'Macro Goals', icon: PieChart, value: `${macros.carbs}C ${macros.protein}P ${macros.fat}F`, action: 'macros' },
            { label: 'Units', icon: Settings, value: 'kg ft/in', action: 'main' }
          ].map((item, i, arr) => (
            <React.Fragment key={item.label}>
              <button 
                onClick={() => {
                  if (item.action === 'gender') {
                    setGenderModalOpen(true);
                    return;
                  }
                  if (item.action === 'height') {
                    setHeightModalOpen(true);
                    return;
                  }
                  if (item.action === 'age') {
                    setAgeModalOpen(true);
                    return;
                  }
                  if (item.action === 'weight') {
                    setWeightModalOpen(true);
                    return;
                  }
                  if (item.action !== 'main') setCurrentPage(item.action as SubPage);
                }}
                className="w-full min-w-0 flex items-center justify-between p-5 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-white border border-gray-50">
                    <item.icon size={22} />
                  </div>
                  <span className="text-sm font-black text-gray-900">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-400">{item.value}</span>
                  <ChevronRight size={16} className="text-gray-200" />
                </div>
              </button>
              {i < arr.length - 1 && <div className="h-px bg-gray-50 ml-20" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Body Profile Gender Dialog */}
      {genderModalOpen && (
        <div className="fixed inset-0 z-200 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-sm rounded-[3rem] bg-white p-8 shadow-2xl border border-white">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 mb-6 border border-white shadow-sm">
                <User size={32} />
              </div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-2">Identify Body Profile</h3>
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-8">This optimizes your metabolic AI.</p>
              
              <div className="w-full space-y-3">
                {['Male', 'Female'].map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      updateBiometrics({ gender: option });
                      setGenderModalOpen(false);
                    }}
                    className={`w-full py-5 rounded-2xl text-sm font-black transition-all ${biometrics.gender === option ? 'bg-[#7ED957] text-white shadow-lg shadow-[#7ED957]/30' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                  >
                    {option.toUpperCase()} {biometrics.gender === option && '✓'}
                  </button>
                ))}
              </div>
              <button onClick={() => setGenderModalOpen(false)} className="mt-6 text-[10px] font-black text-gray-300 uppercase tracking-widest hover:text-gray-900 transition-colors">Dismiss</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Height Dialog */}
      {heightModalOpen && (
        <div className="fixed inset-0 z-200 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-sm rounded-[3rem] bg-white p-8 shadow-2xl border border-white">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 mb-6 border border-white shadow-sm">
                <Activity size={32} />
              </div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-1">Stature Protocol</h3>
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-8">Enter height in centimeters</p>
              
              <div className="w-full relative mb-8">
                <input 
                  type="number" 
                  value={localHeight}
                  onChange={(e) => setLocalHeight(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-5 text-3xl font-black text-center text-gray-900 outline-none focus:bg-white focus:border-[#7ED957] transition-all shadow-inner"
                  autoFocus
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-gray-300 tracking-widest text-xs">CM</span>
              </div>
              
              <div className="w-full grid grid-cols-2 gap-3">
                <button onClick={() => setHeightModalOpen(false)} className="py-4 rounded-xl text-gray-400 font-black text-xs uppercase tracking-widest bg-gray-50">Cancel</button>
                <button 
                  onClick={() => {
                    updateBiometrics({ height: localHeight });
                    setHeightModalOpen(false);
                  }} 
                  className="py-4 rounded-xl bg-[#7ED957] text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-[#7ED957]/20"
                >
                  Save
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Age Dialog */}
      {ageModalOpen && (
        <div className="fixed inset-0 z-200 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-sm rounded-[3rem] bg-white p-8 shadow-2xl border border-white">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 mb-6 border border-white shadow-sm">
                <Calendar size={32} />
              </div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-1">Chronology Log</h3>
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-8">Enter your current age</p>
              
              <div className="w-full relative mb-8">
                <input 
                  type="number" 
                  value={localAge}
                  onChange={(e) => setLocalAge(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-5 text-3xl font-black text-center text-gray-900 outline-none focus:bg-white focus:border-[#7ED957] transition-all shadow-inner"
                  autoFocus
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-gray-300 tracking-widest text-xs">YEARS</span>
              </div>
              
              <div className="w-full grid grid-cols-2 gap-3">
                <button onClick={() => setAgeModalOpen(false)} className="py-4 rounded-xl text-gray-400 font-black text-xs uppercase tracking-widest bg-gray-50">Cancel</button>
                <button 
                  onClick={() => {
                    updateBiometrics({ age: localAge });
                    setAgeModalOpen(false);
                  }} 
                  className="py-4 rounded-xl bg-[#7ED957] text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-[#7ED957]/20"
                >
                  Save
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Weight Dialog */}
      {weightModalOpen && (
        <div className="fixed inset-0 z-200 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-sm rounded-[3rem] bg-white p-8 shadow-2xl border border-white">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-500 mb-6 border border-white shadow-sm">
                <Weight size={32} />
              </div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-1">Mass Analysis</h3>
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-8">Enter your current weight</p>
              
              <div className="w-full relative mb-8">
                <input 
                  type="number" 
                  step="0.1"
                  value={localWeight}
                  onChange={(e) => setLocalWeight(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-5 text-3xl font-black text-center text-gray-900 outline-none focus:bg-white focus:border-[#7ED957] transition-all shadow-inner"
                  autoFocus
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-gray-300 tracking-widest text-xs">KG</span>
              </div>
              
              <div className="w-full grid grid-cols-2 gap-3">
                <button onClick={() => setWeightModalOpen(false)} className="py-4 rounded-xl text-gray-400 font-black text-xs uppercase tracking-widest bg-gray-50">Cancel</button>
                <button 
                  onClick={() => {
                    updateBiometrics({ weight: localWeight });
                    setWeightModalOpen(false);
                  }} 
                  className="py-4 rounded-xl bg-[#7ED957] text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-[#7ED957]/20"
                >
                  Save
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* System Integrity */}
      <div className="space-y-4">
        <h5 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] ml-4">System Integrity</h5>
        <div className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm">
          <button 
            onClick={() => window.open('https://joydeepdas-portfolio.vercel.app/', '_blank', 'noopener noreferrer')}
            className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-4 text-gray-900">
              <Mail size={18} className="text-gray-400" />
              <span className="text-sm font-black uppercase tracking-widest">About Bunny</span>
            </div>
            <ChevronRight size={18} className="text-gray-300" />
          </button>
          <div className="h-px bg-gray-50 ml-16" />
          <button 
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full flex items-center justify-between p-6 hover:bg-red-50 transition-colors group"
          >
            <div className="flex items-center gap-4 text-red-500">
              <LogOut size={18} className="opacity-50 group-hover:opacity-100" />
              <span className="text-sm font-black uppercase tracking-widest">Server Connection</span>
            </div>
          </button>
        </div>
      </div>

      <p className="text-center text-gray-300 font-bold text-[9px] tracking-widest uppercase py-4">Protocol v2.5.0 • Digital Sanctuary Enabled</p>
    </motion.div>
  );

  const renderBiometrics = () => (
    <motion.div variants={containerVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
       <div className="p-8 rounded-[3rem] bg-white border border-gray-100 shadow-sm space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Height (cm)</label>
              <input 
                type="number" 
                value={biometrics.height}
                onChange={(e) => updateBiometrics({ height: e.target.value })}
                className="w-full bg-gray-50 border border-transparent rounded-2xl px-6 py-4 text-lg font-black text-gray-900 focus:bg-white focus:border-[#7ED957] focus:outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Weight (kg)</label>
              <input 
                type="number" 
                value={biometrics.weight}
                onChange={(e) => updateBiometrics({ weight: e.target.value })}
                className="w-full bg-gray-50 border border-transparent rounded-2xl px-6 py-4 text-lg font-black text-gray-900 focus:bg-white focus:border-[#7ED957] focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Age Progression</label>
              <input 
                type="number" 
                value={biometrics.age}
                onChange={(e) => updateBiometrics({ age: e.target.value })}
                className="w-full bg-gray-50 border border-transparent rounded-2xl px-6 py-4 text-lg font-black text-gray-900 focus:bg-white focus:border-[#7ED957] focus:outline-none transition-all"
              />
          </div>

          <button onClick={() => setCurrentPage('main')} className="w-full py-5 bg-gray-900 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl active:scale-95 transition-all">
            Secure Biometrics
          </button>
       </div>
    </motion.div>
  );

  const renderMacros = () => (
    <motion.div variants={containerVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
       <div className="p-8 rounded-[3rem] bg-white border border-gray-100 shadow-sm space-y-10">
          <div className="space-y-8">
            {[
              { label: 'Carbohydrates', value: macros.carbs, color: '#FCD34D', key: 'carbs', min: 50, max: 300 },
              { label: 'Proteins', value: macros.protein, color: '#60A5FA', key: 'protein', min: 50, max: 250 },
              { label: 'Lipides', value: macros.fat, color: '#F97316', key: 'fat', min: 20, max: 150 }
            ].map((m) => (
              <div key={m.label} className="space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{m.label}</span>
                  <span className="text-xl font-black text-gray-900">{m.value}g</span>
                </div>
                <input 
                  type="range" min={m.min} max={m.max}
                  value={m.value}
                  onChange={(e) => updateMacros({ [m.key]: e.target.value })}
                  className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-gray-900" 
                />
              </div>
            ))}
          </div>

          <button onClick={() => setCurrentPage('main')} className="w-full py-5 bg-[#7ED957] text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-lg active:scale-95 transition-all">
            Lock Targets
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
           className={`w-full p-6 text-left rounded-[2rem] border transition-all flex items-center justify-between group ${activity === level ? 'bg-gray-900 border-gray-900 shadow-xl scale-[1.02]' : 'bg-white border-gray-100 hover:bg-gray-50'}`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${activity === level ? 'bg-white/10 text-white' : 'bg-gray-50 text-gray-400 group-hover:bg-white'}`}>
                <Activity size={22} />
              </div>
              <div>
                <span className={`block font-black text-lg ${activity === level ? 'text-white' : 'text-gray-900'}`}>{level}</span>
                <p className={`text-xs font-bold leading-tight ${activity === level ? 'text-white/60' : 'text-gray-400'}`}>
                  {level === 'Sedentary' && 'Minimal activity protocol.'}
                  {level === 'Active' && 'Moderate kinetic frequency.'}
                  {level === 'Athlete' && 'Peak physical performance level.'}
                </p>
              </div>
            </div>
            {activity === level && <CheckCircle2 size={24} className="text-[#7ED957]" fill="currentColor" />}
         </button>
       ))}
    </motion.div>
  );

  const renderTheme = () => (
    <motion.div variants={containerVariants} initial="initial" animate="animate" exit="exit" className="space-y-4">
       {['Light', 'Dark'].map((t) => (
         <button 
           key={t}
           onClick={() => {
             setTheme(t);
             setCurrentPage('main');
           }}
           className={`w-full p-8 text-left rounded-[2.5rem] border transition-all flex items-center justify-between group ${theme === t ? 'bg-gray-900 border-gray-900 shadow-xl' : 'bg-white border-gray-100 hover:bg-gray-50'}`}
          >
            <div className="flex items-center gap-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${theme === t ? 'bg-white/10 text-white' : 'bg-gray-50 text-gray-400'}`}>
                <Sun size={28} />
              </div>
              <span className={`block font-black text-2xl ${theme === t ? 'text-white' : 'text-gray-900'}`}>{t} Mode</span>
            </div>
            {theme === t && <CheckCircle2 size={28} className="text-[#7ED957]" fill="currentColor" />}
         </button>
       ))}
    </motion.div>
  );

  return (
    <div className="relative h-full overflow-hidden font-poppins">
      {/* Background Imagery */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat" 
        style={{ backgroundImage: "url('/11.png')" }}
      />
      
      {/* Soft Overlay */}
      <div className="absolute inset-0 z-10 bg-black/5 backdrop-blur-[2px]" />

      <div className="relative z-20 h-full overflow-y-auto scrollbar-hide pt-12 pb-40">
        {renderHeader(currentPage === 'main' ? 'Command' : currentPage, currentPage !== 'main')}

        <main className="px-6 max-w-xl mx-auto mt-8">
          <AnimatePresence mode="wait">
            {currentPage === 'main' && renderMainSettings()}
            {currentPage === 'biometrics' && renderBiometrics()}
            {currentPage === 'macros' && renderMacros()}
            {currentPage === 'activity' && renderActivity()}
            {currentPage === 'theme' && renderTheme()}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
