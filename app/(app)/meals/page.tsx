"use client";

import { useState } from 'react';
import MealsScreen from '@/src/screens/MealsScreen';
import PremiumScreen from '@/src/screens/PremiumScreen';
import { AnimatePresence } from 'motion/react';

export default function MealsPage() {
  const [showPremium, setShowPremium] = useState(false);

  return (
    <>
      <MealsScreen onOpenPremium={() => setShowPremium(true)} />

      {/* Overlays */}
      <AnimatePresence>
        {showPremium && (
          <div className="fixed inset-0 z-220">
            <PremiumScreen onClose={() => setShowPremium(false)} />
          </div>
        )}
      </AnimatePresence>
    </>
  );
}