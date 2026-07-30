import { supabase, isSupabaseEnabled } from './supabaseClient.js';
import {
  INITIAL_STUDENTS,
  SUBJECTS_AND_TOPICS,
  INITIAL_QUESTIONS,
  INITIAL_ASSESSMENTS,
  INITIAL_ATTEMPTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_SETTINGS
} from './seedData.js';

const STORAGE_KEYS = {
  STUDENTS: 'edupulse_cbt_students',
  SUBJECTS: 'edupulse_cbt_subjects',
  QUESTIONS: 'edupulse_cbt_questions',
  ASSESSMENTS: 'edupulse_cbt_assessments',
  ATTEMPTS: 'edupulse_cbt_attempts',
  NOTIFICATIONS: 'edupulse_cbt_notifications',
  SETTINGS: 'edupulse_cbt_settings',
  LOGS: 'edupulse_cbt_activity_logs'
};

const notifyChange = (key) => {
  window.dispatchEvent(new CustomEvent('storage-updated', { detail: { key } }));
};

const toSnake = str => str.replace(/[A-Z]/g, l => '_' + l.toLowerCase());
const toCamel = str => str.replace(/_([a-z])/g, (m, l) => l.toUpperCase());

const toDb = (obj) => {
  if (Array.isArray(obj)) return obj.map(toDb);
  if (obj && typeof obj === 'object') {
    const newObj = {};
    for (const key in obj) {
      if (key === 'answers' || key === 'options' || key === 'topics') {
        newObj[toSnake(key)] = obj[key]; // Keep arrays/JSONB as is
      } else {
        newObj[toSnake(key)] = Array.isArray(obj[key]) ? obj[key] : (typeof obj[key] === 'object' ? toDb(obj[key]) : obj[key]);
      }
    }
    return newObj;
  }
  return obj;
};

const fromDb = (obj) => {
  if (Array.isArray(obj)) return obj.map(fromDb);
  if (obj && typeof obj === 'object') {
    const newObj = {};
    for (const key in obj) {
      if (key === 'answers' || key === 'options' || key === 'topics') {
        newObj[toCamel(key)] = obj[key]; // Keep arrays/JSONB as is
      } else {
        newObj[toCamel(key)] = Array.isArray(obj[key]) ? obj[key] : (typeof obj[key] === 'object' ? fromDb(obj[key]) : obj[key]);
      }
    }
    return newObj;
  }
  return obj;
};

const getStorageItem = async (key, fallback) => {
  if (isSupabaseEnabled) {
    const table = key.replace('edupulse_cbt_', '');
    const { data, error } = await supabase.from(table).select('*');
    if (error) {
      console.error(`Error reading ${table} from Supabase:`, error);
      return fallback;
    }
    return data && data.length > 0 ? fromDb(data) : fallback;
  } else {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch (err) {
      console.error(`Error reading ${key} from localStorage:`, err);
      return fallback;
    }
  }
};

const setStorageItem = async (key, data) => {
  if (isSupabaseEnabled) {
    const table = key.replace('edupulse_cbt_', '');
    const { error } = await supabase.from(table).upsert(toDb(data));
    if (error) {
      console.error(`Error writing ${table} to Supabase:`, error);
    }
  } else {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      notifyChange(key);
    } catch (err) {
      console.error(`Error writing ${key} to localStorage:`, err);
    }
  }
};

// Initialization
export const initStorage = async () => {
  if (isSupabaseEnabled) {
    const { data: stData } = await supabase.from('settings').select('id').limit(1);
    if (!stData || stData.length === 0) {
      await setStorageItem(STORAGE_KEYS.SUBJECTS, SUBJECTS_AND_TOPICS);
      await setStorageItem(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
      await setStorageItem(STORAGE_KEYS.LOGS, [
        { id: "LOG-001", action: "System Initialized", details: "Default seed data loaded into platform storage.", timestamp: new Date().toISOString(), userName: "System" }
      ]);
    }
  } else {
    if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SUBJECTS)) {
      localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(SUBJECTS_AND_TOPICS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.QUESTIONS)) {
      localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(INITIAL_QUESTIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ASSESSMENTS)) {
      localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(INITIAL_ASSESSMENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ATTEMPTS)) {
      localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(INITIAL_ATTEMPTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.LOGS)) {
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify([
        { id: "LOG-001", action: "System Initialized", details: "Default seed data loaded into platform storage.", timestamp: new Date().toISOString(), user: "System" }
      ]));
    }
  }
};

