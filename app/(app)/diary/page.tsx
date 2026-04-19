"use client";

import { useState } from 'react';
import DiaryScreen from '@/src/screens/DiaryScreen';
import AddScreen from '@/src/screens/AddScreen';
import ScanScreen from '@/src/screens/ScanScreen';
import PremiumScreen from '@/src/screens/PremiumScreen';
import { AnimatePresence } from 'motion/react';

export default function DiaryPage() {
  const [showScan, setShowScan] = useState(false);
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [showPremium, setShowPremium] = useState(false);
  const [targetCategory, setTargetCategory] = useState('Breakfast');

  const handleOpenAddDialog = (category: string) => {
    setTargetCategory(category);
    setShowAddMeal(true);
  };

  return (
    <>
      <DiaryScreen
        onOpenPremium={() => setShowPremium(true)}
        onNavigateToAdd={handleOpenAddDialog}
        onOpenScan={() => setShowScan(true)}
      />

      {/* Overlays */}
      <AnimatePresence>
        {showAddMeal && (
          <div className="fixed inset-0 z-200">
            <AddScreen
              initialCategory={targetCategory}
              onBack={() => setShowAddMeal(false)}
              onScanClick={() => {
                setShowAddMeal(false);
                setShowScan(true);
              }}
            />
          </div>
        )}

        {showScan && (
          <div className="fixed inset-0 z-210">
            <ScanScreen closeScan={() => setShowScan(false)} />
          </div>
        )}

        {showPremium && (
          <div className="fixed inset-0 z-220">
            <PremiumScreen onClose={() => setShowPremium(false)} />
          </div>
        )}
      </AnimatePresence>
    </>
  );
}