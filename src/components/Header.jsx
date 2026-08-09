import React, { useState } from 'react';
import { Sun, Moon, LogIn, LogOut, Shield, Menu, X, Users, Trophy, Search, Calendar, Award, Settings } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MADRASA_INFO, GROUPS } from '../utils/constants';

export default function Header({ onOpenAdminPanel, onOpenGroupPanel }) {
  const { theme, toggleTheme, activeTab, setActiveTab, currentUser, logout, setIsLoginModalOpen } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 px-4 py-2.5 shadow-2xs transition-colors duration-200">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left Brand Badge */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-[#0B0F14] border border-slate-700 p-0.5 shadow-md flex items-center justify-center flex-shrink-0">
            <span className="text-[#16B978] font-black text-xl tracking-tighter">M</span>
          </div>

          <div className="flex flex-col text-left">
            <h1 className="text-xs sm:text-sm font-black tracking-tight text-[#000000] uppercase leading-none">
              {MADRASA_INFO.madrasaName}
            </h1>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-[#16B978] animate-pulse"></span>
              <p className="text-[10px] sm:text-xs font-bold text-[#16B978] leading-none">
                {MADRASA_INFO.subTitle}
              </p>
            </div>
          </div>
        </div>

        {/* Center Desktop Navigation Pill Container (Matching PC Screenshot) */}
        <div className="hidden lg:flex items-center bg-slate-100/90 border border-slate-200/80 p-1 rounded-2xl gap-0.5">
          <button
            onClick={() => setActiveTab('scores')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              activeTab === 'scores'
                ? 'bg-[#2563EB] text-white shadow-sm'
                : 'text-slate-600 hover:text-[#0F172A] hover:bg-slate-200/50'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Scoreboard</span>
          </button>

          <button
            onClick={() => setActiveTab('result')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              activeTab === 'result'
                ? 'bg-[#2563EB] text-white shadow-sm'
                : 'text-slate-600 hover:text-[#0F172A] hover:bg-slate-200/50'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Student Result</span>
          </button>

          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              activeTab === 'schedule'
                ? 'bg-[#2563EB] text-white shadow-sm'
                : 'text-slate-600 hover:text-[#0F172A] hover:bg-slate-200/50'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Schedule</span>
          </button>

          <button
            onClick={() => setActiveTab('performers')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              activeTab === 'performers'
                ? 'bg-[#2563EB] text-white shadow-sm'
                : 'text-slate-600 hover:text-[#0F172A] hover:bg-slate-200/50'
            }`}
          >
            <Award className="w-4 h-4 text-amber-500" />
            <span>Performers</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('admin');
              onOpenAdminPanel();
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              activeTab === 'admin'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-red-600 hover:bg-red-50'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Admin</span>
          </button>

          {currentUser?.role === 'group' && (
            <button
              onClick={onOpenGroupPanel}
              className="px-3.5 py-1.5 rounded-xl text-xs font-black text-emerald-600 hover:bg-emerald-50 transition-all flex items-center gap-1.5"
            >
              <Users className="w-4 h-4 text-emerald-500" />
              <span>My Group ({GROUPS[currentUser.groupCode]?.shortName})</span>
            </button>
          )}
        </div>

        {/* Right Desktop Controls */}
        <div className="flex items-center gap-2">
          {/* Sun / Moon Theme Toggle Pill */}
          <button
            onClick={toggleTheme}
            className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200/80 hover:bg-amber-100/70 font-extrabold text-xs flex items-center gap-1.5 transition active:scale-95 shadow-2xs"
            title="Toggle Theme"
          >
            {theme === 'dark' ? (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-600 fill-indigo-600" />
                <span>Moon</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>Sun</span>
              </>
            )}
          </button>

          {/* User Auth Status / Login */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-extrabold shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                {currentUser.name}
              </span>

              <button
                onClick={logout}
                className="px-3.5 py-1.5 rounded-xl bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 font-extrabold text-xs flex items-center gap-1.5 transition active:scale-95 shadow-2xs"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="px-4 py-1.5 text-xs font-black bg-[#16B978] text-white rounded-xl shadow-sm hover:opacity-90 active:scale-95 transition flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
          )}

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-100 text-[#0F172A] border border-slate-200"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 pt-3 border-t border-slate-200 flex flex-col gap-2 max-w-4xl mx-auto text-left">
          {currentUser ? (
            <>
              <div className="px-3 py-2 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-200">
                <span className="text-xs font-bold text-[#0F172A]">
                  {currentUser.name}
                </span>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-1 text-xs font-extrabold text-red-600 bg-red-50 rounded-lg border border-red-200"
                >
                  Logout
                </button>
              </div>

              <button
                onClick={() => {
                  onOpenAdminPanel();
                  setMobileMenuOpen(false);
                }}
                className="w-full px-3 py-2 text-xs font-black text-[#F59E0B] bg-[#FFF7E8] border border-[#F59E0B]/30 rounded-xl flex items-center gap-2"
              >
                <Shield className="w-4 h-4" />
                Admin Control Hub
              </button>

              {currentUser?.role === 'group' && (
                <button
                  onClick={() => {
                    onOpenGroupPanel();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-3 py-2 text-xs font-black text-[#16B978] bg-[#EAF9F2] border border-[#16B978]/30 rounded-xl flex items-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  Group Leader Panel ({GROUPS[currentUser.groupCode]?.name})
                </button>
              )}
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  onOpenAdminPanel();
                  setMobileMenuOpen(false);
                }}
                className="w-full px-3 py-2 text-xs font-black text-white bg-red-600 rounded-xl flex items-center justify-center gap-2 shadow-xs"
              >
                <Shield className="w-4 h-4" />
                Admin Dashboard & Publish Result
              </button>
              <button
                onClick={() => {
                  setIsLoginModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full px-3 py-2 text-xs font-black text-white bg-[#16B978] rounded-xl flex items-center justify-center gap-2 shadow-xs"
              >
                <LogIn className="w-4 h-4" />
                Login to Portal (Admin / Group Leaders)
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
