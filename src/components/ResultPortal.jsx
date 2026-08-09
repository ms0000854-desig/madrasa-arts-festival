import React, { useState } from 'react';
import { Search, Filter, Award, Sparkles, User, Trophy, FileImage } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, GROUPS } from '../utils/constants';
import WinnerPosterModal from './WinnerPosterModal';

export default function ResultPortal() {
  const { students, events, results, scoreCalculations } = useApp();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Event result lookup state
  const [selectedGender, setSelectedGender] = useState('Boys');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedEventId, setSelectedEventId] = useState('');
  const [activeEventResult, setActiveEventResult] = useState(null);

  // Poster Modal state
  const [posterData, setPosterData] = useState(null);

  // Filter events based on selected gender & category
  const filteredEvents = events.filter((e) => {
    const matchesGender = e.gender === selectedGender || e.gender === 'General';
    const matchesCat = selectedCategory === 'All' || e.category === selectedCategory;
    return matchesGender && matchesCat;
  });

  // Filter students based on search query
  const searchResults = searchQuery.trim() === ''
    ? []
    : students.filter((s) => {
        const q = searchQuery.trim().toLowerCase();
        return (
          s.chestNo?.toString().includes(q) ||
          s.name.toLowerCase().includes(q) ||
          s.admissionNo?.toLowerCase().includes(q)
        );
      });

  const handleLookupEventResult = () => {
    if (!selectedEventId) return;
    const res = results[selectedEventId];
    const event = events.find((e) => e.id === selectedEventId);
    if (res) {
      setActiveEventResult({ result: res, event });
    } else {
      setActiveEventResult({ result: null, event });
    }
  };

  return (
    <div className="space-y-6 pb-20 pt-2 w-full max-w-7xl mx-auto">
      
      {/* Title Header */}
      <div className="space-y-1 text-left">
        <div className="flex items-center gap-2.5 text-[#3B82E8] font-black text-xl">
          <Search className="w-6 h-6" />
          <h2 className="text-2xl font-black text-[#000000]">
            Student Result Portal
          </h2>
        </div>
        <p className="text-xs text-slate-500 font-bold">
          Enter Admission Number, Student Name, or Chest Number to view individual published competition results.
        </p>
      </div>

      {/* SECTION 1: SEARCH STUDENT PROFILE */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-4 text-left">
        <div className="text-xs font-black uppercase tracking-wider text-slate-400">
          SEARCH STUDENT PROFILE:
        </div>

        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Type Chest No (e.g. 100, 205), Student Name, or Admission No..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50/50 text-[#000000] text-sm font-bold border border-slate-200 focus:outline-none focus:border-[#3B82E8]"
          />
        </div>

        {/* Search Results Display */}
        {searchQuery.trim() !== '' && (
          <div className="space-y-3 pt-2">
            {searchResults.length === 0 ? (
              <div className="text-center py-4 text-xs font-semibold text-slate-400">
                No student found matching "{searchQuery}"
              </div>
            ) : (
              searchResults.map((st) => {
                const group = GROUPS[st.group];
                const perfInfo = scoreCalculations.studentPointsMap[st.id];

                return (
                  <div
                    key={st.id}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-base text-[#000000]">
                            {st.name}
                          </span>
                          <span
                            className="px-2.5 py-0.5 rounded text-[10px] font-black text-white"
                            style={{ backgroundColor: group?.color || '#16B978' }}
                          >
                            {group?.name}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 font-bold mt-1">
                          Chest No: <strong className="text-[#000000]">#{st.chestNo}</strong> • {st.category} ({st.gender})
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xl font-black text-[#16B978]">
                          {perfInfo?.totalPoints || 0} PTS
                        </div>
                      </div>
                    </div>

                    {/* Won Positions */}
                    {perfInfo && perfInfo.wins.length > 0 ? (
                      <div className="space-y-2 pt-2 border-t border-slate-200">
                        <div className="text-[10px] font-black uppercase text-slate-400">
                          Published Achievements:
                        </div>
                        {perfInfo.wins.map((win, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between text-xs bg-white p-2.5 rounded-lg border border-slate-200"
                          >
                            <div className="flex items-center gap-2">
                              <span>
                                {win.place === 'first' ? '🥇 1st' : win.place === 'second' ? '🥈 2nd' : '🥉 3rd'}
                              </span>
                              <span className="font-black text-[#000000]">
                                {win.eventTitle}
                              </span>
                            </div>

                            <button
                              onClick={() =>
                                setPosterData({
                                  studentName: st.name,
                                  chestNo: st.chestNo,
                                  groupCode: st.group,
                                  eventTitle: win.eventTitle,
                                  category: st.category,
                                  gender: st.gender,
                                  place: win.place,
                                  points: win.points,
                                })
                              }
                              className="px-2.5 py-1 text-xs font-black bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-md border border-amber-200 flex items-center gap-1"
                            >
                              <FileImage className="w-3.5 h-3.5" />
                              Poster
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-slate-400 font-semibold pt-1">
                        No published winning positions yet for this student.
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* SECTION 2: ITEM / EVENT RESULTS LOOKUP */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-6 text-left">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#16B978] font-black text-base uppercase">
              <Filter className="w-5 h-5" />
              <span>ITEM / EVENT RESULTS</span>
            </div>
            <p className="text-xs text-slate-500 font-bold">
              Select Gender (Boys / Girls) and pick an item to view official results.
            </p>
          </div>

          {/* Gender Toggle Pill */}
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => {
                setSelectedGender('Boys');
                setSelectedEventId('');
                setActiveEventResult(null);
              }}
              className={`py-1.5 px-4 rounded-xl text-xs font-black flex items-center gap-1.5 transition ${
                selectedGender === 'Boys'
                  ? 'bg-[#16B978] text-white shadow-sm'
                  : 'text-slate-600 hover:text-[#000000]'
              }`}
            >
              🍺 Boys
            </button>
            <button
              onClick={() => {
                setSelectedGender('Girls');
                setSelectedEventId('');
                setActiveEventResult(null);
              }}
              className={`py-1.5 px-4 rounded-xl text-xs font-black flex items-center gap-1.5 transition ${
                selectedGender === 'Girls'
                  ? 'bg-[#8B5CF6] text-white shadow-sm'
                  : 'text-slate-600 hover:text-[#000000]'
              }`}
            >
              🧕 Girls
            </button>
          </div>
        </div>

        {/* Desktop 3-Column Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          {/* Category Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase text-slate-500">
              SELECT CATEGORY:
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedEventId('');
                setActiveEventResult(null);
              }}
              className="w-full p-3 rounded-xl bg-slate-50 text-[#000000] text-xs font-black border border-slate-200 focus:outline-none"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.subtitle})
                </option>
              ))}
            </select>
          </div>

          {/* Item / Event Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase text-slate-500">
              SELECT ITEM / EVENT:
            </label>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 text-[#000000] text-xs font-black border border-slate-200 focus:outline-none"
            >
              <option value="">-- Choose Item / Event --</option>
              {filteredEvents.map((evt) => (
                <option key={evt.id} value={evt.id}>
                  {evt.title} ({evt.category} • {evt.type})
                </option>
              ))}
            </select>
          </div>

          {/* View Result Button */}
          <div>
            <button
              onClick={handleLookupEventResult}
              disabled={!selectedEventId}
              className="w-full py-3 rounded-xl bg-slate-100 hover:bg-[#16B978] hover:text-white text-[#000000] font-black text-xs transition disabled:opacity-50 flex items-center justify-center gap-2 border border-slate-200"
            >
              <Search className="w-4 h-4" />
              <span>View Result</span>
            </button>
          </div>
        </div>

        {/* Active Lookup Result Display */}
        {activeEventResult && (
          <div className="pt-4 border-t border-slate-200 space-y-4">
            {activeEventResult.result ? (
              <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div className="text-center space-y-1">
                  <span className="text-xs font-black uppercase text-[#16B978] tracking-wider">
                    OFFICIAL RESULT PUBLISHED
                  </span>
                  <h3 className="text-lg font-black text-[#000000]">
                    {activeEventResult.event?.title}
                  </h3>
                  <div className="text-xs font-bold text-slate-500">
                    {activeEventResult.event?.category} • {activeEventResult.event?.gender}
                  </div>
                </div>

                {/* Places */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                  {['first', 'second', 'third'].map((placeKey) => {
                    const winner = activeEventResult.result[placeKey];
                    if (!winner) return null;
                    const group = GROUPS[winner.group];
                    const medal = placeKey === 'first' ? '🥇 1st Place' : placeKey === 'second' ? '🥈 2nd Place' : '🥉 3rd Place';

                    return (
                      <div
                        key={placeKey}
                        className="flex flex-col justify-between p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2"
                      >
                        <div>
                          <div className="text-xs font-black text-[#F59E0B]">
                            {medal}
                          </div>
                          <div className="text-sm font-black text-[#000000] mt-0.5">
                            {winner.name} <span className="text-xs text-slate-400 font-semibold">(#{winner.chestNo})</span>
                          </div>
                          <span
                            className="inline-block mt-1 px-2.5 py-0.5 rounded text-[10px] font-black text-white"
                            style={{ backgroundColor: group?.color || '#16B978' }}
                          >
                            {group?.name}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                          <span className="text-xs font-black text-[#16B978]">
                            +{winner.points} PTS
                          </span>
                          <button
                            onClick={() =>
                              setPosterData({
                                studentName: winner.name,
                                chestNo: winner.chestNo,
                                groupCode: winner.group,
                                eventTitle: activeEventResult.event?.title,
                                category: activeEventResult.event?.category,
                                gender: activeEventResult.event?.gender,
                                place: placeKey,
                                points: winner.points,
                              })
                            }
                            className="px-2 py-1 text-[10px] font-black bg-amber-50 text-amber-600 rounded border border-amber-200 flex items-center gap-1"
                          >
                            <FileImage className="w-3 h-3" />
                            Poster
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-4 bg-amber-50 rounded-xl border border-amber-200 text-xs font-bold text-amber-700">
                Official result has not been published yet for this event.
              </div>
            )}
          </div>
        )}

      </div>

      {/* Winner Poster Modal */}
      {posterData && (
        <WinnerPosterModal
          winnerData={posterData}
          onClose={() => setPosterData(null)}
        />
      )}

    </div>
  );
}
