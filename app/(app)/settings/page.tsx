"use client";

import { useState } from 'react';
import ProfileScreen from '@/src/screens/ProfileScreen';
import PremiumScreen from '@/src/screens/PremiumScreen';
import { AnimatePresence } from 'motion/react';

export default function SettingsPage() {
  const [showPremium, setShowPremium] = useState(false);

  return (
    <>
      <ProfileScreen onOpenPremium={() => setShowPremium(true)} />

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