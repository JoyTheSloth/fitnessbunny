"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Camera, Target, BarChart3, Utensils, TrendingUp, ChevronLeft, Check, FastForward, Heart, Info, ChevronRight } from 'lucide-react';

export default function PremiumScreen({ onClose }: { onClose: () => void }) {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState('lifetime');
  const [isUpgraded, setIsUpgraded] = useState(false);

  const plans = [
    { id: 'monthly', name: 'Monthly', price: '$9.99', desc: 'Renews monthly' },
    { id: 'yearly', name: 'Yearly', price: '$69.99', desc: 'Save 40%' },
    { id: 'lifetime', name: 'Lifetime', price: 'FREE', desc: 'Limited for you' }
  ];

  const features = [
    {
      id: 'scanning',
      icon: Camera,
      title: 'Advanced AI Scanning',
      desc: 'Unlimited photo-based food identification and calorie logging.',
      content: 'Simply point your camera at any meal, and our AI instantly identifies the food, estimates the portion size, and calculates the exact macronutrients. No more manual searching or estimating!'
    },
    {
      id: 'plans',
      icon: Target,
      title: 'Personalized Diet Plans',
      desc: 'Adaptive, tailored tracking for goals like keto or intermittent fasting.',
      content: 'fitnessbunny AI adapts to your unique body. Whether you are doing Keto, Paleo, Vegan, or IF, we build a dynamic daily target scheme that shifts as you lose weight or build muscle.'
    },
    {
      id: 'insights',
      icon: BarChart3,
      title: 'Advanced Nutritional Insights',
      desc: 'Detailed breakdown of proteins, fats, carbs, and fiber to ensure a balanced diet.',
      content: 'Go beyond just calories. Track over 30 micronutrients including essential vitamins, minerals, and exact amino acid profiles to ensure your body is perfectly fueled.'
    },
    {
      id: 'restaurant',
      icon: Utensils,
      title: 'Restaurant & Recipe Tools',
      desc: 'Decoding menus to track calories while eating out.',
      content: 'Import recipes from any URL or take a picture of a restaurant menu. Our AI decodes the complex ingredients, matches them to our verified database, and accurately scores your meal out.'
    },
    {
      id: 'forecasting',
      icon: TrendingUp,
      title: 'Meal-Plan Forecasting',
      desc: 'Predictive modeling for long-term health goals.',
      content: 'See the future! Based on your current eating habits and goals, fitnessbunny AI will predict your weight and body fat percentage up to 6 months in advance so you can course-correct early.'
    }
  ];

  const containerVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  const renderFeaturePage = () => {
    const feature = features.find(f => f.id === activeFeature);
    if (!feature) return null;
    const Icon = feature.icon;

    return (
      <motion.div 
        key="feature-page"
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="absolute inset-0 bg-[#eff3f4] z-50 flex flex-col pt-10 min-h-screen overflow-y-auto pb-32"
      >
        <div className="flex items-center justify-between px-6 mb-8 shrink-0">
          <button 
            onClick={() => setActiveFeature(null)} 
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-[#e2e8e9] hover:bg-[#f8fafb] transition-colors active:scale-90"
          >
            <ChevronLeft className="w-6 h-6 text-[#3a4746]" />
          </button>
          <div className="flex flex-col items-center">
            <span className="font-extrabold text-[#3a4746] text-[10px] uppercase tracking-[0.2em] opacity-40">Elite Feature</span>
            <span className="font-black text-[#3a4746] text-sm uppercase tracking-tighter">Deep Dive</span>
          </div>
          <div className="w-12"></div>
        </div>

        <div className="px-6 flex-1 flex flex-col items-center max-w-lg mx-auto w-full">
            <motion.div 
               initial={{ scale: 0.8, rotate: -10 }}
               animate={{ scale: 1, rotate: 0 }}
               className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-br from-[#ffa024] to-[#f55938] flex items-center justify-center mb-8 shadow-[0_15px_35px_rgba(255,160,36,0.3)] border-4 border-white"
            >
                <Icon className="w-10 h-10 text-white" strokeWidth={2.5} />
            </motion.div>
            
            <h2 className="text-3xl font-black text-[#3a4746] text-center mb-4 tracking-tighter leading-none">{feature.title}</h2>
            <p className="text-[#89979b] text-center leading-relaxed mb-12 text-[14px] font-medium px-4">{feature.content}</p>

            <div className="w-full space-y-8">
              {feature.id === 'scanning' && (
                  <div className="space-y-6">
                    <div className="relative group">
                       <div className="w-full bg-zinc-900 rounded-[2.5rem] overflow-hidden aspect-[4/3] shadow-2xl relative">
                          <img 
                            src="https://images.unsplash.com/photo-1543339308-43e59d6b73a6?q=80&w=2070&auto=format&fit=crop" 
                            className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-[2s]" 
                            alt="AI Scanning" 
                          />
                          <div className="absolute inset-x-8 top-1/2 -translate-y-1/2">
                             <div className="h-0.5 w-full bg-[#8de15c] shadow-[0_0_20px_#8de15c] animate-scan-line"></div>
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                             <div className="w-48 h-48 border-2 border-dashed border-white/20 rounded-3xl animate-pulse"></div>
                          </div>
                          <div className="absolute bottom-6 left-6 right-6">
                             <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 flex items-center gap-4">
                                <div className="w-12 h-12 bg-[#8de15c] rounded-xl flex items-center justify-center shadow-lg">
                                   <Check className="text-white w-6 h-6" />
                                </div>
                                <div>
                                   <p className="text-white text-[10px] uppercase font-black tracking-widest leading-none">Detected</p>
                                   <p className="text-white font-bold text-lg leading-tight">Harvest Salad Bowl</p>
                                </div>
                                <div className="ml-auto text-right text-white">
                                   <p className="text-[10px] opacity-70 font-bold uppercase">Target</p>
                                   <p className="text-xl font-black tracking-tighter">420<span className="text-[10px] ml-0.5">kcal</span></p>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                    
                    <div className="bg-white/60 border border-white p-6 rounded-[2rem] shadow-sm">
                       <h4 className="text-[12px] font-black text-[#3a4746] uppercase tracking-widest mb-4 flex items-center gap-2">
                         <Info className="w-4 h-4 text-primary" /> Why it matters
                       </h4>
                       <p className="text-sm font-bold text-[#89979b] leading-relaxed">Our neural engine handles complex plates by segmenting individual ingredients and volumetrically mapping them to precision nutrition data.</p>
                    </div>
                  </div>
              )}
              
              {feature.id === 'plans' && (
                  <div className="space-y-6">
                    <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 shadow-xl border border-white">
                       <div className="flex items-center justify-between mb-8">
                          <h4 className="text-xl font-black text-[#3a4746] tracking-tight">Focus Module</h4>
                          <span className="bg-[#ffa024]/10 text-[#ffa024] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">Active Choice</span>
                       </div>
                       
                       <div className="space-y-4">
                          {[
                            { name: 'Standard Balanced', val: '40/30/30', active: false },
                            { name: 'Ketogenic Elite', val: '75/20/5', active: true },
                            { name: 'Paleo Strength', val: '20/40/40', active: false },
                            { name: 'Vegan Endurance', val: '60/25/15', active: false }
                          ].map(module => (
                            <div key={module.name} className={`p-5 rounded-2xl border-2 transition-all flex items-center justify-between group ${module.active ? 'border-[#ffa024] bg-[#ffa024]/5 translate-x-1' : 'border-zinc-100 hover:border-zinc-200'}`}>
                               <div className="flex items-center gap-4">
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${module.active ? 'bg-[#ffa024] text-white shadow-lg shadow-[#ffa024]/20' : 'bg-zinc-100 text-zinc-400 group-hover:bg-zinc-200'}`}>
                                     <Sparkles className="w-5 h-5" fill={module.active ? "currentColor" : "none"} />
                                  </div>
                                  <div>
                                     <p className="font-extrabold text-[#3a4746]">{module.name}</p>
                                     <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">{module.val} Split</p>
                                  </div>
                               </div>
                               {module.active && <Check className="w-5 h-5 text-[#ffa024]" strokeWidth={3} />}
                            </div>
                          ))}
                       </div>
                    </div>
                  </div>
              )}

              {feature.id === 'insights' && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-white">
                       <h4 className="text-lg font-black text-[#3a4746] mb-6 flex items-center gap-2">
                         <Heart className="w-5 h-5 text-[#f55938]" fill="currentColor" /> Micros Mastery
                       </h4>
                       <div className="space-y-5">
                          {[
                            { label: 'Fiber', value: 85, color: '#8de15c' },
                            { label: 'Vitamin D', value: 42, color: '#ffa024' },
                            { label: 'Iron (Fe)', value: 68, color: '#309af0' },
                            { label: 'Magnesium', value: 91, color: '#9b51e0' }
                          ].map(micro => (
                            <div key={micro.label} className="space-y-2">
                               <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-zinc-400 px-1">
                                  <span>{micro.label}</span>
                                  <span className="text-[#3a4746]">{micro.value}%</span>
                               </div>
                               <div className="h-4 bg-zinc-50 rounded-full border border-zinc-100 p-0.5 shadow-inner">
                                  <motion.div 
                                    initial={{ width: 0 }} 
                                    animate={{ width: `${micro.value}%` }} 
                                    transition={{ duration: 1, delay: 0.2 }}
                                    className="h-full rounded-full shadow-sm" 
                                    style={{ backgroundColor: micro.color }}
                                  />
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>
                    
                    <div className="flex gap-4">
                       <div className="flex-1 bg-[#309af0]/10 p-5 rounded-[2rem] border border-[#309af0]/20">
                          <p className="text-[10px] font-black uppercase text-[#309af0] mb-1">Weekly Avg</p>
                          <p className="text-2xl font-black text-[#309af0] tracking-tighter">98%</p>
                          <p className="text-[10px] font-bold text-[#309af0]/70 mt-1">Accuracy Score</p>
                       </div>
                       <div className="flex-1 bg-[#8de15c]/10 p-5 rounded-[2rem] border border-[#8de15c]/20">
                          <p className="text-[10px] font-black uppercase text-[#8de15c] mb-1">Status</p>
                          <p className="text-2xl font-black text-[#8de15c] tracking-tighter">Optimal</p>
                          <p className="text-[10px] font-bold text-[#8de15c]/70 mt-1">Metabolic Rate</p>
                       </div>
                    </div>
                  </div>
              )}

              {feature.id === 'restaurant' && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-white space-y-8">
                       <div className="flex flex-col items-center">
                          <div className="w-16 h-1 w-12 bg-zinc-100 rounded-full mb-6"></div>
                          <div className="w-full h-40 bg-zinc-900 rounded-2xl overflow-hidden relative shadow-lg">
                             <img 
                                src="https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974&auto=format&fit=crop" 
                                className="w-full h-full object-cover opacity-50 contrast-125" 
                                alt="Menu Scan" 
                             />
                             <div className="absolute inset-0 flex flex-col p-4 justify-between">
                                <span className="inline-block bg-[#ffa024] text-white text-[9px] font-black px-2 py-1 rounded w-fit uppercase tracking-tighter shadow-lg">Scan Mode: Menu</span>
                                <div className="space-y-2">
                                   <div className="bg-black/40 backdrop-blur-md p-2 rounded-lg border border-white/20 translate-x-4 animate-bounce shrink-0">
                                      <p className="text-white text-[10px] font-black leading-none">Wagyu Burger</p>
                                      <p className="text-[#8de15c] text-xs font-black">940 kcal</p>
                                   </div>
                                   <div className="bg-black/40 backdrop-blur-md p-2 border border-white/20 rounded-lg -translate-x-4">
                                      <p className="text-white text-[10px] font-black leading-none">Garden Greens</p>
                                      <p className="text-[#309af0] text-xs font-black">180 kcal</p>
                                   </div>
                                </div>
                             </div>
                          </div>
                       </div>
                       
                       <div className="space-y-4">
                          <h4 className="text-sm font-black text-[#3a4746] uppercase tracking-widest text-center">Smart Integration</h4>
                          <div className="flex justify-around items-center">
                             {['Yelp', 'UberEats', 'TripAdvisor', 'Google'].map(brand => (
                               <div key={brand} className="w-12 h-12 bg-zinc-50 rounded-2xl border border-zinc-100 flex items-center justify-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
                                  <span className="text-[8px] font-black uppercase text-zinc-400">{brand}</span>
                               </div>
                             ))}
                          </div>
                       </div>
                    </div>
                  </div>
              )}

              {feature.id === 'forecasting' && (
                  <div className="space-y-6">
                    <div className="bg-[#141d2a] rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden h-80 flex flex-col border border-white/10">
                       <div className="relative z-10">
                          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mb-1">Neural Forecast</p>
                          <h4 className="text-2xl font-black text-white tracking-tighter leading-tight">6-Month Blueprint</h4>
                       </div>
                       
                       <div className="flex-1 w-full relative mt-4">
                          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                             <defs>
                                <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                                   <stop offset="0%" style={{ stopColor: '#309af0', stopOpacity: 0.2 }} />
                                   <stop offset="100%" style={{ stopColor: '#309af0', stopOpacity: 0 }} />
                                </linearGradient>
                             </defs>
                             <path d="M 0 80 Q 25 75 50 60 T 100 20 L 100 100 L 0 100 Z" fill="url(#grad)" />
                             <motion.path 
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 1.5 }}
                                d="M 0 80 Q 25 75 50 60 T 100 20" 
                                fill="none" 
                                stroke="#309af0" 
                                strokeWidth="3" 
                                strokeLinecap="round" 
                             />
                             <circle cx="50" cy="60" r="3" fill="#ffa024" />
                             <circle cx="100" cy="20" r="4" fill="#8de15c" shadow="0 0 10px #8de15c" />
                          </svg>
                          
                          <div className="absolute top-[20%] right-0 bg-[#8de15c] text-white px-3 py-1.5 rounded-xl font-black text-xs shadow-lg uppercase tracking-tighter animate-bounce">
                             Goal Reached
                          </div>
                          <div className="absolute bottom-4 left-0 right-0 flex justify-between px-2 text-[9px] font-black text-white/30 uppercase tracking-widest">
                             <span>Now</span>
                             <span>May</span>
                             <span>Aug</span>
                             <span>Nov <span className="text-white">v2.0</span></span>
                          </div>
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                       <div className="bg-white p-6 rounded-[2rem] border border-white shadow-sm">
                          <p className="text-[10px] font-black uppercase text-[#89979b] mb-1">Est. Weight</p>
                          <p className="text-2xl font-black text-[#3a4746] tracking-tighter">64.2<span className="text-[12px] ml-0.5">kg</span></p>
                          <div className="flex items-center gap-1 text-[#8de15c] text-[10px] font-black mt-2">
                             <TrendingUp className="w-3 h-3" strokeWidth={3} />
                             -8.5% Total
                          </div>
                       </div>
                       <div className="bg-white p-6 rounded-[2rem] border border-white shadow-sm">
                          <p className="text-[10px] font-black uppercase text-[#89979b] mb-1">Body Fat</p>
                          <p className="text-2xl font-black text-[#3a4746] tracking-tighter">14.0<span className="text-[12px] ml-0.5">%</span></p>
                          <div className="flex items-center gap-1 text-[#309af0] text-[10px] font-black mt-2">
                             <FastForward className="w-3 h-3" />
                             Lean Build
                          </div>
                       </div>
                    </div>
                  </div>
              )}
            </div>

            <motion.button 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              onClick={() => setActiveFeature(null)}
              className="mt-12 w-full bg-[#3a4746] text-white font-black py-5 rounded-[2.5rem] shadow-xl hover:bg-black transition-all active:scale-[0.98] uppercase tracking-[0.2em] text-xs"
            >
              Continue Explore
            </motion.button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#eff3f4] overflow-hidden w-full h-full">
      <AnimatePresence mode="wait">
        {activeFeature ? renderFeaturePage() : (
          <motion.div 
            key="main-premium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full overflow-y-auto pb-32"
          >
            {/* Header */}
            <div className="w-full h-72 bg-gradient-to-br from-[#ffa024] to-[#f55938] rounded-b-[4rem] relative p-8 flex flex-col items-center justify-center shadow-[0_15px_40px_rgba(255,160,36,0.3)] border-b-4 border-white">
              <button 
                onClick={onClose} 
                className="absolute top-10 right-8 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-xl border border-white/40 text-white hover:bg-white/40 transition-all active:scale-90 shadow-lg"
              >
                <X className="w-6 h-6" />
              </button>
              
              <motion.div 
                initial={{ scale: 0.8, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                className="w-24 h-24 bg-white/20 rounded-[2.5rem] flex items-center justify-center backdrop-blur-xl border border-white/40 mb-6 shadow-2xl"
              >
                <Sparkles className="w-12 h-12 text-white" fill="currentColor" />
              </motion.div>
              <h2 className="text-4xl font-black text-white tracking-tighter leading-none mb-1">Elite Bunny AI</h2>
              <div className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/30 flex items-center gap-2">
                 <Sparkles className="w-3 h-3 text-white" fill="currentColor" />
                 <span className="text-white text-[10px] font-black uppercase tracking-widest">The Ultimate Health OS</span>
              </div>
            </div>

            <div className="px-6 -mt-10 relative z-10 space-y-6 max-w-2xl mx-auto">
              <div className="bg-white rounded-[3rem] p-8 shadow-[0_15px_50px_rgba(0,0,0,0.06)] border border-white flex flex-col">
                <h5 className="text-[11px] font-black text-[#ffa024] uppercase tracking-[0.3em] mb-8 ml-1 opacity-60">Elite Capabilities</h5>
                
                <div className="space-y-2">
                  {features.map((feature, index) => (
                    <React.Fragment key={feature.id}>
                      <button 
                        onClick={() => setActiveFeature(feature.id)}
                        className="w-full flex items-center justify-between group p-4 -mx-2 rounded-[2rem] transition-all hover:bg-zinc-50 active:scale-95"
                      >
                        <div className="flex items-start gap-5 pr-4">
                          <div className="w-14 h-14 rounded-2xl bg-[#fff4e6] flex items-center justify-center shrink-0 group-hover:bg-[#ffa024] group-hover:text-white transition-all shadow-inner border border-zinc-100">
                            <feature.icon className="w-7 h-7 text-[#ffa024] group-hover:text-white" strokeWidth={2.5} />
                          </div>
                          <div className="text-left">
                            <h4 className="font-black text-[#3a4746] text-base tracking-tight leading-none mb-1 group-hover:text-primary transition-colors">{feature.title}</h4>
                            <p className="text-[#89979b] text-[12px] leading-tight font-bold opacity-80">{feature.desc}</p>
                          </div>
                        </div>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-zinc-50 group-hover:bg-[#ffa024] transition-all group-hover:translate-x-1">
                           <ChevronRight className="w-5 h-5 text-zinc-300 group-hover:text-white" strokeWidth={3} />
                        </div>
                      </button>
                      
                      {index < features.length - 1 && (
                        <div className="w-full h-px bg-zinc-100/60 my-1 mx-2"></div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between px-4">
                   <h5 className="text-[11px] font-black text-[#89979b] uppercase tracking-[0.3em]">Select Blueprint</h5>
                   <span className="text-[9px] font-black text-primary bg-primary/10 px-2 py-1 rounded uppercase tracking-widest">No Hidden Fees</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {plans.map(plan => (
                    <button
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`p-6 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-2 group relative overflow-hidden ${
                        selectedPlan === plan.id 
                        ? 'bg-[#3a4746] border-[#3a4746] shadow-2xl scale-102 -translate-y-1' 
                        : 'bg-white border-white hover:border-zinc-200 text-zinc-400'
                      }`}
                    >
                      {selectedPlan === plan.id && (
                        <motion.div layoutId="highlight" className="absolute top-2 right-4"><Sparkles className="w-4 h-4 text-[#ffa024]" fill="currentColor" /></motion.div>
                      )}
                      <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${selectedPlan === plan.id ? 'text-white/40' : 'text-zinc-400'}`}>{plan.name}</span>
                      <span className={`text-xl font-black tracking-tighter ${selectedPlan === plan.id ? 'text-white' : 'text-[#3a4746]'}`}>{plan.price}</span>
                      <span className={`text-[9px] font-bold ${selectedPlan === plan.id ? 'text-white/60' : 'text-zinc-400'}`}>{plan.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Upgrade Button */}
              <div className="pt-4">
                {isUpgraded ? (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full bg-[#8de15c]/10 border-2 border-[#8de15c] text-[#144500] font-black text-center py-6 rounded-[2.5rem] flex items-center justify-center gap-3 shadow-lg"
                  >
                     <div className="w-8 h-8 rounded-full bg-[#8de15c] flex items-center justify-center text-white">
                        <Check className="w-5 h-5" strokeWidth={4} />
                     </div>
                     <span className="uppercase tracking-[0.2em] text-xs">Full Access Activated</span>
                  </motion.div>
                ) : (
                  <button 
                    onClick={() => setIsUpgraded(true)}
                    className="w-full relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#8de15c] to-[#6bc438] rounded-[2.5rem] blur-xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
                    <div className="relative bg-gradient-to-r from-[#8de15c] to-[#6bc438] text-white font-black text-lg py-6 rounded-[2.5rem] shadow-xl transition-all active:scale-[0.98] uppercase tracking-[0.2em] flex items-center justify-center gap-3 border-b-4 border-black/10 overflow-hidden">
                      <Sparkles className="w-6 h-6 animate-pulse" fill="currentColor" />
                      Elevate Now
                      <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-[-20deg]"></div>
                    </div>
                  </button>
                )}
                
                <p className="text-center text-[10px] font-black text-[#89979b] mt-8 uppercase tracking-[0.2em] px-8 leading-relaxed opacity-40">
                  Secured by fitnessbunny AES-256. <br />
                  Join 1.2M Elite members worldwide.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <style>{`
        @keyframes scan-line {
          0% { top: 0; }
          100% { top: 100%; }
        }
        .animate-scan-line {
          position: absolute;
          animation: scan-line 2s ease-in-out infinite alternate;
        }
      `}</style>
    </div>
  );
}

