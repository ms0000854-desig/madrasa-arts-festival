import React, { useState } from 'react';
import { X, Shield, Award, Calendar, Users, RefreshCw, Trash2, Plus, Edit3, CheckCircle2, RotateCcw, AlertTriangle, Filter, Search, UserCheck, UserX } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, GROUPS, CLASSES, MADRASA_INFO, mapClassToCategory } from '../utils/constants';

export default function AdminPanel({ onClose, isEmbedded = false }) {
  const {
    events,
    students,
    results,
    publishResult,
    retractResult,
    resetAllScores,
    addEvent,
    updateEvent,
    deleteEvent,
    addStudent,
    updateStudent,
    toggleStudentStatus,
    deleteStudent,
  } = useApp();

  const [adminTab, setAdminTab] = useState('publish'); // 'publish' | 'events' | 'students' | 'leaders' | 'retract'

  // Publish Modal State
  const [selectedEventId, setSelectedEventId] = useState('');
  const [firstStudentId, setFirstStudentId] = useState('');
  const [secondStudentId, setSecondStudentId] = useState('');
  const [thirdStudentId, setThirdStudentId] = useState('');

  // Event Add/Edit Modal State
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventFormData, setEventFormData] = useState({
    title: '',
    category: 'Sub Junior',
    gender: 'Boys',
    type: 'Stage',
    time: '02:00 PM',
    location: 'Main Stage',
    date: '2026-08-09',
    status: 'Upcoming',
  });

  // Student Filters State
  const [studentClassFilter, setStudentClassFilter] = useState('All');
  const [studentGenderFilter, setStudentGenderFilter] = useState('All');
  const [studentGroupFilter, setStudentGroupFilter] = useState('All');
  const [studentStatusFilter, setStudentStatusFilter] = useState('All');
  const [studentSearchQuery, setStudentSearchQuery] = useState('');

  // Student Add/Edit Modal State
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [studentFormData, setStudentFormData] = useState({
    name: '',
    classNum: 'Class 1',
    gender: 'Boys',
    group: 'GRP-A',
    rollNo: '',
    admissionNo: '',
    isLeader: false,
    status: 'active',
  });

  // Score Reset Confirmation state
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Selected event for publish
  const selectedEvent = events.find((e) => e.id === selectedEventId);
  const isGeneral = selectedEvent?.category === 'General';
  const ptsFirst = isGeneral ? 15 : 10;
  const ptsSecond = isGeneral ? 10 : 7;
  const ptsThird = 5;

  const handlePublishSubmit = (e) => {
    e.preventDefault();
    if (!selectedEventId || !firstStudentId) return;

    const s1 = students.find((s) => s.id === firstStudentId);
    const s2 = students.find((s) => s.id === secondStudentId);
    const s3 = students.find((s) => s.id === thirdStudentId);

    const resultObj = {
      first: s1
        ? {
            studentId: s1.id,
            chestNo: s1.chestNo,
            name: s1.name,
            group: s1.group,
            points: ptsFirst,
          }
        : null,
      second: s2
        ? {
            studentId: s2.id,
            chestNo: s2.chestNo,
            name: s2.name,
            group: s2.group,
            points: ptsSecond,
          }
        : null,
      third: s3
        ? {
            studentId: s3.id,
            chestNo: s3.chestNo,
            name: s3.name,
            group: s3.group,
            points: ptsThird,
          }
        : null,
    };

    publishResult(selectedEventId, resultObj);
    alert(`🎉 Result for "${selectedEvent.title}" published successfully! Live scores updated.`);
    setSelectedEventId('');
    setFirstStudentId('');
    setSecondStudentId('');
    setThirdStudentId('');
  };

  const handleSaveEvent = (e) => {
    e.preventDefault();
    if (!eventFormData.title.trim()) return;

    if (editingEvent) {
      updateEvent(editingEvent.id, eventFormData);
    } else {
      addEvent(eventFormData);
    }
    setIsEventModalOpen(false);
  };

  const handleSaveStudent = (e) => {
    e.preventDefault();
    if (!studentFormData.name.trim()) return;

    if (editingStudent) {
      updateStudent(editingStudent.id, studentFormData);
      setIsStudentModalOpen(false);
    } else {
      const res = addStudent(studentFormData);
      if (res.isDuplicate) {
        alert(`⚠️ Duplicate Error: ${res.message}`);
      } else {
        setIsStudentModalOpen(false);
      }
    }
  };

  // Filtered Students List
  const filteredStudents = students.filter((s) => {
    if (studentClassFilter !== 'All' && s.classNum !== studentClassFilter) return false;
    if (studentGenderFilter !== 'All' && s.gender !== studentGenderFilter) return false;
    if (studentGroupFilter !== 'All' && s.group !== studentGroupFilter) return false;
    if (studentStatusFilter !== 'All' && s.status !== studentStatusFilter) return false;
    if (studentSearchQuery.trim() !== '') {
      const q = studentSearchQuery.toLowerCase().trim();
      const matchName = s.name.toLowerCase().includes(q);
      const matchChest = s.chestNo?.toString().includes(q);
      const matchAdm = s.admissionNo?.toLowerCase().includes(q);
      if (!matchName && !matchChest && !matchAdm) return false;
    }
    return true;
  });

  const content = (
    <>
      <div className={`relative w-full ${isEmbedded ? 'max-w-7xl mx-auto' : 'max-w-3xl my-auto max-h-[92vh]'} bg-slate-900 rounded-3xl p-5 sm:p-6 text-white border border-slate-700 shadow-2xl space-y-5 flex flex-col`}>
      
      {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-black text-xl shadow-lg">
              <Shield className="w-5 h-5 text-[#F59E0B]" />
            </div>
            <div className="text-left">
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                Admin Dashboard
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                {MADRASA_INFO.madrasaName} • Sunday, 9 August
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setAdminTab('publish')}
              className="py-2 px-3.5 rounded-xl bg-[#16B978] text-white font-black text-xs shadow-md hover:brightness-110 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Result</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition border border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-5 gap-1 bg-slate-800/80 p-1.5 rounded-2xl text-[11px] font-bold">
          <button
            onClick={() => setAdminTab('publish')}
            className={`py-2 rounded-xl transition ${
              adminTab === 'publish'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🏆 Publish
          </button>
          <button
            onClick={() => setAdminTab('events')}
            className={`py-2 rounded-xl transition ${
              adminTab === 'events'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            📅 Events ({events.length})
          </button>
          <button
            onClick={() => setAdminTab('students')}
            className={`py-2 rounded-xl transition ${
              adminTab === 'students'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            👥 Database ({students.length})
          </button>
          <button
            onClick={() => setAdminTab('leaders')}
            className={`py-2 rounded-xl transition ${
              adminTab === 'leaders'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            👑 Leaders
          </button>
          <button
            onClick={() => setAdminTab('retract')}
            className={`py-2 rounded-xl transition ${
              adminTab === 'retract'
                ? 'bg-red-500 text-white font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚙️ Reset
          </button>
        </div>

        {/* TAB 1: PUBLISH RESULT */}
        {adminTab === 'publish' && (
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-left">
            <form onSubmit={handlePublishSubmit} className="space-y-4">
              
              {/* Event Picker */}
              <div>
                <label className="text-xs font-bold text-slate-300">Choose Competition Item / Event</label>
                <select
                  required
                  value={selectedEventId}
                  onChange={(e) => {
                    setSelectedEventId(e.target.value);
                    setFirstStudentId('');
                    setSecondStudentId('');
                    setThirdStudentId('');
                  }}
                  className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-white mt-1 focus:outline-none focus:border-amber-500"
                >
                  <option value="">-- Select Event --</option>
                  {events.map((evt) => (
                    <option key={evt.id} value={evt.id}>
                      {evt.title} ({evt.category} • {evt.gender} • Status: {evt.status})
                    </option>
                  ))}
                </select>
              </div>

              {selectedEvent && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs space-y-1">
                  <div className="font-extrabold text-amber-400">
                    Category: {selectedEvent.category} ({selectedEvent.gender})
                  </div>
                  <div className="text-slate-300 text-[11px]">
                    Points Engine: {isGeneral ? 'General Rule (🥇 15 pts | 🥈 10 pts | 🥉 5 pts)' : 'Regular Rule (🥇 10 pts | 🥈 7 pts | 🥉 5 pts)'}
                  </div>
                </div>
              )}

              {/* Winners Selectors */}
              <div className="space-y-3">
                {/* 1st Place */}
                <div className="p-3 rounded-xl bg-slate-800/80 border border-amber-500/30 space-y-1">
                  <label className="text-xs font-black text-amber-400 flex items-center justify-between">
                    <span>🥇 1st Place Winner (+{ptsFirst} PTS)</span>
                  </label>
                  <select
                    required
                    value={firstStudentId}
                    onChange={(e) => setFirstStudentId(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-bold text-white focus:outline-none"
                  >
                    <option value="">-- Select 1st Place Student --</option>
                    {students
                      .filter((st) => st.status === 'active')
                      .map((st) => (
                        <option key={st.id} value={st.id}>
                          #{st.chestNo} - {st.name} ({st.classNum || st.category} • {GROUPS[st.group]?.name})
                        </option>
                      ))}
                  </select>
                </div>

                {/* 2nd Place */}
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-400/30 space-y-1">
                  <label className="text-xs font-black text-slate-300 flex items-center justify-between">
                    <span>🥈 2nd Place Winner (+{ptsSecond} PTS)</span>
                  </label>
                  <select
                    value={secondStudentId}
                    onChange={(e) => setSecondStudentId(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-bold text-white focus:outline-none"
                  >
                    <option value="">-- Select 2nd Place Student (Optional) --</option>
                    {students
                      .filter((st) => st.status === 'active' && st.id !== firstStudentId)
                      .map((st) => (
                        <option key={st.id} value={st.id}>
                          #{st.chestNo} - {st.name} ({st.classNum || st.category} • {GROUPS[st.group]?.name})
                        </option>
                      ))}
                  </select>
                </div>

                {/* 3rd Place */}
                <div className="p-3 rounded-xl bg-slate-800/80 border border-amber-700/30 space-y-1">
                  <label className="text-xs font-black text-amber-600 flex items-center justify-between">
                    <span>🥉 3rd Place Winner (+{ptsThird} PTS)</span>
                  </label>
                  <select
                    value={thirdStudentId}
                    onChange={(e) => setThirdStudentId(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-bold text-white focus:outline-none"
                  >
                    <option value="">-- Select 3rd Place Student (Optional) --</option>
                    {students
                      .filter((st) => st.status === 'active' && st.id !== firstStudentId && st.id !== secondStudentId)
                      .map((st) => (
                        <option key={st.id} value={st.id}>
                          #{st.chestNo} - {st.name} ({st.classNum || st.category} • {GROUPS[st.group]?.name})
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={!selectedEventId || !firstStudentId}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg hover:brightness-110 transition disabled:opacity-50"
              >
                Publish Result & Broadcast Live Scores 🚀
              </button>

            </form>
          </div>
        )}

        {/* TAB 2: MANAGE EVENTS */}
        {adminTab === 'events' && (
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-left">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-200">Events Schedule</h3>
              <button
                onClick={() => {
                  setEditingEvent(null);
                  setEventFormData({
                    title: '',
                    category: 'Sub Junior',
                    gender: 'Boys',
                    type: 'Stage',
                    time: '02:00 PM',
                    location: 'Main Stage',
                    date: '2026-08-09',
                    status: 'Upcoming',
                  });
                  setIsEventModalOpen(true);
                }}
                className="py-1.5 px-3 rounded-xl bg-amber-500 text-slate-950 font-black text-xs flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Event
              </button>
            </div>

            <div className="space-y-2">
              {events.map((evt) => (
                <div
                  key={evt.id}
                  className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-white">{evt.title}</div>
                    <div className="text-[11px] text-slate-400">
                      {evt.category} • {evt.gender} • {evt.type} • {evt.time} ({evt.location})
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const nextStatus =
                          evt.status === 'Upcoming' ? 'Live' : evt.status === 'Live' ? 'Completed' : 'Upcoming';
                        updateEvent(evt.id, { status: nextStatus });
                      }}
                      className="px-2 py-1 rounded text-[10px] font-black bg-slate-700 text-amber-400"
                    >
                      {evt.status}
                    </button>

                    <button
                      onClick={() => {
                        setEditingEvent(evt);
                        setEventFormData(evt);
                        setIsEventModalOpen(true);
                      }}
                      className="p-1.5 rounded bg-slate-700 text-slate-300"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>

                    <button
                      onClick={() => deleteEvent(evt.id)}
                      className="p-1.5 rounded bg-red-500/10 text-red-400"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: MANAGE CENTRAL STUDENT DATABASE */}
        {adminTab === 'students' && (
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-left">
            
            {/* Header + Add Button */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-200">Central Student Database</h3>
              <button
                onClick={() => {
                  setEditingStudent(null);
                  setStudentFormData({
                    name: '',
                    classNum: 'Class 1',
                    gender: 'Boys',
                    group: 'GRP-A',
                    rollNo: '',
                    admissionNo: '',
                    isLeader: false,
                    status: 'active',
                  });
                  setIsStudentModalOpen(true);
                }}
                className="py-1.5 px-3 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs flex items-center gap-1 shadow"
              >
                <Plus className="w-4 h-4" />
                Add Student
              </button>
            </div>

            {/* Filter Bar */}
            <div className="p-3 bg-slate-800/70 rounded-2xl border border-slate-700 space-y-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by student name or chest no..."
                  value={studentSearchQuery}
                  onChange={(e) => setStudentSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-4 gap-1.5 text-[11px]">
                {/* Class Filter */}
                <select
                  value={studentClassFilter}
                  onChange={(e) => setStudentClassFilter(e.target.value)}
                  className="p-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-bold"
                >
                  <option value="All">All Classes</option>
                  {CLASSES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                {/* Gender Filter */}
                <select
                  value={studentGenderFilter}
                  onChange={(e) => setStudentGenderFilter(e.target.value)}
                  className="p-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-bold"
                >
                  <option value="All">All Genders</option>
                  <option value="Boys">Boys</option>
                  <option value="Girls">Girls</option>
                </select>

                {/* Group Filter */}
                <select
                  value={studentGroupFilter}
                  onChange={(e) => setStudentGroupFilter(e.target.value)}
                  className="p-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-bold"
                >
                  <option value="All">All Groups</option>
                  <option value="GRP-A">AN-NAJAH</option>
                  <option value="GRP-B">AL-FALAH</option>
                  <option value="GRP-C">AS-SALAH</option>
                </select>

                {/* Status Filter */}
                <select
                  value={studentStatusFilter}
                  onChange={(e) => setStudentStatusFilter(e.target.value)}
                  className="p-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-bold"
                >
                  <option value="All">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Student List Cards */}
            <div className="space-y-2">
              {filteredStudents.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-500 font-semibold">
                  No students found matching selected filters.
                </div>
              ) : (
                filteredStudents.map((st) => (
                  <div
                    key={st.id}
                    className={`p-3 rounded-xl border flex items-center justify-between text-xs transition ${
                      st.status === 'inactive'
                        ? 'bg-slate-900/40 border-slate-800 opacity-60'
                        : 'bg-slate-800/60 border-slate-700/60'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-white text-sm">{st.name}</span>
                        <span
                          className="px-2 py-0.5 rounded text-[9px] font-black text-white"
                          style={{ backgroundColor: GROUPS[st.group]?.color || '#10b981' }}
                        >
                          {GROUPS[st.group]?.name}
                        </span>
                        {st.status === 'inactive' && (
                          <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 text-[9px] font-bold">
                            Inactive
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-400 font-medium">
                        Class: <strong className="text-amber-400">{st.classNum || 'Class 1'}</strong> • Chest: <strong className="text-emerald-400">#{st.chestNo}</strong> • Roll: #{st.rollNo || '-'} • Gender: {st.gender}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Active / Inactive Toggle Button */}
                      <button
                        onClick={() => toggleStudentStatus(st.id)}
                        className={`p-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 border ${
                          st.status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                            : 'bg-slate-700 text-slate-400 border-slate-600 hover:text-white'
                        }`}
                        title={st.status === 'active' ? 'Deactivate student' : 'Reactivate student'}
                      >
                        {st.status === 'active' ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => {
                          setEditingStudent(st);
                          setStudentFormData({
                            name: st.name,
                            classNum: st.classNum || 'Class 1',
                            gender: st.gender,
                            group: st.group,
                            rollNo: st.rollNo || '',
                            admissionNo: st.admissionNo || '',
                            isLeader: st.isLeader || false,
                            status: st.status || 'active',
                          });
                          setIsStudentModalOpen(true);
                        }}
                        className="p-1.5 rounded bg-slate-700 text-slate-300 hover:text-white"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => deleteStudent(st.id)}
                        className="p-1.5 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        )}

        {/* TAB: SENIOR LEADERS ASSIGNMENT */}
        {adminTab === 'leaders' && (
          <div className="flex-1 overflow-y-auto space-y-5 pr-1 text-left">
            <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs space-y-1">
              <div className="font-extrabold text-amber-300 flex items-center gap-1.5">
                <span>👑 Senior Category Leader Rules (Strict Class Allocation)</span>
              </div>
              <ul className="text-[11px] text-slate-300 space-y-0.5 list-disc pl-4 mt-1 font-medium">
                <li><strong className="text-amber-400">🥇 1st Leader</strong> → Must be assigned strictly from <strong>Class 10</strong></li>
                <li><strong className="text-amber-400">🥈 2nd Leader</strong> → Must be assigned strictly from <strong>Class 9</strong></li>
                <li><strong className="text-amber-400">🥉 3rd Leader</strong> → Must be assigned strictly from <strong>Class 8</strong></li>
              </ul>
            </div>

            {/* Group Leader Assignment Cards */}
            <div className="space-y-4">
              {['GRP-A', 'GRP-B', 'GRP-C'].map((gCode) => {
                const groupObj = GROUPS[gCode];
                const c10Students = students.filter((s) => s.group === gCode && s.classNum === 'Class 10' && s.status === 'active');
                const c9Students = students.filter((s) => s.group === gCode && s.classNum === 'Class 9' && s.status === 'active');
                const c8Students = students.filter((s) => s.group === gCode && s.classNum === 'Class 8' && s.status === 'active');

                const currentFirstLeader = students.find((s) => s.group === gCode && s.isLeader && s.leaderRank === '1st Leader');
                const currentSecondLeader = students.find((s) => s.group === gCode && s.isLeader && s.leaderRank === '2nd Leader');
                const currentThirdLeader = students.find((s) => s.group === gCode && s.isLeader && s.leaderRank === '3rd Leader');

                const handleAssignLeader = (rank, studentId) => {
                  // Clear existing leader of this rank for this group
                  students.forEach((s) => {
                    if (s.group === gCode && s.leaderRank === rank) {
                      updateStudent(s.id, { isLeader: false, leaderRank: null });
                    }
                  });

                  if (studentId) {
                    updateStudent(studentId, { isLeader: true, leaderRank: rank });
                  }
                };

                return (
                  <div key={gCode} className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
                    <div className="flex items-center gap-2.5 border-b border-slate-700/60 pb-2">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-sm text-white"
                        style={{ backgroundColor: groupObj.color }}
                      >
                        {groupObj.icon}
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-white">{groupObj.name} ({groupObj.code})</h4>
                        <span className="text-[10px] text-slate-400 font-semibold">Group Leader Roster</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                      {/* 1st Leader Selection (Class 10) */}
                      <div className="p-3 bg-slate-900/80 rounded-xl border border-amber-500/30 space-y-1.5">
                        <label className="text-[11px] font-black text-amber-400 flex items-center justify-between">
                          <span>🥇 1st Leader</span>
                          <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[9px]">Class 10</span>
                        </label>
                        <select
                          value={currentFirstLeader?.id || ''}
                          onChange={(e) => handleAssignLeader('1st Leader', e.target.value)}
                          className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-xs font-bold text-white focus:outline-none focus:border-amber-500"
                        >
                          <option value="">-- Select Class 10 Leader --</option>
                          {c10Students.map((st) => (
                            <option key={st.id} value={st.id}>
                              #{st.chestNo} • {st.name} ({st.gender})
                            </option>
                          ))}
                        </select>
                        {currentFirstLeader && (
                          <div className="text-[10px] text-emerald-400 font-bold truncate">
                            Assigned: #{currentFirstLeader.chestNo} {currentFirstLeader.name}
                          </div>
                        )}
                      </div>

                      {/* 2nd Leader Selection (Class 9) */}
                      <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-400/30 space-y-1.5">
                        <label className="text-[11px] font-black text-slate-300 flex items-center justify-between">
                          <span>🥈 2nd Leader</span>
                          <span className="px-1.5 py-0.5 rounded bg-slate-500/20 text-slate-300 text-[9px]">Class 9</span>
                        </label>
                        <select
                          value={currentSecondLeader?.id || ''}
                          onChange={(e) => handleAssignLeader('2nd Leader', e.target.value)}
                          className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-xs font-bold text-white focus:outline-none focus:border-slate-400"
                        >
                          <option value="">-- Select Class 9 Leader --</option>
                          {c9Students.map((st) => (
                            <option key={st.id} value={st.id}>
                              #{st.chestNo} • {st.name} ({st.gender})
                            </option>
                          ))}
                        </select>
                        {currentSecondLeader && (
                          <div className="text-[10px] text-emerald-400 font-bold truncate">
                            Assigned: #{currentSecondLeader.chestNo} {currentSecondLeader.name}
                          </div>
                        )}
                      </div>

                      {/* 3rd Leader Selection (Class 8) */}
                      <div className="p-3 bg-slate-900/80 rounded-xl border border-amber-700/30 space-y-1.5">
                        <label className="text-[11px] font-black text-amber-600 flex items-center justify-between">
                          <span>🥉 3rd Leader</span>
                          <span className="px-1.5 py-0.5 rounded bg-amber-700/20 text-amber-500 text-[9px]">Class 8</span>
                        </label>
                        <select
                          value={currentThirdLeader?.id || ''}
                          onChange={(e) => handleAssignLeader('3rd Leader', e.target.value)}
                          className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-xs font-bold text-white focus:outline-none focus:border-amber-600"
                        >
                          <option value="">-- Select Class 8 Leader --</option>
                          {c8Students.map((st) => (
                            <option key={st.id} value={st.id}>
                              #{st.chestNo} • {st.name} ({st.gender})
                            </option>
                          ))}
                        </select>
                        {currentThirdLeader && (
                          <div className="text-[10px] text-emerald-400 font-bold truncate">
                            Assigned: #{currentThirdLeader.chestNo} {currentThirdLeader.name}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: RETRACT / SCORES RESET */}
        {adminTab === 'retract' && (
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-left">
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase text-amber-400">Published Event Results</h3>
              {Object.keys(results).length === 0 ? (
                <div className="text-xs text-slate-400 py-3">No published results to retract.</div>
              ) : (
                Object.values(results).map((res) => {
                  const event = events.find((e) => e.id === res.eventId);
                  return (
                    <div
                      key={res.eventId}
                      className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-white">{event?.title || res.eventId}</div>
                        <div className="text-[10px] text-slate-400">
                          Winner 1st: {res.first?.name} (#{res.first?.chestNo})
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          retractResult(res.eventId);
                          alert(`Result for "${event?.title}" retracted.`);
                        }}
                        className="py-1 px-2.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/30 text-[10px] font-bold flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Retract Result
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-2">
              <div className="text-xs font-black uppercase text-red-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Score Reset & Competition Reset</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Resets all published competition scores back to zero and marks all events as upcoming.
              </p>

              <button
                onClick={() => setShowResetConfirm(true)}
                className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-lg transition"
              >
                Reset All Competition Scores
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Add/Edit Student Modal */}
      {isStudentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 rounded-3xl p-5 text-white border border-slate-700 shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-base font-black text-white">
                {editingStudent ? 'Edit Student Record' : 'Add New Student Record'}
              </h3>
              <button onClick={() => setIsStudentModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-400">Full Student Name</label>
                <input
                  type="text"
                  required
                  placeholder="Enter student's exact name"
                  value={studentFormData.name}
                  onChange={(e) => setStudentFormData({ ...studentFormData, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-white mt-1 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-400">Class</label>
                  <select
                    value={studentFormData.classNum}
                    onChange={(e) => setStudentFormData({ ...studentFormData, classNum: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-white mt-1 focus:outline-none"
                  >
                    {CLASSES.map((c) => (
                      <option key={c} value={c}>
                        {c} ({mapClassToCategory(c)})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400">Gender</label>
                  <select
                    value={studentFormData.gender}
                    onChange={(e) => setStudentFormData({ ...studentFormData, gender: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-white mt-1 focus:outline-none"
                  >
                    <option value="Boys">Boys</option>
                    <option value="Girls">Girls</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-400">Group / Team</label>
                  <select
                    value={studentFormData.group}
                    onChange={(e) => setStudentFormData({ ...studentFormData, group: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-white mt-1 focus:outline-none"
                  >
                    <option value="GRP-A">AN-NAJAH</option>
                    <option value="GRP-B">AL-FALAH</option>
                    <option value="GRP-C">AS-SALAH</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400">Roll / Serial No</label>
                  <input
                    type="number"
                    placeholder="e.g. 1"
                    value={studentFormData.rollNo}
                    onChange={(e) => setStudentFormData({ ...studentFormData, rollNo: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-white mt-1 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-400">Status</label>
                  <select
                    value={studentFormData.status}
                    onChange={(e) => setStudentFormData({ ...studentFormData, status: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-white mt-1 focus:outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400">Admission No</label>
                  <input
                    type="text"
                    placeholder="e.g. AD-101"
                    value={studentFormData.admissionNo}
                    onChange={(e) => setStudentFormData({ ...studentFormData, admissionNo: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-white mt-1 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 text-slate-950 font-black text-xs shadow-lg hover:brightness-110 transition mt-2"
              >
                {editingStudent ? 'Save Student Changes' : 'Add Student Record'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Event Modal */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 rounded-3xl p-5 text-white border border-slate-700 shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-base font-black text-white">
                {editingEvent ? 'Edit Event' : 'Add New Event'}
              </h3>
              <button onClick={() => setIsEventModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-400">Event Title (Malayalam / English)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. പ്രസംഗം (മലയാളം)"
                  value={eventFormData.title}
                  onChange={(e) => setEventFormData({ ...eventFormData, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-white mt-1 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-400">Category</label>
                  <select
                    value={eventFormData.category}
                    onChange={(e) => setEventFormData({ ...eventFormData, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-white mt-1 focus:outline-none"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400">Gender</label>
                  <select
                    value={eventFormData.gender}
                    onChange={(e) => setEventFormData({ ...eventFormData, gender: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-white mt-1 focus:outline-none"
                  >
                    <option value="Boys">Boys</option>
                    <option value="Girls">Girls</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-400">Type</label>
                  <select
                    value={eventFormData.type}
                    onChange={(e) => setEventFormData({ ...eventFormData, type: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-white mt-1 focus:outline-none"
                  >
                    <option value="Stage">Stage</option>
                    <option value="Non-Stage">Non-Stage</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400">Time</label>
                  <input
                    type="text"
                    value={eventFormData.time}
                    onChange={(e) => setEventFormData({ ...eventFormData, time: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-white mt-1 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400">Location / Stage</label>
                <input
                  type="text"
                  value={eventFormData.location}
                  onChange={(e) => setEventFormData({ ...eventFormData, location: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-white mt-1 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 text-slate-950 font-black text-xs shadow-lg hover:brightness-110 transition mt-2"
              >
                Save Event
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="w-full max-w-sm bg-slate-900 rounded-3xl p-5 text-white border border-red-500/40 shadow-2xl space-y-4 text-center">
            <AlertTriangle className="w-10 h-10 text-red-500 mx-auto" />
            <h3 className="text-base font-black text-white">Reset All Scores?</h3>
            <p className="text-xs text-slate-400">
              Are you sure you want to retract all published results and reset group scores to 0?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetAllScores();
                  setShowResetConfirm(false);
                  alert('All scores reset successfully.');
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-extrabold text-xs"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );

  if (isEmbedded) return content;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      {content}
    </div>
  );
}
