"use client";
import React from 'react';
import Link from 'next/link';
import { BookText, BarChart3, Rabbit, Utensils, Settings } from 'lucide-react';

export default function BottomNav({ activeTab }: { activeTab: string }) {
  const tabs = [
    { id: 'diary', label: 'Diary', icon: BookText, href: '/diary' },
    { id: 'dashboard', label: 'Insights', icon: BarChart3, href: '/insights' },
    { id: 'add', label: '', icon: Rabbit, href: '/add', isMain: true },
    { id: 'recipes', label: 'Recipes', icon: Utensils, href: '/meals' },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-40 flex justify-around items-center px-2 pt-2 bg-white/80 backdrop-blur-xl border-t border-black/[0.03] shadow-[0_-8px_30px_rgba(0,0,0,0.04)]"
      style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))' }}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        if (tab.isMain) {
            return (
                <div key={tab.id} className="relative -mt-9 flex flex-col items-center justify-center">
                    <Link href={tab.href}>
                      <button 
                        className="flex items-center justify-center rounded-full w-[62px] h-[62px] bg-[#8de15c] text-white transform transition-all active:scale-95 border-[5px] border-white z-10 shadow-lg"
                      >
                        <Rabbit className="w-7 h-7" strokeWidth={3} />
                      </button>
                    </Link>
                </div>
            )
        }

        return (
          <Link key={tab.id} href={tab.href}>
            <button 
              className={`flex flex-col items-center justify-center p-2 w-16 transition-colors ${isActive ? 'text-[#8de15c]' : 'text-[#a3afb8]'}`}
            >
              <Icon className="w-6 h-6 mb-1" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-bold tracking-wide">{tab.label}</span>
            </button>
          </Link>
        );
      })}
    </nav>
  );
}
