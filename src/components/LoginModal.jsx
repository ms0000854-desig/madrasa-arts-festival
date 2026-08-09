import React, { useState } from 'react';
import { X, Lock, KeyRound, Shield, Users, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ACCOUNTS } from '../utils/constants';

export default function LoginModal({ onClose }) {
  const { login } = useApp();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleQuickFill = (userVal, passVal) => {
    setUsername(userVal);
    setPassword(passVal);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const res = login(username, password);
    if (!res.success) {
      setError(res.message || 'Invalid credentials!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md bg-slate-900 rounded-3xl p-5 sm:p-6 text-white border border-slate-700 shadow-2xl space-y-5 my-auto text-left">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-base">
            <Lock className="w-5 h-5" />
            <span>Madrasa Portal Authentication</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Credentials Fill Pills */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-black uppercase text-slate-400">
            QUICK ACCESS ACCOUNTS:
          </label>

          <div className="grid grid-cols-2 gap-2 text-xs font-bold">
            {/* Admin */}
            <button
              type="button"
              onClick={() => handleQuickFill('admin', 'Salim786')}
              className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-left transition flex items-center justify-between"
            >
              <div>
                <div className="text-[11px] font-black">Head Ustad</div>
                <div className="text-[9px] text-amber-400/80">admin / Salim786</div>
              </div>
              <Shield className="w-3.5 h-3.5" />
            </button>

            {/* AN-NAJAH */}
            <button
              type="button"
              onClick={() => handleQuickFill('Najah', 'Annajah200')}
              className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 text-left transition flex items-center justify-between"
            >
              <div>
                <div className="text-[11px] font-black">AN-NAJAH</div>
                <div className="text-[9px] text-emerald-400/80">Najah / Annajah200</div>
              </div>
              <Users className="w-3.5 h-3.5" />
            </button>

            {/* AL-FALAH */}
            <button
              type="button"
              onClick={() => handleQuickFill('Alfalah100', '859090100')}
              className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 hover:bg-blue-500/20 text-left transition flex items-center justify-between"
            >
              <div>
                <div className="text-[11px] font-black">AL-FALAH</div>
                <div className="text-[9px] text-blue-400/80">Alfalah100 / 859090100</div>
              </div>
              <Users className="w-3.5 h-3.5" />
            </button>

            {/* AS-SALAH */}
            <button
              type="button"
              onClick={() => handleQuickFill('Assalah', '859090300')}
              className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-left transition flex items-center justify-between"
            >
              <div>
                <div className="text-[11px] font-black">AS-SALAH</div>
                <div className="text-[9px] text-amber-400/80">Assalah / 859090300</div>
              </div>
              <Users className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 pt-1">
          {error && (
            <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold text-center">
              {error}
            </div>
          )}

          <div>
            <label className="text-[11px] font-bold text-slate-300">Username</label>
            <input
              type="text"
              required
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-white mt-1 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-300">Password</label>
            <input
              type="password"
              required
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-white mt-1 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-xs shadow-lg hover:opacity-90 transition mt-2"
          >
            Authenticate & Access Panel
          </button>
        </form>

      </div>
    </div>
  );
}
