// Initial seed dataset for school CBT & Learning Analytics Platform

export const INITIAL_STUDENTS = [
  {
    id: "STU-2026-001",
    name: "Amina Yusuf",
    class: "SS 3 Alpha",
    status: "active",
    email: "amina.yusuf@school.edu",
    joinedDate: "2026-01-10"
  },
  {
    id: "STU-2026-002",
    name: "Emeka Okafor",
    class: "SS 3 Alpha",
    status: "active",
    email: "emeka.okafor@school.edu",
    joinedDate: "2026-01-12"
  },
  {
    id: "STU-2026-003",
    name: "David Adeleke",
    class: "SS 3 Beta",
    status: "active",
    email: "david.adeleke@school.edu",
    joinedDate: "2026-01-15"
  },
  {
    id: "STU-2026-004",
    name: "Fatima Bello",
    class: "SS 3 Beta",
    status: "active",
    email: "fatima.bello@school.edu",
    joinedDate: "2026-01-18"
  },
  {
    id: "STU-2026-005",
    name: "Grace Nwosu",
    class: "SS 3 Alpha",
    status: "active",
    email: "grace.nwosu@school.edu",
    joinedDate: "2026-01-20"
  }
];

export const SUBJECTS_AND_TOPICS = [
  {
    id: "SUB-MATH",
    name: "Mathematics",
    code: "MTH101",
    topics: ["Algebra", "Fractions", "Decimals", "Geometry", "Percentage"]
  },
  {
    id: "SUB-ENG",
    name: "English Language",
    code: "ENG101",
    topics: ["Grammar", "Comprehension", "Vocabulary", "Punctuation"]
  },
  {
    id: "SUB-SCI",
    name: "Basic Science",
    code: "SCI101",
    topics: ["Living Things", "Energy & Work", "Solar System", "Chemical Reactions"]
  }
];