// Students API
export const getStudents = async () => getStorageItem(STORAGE_KEYS.STUDENTS, isSupabaseEnabled ? [] : INITIAL_STUDENTS);
export const saveStudents = async (students) => setStorageItem(STORAGE_KEYS.STUDENTS, students);
export const addStudent = async (student) => {
  const current = await getStudents();
  const updated = [student, ...current];
  await saveStudents(updated);
  return updated;
};
export const updateStudent = async (id, updatedData) => {
  const current = await getStudents();
  const updated = current.map(s => s.id === id ? { ...s, ...updatedData } : s);
  await saveStudents(updated);
  return updated;
};

// Question Bank API
export const getQuestions = async () => getStorageItem(STORAGE_KEYS.QUESTIONS, isSupabaseEnabled ? [] : INITIAL_QUESTIONS);
export const saveQuestions = async (questions) => setStorageItem(STORAGE_KEYS.QUESTIONS, questions);
export const addQuestionsBatch = async (newQuestions) => {
  const current = await getQuestions();
  const updated = [...newQuestions, ...current];
  await saveQuestions(updated);
  return updated;
};

// Subjects API
export const getSubjects = async () => getStorageItem(STORAGE_KEYS.SUBJECTS, isSupabaseEnabled ? [] : SUBJECTS_AND_TOPICS);
export const saveSubjects = async (subjects) => setStorageItem(STORAGE_KEYS.SUBJECTS, subjects);

// Assessments API
export const getAssessments = async () => getStorageItem(STORAGE_KEYS.ASSESSMENTS, isSupabaseEnabled ? [] : INITIAL_ASSESSMENTS);
export const saveAssessments = async (assessments) => setStorageItem(STORAGE_KEYS.ASSESSMENTS, assessments);
export const addAssessment = async (assessment) => {
  const current = await getAssessments();
  const updated = [assessment, ...current];
  await saveAssessments(updated);
  return updated;
};
export const updateAssessment = async (id, updatedData) => {
  const current = await getAssessments();
  const updated = current.map(a => a.id === id ? { ...a, ...updatedData } : a);
  await saveAssessments(updated);
  return updated;
};

// Attempts API
export const getAttempts = async () => getStorageItem(STORAGE_KEYS.ATTEMPTS, isSupabaseEnabled ? [] : INITIAL_ATTEMPTS);
export const saveAttempt = async (newAttempt) => {
  const current = await getAttempts();
  const updated = [newAttempt, ...current];
  await setStorageItem(STORAGE_KEYS.ATTEMPTS, updated);
  return updated;
};

// Notifications API
export const getNotifications = async () => getStorageItem(STORAGE_KEYS.NOTIFICATIONS, isSupabaseEnabled ? [] : INITIAL_NOTIFICATIONS);
export const markNotificationRead = async (id) => {
  const current = await getNotifications();
  const updated = current.map(n => n.id === id ? { ...n, read: true } : n);
  await setStorageItem(STORAGE_KEYS.NOTIFICATIONS, updated);
  return updated;
};

// Settings API
export const getSettings = async () => {
  const items = await getStorageItem(STORAGE_KEYS.SETTINGS, [INITIAL_SETTINGS]);
  return Array.isArray(items) ? items[0] : items;
};
export const saveSettings = async (settings) => setStorageItem(STORAGE_KEYS.SETTINGS, settings);

// Activity Logs API
export const getActivityLogs = async () => getStorageItem(STORAGE_KEYS.LOGS, []);
export const logActivity = async (action, details, user = "System") => {
  const current = await getActivityLogs();
  const newLog = {
    id: `LOG-${Date.now()}`,
    action,
    details,
    timestamp: new Date().toISOString(),
    userName: user
  };
  await setStorageItem(STORAGE_KEYS.LOGS, [newLog, ...current]);
};

// Reset System Data
export const resetToDefaults = async () => {
  if (isSupabaseEnabled) {
    // Don't reset everything to dummy data in production
    await setStorageItem(STORAGE_KEYS.SUBJECTS, SUBJECTS_AND_TOPICS);
    await setStorageItem(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
    await setStorageItem(STORAGE_KEYS.LOGS, []);
  } else {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(SUBJECTS_AND_TOPICS));
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(INITIAL_QUESTIONS));
    localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(INITIAL_ASSESSMENTS));
    localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(INITIAL_ATTEMPTS));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify([]));
    notifyChange("ALL");
  }
};
