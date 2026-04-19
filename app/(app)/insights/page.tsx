"use client";

import { useState } from 'react';
import InsightsScreen from '@/src/screens/InsightsScreen';
import PremiumScreen from '@/src/screens/PremiumScreen';
import { AnimatePresence } from 'motion/react';

export default function InsightsPage() {
  const [showPremium, setShowPremium] = useState(false);

  return (
    <>
      <InsightsScreen onOpenPremium={() => setShowPremium(true)} />

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