export const INITIAL_QUESTIONS = [
  // Mathematics - Algebra
  {
    id: "Q-MTH-001",
    subject: "Mathematics",
    topic: "Algebra",
    question: "Solve for x: 3x + 15 = 45",
    optionA: "x = 5",
    optionB: "x = 10",
    optionC: "x = 15",
    optionD: "x = 20",
    correctAnswer: "B",
    marks: 5,
    difficulty: "Easy",
    explanation: "Subtract 15 from both sides: 3x = 30. Divide by 3: x = 10."
  },
  {
    id: "Q-MTH-002",
    subject: "Mathematics",
    topic: "Algebra",
    question: "Factorize the quadratic expression: x² - 9",
    optionA: "(x - 3)(x - 3)",
    optionB: "(x + 3)(x - 3)",
    optionC: "(x + 9)(x - 1)",
    optionD: "(x + 3)(x + 3)",
    correctAnswer: "B",
    marks: 5,
    difficulty: "Medium",
    explanation: "Difference of two squares formula: a² - b² = (a + b)(a - b). Here a = x and b = 3."
  },
  {
    id: "Q-MTH-003",
    subject: "Mathematics",
    topic: "Algebra",
    question: "If 2^(x + 1) = 32, what is the value of x?",
    optionA: "3",
    optionB: "4",
    optionC: "5",
    optionD: "6",
    correctAnswer: "B",
    marks: 5,
    difficulty: "Hard",
    explanation: "Express 32 as 2^5. Therefore 2^(x+1) = 2^5 => x + 1 = 5 => x = 4."
  },

  // Mathematics - Fractions
  {
    id: "Q-MTH-004",
    subject: "Mathematics",
    topic: "Fractions",
    question: "Simplify the fraction addition: 3/4 + 2/5",
    optionA: "5/9",
    optionB: "23/20",
    optionC: "11/20",
    optionD: "6/20",
    correctAnswer: "B",
    marks: 5,
    difficulty: "Easy",
    explanation: "Common denominator is 20. (15/20) + (8/20) = 23/20 or 1 3/20."
  },
  {
    id: "Q-MTH-005",
    subject: "Mathematics",
    topic: "Fractions",
    question: "What is 3/8 of 160?",
    optionA: "40",
    optionB: "50",
    optionC: "60",
    optionD: "70",
    correctAnswer: "C",
    marks: 5,
    difficulty: "Easy",
    explanation: "(160 / 8) * 3 = 20 * 3 = 60."
  },

  // Mathematics - Decimals & Percentage
  {
    id: "Q-MTH-006",
    subject: "Mathematics",
    topic: "Decimals",
    question: "Convert 0.375 into a fraction in its simplest form.",
    optionA: "3/8",
    optionB: "3/4",
    optionC: "7/16",
    optionD: "5/8",
    correctAnswer: "A",
    marks: 5,
    difficulty: "Medium",
    explanation: "0.375 = 375/1000. Divide numerator and denominator by 125 to get 3/8."
  },
  {
    id: "Q-MTH-007",
    subject: "Mathematics",
    topic: "Percentage",
    question: "A student scored 68 out of 80 in a test. Calculate the percentage score.",
    optionA: "75%",
    optionB: "80%",
    optionC: "85%",
    optionD: "90%",
    correctAnswer: "C",
    marks: 5,
    difficulty: "Easy",
    explanation: "(68 / 80) * 100% = 0.85 * 100% = 85%."
  },

  // English Language - Grammar & Vocabulary
  {
    id: "Q-ENG-001",
    subject: "English Language",
    topic: "Grammar",
    question: "Identify the correct sentence:",
    optionA: "Neither of the boys were present.",
    optionB: "Neither of the boys was present.",
    optionC: "Neither of the boys are present.",
    optionD: "Neither of the boys have present.",
    correctAnswer: "B",
    marks: 5,
    difficulty: "Medium",
    explanation: "'Neither' takes a singular verb ('was')."
  },
  {
    id: "Q-ENG-002",
    subject: "English Language",
    topic: "Vocabulary",
    question: "Choose the word nearest in meaning to OPTIMISTIC:",
    optionA: "Hopeful",
    optionB: "Pessimistic",
    optionC: "Skeptical",
    optionD: "Reluctant",
    correctAnswer: "A",
    marks: 5,
    difficulty: "Easy",
    explanation: "Optimistic means expecting good outcomes, synonymous with hopeful."
  },

  // Basic Science
  {
    id: "Q-SCI-001",
    subject: "Basic Science",
    topic: "Energy & Work",
    question: "What is the S.I. unit of Power?",
    optionA: "Joule",
    optionB: "Newton",
    optionC: "Watt",
    optionD: "Pascal",
    correctAnswer: "C",
    marks: 5,
    difficulty: "Easy",
    explanation: "Power is rate of doing work (Joules/sec), measured in Watts."
  },
  {
    id: "Q-SCI-002",
    subject: "Basic Science",
    topic: "Solar System",
    question: "Which planet in our solar system is known as the Red Planet?",
    optionA: "Venus",
    optionB: "Mars",
    optionC: "Jupiter",
    optionD: "Saturn",
    correctAnswer: "B",
    marks: 5,
    difficulty: "Easy",
    explanation: "Mars appears red due to iron oxide (rust) on its surface."
  }
];

export const INITIAL_ASSESSMENTS = [
  {
    id: "ASM-2026-001",
    title: "SS3 Mathematics Mid-Term Exam",
    type: "Examination",
    subject: "Mathematics",
    targetClass: "SS 3 Alpha",
    startDate: "2026-07-01T08:00",
    dueDate: "2026-08-30T23:59",
    durationMinutes: 30,
    totalMarks: 35,
    maxAttempts: 2,
    randomizeQuestions: true,
    randomizeOptions: true,
    showResultsImmediately: true,
    allowAnswerReview: true,
    status: "active",
    questionIds: ["Q-MTH-001", "Q-MTH-002", "Q-MTH-003", "Q-MTH-004", "Q-MTH-005", "Q-MTH-006", "Q-MTH-007"]
  },
  {
    id: "ASM-2026-002",
    title: "English Grammar & Vocab Quiz",
    type: "Quiz",
    subject: "English Language",
    targetClass: "SS 3 Alpha",
    startDate: "2026-07-10T08:00",
    dueDate: "2026-08-15T23:59",
    durationMinutes: 15,
    totalMarks: 10,
    maxAttempts: 1,
    randomizeQuestions: false,
    randomizeOptions: false,
    showResultsImmediately: true,
    allowAnswerReview: true,
    status: "active",
    questionIds: ["Q-ENG-001", "Q-ENG-002"]
  },
  {
    id: "ASM-2026-003",
    title: "Basic Science Comprehensive Test",
    type: "Test",
    subject: "Basic Science",
    targetClass: "SS 3 Beta",
    startDate: "2026-07-20T08:00",
    dueDate: "2026-08-25T23:59",
    durationMinutes: 20,
    totalMarks: 10,
    maxAttempts: 3,
    randomizeQuestions: true,
    randomizeOptions: true,
    showResultsImmediately: true,
    allowAnswerReview: true,
    status: "active",
    questionIds: ["Q-SCI-001", "Q-SCI-002"]
  }
];

