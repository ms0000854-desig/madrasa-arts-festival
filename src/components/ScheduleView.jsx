import React, { useState } from 'react';
import { Calendar, Download, MapPin, Tag } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../utils/constants';

export default function ScheduleView() {
  const { events } = useApp();

  // Filters state
  const [dateFilter, setDateFilter] = useState('All'); // 'All' | 'Today' | 'Tomorrow' | 'Not Announced' | 'Upcoming' | 'Live' | 'Completed'
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All'); // 'All' | 'Stage' | 'Non-Stage'
  const [genderFilter, setGenderFilter] = useState('All'); // 'All' | 'Boys' | 'Girls'

  // Filtered schedule items
  const filteredEvents = events.filter((evt) => {
    // Date / Status Filter
    if (dateFilter === 'Upcoming' && evt.status !== 'Upcoming') return false;
    if (dateFilter === 'Live' && evt.status !== 'Live') return false;
    if (dateFilter === 'Completed' && evt.status !== 'Completed') return false;
    if (dateFilter === 'Today' && evt.date !== '2026-08-09') return false;
    if (dateFilter === 'Tomorrow' && evt.date !== '2026-08-10') return false;

    // Category Filter
    if (categoryFilter !== 'All' && evt.category !== categoryFilter) return false;

    // Type Filter
    if (typeFilter !== 'All' && evt.type !== typeFilter) return false;

    // Gender Filter
    if (genderFilter !== 'All' && evt.gender !== genderFilter && evt.gender !== 'General') return false;

    return true;
  });

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-5 pb-20 pt-2 w-full max-w-7xl mx-auto text-left">
      
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 text-[#000000] font-black text-2xl">
          <Calendar className="w-7 h-7 text-[#3B82E8]" />
          <h2>Competition Schedule</h2>
        </div>

        {/* Download PDF Button */}
        <button
          onClick={handleDownloadPDF}
          className="py-2 px-4 rounded-xl bg-blue-50 text-[#3B82E8] font-black text-xs border border-blue-200 hover:bg-blue-100 flex items-center gap-2 transition shadow-2xs"
        >
          <Download className="w-4 h-4" />
          <span>Download PDF</span>
        </button>
      </div>

      {/* Filter Sections Bar */}
      <div className="space-y-3 pt-1">
        
        {/* Row 1: Date / Status Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {['All', 'Today', 'Tomorrow', 'Not Announced', 'Upcoming', 'Live', 'Completed'].map((tab) => {
            const isActive = dateFilter === tab;
            return (
              <button
                key={tab}
                onClick={() => setDateFilter(tab)}
                className={`px-4 py-1.5 rounded-full text-xs font-black whitespace-nowrap transition shadow-2xs ${
                  isActive
                    ? 'bg-[#3B82E8] text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                {tab === 'Live' ? '🟢 Live' : tab}
              </button>
            );
          })}
        </div>

        {/* Row 2: Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <span className="text-xs font-black uppercase text-[#F59E0B] flex items-center gap-1 shrink-0">
            <Tag className="w-3.5 h-3.5" /> CATEGORY:
          </span>
          <button
            onClick={() => setCategoryFilter('All')}
            className={`px-4 py-1.5 rounded-full text-xs font-black whitespace-nowrap transition shadow-2xs ${
              categoryFilter === 'All'
                ? 'bg-[#16B978] text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategoryFilter(c.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-black whitespace-nowrap transition shadow-2xs ${
                categoryFilter === c.id
                  ? 'bg-[#16B978] text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Row 3: Type & Gender Pills */}
        <div className="flex items-center justify-between gap-4 pt-1">
          {/* Type Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
            {['All', 'Stage', 'Non-Stage'].map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition ${
                  typeFilter === t
                    ? 'bg-[#8B5CF6] text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#000000]'
                }`}
              >
                {t === 'Stage' ? '🎪 Stage' : t === 'Non-Stage' ? '🎨 Non-Stage' : 'All Types'}
              </button>
            ))}
          </div>

          {/* Gender Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
            {['All', 'Boys', 'Girls'].map((g) => (
              <button
                key={g}
                onClick={() => setGenderFilter(g)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition ${
                  genderFilter === g
                    ? 'bg-[#16B978] text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#000000]'
                }`}
              >
                {g === 'Boys' ? '🍺 Boys' : g === 'Girls' ? '🧕 Girls' : 'All Genders'}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Events List */}
      <div className="space-y-3 pt-2">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl border border-slate-200 text-xs font-bold text-slate-400">
            No competition events found matching selected criteria.
          </div>
        ) : (
          filteredEvents.map((evt) => {
            return (
              <div
                key={evt.id}
                className="bg-white rounded-2xl p-4.5 flex items-center justify-between gap-4 shadow-2xs border border-slate-200/90"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {/* Time Badge */}
                  <div className="w-16 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-[#F59E0B] flex flex-col items-center justify-center shrink-0">
                    <span className="text-sm font-black leading-none">{evt.time.split(' ')[0]}</span>
                    <span className="text-[10px] font-black tracking-wider mt-0.5">{evt.time.split(' ')[1] || 'PM'}</span>
                  </div>

                  {/* Event Info */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <h3 className="text-base font-black text-[#000000] leading-tight">
                      {evt.title}
                    </h3>

                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-black bg-purple-50 text-[#8B5CF6] border border-purple-200">
                        {evt.type === 'Stage' ? '🎪 Stage' : '🎨 Non-Stage'}
                      </span>

                      <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-black bg-blue-50 text-[#3B82E8] border border-blue-200">
                        {evt.category}
                      </span>

                      <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-black bg-emerald-50 text-[#16B978] border border-emerald-200">
                        {evt.gender === 'Boys' ? '🍺 Boys' : evt.gender === 'Girls' ? '🧕 Girls' : 'General'}
                      </span>

                      <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-black bg-slate-100 text-slate-600 flex items-center gap-1 border border-slate-200">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {evt.location}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Status Badge */}
                <div className="shrink-0">
                  <span className="px-3 py-1 text-xs font-black rounded-full bg-amber-50 text-[#F59E0B] border border-amber-200">
                    {evt.status === 'Live' ? '🟢 Live' : evt.status}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
