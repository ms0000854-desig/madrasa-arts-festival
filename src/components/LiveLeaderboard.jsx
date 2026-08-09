import React, { useState } from 'react';
import { Trophy, TrendingUp, Award, ChevronRight, Crown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MADRASA_INFO, CATEGORIES, GROUPS } from '../utils/constants';

export default function LiveLeaderboard() {
  const { scoreCalculations, setActiveTab } = useApp();
  const [sectionFilter, setSectionFilter] = useState('overall'); // 'overall' | 'boys' | 'girls'

  const { rankedGroups } = scoreCalculations;

  // Recalculate group order based on active section filter (Overall, Boys, Girls)
  const displayGroups = [...rankedGroups]
    .map((g) => {
      let pts = g.points;
      if (sectionFilter === 'boys') pts = g.boysPoints;
      if (sectionFilter === 'girls') pts = g.girlsPoints;
      return { ...g, filterPoints: pts };
    })
    .sort((a, b) => b.filterPoints - a.filterPoints)
    .map((g, idx, arr) => {
      const maxPts = Math.max(...arr.map((item) => item.filterPoints), 1);
      return {
        ...g,
        rank: idx + 1,
        status: idx === 0 ? 'Leading' : 'Chasing',
        pct: g.filterPoints > 0 ? Math.round((g.filterPoints / maxPts) * 100) : 0,
      };
    });

  return (
    <div className="space-y-6 pb-20 pt-2 w-full max-w-7xl mx-auto">
      
      {/* PC DESKTOP HERO BANNER (#132235 Dark Navy with Diamond Grid Texture) */}
      <div className="relative overflow-hidden rounded-3xl bg-[#132235] text-white p-8 sm:p-14 shadow-2xl border border-slate-700/50 text-center">
        {/* Subtle Diamond Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0f_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>

        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-56 h-56 bg-[#16B978]/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-56 h-56 bg-[#3B82E8]/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center">
          {/* Live Leaderboard Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#16B978]/20 border border-[#16B978]/40 text-[#16B978] text-xs font-black uppercase tracking-widest mb-4">
            <span className="w-2 h-2 rounded-full bg-[#16B978] animate-ping"></span>
            LIVE LEADERBOARD
            <span className="w-2 h-2 rounded-full bg-[#16B978] animate-ping"></span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white uppercase leading-tight max-w-4xl">
            {MADRASA_INFO.madrasaName}
          </h2>
          <p className="text-sm sm:text-base text-slate-300 font-bold mt-2">
            {MADRASA_INFO.subTitle}
          </p>
        </div>
      </div>

      {/* FULL-WIDTH GROUP CARDS (Matching Scoreboard Screenshot 1:1) */}
      <div className="space-y-4">
        {displayGroups.map((group) => {
          const groupMeta = GROUPS[group.groupCode] || {};
          const groupColor = groupMeta.color || '#16B978';

          const rankMedal = group.rank === 1 ? '🥇' : group.rank === 2 ? '🥈' : '🥉';
          const isLeading = group.rank === 1;

          const statusBg = isLeading ? '#EAF9F2' : '#EEF5FF';
          const statusTextColor = isLeading ? '#16B978' : '#3B82E8';

          return (
            <div
              key={group.groupCode}
              className="relative overflow-hidden rounded-2xl p-5 sm:p-6 transition-all duration-200 shadow-sm border border-slate-200/90 bg-white"
            >
              {/* Left Curved Accent Border Bar */}
              <div
                className="absolute top-0 bottom-0 left-0 w-2 rounded-l-2xl"
                style={{ backgroundColor: groupColor }}
              ></div>

              <div className="pl-2 space-y-4">
                {/* Top Information Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Square Position Badge */}
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl text-white shadow-sm"
                      style={{ backgroundColor: groupColor }}
                    >
                      #{group.rank}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl sm:text-2xl font-black tracking-tight text-[#000000]">
                          {group.name}
                        </h3>
                        <span className="text-xl">{rankMedal}</span>
                      </div>

                      {/* Status Pill */}
                      <div className="mt-1">
                        <span
                          className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-black"
                          style={{
                            backgroundColor: statusBg,
                            color: statusTextColor,
                            border: `1px solid ${statusTextColor}40`,
                          }}
                        >
                          <TrendingUp className="w-3.5 h-3.5" />
                          {group.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Points Number Count */}
                  <div className="text-right">
                    <div
                      className="text-3xl sm:text-4xl font-black leading-none"
                      style={{ color: '#000000' }}
                    >
                      {group.filterPoints}
                    </div>
                    <div className="text-xs font-black text-slate-400 tracking-wider uppercase mt-1">
                      POINTS
                    </div>
                  </div>
                </div>

                {/* Progress Bar Row */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-xs font-black text-[#64748B]">
                    <span>Performance</span>
                    <span style={{ color: groupColor }}>{group.pct}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${group.pct}%`,
                        backgroundColor: groupColor,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* SECTION BUTTONS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => setSectionFilter('overall')}
          className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all shadow-sm ${
            sectionFilter === 'overall'
              ? 'bg-[#16B978] text-white shadow-[#16B978]/30 scale-[1.01]'
              : 'bg-white text-[#000000] hover:bg-slate-50 border border-slate-200'
          }`}
        >
          🏆 Overall Standings
        </button>

        <button
          onClick={() => setSectionFilter('boys')}
          className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all shadow-sm ${
            sectionFilter === 'boys'
              ? 'bg-[#3B82E8] text-white shadow-[#3B82E8]/30 scale-[1.01]'
              : 'bg-white text-[#000000] hover:bg-slate-50 border border-slate-200'
          }`}
        >
          👳‍♂️ Boys Section
        </button>

        <button
          onClick={() => setSectionFilter('girls')}
          className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all shadow-sm ${
            sectionFilter === 'girls'
              ? 'bg-[#8B5CF6] text-white shadow-[#8B5CF6]/30 scale-[1.01]'
              : 'bg-white text-[#000000] hover:bg-slate-50 border border-slate-200'
          }`}
        >
          🧕 Girls Section
        </button>
      </div>

      {/* TOP 10 PERFORMERS BANNER BUTTON */}
      <button
        onClick={() => setActiveTab('performers')}
        className="w-full py-4 px-6 rounded-2xl bg-[#F59E0B] text-white font-black text-base shadow-md shadow-[#F59E0B]/20 flex items-center justify-between hover:brightness-105 active:scale-[0.99] transition-all"
      >
        <div className="flex items-center gap-3">
          <Crown className="w-6 h-6 fill-white/20" />
          <span>Top 10 Outstanding Performers</span>
        </div>
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* CATEGORY SCORES DESKTOP GRID */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex items-center gap-2 text-[#000000] font-black text-lg border-b border-slate-100 pb-3">
          <Award className="w-6 h-6 text-[#3B82E8]" />
          <span>Category Scores Breakdown</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORIES.map((cat) => {
            const najahCatPts = GROUPS['GRP-A'] ? scoreCalculations.totals['GRP-A']?.categories[cat.id] || 0 : 0;
            const falahCatPts = GROUPS['GRP-B'] ? scoreCalculations.totals['GRP-B']?.categories[cat.id] || 0 : 0;
            const salahCatPts = GROUPS['GRP-C'] ? scoreCalculations.totals['GRP-C']?.categories[cat.id] || 0 : 0;

            return (
              <div key={cat.id} className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                  <span className="font-black text-sm text-[#000000] uppercase tracking-wide">
                    {cat.name}
                  </span>
                  <span className="text-xs font-bold text-[#94A3B8]">
                    {cat.subtitle}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {/* NAJAH (#16B978) */}
                  <div
                    className="p-3 rounded-xl text-center border transition-all"
                    style={{
                      backgroundColor: '#EAF9F2',
                      borderColor: '#16B97840',
                    }}
                  >
                    <div className="text-[10px] font-black text-[#16B978] uppercase tracking-wider">
                      NAJAH
                    </div>
                    <div className="text-xl font-black text-[#000000] mt-0.5">
                      {najahCatPts}
                    </div>
                  </div>

                  {/* FALAH (#3B82E8) */}
                  <div
                    className="p-3 rounded-xl text-center border transition-all"
                    style={{
                      backgroundColor: '#EEF5FF',
                      borderColor: '#3B82E840',
                    }}
                  >
                    <div className="text-[10px] font-black text-[#3B82E8] uppercase tracking-wider">
                      FALAH
                    </div>
                    <div className="text-xl font-black text-[#000000] mt-0.5">
                      {falahCatPts}
                    </div>
                  </div>

                  {/* SALAH (#F59E0B) */}
                  <div
                    className="p-3 rounded-xl text-center border transition-all"
                    style={{
                      backgroundColor: '#FFF7E8',
                      borderColor: '#F59E0B40',
                    }}
                  >
                    <div className="text-[10px] font-black text-[#F59E0B] uppercase tracking-wider">
                      SALAH
                    </div>
                    <div className="text-xl font-black text-[#000000] mt-0.5">
                      {salahCatPts}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
