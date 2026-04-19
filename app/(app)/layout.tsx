"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import BottomNav from '../../src/components/BottomNav';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Map pathname to activeTab
  const getActiveTab = () => {
    if (pathname === '/diary') return 'diary';
    if (pathname === '/insights') return 'dashboard';
    if (pathname === '/add') return 'add';
    if (pathname === '/meals') return 'recipes';
    if (pathname === '/settings') return 'settings';
    return 'diary';
  };

  return (
    <div className="font-sans text-on-surface h-screen relative overflow-hidden bg-white">
      {/* Main screen */}
      <div className="absolute inset-0 z-10">
        {children}
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 z-100">
        <BottomNav activeTab={getActiveTab()} />
      </div>
    </div>
  );
}
