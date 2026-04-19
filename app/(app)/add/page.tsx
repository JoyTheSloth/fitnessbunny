"use client";

import { useState } from 'react';
import AIHubScreen from '../../src/screens/AIHubScreen';
import ScanScreen from '../../src/screens/ScanScreen';
import AddScreen from '../../src/screens/AddScreen';

export default function AddPage() {
  const [showScan, setShowScan] = useState(false);
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [targetCategory, setTargetCategory] = useState('Breakfast');

  const handleNavigateToScan = () => setShowScan(true);
  const handleNavigateToAdd = (category: string) => {
    setTargetCategory(category);
    setShowAddMeal(true);
  };

  return (
    <>
      <AIHubScreen
        onNavigateToScan={handleNavigateToScan}
        onNavigateToAdd={handleNavigateToAdd}
      />

      {/* Overlays */}
      {showScan && (
        <div className="fixed inset-0 z-210">
          <ScanScreen closeScan={() => setShowScan(false)} />
        </div>
      )}

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
    </>
  );
}