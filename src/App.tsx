"use client";
import React, { useState } from 'react';
import BottomNav from './components/BottomNav';
import DiaryScreen from './screens/DiaryScreen';
import InsightsScreen from './screens/InsightsScreen';
import AddScreen from './screens/AddScreen';
import MealsScreen from './screens/MealsScreen';
import ProfileScreen from './screens/ProfileScreen';
import ScanScreen from './screens/ScanScreen';
import PremiumScreen from './screens/PremiumScreen';
import AIHubScreen from './screens/AIHubScreen';
import { UserProvider } from './context/UserContext';
import { AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState('diary');
  const [targetCategory, setTargetCategory] = useState('Breakfast');

  // Overlay states — completely decoupled from tab navigation
  const [showScan, setShowScan] = useState(false);
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [showPremium, setShowPremium] = useState(false);

  // Opens the Add dialog with a specific meal category (Breakfast, Lunch, etc.)
  // Called ONLY from DiaryScreen buttons — never from tab navigation
  const handleOpenAddDialog = (category: string) => {
    setTargetCategory(category);
    setShowAddMeal(true);
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'diary':
        return (
          <DiaryScreen
            onOpenPremium={() => setShowPremium(true)}
            onNavigateToAdd={handleOpenAddDialog}
            onOpenScan={() => setShowScan(true)}
          />
        );

      case 'dashboard':
        return <InsightsScreen onOpenPremium={() => setShowPremium(true)} />;

      // Center bunny tab → renders the new AI Hub Screen (from your screenshot)
      case 'add':
        return (
          <AIHubScreen
            onNavigateToScan={() => setShowScan(true)}
            onNavigateToAdd={handleOpenAddDialog}
          />
        );

      case 'recipes':
        return <MealsScreen onOpenPremium={() => setShowPremium(true)} />;

      case 'settings':
        return <ProfileScreen onOpenPremium={() => setShowPremium(true)} />;

      default:
        return (
          <DiaryScreen
            onOpenPremium={() => setShowPremium(true)}
            onNavigateToAdd={handleOpenAddDialog}
            onOpenScan={() => setShowScan(true)}
          />
        );
    }
  };

  return (
    <UserProvider>
      <div className="font-sans text-on-surface h-screen relative overflow-hidden bg-[#eff3f4]">
        {/* Main screen — rendered behind overlays */}
        <div className="relative z-10 h-full pb-20">
          {renderScreen()}
        </div>

        {/* Bottom nav — always visible */}
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Overlays — triggered by in-page buttons only */}
        <AnimatePresence>
          {showAddMeal && (
            <div className="fixed inset-0 z-[200]">
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
            <div className="fixed inset-0 z-[210]">
              <ScanScreen closeScan={() => setShowScan(false)} />
            </div>
          )}

          {showPremium && (
            <div className="fixed inset-0 z-[220]">
              <PremiumScreen onClose={() => setShowPremium(false)} />
            </div>
          )}
        </AnimatePresence>
      </div>
    </UserProvider>
  );
}