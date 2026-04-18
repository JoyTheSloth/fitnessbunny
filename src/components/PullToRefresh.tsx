"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'motion/react';
import { RefreshCw } from 'lucide-react';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

export default function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullProgress, setPullProgress] = useState(0);
  const dragY = useMotionValue(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef(0);
  
  // Icon animation values
  const rotate = useTransform(dragY, [0, 100], [0, 360]);
  const opacity = useTransform(dragY, [0, 60, 100], [0, 0.5, 1]);
  const scale = useTransform(dragY, [0, 100], [0.8, 1.2]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (el.scrollTop <= 0) {
        startYRef.current = e.touches[0].clientY;
      } else {
        startYRef.current = 0;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (startYRef.current === 0 || isRefreshing) return;
      
      const currentY = e.touches[0].clientY;
      const deltaY = currentY - startYRef.current;
      
      if (deltaY > 0 && el.scrollTop <= 0) {
        const newY = Math.min(deltaY * 0.4, 120);
        dragY.set(newY);
        setPullProgress(Math.min(newY / 80, 1));
        
        // Prevent native scroll/bounce while pulling
        if (newY > 5 && e.cancelable) {
          e.preventDefault();
        }
      }
    };

    const handleTouchEnd = () => {
      startYRef.current = 0;
      if (dragY.get() >= 80 && !isRefreshing) {
        onRefreshInternal();
      } else {
        animate(dragY, 0, { type: 'spring', stiffness: 300, damping: 30 });
      }
      setPullProgress(0);
    };

    el.addEventListener('touchstart', handleTouchStart);
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    el.addEventListener('touchend', handleTouchEnd);

    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isRefreshing, onRefresh, dragY]);

  const onRefreshInternal = async () => {
    setIsRefreshing(true);
    animate(dragY, 60, { type: 'spring', stiffness: 300, damping: 30 });
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
      animate(dragY, 0, { type: 'spring', stiffness: 300, damping: 30 });
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col">
      {/* Refresh Indicator Container */}
      <motion.div 
        style={{ height: dragY }}
        className="overflow-hidden flex items-center justify-center pointer-events-none"
      >
        <div className="flex flex-col items-center">
          <motion.div
            style={{ rotate, opacity, scale }}
            className={`p-3 rounded-full bg-white shadow-lg border border-[#8de15c]/20 flex items-center justify-center ${isRefreshing ? 'animate-spin' : ''}`}
          >
            {isRefreshing ? (
              <RefreshCw className="w-5 h-5 text-[#8de15c]" strokeWidth={3} />
            ) : (
              <img 
                src="input_file_1.png" 
                alt="Fitness Bunny" 
                className="w-10 h-10 object-contain"
                referrerPolicy="no-referrer"
              />
            )}
          </motion.div>
          <motion.span 
            style={{ opacity: useTransform(dragY, [40, 80], [0, 1]) }}
            className="text-[10px] uppercase font-black tracking-widest text-[#8de15c] mt-2"
          >
            {pullProgress >= 1 ? 'Release to Refresh' : 'Pull Down'}
          </motion.span>
        </div>
      </motion.div>

      {/* Content Area with Native Scroll */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto pt-2 scroll-smooth"
        style={{ 
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-y'
        }}
      >
        {children}
      </div>
    </div>
  );
}