export const INITIAL_ATTEMPTS = [
  {
    id: "ATT-1001",
    assessmentId: "ASM-2026-001",
    assessmentTitle: "SS3 Mathematics Mid-Term Exam",
    studentId: "STU-2026-001",
    studentName: "Amina Yusuf",
    attemptNumber: 1,
    score: 20,
    totalPossible: 35,
    percentage: 57.1,
    grade: "C",
    timeSpentSeconds: 1140,
    submittedAt: "2026-07-15T10:30:00",
    answers: {
      "Q-MTH-001": { selected: "B", correct: true, marks: 5, topic: "Algebra" },
      "Q-MTH-002": { selected: "A", correct: false, marks: 0, topic: "Algebra" },
      "Q-MTH-003": { selected: "A", correct: false, marks: 0, topic: "Algebra" },
      "Q-MTH-004": { selected: "B", correct: true, marks: 5, topic: "Fractions" },
      "Q-MTH-005": { selected: "C", correct: true, marks: 5, topic: "Fractions" },
      "Q-MTH-006": { selected: "A", correct: true, marks: 5, topic: "Decimals" },
      "Q-MTH-007": { selected: "A", correct: false, marks: 0, topic: "Percentage" }
    }
  },
  {
    id: "ATT-1002",
    assessmentId: "ASM-2026-001",
    assessmentTitle: "SS3 Mathematics Mid-Term Exam",
    studentId: "STU-2026-001",
    studentName: "Amina Yusuf",
    attemptNumber: 2,
    score: 30,
    totalPossible: 35,
    percentage: 85.7,
    grade: "A",
    timeSpentSeconds: 980,
    submittedAt: "2026-07-16T14:20:00",
    answers: {
      "Q-MTH-001": { selected: "B", correct: true, marks: 5, topic: "Algebra" },
      "Q-MTH-002": { selected: "B", correct: true, marks: 5, topic: "Algebra" },
      "Q-MTH-003": { selected: "B", correct: true, marks: 5, topic: "Algebra" },
      "Q-MTH-004": { selected: "B", correct: true, marks: 5, topic: "Fractions" },
      "Q-MTH-005": { selected: "C", correct: true, marks: 5, topic: "Fractions" },
      "Q-MTH-006": { selected: "A", correct: true, marks: 5, topic: "Decimals" },
      "Q-MTH-007": { selected: "B", correct: false, marks: 0, topic: "Percentage" }
    }
  },
  {
    id: "ATT-1003",
    assessmentId: "ASM-2026-001",
    assessmentTitle: "SS3 Mathematics Mid-Term Exam",
    studentId: "STU-2026-002",
    studentName: "Emeka Okafor",
    attemptNumber: 1,
    score: 35,
    totalPossible: 35,
    percentage: 100.0,
    grade: "A+",
    timeSpentSeconds: 750,
    submittedAt: "2026-07-18T11:00:00",
    answers: {
      "Q-MTH-001": { selected: "B", correct: true, marks: 5, topic: "Algebra" },
      "Q-MTH-002": { selected: "B", correct: true, marks: 5, topic: "Algebra" },
      "Q-MTH-003": { selected: "B", correct: true, marks: 5, topic: "Algebra" },
      "Q-MTH-004": { selected: "B", correct: true, marks: 5, topic: "Fractions" },
      "Q-MTH-005": { selected: "C", correct: true, marks: 5, topic: "Fractions" },
      "Q-MTH-006": { selected: "A", correct: true, marks: 5, topic: "Decimals" },
      "Q-MTH-007": { selected: "C", correct: true, marks: 5, topic: "Percentage" }
    }
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: "NOTIF-001",
    title: "New Assessment Available",
    message: "SS3 Mathematics Mid-Term Exam is now open for submissions.",
    type: "info",
    date: "2026-07-28T09:00",
    read: false
  },
  {
    id: "NOTIF-002",
    title: "Result Released",
    message: "Your results for English Grammar & Vocab Quiz have been published.",
    type: "success",
    date: "2026-07-29T14:30",
    read: false
  }
];

export const INITIAL_SETTINGS = {
  schoolName: "Noble Borg International Academy",
  session: "2025/2026 Academic Session",
  term: "Third Term",
  passPercentage: 50,
  allowStudentThemeChange: true,
  sisAutoSyncEnabled: true,
  singleSessionEnforcement: true
};
