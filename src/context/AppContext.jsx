import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { GROUPS, POINT_RULES, ACCOUNTS, CATEGORIES, CLASSES, mapClassToCategory } from '../utils/constants';
import { INITIAL_STUDENTS, INITIAL_EVENTS, INITIAL_RESULTS } from '../utils/mockData';
import { subscribeToStore, updateStore } from '../services/firebase';
import { generateNextChestNumber } from '../utils/chestNumbering';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [activeTab, setActiveTab] = useState('scores'); // 'scores' | 'result' | 'performers' | 'schedule'
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Core Data Stores
  const [students, setStudents] = useState([]);
  const [events, setEvents] = useState([]);
  const [results, setResults] = useState({});

  // Real-time synchronization subscriptions
  useEffect(() => {
    const unsubStudents = subscribeToStore('students', setStudents, INITIAL_STUDENTS);
    const unsubEvents = subscribeToStore('events', setEvents, INITIAL_EVENTS);
    const unsubResults = subscribeToStore('results', setResults, INITIAL_RESULTS);

    return () => {
      if (typeof unsubStudents === 'function') unsubStudents();
      if (typeof unsubEvents === 'function') unsubEvents();
      if (typeof unsubResults === 'function') unsubResults();
    };
  }, []);

  // Sync state changes back to Store helper wrapper
  const saveStudents = (newStudents) => {
    setStudents(newStudents);
    updateStore('students', newStudents);
  };

  const saveEvents = (newEvents) => {
    setEvents(newEvents);
    updateStore('events', newEvents);
  };

  const saveResults = (newResults) => {
    setResults(newResults);
    updateStore('results', newResults);
  };

  // Toggle Theme
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Authentication Logic
  const login = (username, password) => {
    if (
      username.trim().toLowerCase() === ACCOUNTS.admin.username.toLowerCase() &&
      password.trim() === ACCOUNTS.admin.password
    ) {
      const user = { role: 'admin', name: ACCOUNTS.admin.name };
      setCurrentUser(user);
      setIsLoginModalOpen(false);
      return { success: true, user };
    }

    const matchedGroup = ACCOUNTS.groups.find(
      (g) =>
        g.username.toLowerCase() === username.trim().toLowerCase() &&
        g.password === password.trim()
    );

    if (matchedGroup) {
      const user = {
        role: 'group',
        groupCode: matchedGroup.groupCode,
        name: matchedGroup.name,
      };
      setCurrentUser(user);
      setIsLoginModalOpen(false);
      return { success: true, user };
    }

    return { success: false, message: 'Invalid username or password!' };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'],
    });
  };

  // Point Calculation Engine
  const scoreCalculations = useMemo(() => {
    const totals = {
      'GRP-A': { overall: 0, boys: 0, girls: 0, categories: {} },
      'GRP-B': { overall: 0, boys: 0, girls: 0, categories: {} },
      'GRP-C': { overall: 0, boys: 0, girls: 0, categories: {} },
    };

    CATEGORIES.forEach((cat) => {
      totals['GRP-A'].categories[cat.id] = 0;
      totals['GRP-B'].categories[cat.id] = 0;
      totals['GRP-C'].categories[cat.id] = 0;
    });

    const studentPointsMap = {};

    Object.values(results).forEach((res) => {
      if (!res) return;
      const event = events.find((e) => e.id === res.eventId);
      const isGeneral = event?.category === 'General';
      const categoryId = event?.category || 'General';
      const gender = event?.gender || 'Boys';

      ['first', 'second', 'third'].forEach((placeKey) => {
        const placeData = res[placeKey];
        if (!placeData) return;

        const groupCode = placeData.group;
        let points = placeData.points;

        if (!points) {
          if (isGeneral) {
            points = placeKey === 'first' ? 15 : placeKey === 'second' ? 10 : 5;
          } else {
            points = placeKey === 'first' ? 10 : placeKey === 'second' ? 7 : 5;
          }
        }

        if (totals[groupCode]) {
          totals[groupCode].overall += points;
          if (gender === 'Girls') {
            totals[groupCode].girls += points;
          } else {
            totals[groupCode].boys += points;
          }

          if (totals[groupCode].categories[categoryId] !== undefined) {
            totals[groupCode].categories[categoryId] += points;
          }
        }

        if (placeData.studentId) {
          if (!studentPointsMap[placeData.studentId]) {
            studentPointsMap[placeData.studentId] = {
              studentId: placeData.studentId,
              name: placeData.name,
              chestNo: placeData.chestNo,
              group: groupCode,
              totalPoints: 0,
              firsts: 0,
              seconds: 0,
              thirds: 0,
              wins: [],
            };
          }
          studentPointsMap[placeData.studentId].totalPoints += points;
          if (placeKey === 'first') studentPointsMap[placeData.studentId].firsts += 1;
          if (placeKey === 'second') studentPointsMap[placeData.studentId].seconds += 1;
          if (placeKey === 'third') studentPointsMap[placeData.studentId].thirds += 1;

          studentPointsMap[placeData.studentId].wins.push({
            eventTitle: event?.title || 'Competition',
            category: categoryId,
            place: placeKey,
            points,
          });
        }
      });
    });

    const sortedGroups = Object.keys(totals)
      .map((code) => ({
        groupCode: code,
        ...GROUPS[code],
        points: totals[code].overall,
        boysPoints: totals[code].boys,
        girlsPoints: totals[code].girls,
        categories: totals[code].categories,
      }))
      .sort((a, b) => b.points - a.points);

    const maxPoints = Math.max(...sortedGroups.map((g) => g.points), 1);
    const rankedGroups = sortedGroups.map((group, idx) => ({
      ...group,
      rank: idx + 1,
      status: idx === 0 ? 'Leading' : 'Chasing',
      performancePct: group.points > 0 ? Math.round((group.points / maxPoints) * 100) : 100,
    }));

    const allPerformers = Object.values(studentPointsMap).map((perf) => {
      const student = students.find((s) => s.id === perf.studentId);
      return {
        ...perf,
        gender: student ? student.gender : 'Boys',
        category: student ? student.category : 'General',
      };
    });

    const boysTop10 = allPerformers
      .filter((p) => p.gender === 'Boys')
      .sort((a, b) => b.totalPoints - a.totalPoints || b.firsts - a.firsts)
      .slice(0, 10);

    const girlsTop10 = allPerformers
      .filter((p) => p.gender === 'Girls')
      .sort((a, b) => b.totalPoints - a.totalPoints || b.firsts - a.firsts)
      .slice(0, 10);

    return {
      rankedGroups,
      totals,
      boysTop10,
      girlsTop10,
      studentPointsMap,
    };
  }, [results, events, students]);

  // Student Actions with Duplicate Check
  const addStudent = (studentData) => {
    // Normalize values
    const nameClean = studentData.name.trim();
    const classNum = studentData.classNum || 'Class 5';
    const category = studentData.category || mapClassToCategory(classNum);
    const gender = studentData.gender || 'Boys';
    const group = studentData.group || 'GRP-A';

    // Duplicate check
    const isDuplicate = students.some(
      (s) =>
        s.name.toLowerCase().trim() === nameClean.toLowerCase() &&
        s.classNum === classNum &&
        s.gender === gender
    );

    if (isDuplicate) {
      return {
        success: false,
        isDuplicate: true,
        message: `Student "${nameClean}" is already registered in ${classNum} (${gender}).`,
      };
    }

    const chestNo =
      studentData.chestNo ||
      generateNextChestNumber(group, gender, studentData.isLeader || false, students);

    const newStudent = {
      id: `s-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      admissionNo: studentData.admissionNo || `AD-${Math.floor(1000 + Math.random() * 9000)}`,
      name: nameClean,
      classNum,
      category,
      gender,
      group,
      rollNo: studentData.rollNo || null,
      chestNo,
      isLeader: studentData.isLeader || false,
      status: studentData.status || 'active',
    };

    const updated = [...students, newStudent];
    saveStudents(updated);
    return { success: true, student: newStudent };
  };

  // Bulk Student Adding Engine for Class-Wise Entry
  const addBulkStudents = (rawStudentList) => {
    let addedCount = 0;
    const duplicates = [];
    const errors = [];
    const updatedStudentsList = [...students];

    rawStudentList.forEach((item, index) => {
      if (!item.name || !item.name.trim()) {
        errors.push(`Row ${index + 1}: Missing student name.`);
        return;
      }

      const nameClean = item.name.trim();
      const classNum = item.classNum || 'Class 1';
      const gender = item.gender || 'Boys';
      const group = item.group || 'GRP-A';
      const isLeader = Boolean(item.isLeader);

      // Duplicate check against both state list and newly added items in this batch
      const isDup = updatedStudentsList.some(
        (s) =>
          s.name.toLowerCase().trim() === nameClean.toLowerCase() &&
          s.classNum === classNum &&
          s.gender === gender
      );

      if (isDup) {
        duplicates.push(`${nameClean} (${classNum} • ${gender})`);
        return;
      }

      const category = mapClassToCategory(classNum);
      const chestNo =
        item.chestNo ||
        generateNextChestNumber(group, gender, isLeader, updatedStudentsList);

      const newStudent = {
        id: `s-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}-${index}`,
        admissionNo: item.admissionNo || `AD-${Math.floor(10000 + Math.random() * 90000)}`,
        name: nameClean,
        classNum,
        category,
        gender,
        group,
        rollNo: item.rollNo || (index + 1),
        chestNo,
        isLeader,
        status: item.status || 'active',
      };

      updatedStudentsList.push(newStudent);
      addedCount += 1;
    });

    if (addedCount > 0) {
      saveStudents(updatedStudentsList);
    }

    return {
      addedCount,
      duplicates,
      errors,
      totalStudents: updatedStudentsList.length,
    };
  };

  const updateStudent = (id, updatedData) => {
    const updated = students.map((s) => {
      if (s.id === id) {
        const classNum = updatedData.classNum || s.classNum;
        const category = updatedData.category || mapClassToCategory(classNum);
        return { ...s, ...updatedData, classNum, category };
      }
      return s;
    });
    saveStudents(updated);
  };

  const toggleStudentStatus = (id) => {
    const updated = students.map((s) =>
      s.id === id ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' } : s
    );
    saveStudents(updated);
  };

  const deleteStudent = (id) => {
    const filtered = students.filter((s) => s.id !== id);
    saveStudents(filtered);
  };

  // Event Actions
  const addEvent = (eventData) => {
    const newEvt = {
      id: `evt-${Date.now()}`,
      status: 'Upcoming',
      ...eventData,
    };
    saveEvents([...events, newEvt]);
  };

  const updateEvent = (id, updatedData) => {
    const updated = events.map((e) => (e.id === id ? { ...e, ...updatedData } : e));
    saveEvents(updated);
  };

  const deleteEvent = (id) => {
    const filtered = events.filter((e) => e.id !== id);
    saveEvents(filtered);
    const newResults = { ...results };
    delete newResults[id];
    saveResults(newResults);
  };

  // Result Actions
  const publishResult = (eventId, resultObj) => {
    const newResults = {
      ...results,
      [eventId]: {
        eventId,
        publishedAt: new Date().toISOString(),
        ...resultObj,
      },
    };
    saveResults(newResults);
    updateEvent(eventId, { status: 'Completed' });
    triggerConfetti();
  };

  const retractResult = (eventId) => {
    const newResults = { ...results };
    delete newResults[eventId];
    saveResults(newResults);
    updateEvent(eventId, { status: 'Upcoming' });
  };

  const resetAllScores = () => {
    saveResults({});
    const updatedEvents = events.map((e) => ({ ...e, status: 'Upcoming' }));
    saveEvents(updatedEvents);
  };

  const value = {
    theme,
    toggleTheme,
    activeTab,
    setActiveTab,
    currentUser,
    login,
    logout,
    isLoginModalOpen,
    setIsLoginModalOpen,
    students,
    events,
    results,
    scoreCalculations,
    addStudent,
    addBulkStudents,
    updateStudent,
    toggleStudentStatus,
    deleteStudent,
    addEvent,
    updateEvent,
    deleteEvent,
    publishResult,
    retractResult,
    resetAllScores,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
