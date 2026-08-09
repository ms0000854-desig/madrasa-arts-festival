export const MADRASA_INFO = {
  festName: "MAHABBA Meelad Islamic Arts Fest 2k26",
  madrasaName: "NAJATHUL ISLAM MADRASA THOTTUPOYIL",
  subTitle: "Mahabba Meelad Islamic Arts & Cultural Fest 2k26",
  location: "Thottupoyil",
  year: "2026",
};

export const GROUPS = {
  'GRP-A': {
    id: 'GRP-A',
    code: 200,
    name: 'AN-NAJAH',
    shortName: 'NAJAH',
    color: '#16B978', // Exact reference green
    bgLight: '#EAF9F2', // Light green background
    badgeBg: 'bg-[#EAF9F2] text-[#16B978] border-[#16B978]/30',
    headerBg: 'from-[#16B978] to-[#059669]',
    accentColor: 'emerald',
    icon: '🥇',
  },
  'GRP-B': {
    id: 'GRP-B',
    code: 100,
    name: 'AL-FALAH',
    shortName: 'FALAH',
    color: '#3B82E8', // Exact reference blue
    bgLight: '#EEF5FF', // Light blue background
    badgeBg: 'bg-[#EEF5FF] text-[#3B82E8] border-[#3B82E8]/30',
    headerBg: 'from-[#3B82E8] to-[#2563EB]',
    accentColor: 'blue',
    icon: '🥈',
  },
  'GRP-C': {
    id: 'GRP-C',
    code: 300,
    name: 'AS-SALAH',
    shortName: 'SALAH',
    color: '#F59E0B', // Exact reference orange/gold
    bgLight: '#FFF7E8', // Light orange background
    badgeBg: 'bg-[#FFF7E8] text-[#F59E0B] border-[#F59E0B]/30',
    headerBg: 'from-[#F59E0B] to-[#D97706]',
    accentColor: 'amber',
    icon: '🥉',
  },
};

export const CLASSES = [
  'Class 1',
  'Class 2',
  'Class 3',
  'Class 4',
  'Class 5',
  'Class 6',
  'Class 7',
  'Class 8',
  'Class 9',
  'Class 10',
];

export function mapClassToCategory(classNum) {
  if (classNum === 'Class 1' || classNum === 'Class 2') return 'Kiddies';
  if (classNum === 'Class 3' || classNum === 'Class 4') return 'Sub Junior';
  if (classNum === 'Class 5' || classNum === 'Class 6' || classNum === 'Class 7') return 'Junior';
  if (classNum === 'Class 8' || classNum === 'Class 9' || classNum === 'Class 10') return 'Senior';
  return 'General';
}

export const CATEGORIES = [
  { id: 'Kiddies', name: 'Kiddies', subtitle: 'Class 1 & 2' },
  { id: 'Sub Junior', name: 'Sub Junior', subtitle: 'Class 3 & 4' },
  { id: 'Junior', name: 'Junior', subtitle: 'Class 5, 6 & 7' },
  { id: 'Senior', name: 'Senior', subtitle: 'Class 8, 9 & 10' },
  { id: 'General', name: 'General', subtitle: 'All Classes • Leaders', isGeneral: true },
];

export const POINT_RULES = {
  regular: {
    first: 10,
    second: 7,
    third: 5,
  },
  general: {
    first: 15,
    second: 10,
    third: 5,
  },
};

export const ACCOUNTS = {
  admin: {
    username: 'admin',
    password: 'Salim786',
    role: 'admin',
    name: 'Head Ustad (Admin)',
  },
  groups: [
    {
      groupCode: 'GRP-A',
      username: 'Najah',
      password: 'Annajah200',
      name: 'AN-NAJAH Group Leader',
    },
    {
      groupCode: 'GRP-B',
      username: 'Alfalah100',
      password: '859090100',
      name: 'AL-FALAH Group Leader',
    },
    {
      groupCode: 'GRP-C',
      username: 'Assalah',
      password: '859090300',
      name: 'AS-SALAH Group Leader',
    },
  ],
};

export const CHEST_RULES = {
  'GRP-B': {
    code: 100,
    boysLeaderRange: [101, 103],
    boysStudentStart: 104,
    girlsLeaderRange: [150, 152],
    girlsStudentStart: 153,
  },
  'GRP-A': {
    code: 200,
    boysLeaderRange: [201, 203],
    boysStudentStart: 204,
    girlsLeaderRange: [250, 252],
    girlsStudentStart: 253,
  },
  'GRP-C': {
    code: 300,
    boysLeaderRange: [301, 303],
    boysStudentStart: 304,
    girlsLeaderRange: [350, 352],
    girlsStudentStart: 353,
  },
};
