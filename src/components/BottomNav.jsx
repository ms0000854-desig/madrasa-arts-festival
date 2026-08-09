import React from 'react';
import { Trophy, Search, Award, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function BottomNav() {
  const { activeTab, setActiveTab } = useApp();

  const navItems = [
    { id: 'scores', label: 'Scores', icon: Trophy },
    { id: 'result', label: 'Result', icon: Search },
    { id: 'performers', label: 'Performers', icon: Award },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg py-1.5 px-3 lg:hidden">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all duration-150 ${
                isActive
                  ? 'text-[#16B978] font-black scale-105'
                  : 'text-slate-500 font-bold hover:text-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span className="text-[10px] tracking-tight">{item.label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#16B978] -mt-0.5"></span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
