import React, { useState } from 'react';
import { Crown, Trophy, Award, Medal } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GROUPS } from '../utils/constants';

export default function OutstandingPerformers() {
  const { scoreCalculations } = useApp();
  const [activeGender, setActiveGender] = useState('Boys'); // 'Boys' | 'Girls'

  const performers = activeGender === 'Boys' ? scoreCalculations.boysTop10 : scoreCalculations.girlsTop10;

  return (
    <div className="space-y-6 pb-20 pt-2 w-full max-w-7xl mx-auto text-left">
      
      {/* Top Banner Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#F59E0B] border border-amber-200 flex items-center justify-center shrink-0 shadow-2xs">
            <Crown className="w-6 h-6 fill-[#F59E0B]/20" />
          </div>

          <div>
            <h2 className="text-2xl font-black tracking-tight text-[#000000] uppercase">
              OUTSTANDING PERFORMERS
            </h2>
            <p className="text-xs text-slate-500 font-bold mt-0.5">
              Top 10 Individual Competition Champions • Real-Time Ranking
            </p>
          </div>
        </div>

        {/* Gender Toggle Pills */}
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shrink-0">
          <button
            onClick={() => setActiveGender('Boys')}
            className={`py-2 px-5 rounded-xl text-xs font-black flex items-center gap-1.5 transition ${
              activeGender === 'Boys'
                ? 'bg-[#2563EB] text-white shadow-sm'
                : 'text-slate-600 hover:text-[#000000]'
            }`}
          >
            🍺 Boys Top 10
          </button>

          <button
            onClick={() => setActiveGender('Girls')}
            className={`py-2 px-5 rounded-xl text-xs font-black flex items-center gap-1.5 transition ${
              activeGender === 'Girls'
                ? 'bg-[#8B5CF6] text-white shadow-sm'
                : 'text-slate-600 hover:text-[#000000]'
            }`}
          >
            🧕 Girls Top 10
          </button>
        </div>
      </div>

      {/* Performers Desktop Podium Grid */}
      {performers.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center space-y-3 border border-slate-200 shadow-sm my-6">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Trophy className="w-8 h-8 stroke-[1.5]" />
          </div>

          <h3 className="text-lg font-black text-[#000000]">
            No Individual Results Published Yet
          </h3>

          <p className="text-xs text-slate-500 font-bold max-w-sm mx-auto leading-relaxed">
            Top 10 individual performers for {activeGender} will automatically rank here as official individual competition results are published.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {performers.map((perf, index) => {
            const rank = index + 1;
            const group = GROUPS[perf.group];

            const isGold = rank === 1;
            const isSilver = rank === 2;
            const isBronze = rank === 3;

            const cardBg = isGold
              ? 'bg-[#FFF7E8] border-[#F59E0B]/40'
              : isSilver
              ? 'bg-[#F1F5F9] border-slate-300'
              : isBronze
              ? 'bg-[#FDF4E3] border-amber-700/30'
              : 'bg-white border-slate-200';

            const badgeTitle = isGold
              ? '1ST PLACE CHAMPION'
              : isSilver
              ? '2ND PLACE RUNNER-UP'
              : isBronze
              ? '3RD PLACE PODIUM'
              : `#${rank} RANK`;

            const medalIcon = isGold ? '🥇' : isSilver ? '🥈' : isBronze ? '🥉' : '🎗️';

            return (
              <div
                key={perf.studentId}
                className={`rounded-2xl p-5 border space-y-4 shadow-sm transition-all hover:scale-[1.01] ${cardBg}`}
              >
                {/* Header Tag */}
                <div className="flex items-center justify-between border-b border-slate-200/60 pb-2.5">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-black/5 text-[#000000]">
                    {badgeTitle}
                  </span>
                  <span className="text-xl">{medalIcon}</span>
                </div>

                {/* Main Rank & Name Row */}
                <div className="flex items-start gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl text-white shadow-sm shrink-0"
                    style={{ backgroundColor: group?.color || '#16B978' }}
                  >
                    #{rank}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-black text-[#000000] truncate">
                      {perf.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-bold text-slate-500">
                        {perf.category || 'Class 9'}
                      </span>
                      <span
                        className="px-2 py-0.5 rounded text-[10px] font-black text-white"
                        style={{ backgroundColor: group?.color || '#16B978' }}
                      >
                        {group?.name}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Score & Medals Won */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                  <div>
                    <div className="text-[10px] font-black uppercase text-slate-400">
                      INDIVIDUAL SCORE
                    </div>
                    <div className="text-xl font-black text-[#16B978] mt-0.5">
                      {perf.totalPoints} <span className="text-xs font-bold text-slate-400">PTS</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 bg-white/80 p-1.5 rounded-xl border border-slate-200/80 text-xs font-black text-[#000000]">
                    <span>🥇 {perf.firsts}</span>
                    {perf.seconds > 0 && <span className="ml-1">🥈 {perf.seconds}</span>}
                    {perf.thirds > 0 && <span className="ml-1">🥉 {perf.thirds}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
