import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import LiveLeaderboard from './components/LiveLeaderboard';
import ResultPortal from './components/ResultPortal';
import OutstandingPerformers from './components/OutstandingPerformers';
import ScheduleView from './components/ScheduleView';
import GroupLeaderPanel from './components/GroupLeaderPanel';
import AdminPanel from './components/AdminPanel';
import LoginModal from './components/LoginModal';
import { ShieldCheck, Zap } from 'lucide-react';
import { MADRASA_INFO } from './utils/constants';

function MainApp() {
  const { theme, activeTab, setActiveTab, currentUser, login, isLoginModalOpen, setIsLoginModalOpen } = useApp();

  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isGroupPanelOpen, setIsGroupPanelOpen] = useState(false);

  const handleOpenAdmin = () => {
    login('admin', 'Salim786');
    setActiveTab('admin');
    setIsAdminPanelOpen(true);
  };

  const handleOpenGroup = () => {
    if (currentUser?.role === 'group') {
      setIsGroupPanelOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${theme === 'light' ? 'light-theme bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'}`}>
      
      {/* Top Header */}
      <Header
        onOpenAdminPanel={handleOpenAdmin}
        onOpenGroupPanel={handleOpenGroup}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto py-4 px-3 sm:px-6">
        {activeTab === 'scores' && <LiveLeaderboard />}
        {activeTab === 'result' && <ResultPortal />}
        {activeTab === 'performers' && <OutstandingPerformers />}
        {activeTab === 'schedule' && <ScheduleView />}
        {activeTab === 'admin' && <AdminPanel isEmbedded={true} onClose={() => setActiveTab('scores')} />}
      </main>

      {/* Footer Branding Matching Screenshot Layout */}
      <footer className="w-full max-w-md mx-auto py-6 px-4 mb-16 text-center space-y-3 border-t border-slate-200 dark:border-slate-800/80">
        <div className="flex items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center border border-amber-500/30 text-amber-400 font-bold text-base shadow-md">
            M
          </div>
          <div className="text-left">
            <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wide">
              {MADRASA_INFO.madrasaName}
            </h4>
            <p className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
              {MADRASA_INFO.subTitle}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 text-[10px] font-bold text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            Secure RBAC Authentication
          </span>
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <Zap className="w-3.5 h-3.5" />
            Live Score Engine
          </span>
        </div>

        <div className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
          Powered by Mahabba • {MADRASA_INFO.year}
        </div>
      </footer>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Auth Login Modal */}
      {isLoginModalOpen && (
        <LoginModal onClose={() => setIsLoginModalOpen(false)} />
      )}

      {/* Admin Control Hub Modal */}
      {isAdminPanelOpen && (
        <AdminPanel onClose={() => setIsAdminPanelOpen(false)} />
      )}

      {/* Group Leader Panel Modal */}
      {isGroupPanelOpen && (
        <GroupLeaderPanel onClose={() => setIsGroupPanelOpen(false)} />
      )}

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
