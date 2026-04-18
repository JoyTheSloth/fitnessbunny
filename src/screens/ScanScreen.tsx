"use client";
import React, { useEffect, useState, useRef } from 'react';
import { X, Zap, CheckCircle2, Sparkles, PlusCircle, Camera, AlertCircle, ShieldCheck, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useUser } from '../context/UserContext';

export default function ScanScreen({ closeScan }: { closeScan: () => void }) {
  const { addMeal } = useUser();
  const [analyzed, setAnalyzed] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<'checking' | 'granted' | 'denied'>('checking');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Analysis result state
  const [result, setResult] = useState<any>(null);

  const startCamera = async () => {
    try {
      setPermissionStatus('checking');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
        } catch (playErr) {
          console.error("Video play failed:", playErr);
        }
      }
      streamRef.current = stream;
      setPermissionStatus('granted');
      
      // Auto-trigger analysis after 2 seconds of stabilization
      setTimeout(() => {
        captureAndAnalyze();
      }, 2500);

    } catch (err) {
      console.error("Camera access error:", err);
      setPermissionStatus('denied');
    }
  };

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current || isAnalyzing) return;
    
    setIsAnalyzing(true);
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const base64Image = canvas.toDataURL('image/jpeg', 0.8);
      
      try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`
          },
          body: JSON.stringify({
            model: "llama-3.2-11b-vision-preview",
            messages: [{
              role: "user",
              content: [
                {
                  type: "text",
                  text: `Analyze the food in this image with high confidence. 
                  TONE: Friendly, encouraging, light humor.
                  PRECISION: Use exact numbers (e.g. 248 kcal, NOT 250).
                  SAFETY: Clarify estimates are approximations. No medical advice.
                  
                  Extract: 
                  1. Meal Name (e.g. "Veg Thali", "Chicken Salad")
                  2. List of Items with weights/portions.
                  3. Full macros (Protein, Carbs, Fat, Fiber, Sugar, Sodium).
                  4. Notes (Include confidence and alternative ranges if ambiguous).
                  
                  Return ONLY JSON: {
                    "meal_name": string, 
                    "items": [{"name": string, "quantity": string, "calories": number, "protein": number, "carbs": number, "fat": number, "fiber": number, "sugar": number, "sodium": number, "confidence": "High"|"Medium"|"Low"}], 
                    "totals": {"calories": number, "protein": number, "carbs": number, "fat": number, "fiber": number, "sugar": number, "sodium": number}, 
                    "notes": string
                  }`
                },
                {
                  type: "image_url",
                  image_url: {
                    url: base64Image
                  }
                }
              ]
            }],
            temperature: 0,
            response_format: { type: "json_object" }
          })
        });

        const data = await response.json();
        const parsed = JSON.parse(data.choices[0].message.content);
        setResult(parsed);
        setAnalyzed(true);
      } catch (error) {
        console.error("Analysis failed:", error);
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleAddMeal = () => {
    if (!result) return;
    addMeal({
      name: result.meal_name,
      calories: result.totals.calories,
      carbs: result.totals.carbs,
      protein: result.totals.protein,
      fat: result.totals.fat,
      fiber: result.totals.fiber,
      sugar: result.totals.sugar,
      sodium: result.totals.sodium,
      type: 'Lunch', // Default to lunch for scans
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    closeScan();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-zinc-950 overflow-hidden flex flex-col">
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Background Layer (Real Camera or Mock) */}
      <AnimatePresence>
        {permissionStatus === 'granted' ? (
          <motion.video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <motion.img 
            initial={{ opacity: 0 }}
            animate={{ opacity: permissionStatus === 'denied' ? 0.3 : 0.8 }}
            className="absolute inset-0 w-full h-full object-cover" 
            alt="Camera View Mock" 
            src="https://picsum.photos/all/seed/food-scan/1080/1920?blur=10" 
          />
        )}
      </AnimatePresence>

      {/* Permission Prompt Overlay */}
      <AnimatePresence>
        {permissionStatus === 'denied' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-50 flex items-center justify-center p-8 bg-black/60 backdrop-blur-sm"
          >
            <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full text-center space-y-6 shadow-2xl border border-white/20">
              <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto text-red-500 shadow-inner">
                <Camera className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-zinc-900 tracking-tight">Camera Required</h3>
                <p className="text-zinc-500 text-sm mt-3 font-bold leading-relaxed px-4">
                  Bunny needs camera access to identify your delicious meals instantly. ✨
                </p>
              </div>
              <div className="space-y-3 pt-2">
                <button 
                  onClick={startCamera}
                  className="w-full py-4 bg-[#226900] text-white font-extrabold rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-5 h-5" />
                  Request Access
                </button>
                <button 
                  onClick={closeScan}
                  className="w-full py-4 bg-zinc-100 text-zinc-500 font-extrabold rounded-2xl hover:bg-zinc-200 transition-all"
                >
                  Go Back
                </button>
              </div>
              <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest font-black text-zinc-300">
                <AlertCircle className="w-3 h-3" />
                <span>Private & Secure</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* UI Overlay */}
      <div className="absolute inset-0 flex flex-col justify-between p-6 z-10 pb-12 pointer-events-none">
        <div className="flex justify-between items-center w-full pointer-events-auto">
          <button onClick={closeScan} className="w-12 h-12 flex items-center justify-center bg-black/40 backdrop-blur-md rounded-full text-white transition-transform active:scale-90 shadow-sm border border-white/10">
            <X className="w-6 h-6" />
          </button>
          
          <div className="px-4 py-2 flex items-center gap-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 shadow-sm">
            <div className={`w-2 h-2 rounded-full ${permissionStatus === 'denied' ? 'bg-zinc-500' : 'bg-red-500'} animate-pulse`}></div>
            <span className="text-white text-xs font-bold tracking-widest uppercase">
              {analyzed ? "Scan Complete" : (isAnalyzing ? "Analyzing..." : (permissionStatus === 'granted' ? "Live Scan" : "Awaiting Camera"))}
            </span>
          </div>
          
          <button onClick={captureAndAnalyze} className="w-12 h-12 flex items-center justify-center bg-black/40 backdrop-blur-md rounded-full text-white transition-transform active:scale-90 shadow-sm border border-white/10">
            {isAnalyzing ? <Loader2 className="w-6 h-6 animate-spin text-[#8de15c]" /> : <Zap className="w-6 h-6" fill={analyzed ? "#8de15c" : "none"} />}
          </button>
        </div>

        {permissionStatus === 'granted' && !analyzed && (
          <div className="relative flex-1 flex items-center justify-center">
            <div className="relative w-72 h-72">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#8de15c] rounded-tl-2xl drop-shadow-[0_0_8px_rgba(141,225,92,0.5)]"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#8de15c] rounded-tr-2xl drop-shadow-[0_0_8px_rgba(141,225,92,0.5)]"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#8de15c] rounded-bl-2xl drop-shadow-[0_0_8px_rgba(141,225,92,0.5)]"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#8de15c] rounded-br-2xl drop-shadow-[0_0_8px_rgba(141,225,92,0.5)]"></div>
              
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#8de15c] to-transparent animate-[scan_3s_ease-in-out_infinite]"></div>
            </div>
          </div>
        )}

        {analyzed && (
          <div className="relative flex-1 flex items-center justify-center pointer-events-none">
            <div className="relative w-64 h-64 border-2 border-[#8de15c]/30 rounded-[2.5rem] bg-[#8de15c]/5 backdrop-blur-sm">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#226900] text-white px-5 py-2.5 rounded-full flex items-center gap-2 shadow-xl shadow-black/20">
                <CheckCircle2 className="w-4 h-4" />
                <span className="font-extrabold text-sm tracking-tight whitespace-nowrap">{result?.items[0]?.name || "Food"} Detected</span>
              </div>
            </div>
          </div>
        )}

        <div className={`w-full max-w-md mx-auto transition-all duration-700 transform pointer-events-auto ${analyzed ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0 pointer-events-none'}`}>
          <div className="bg-white/80 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl p-6 border border-white/20">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1 mr-4">
                <span className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest mb-1.5 block">Analysis Result</span>
                <h2 className="text-2xl font-extrabold text-on-surface tracking-tight leading-none mt-1">{result?.meal_name || "Food Analysis"}</h2>
                <p className="text-on-surface-variant text-sm mt-2 font-medium">{result?.items?.[0]?.quantity || "Portion estimated"}</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-light text-primary flex items-baseline">
                  {result?.totals?.calories || 0} <span className="text-xs font-bold ml-1 uppercase tracking-widest text-[#405700]">kcal</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-white/70 p-4 rounded-3xl flex flex-col items-center shadow-sm border border-black/5">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5">Protein</span>
                <span className="text-xl font-extrabold text-on-surface mt-1">{result?.totals?.protein || 0}g</span>
                <div className="w-full h-1 bg-surface-container-highest rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-secondary w-2/3 rounded-full"></div>
                </div>
              </div>
              <div className="bg-white/70 p-4 rounded-3xl flex flex-col items-center shadow-sm border border-primary/20 relative">
                {result?.totals?.carbs > 50 && <div className="absolute -top-2 bg-primary text-white text-[8px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest leading-none">High Carbs</div>}
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5 mt-1.5">Carbs</span>
                <span className="text-xl font-extrabold text-on-surface mt-1">{result?.totals?.carbs || 0}g</span>
                <div className="w-full h-1 bg-surface-container-highest rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-primary w-1/2 rounded-full"></div>
                </div>
              </div>
              <div className="bg-white/70 p-4 rounded-3xl flex flex-col items-center shadow-sm border border-black/5">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5">Fat</span>
                <span className="text-xl font-extrabold text-on-surface mt-1">{result?.totals?.fat || 0}g</span>
                <div className="w-full h-1 bg-surface-container-highest rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-[#ff9656] w-3/4 rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="bg-[#ff9656]/15 p-4 rounded-2xl flex items-start gap-3 mb-6 border border-[#ff9656]/20">
              <Sparkles className="text-[#974300] w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-xs text-[#542200] leading-relaxed font-medium">
                {result?.notes || "Pro Tip: Adding the exact weight from your kitchen scale will increase accuracy to 99%."}
              </p>
            </div>

            <button onClick={handleAddMeal} className="w-full h-14 bg-[#226900] text-white font-extrabold rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-transform">
              <PlusCircle className="w-5 h-5" />
              Add to Breakfast Meal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes scan {
      0%, 100% { transform: translateY(-36px); opacity: 0.2; }
      50% { transform: translateY(36px); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
}
