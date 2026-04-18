"use client";
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface CuteCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDate: Date;
  onSelectDate: (date: Date) => void;
  daysWithLogs?: Set<string>; // Optional for other screens
}

export default function CuteCalendarModal({ isOpen, onClose, currentDate, onSelectDate, daysWithLogs }: CuteCalendarModalProps) {
  const [viewDate, setViewDate] = useState(new Date(currentDate));
  
  const daysData = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const offset = new Date(year, month, 1).getDay();
    return { totalDays, offset, year, month };
  }, [viewDate]);

  const changeMonth = (offset: number) => {
    setViewDate(new Date(daysData.year, daysData.month + offset, 1));
  };

  const monthName = viewDate.toLocaleString('default', { month: 'long' });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[200]"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-white rounded-[2.5rem] shadow-2xl z-[201] overflow-hidden border border-white"
          >
            <div className="bg-[#8de15c]/10 p-6 flex justify-between items-center">
              <div className="flex items-center gap-2">
                 <button onClick={() => changeMonth(-1)} className="p-1.5 hover:bg-white/50 rounded-lg text-[#3a4746]"><ChevronLeft size={18} /></button>
                 <h3 className="text-lg font-black text-[#3a4746] tracking-tight">{monthName} {daysData.year}</h3>
                 <button onClick={() => changeMonth(1)} className="p-1.5 hover:bg-white/50 rounded-lg text-[#3a4746]"><ChevronRight size={18} /></button>
              </div>
              <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/80 text-[#3a4746] shadow-sm"><X size={16} /></button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['S','M','T','W','T','F','S'].map(d => (
                  <div key={d} className="text-center text-[10px] font-black text-[#b9c3c1] uppercase mb-2">{d}</div>
                ))}
                {Array.from({ length: daysData.offset }).map((_, i) => <div key={`b-${i}`} />)}
                {Array.from({ length: daysData.totalDays }).map((_, i) => {
                  const d = i + 1;
                  const dateObj = new Date(daysData.year, daysData.month, d);
                  const isToday = dateObj.toDateString() === new Date().toDateString();
                  const isSelected = dateObj.toDateString() === currentDate.toDateString();
                  const dateStr = dateObj.toISOString().split('T')[0];
                  const hasLogs = daysWithLogs?.has(dateStr);

                  return (
                    <button 
                      key={d}
                      onClick={() => {
                        onSelectDate(dateObj);
                        onClose();
                      }}
                      className={`h-10 w-10 flex items-center justify-center rounded-2xl text-xs font-black transition-all relative ${
                        isSelected 
                        ? 'bg-[#8de15c] text-white shadow-lg shadow-[#8de15c]/20' 
                        : isToday ? 'text-[#8de15c] hover:bg-[#eff3f4]' : 'text-[#3a4746] hover:bg-[#eff3f4]'
                      }`}
                    >
                      {d}
                      {hasLogs && (
                        <div className={`absolute -bottom-0.5 ${isSelected ? 'text-white' : 'text-[#ff9d2d]'}`}>
                           <span className="text-[10px]">🥕</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              
              <button 
                onClick={() => { onSelectDate(new Date()); onClose(); }}
                className="w-full py-3 bg-[#f8fafb] border border-[#f1f4f5] rounded-2xl text-[#3a4746] font-black text-[10px] uppercase tracking-widest hover:bg-[#eff3f4] transition-all"
              >
                Snap back to today
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
