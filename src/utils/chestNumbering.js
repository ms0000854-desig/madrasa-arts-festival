import { CHEST_RULES } from './constants';

/**
 * Generate next chest number automatically for a student based on official group rules.
 * 
 * @param {string} groupId - 'GRP-A' | 'GRP-B' | 'GRP-C'
 * @param {'Boys' | 'Girls'} gender - Student gender
 * @param {boolean} isLeader - Is student a group leader
 * @param {Array} existingStudents - Current list of students to check existing assigned chest numbers
 * @returns {number} The generated chest number
 */
export function generateNextChestNumber(groupId, gender, isLeader, existingStudents = []) {
  const rule = CHEST_RULES[groupId];
  if (!rule) return 100;

  const usedChestNumbers = new Set(
    existingStudents
      .filter((s) => s.chestNo != null)
      .map((s) => Number(s.chestNo))
  );

  if (gender === 'Boys') {
    if (isLeader) {
      const [start, end] = rule.boysLeaderRange;
      for (let num = start; num <= end; num++) {
        if (!usedChestNumbers.has(num)) {
          return num;
        }
      }
      // If leader slots filled, fallback to standard student starting number
      let num = rule.boysStudentStart;
      while (usedChestNumbers.has(num)) num++;
      return num;
    } else {
      let num = rule.boysStudentStart;
      while (usedChestNumbers.has(num)) num++;
      return num;
    }
  } else {
    // Girls
    if (isLeader) {
      const [start, end] = rule.girlsLeaderRange;
      for (let num = start; num <= end; num++) {
        if (!usedChestNumbers.has(num)) {
          return num;
        }
      }
      // Fallback
      let num = rule.girlsStudentStart;
      while (usedChestNumbers.has(num)) num++;
      return num;
    } else {
      let num = rule.girlsStudentStart;
      while (usedChestNumbers.has(num)) num++;
      return num;
    }
  }
}
