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
import WelcomeScreen from './screens/WelcomeScreen';
import SettingsScreen from './screens/SettingsScreen';
import { UserProvider, useUser } from './context/UserContext';
import { AnimatePresence } from 'motion/react';
import AIAssistant from './components/AIAssistant';

import { useSession } from 'next-auth/react';

function AppContent() {
  const { data: session, status } = useSession();
  const { profile, updateProfile } = useUser();
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [activeTab, setActiveTab] = useState('diary');
  const [targetCategory, setTargetCategory] = useState('Breakfast');

  // Sync state with session status
  React.useEffect(() => {
    if (status === 'unauthenticated') {
      setHasOnboarded(false);
    } else if (status === 'authenticated' && profile.name) {
      setHasOnboarded(true);
    }
  }, [status, profile.name]);

  // Overlay states
  const [showScan, setShowScan] = useState(false);
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [showPremium, setShowPremium] = useState(false);

  const handleOpenAddDialog = (category: string) => {
    setTargetCategory(category);
    setShowAddMeal(true);
  };

  const handleOnboard = (name: string, email: string) => {
    updateProfile({ name, email });
    setHasOnboarded(true);
  };

  if (!hasOnboarded) {
    return <WelcomeScreen onStart={handleOnboard} />;
  }

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
    <div className="font-sans text-on-surface h-screen relative overflow-hidden bg-white">
      {/* Main screen — rendered behind overlays */}
      <div className="absolute inset-0 z-10">
        {renderScreen()}
      </div>

      {/* Bottom nav — fixed on top */}
      <div className="fixed bottom-0 left-0 right-0 z-[100]">
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

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
  );
}

export default function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}