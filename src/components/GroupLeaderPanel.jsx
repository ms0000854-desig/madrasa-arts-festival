import React, { useState } from 'react';
import { X, UserPlus, Edit3, Trash2, Users, Search, Plus, UserCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GROUPS, CLASSES, CATEGORIES } from '../utils/constants';
import { generateNextChestNumber } from '../utils/chestNumbering';

export default function GroupLeaderPanel({ onClose }) {
  const { currentUser, students, addStudent, updateStudent, deleteStudent, scoreCalculations } = useApp();

  const groupCode = currentUser?.groupCode || 'GRP-A';
  const group = GROUPS[groupCode];

  // Group's registered students
  const groupStudents = students.filter((s) => s.group === groupCode);

  // Filter state inside group panel
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [genderFilter, setGenderFilter] = useState('All');

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    admissionNo: '',
    classNum: 'Class 1',
    gender: 'Boys',
    rollNo: '',
    isLeader: false,
    chestNo: null,
    status: 'active',
  });

  // Calculate chest number dynamically as form values change
  const autoChestNo = generateNextChestNumber(
    groupCode,
    formData.gender,
    formData.isLeader,
    students
  );

  const handleOpenAddModal = () => {
    setEditingStudent(null);
    setFormData({
      name: '',
      admissionNo: '',
      classNum: 'Class 1',
      gender: 'Boys',
      rollNo: '',
      isLeader: false,
      chestNo: null,
      status: 'active',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      admissionNo: student.admissionNo || '',
      classNum: student.classNum || 'Class 1',
      gender: student.gender,
      rollNo: student.rollNo || '',
      isLeader: student.isLeader || false,
      chestNo: student.chestNo,
      status: student.status || 'active',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingStudent) {
      updateStudent(editingStudent.id, {
        ...formData,
        group: groupCode,
      });
      setIsModalOpen(false);
    } else {
      const res = addStudent({
        ...formData,
        group: groupCode,
        chestNo: autoChestNo,
      });

      if (res.isDuplicate) {
        alert(`⚠️ Duplicate Student: ${res.message}`);
      } else {
        setIsModalOpen(false);
      }
    }
  };

  const displayedStudents = groupStudents.filter((s) => {
    if (categoryFilter !== 'All' && s.category !== categoryFilter) return false;
    if (genderFilter !== 'All' && s.gender !== genderFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      const matchName = s.name.toLowerCase().includes(q);
      const matchChest = s.chestNo?.toString().includes(q);
      if (!matchName && !matchChest) return false;
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl p-5 sm:p-6 text-[#000000] border border-slate-200 shadow-2xl space-y-5 my-auto max-h-[92vh] flex flex-col text-left">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xl text-white shadow-md"
              style={{ backgroundColor: group.color || '#16B978' }}
            >
              {group.icon || '🚩'}
            </div>
            <div>
              <h2 className="text-lg font-black text-[#000000]">
                {group.name} Dashboard
              </h2>
              <p className="text-xs text-slate-500 font-bold">
                Group Code {group.code} • Total Students: {groupStudents.length}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-[#000000]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dashboard Title & Count */}
        <div className="flex items-center gap-2 text-xl font-black text-[#000000]">
          <Users className="w-6 h-6 text-[#16B978]" />
          <h3>My Students</h3>
          <span className="text-sm font-bold text-slate-400">({groupStudents.length})</span>
        </div>

        {/* Primary Action Button: + Add Student */}
        <button
          onClick={handleOpenAddModal}
          className="w-full py-3.5 px-4 rounded-2xl bg-[#16B978] text-white font-black text-sm shadow-md hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>Add Student</span>
        </button>

        {/* Filters Row (Search, Category, Gender) */}
        <div className="space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 text-[#000000] text-xs font-bold border border-slate-200 focus:outline-none"
              />
            </div>

            {/* Category Filter Dropdown */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-[#000000] focus:outline-none"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-start">
            {/* Gender Filter Dropdown */}
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-[#000000] focus:outline-none"
            >
              <option value="All">All Genders</option>
              <option value="Boys">Boys</option>
              <option value="Girls">Girls</option>
            </select>
          </div>
        </div>

        {/* Student Cards List (Matching Screenshot 1:1) */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {displayedStudents.length === 0 ? (
            <div className="text-center py-8 text-xs font-semibold text-slate-400">
              No students registered matching selected filters.
            </div>
          ) : (
            displayedStudents.map((st) => {
              const initialLetter = st.name ? st.name.charAt(0).toUpperCase() : 'S';

              return (
                <div
                  key={st.id}
                  className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex flex-col justify-between gap-3 text-left transition hover:shadow-xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      {/* Green Initial Avatar Box */}
                      <div className="w-11 h-11 rounded-2xl bg-[#16B978] text-white flex items-center justify-center font-black text-lg shrink-0 shadow-xs">
                        {initialLetter}
                      </div>

                      {/* Info Column */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-black text-base text-[#000000]">
                            {st.name}
                          </h4>
                          {st.isLeader && (
                            <span className="px-2.5 py-0.5 rounded-full bg-[#FFF7E8] text-[#D97706] border border-[#F59E0B]/30 text-[10px] font-black uppercase flex items-center gap-1">
                              👑 Leader
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-slate-500 font-bold">
                          {st.classNum || 'Class 1'} • {st.gender} • {st.category}
                        </div>

                        <div className="text-xs font-bold text-slate-500">
                          Chess No: <strong className="text-[#16B978] font-black">{st.chestNo}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Edit Pencil Icon Button */}
                    <button
                      onClick={() => handleOpenEditModal(st)}
                      className="p-2.5 rounded-xl bg-slate-100 text-slate-500 hover:text-[#000000] transition border border-slate-200/60"
                      title="Edit Student"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Card Footer Info */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] font-semibold text-slate-400">
                    <span>16 events eligible</span>
                    <button
                      onClick={() => deleteStudent(st.id)}
                      className="text-red-500 hover:text-red-700 text-[10px] font-bold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>

      {/* Add / Edit Student Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 text-[#000000] border border-slate-200 shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-[#000000]">
                {editingStudent ? 'Edit Student Details' : 'Register New Student'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-[#000000]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-black uppercase text-slate-500">Student Name</label>
                <input
                  type="text"
                  required
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-black text-[#000000] mt-1 focus:outline-none focus:border-[#16B978]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-black uppercase text-slate-500">Class</label>
                  <select
                    value={formData.classNum}
                    onChange={(e) => setFormData({ ...formData, classNum: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-black text-[#000000] mt-1 focus:outline-none"
                  >
                    {CLASSES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-black uppercase text-slate-500">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-black text-[#000000] mt-1 focus:outline-none"
                  >
                    <option value="Boys">Boys</option>
                    <option value="Girls">Girls</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-black uppercase text-slate-500">Roll / Serial No</label>
                  <input
                    type="number"
                    placeholder="e.g. 1"
                    value={formData.rollNo}
                    onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-black text-[#000000] mt-1 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-black uppercase text-slate-500">Admission No</label>
                  <input
                    type="text"
                    placeholder="e.g. AD-204"
                    value={formData.admissionNo}
                    onChange={(e) => setFormData({ ...formData, admissionNo: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-black text-[#000000] mt-1 focus:outline-none"
                  />
                </div>
              </div>

              {/* Is Leader Checkbox */}
              <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <input
                  type="checkbox"
                  id="isLeader"
                  checked={formData.isLeader}
                  onChange={(e) => setFormData({ ...formData, isLeader: e.target.checked })}
                  className="w-4 h-4 rounded text-[#16B978] focus:ring-0"
                />
                <label htmlFor="isLeader" className="text-xs font-black text-[#D97706]">
                  Assign as Team Leader
                </label>
              </div>

              {/* Auto Chest Number Preview */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                <div className="text-[10px] font-black uppercase text-[#16B978]">
                  Allocated Chest Number Rule:
                </div>
                <div className="text-xl font-black text-[#16B978]">
                  #{editingStudent ? formData.chestNo : autoChestNo}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#16B978] text-white font-black text-xs shadow-md hover:brightness-105 transition mt-2"
              >
                {editingStudent ? 'Save Changes' : 'Confirm Registration'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
