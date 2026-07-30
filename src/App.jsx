import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/common/Header';
import { Navigation } from './components/common/Navigation';
import { NotificationCenter } from './components/common/NotificationCenter';
import { LoginScreen } from './components/common/LoginScreen';

// Admin Components
import { AdminDashboard } from './components/admin/AdminDashboard';
import { StudentManagement } from './components/admin/StudentManagement';
import { QuestionBankManagement } from './components/admin/QuestionBankManagement';
import { AssessmentBuilder } from './components/admin/AssessmentBuilder';
import { AdminAnalytics } from './components/admin/AdminAnalytics';
import { ReportGenerator } from './components/admin/ReportGenerator';
import { SystemSettings } from './components/admin/SystemSettings';

// Student Components
import { StudentDashboard } from './components/student/StudentDashboard';
import { ExamEngine } from './components/student/ExamEngine';
import { ResultScreen } from './components/student/ResultScreen';
import { AttemptHistory } from './components/student/AttemptHistory';
import { StudentAnalytics } from './components/student/StudentAnalytics';

// Storage Services
import {
  initStorage,
  getStudents,
  getQuestions,
  getSubjects,
  getAssessments,
  getAttempts,
  getNotifications,
  saveAttempt,
  markNotificationRead
} from './services/storageService';

import './styles/app.css';

const MainAppContent = () => {
  const { user } = useAuth();

  // Platform Data States
  const [students, setStudents] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Navigation & View States
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Active Exam / Result Mode
  const [activeExam, setActiveExam] = useState(null);
  const [lastSubmittedAttempt, setLastSubmittedAttempt] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [dbError, setDbError] = useState(null);

  // Load and refresh data
  const loadPlatformData = async () => {
    try {
      setIsLoading(true);
      setDbError(null);
      await initStorage();
      const [st, qu, su, a_s, at, no] = await Promise.all([
        getStudents(),
        getQuestions(),
        getSubjects(),
        getAssessments(),
        getAttempts(),
        getNotifications()
      ]);
      setStudents(st);
      setQuestions(qu);
      setSubjects(su);
      setAssessments(a_s);
      setAttempts(at);
      setNotifications(no);
    } catch (err) {
      console.error(err);
      setDbError(err.message || 'Failed to load platform data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPlatformData();

    const handleStorageEvent = () => loadPlatformData().catch(console.error);
    window.addEventListener('storage-updated', handleStorageEvent);
    return () => window.removeEventListener('storage-updated', handleStorageEvent);
  }, []);

  // Update default tab based on role
  useEffect(() => {
    if (user?.role === 'admin') {
      setActiveTab('dashboard');
    } else if (user?.role === 'student') {
      setActiveTab('student-dashboard');
    }
  }, [user?.role, user?.id]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: 'var(--bg-main)' }}>
        <div style={{ width: '50px', height: '50px', border: '5px solid var(--primary-200)', borderTopColor: 'var(--primary-600)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <h2 style={{ marginTop: '1.5rem', fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>EduPulse CBT</h2>
        <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>Loading platform data...</p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (dbError) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: 'var(--bg-main)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--danger-600)' }}>Database Error</h2>
        <p style={{ marginTop: '0.5rem', color: 'var(--text-main)' }}>{dbError}</p>
        <button className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={loadPlatformData}>Retry</button>
      </div>
    );
  }

  // Show Login Screen if no authenticated user
  if (!user) {
    return <LoginScreen />;
  }

  // Exam Submit Handler
  const handleSubmitExamAttempt = async (attemptResult) => {
    // Compute attempt number for this student-assessment combo
    const currentAttempts = await getAttempts();
    const prevAttempts = currentAttempts.filter(
      a => a.studentId === attemptResult.studentId && a.assessmentId === attemptResult.assessmentId
    );
    const withAttemptNum = {
      ...attemptResult,
      id: `ATT-${Date.now()}`,
      attemptNumber: prevAttempts.length + 1
    };
    await saveAttempt(withAttemptNum);
    setAttempts(await getAttempts());
    setActiveExam(null);
    setLastSubmittedAttempt(withAttemptNum);
  };

  const currentStudentObj = students.find(s => s.id === user?.id) || {
    id: user?.id || 'STU-2026-001',
    name: user?.name || 'Student',
    class: user?.class || 'SS 3 Alpha'
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  // View Names
  const getViewName = () => {
    if (activeExam) return `CBT Engine — ${activeExam.title}`;
    if (lastSubmittedAttempt) return `Result — ${lastSubmittedAttempt.assessmentTitle}`;
    switch (activeTab) {
      case 'dashboard': return 'Administrator Dashboard';
      case 'students': return 'Student Roster';
      case 'questions': return 'Question Bank';
      case 'assessments': return 'Assessment Management';
      case 'analytics': return 'School Analytics';
      case 'reports': return 'Report Generator';
      case 'settings': return 'System Settings';
      case 'student-dashboard': return 'Student Portal';
      case 'my-assessments': return 'Available Assessments';
      case 'my-attempts': return 'Attempt History';
      case 'my-analytics': return 'Learning Analytics';
      default: return 'EduPulse CBT';
    }
  };

  // Render Full Screen Exam Engine
  if (activeExam) {
    return (
      <ExamEngine
        assessment={activeExam}
        questions={questions}
        student={currentStudentObj}
        onSubmitAttempt={handleSubmitExamAttempt}
        onCancel={() => setActiveExam(null)}
      />
    );
  }

  // Render Full Screen Result Screen
  if (lastSubmittedAttempt) {
    return (
      <div className="page-wrapper" style={{ paddingTop: '2rem' }}>
        <ResultScreen
          attempt={lastSubmittedAttempt}
          allAttempts={attempts}
          questions={questions}
          onBackToDashboard={() => {
            setLastSubmittedAttempt(null);
            if (user?.role === 'student') setActiveTab('student-dashboard');
          }}
        />
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        onCloseMobile={() => setIsSidebarOpen(false)}
      />

      <div className="main-content">
        <Header
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          unreadCount={unreadNotifications}
          currentViewName={getViewName()}
        />

        <main className="page-wrapper">
          {/* Admin Views */}
          {user?.role === 'admin' && (
            <>
              {activeTab === 'dashboard' && (
                <AdminDashboard
                  students={students}
                  questions={questions}
                  assessments={assessments}
                  attempts={attempts}
                  onNavigate={setActiveTab}
                />
              )}
              {activeTab === 'students' && (
                <StudentManagement
                  students={students}
                  onRefresh={loadPlatformData}
                />
              )}
              {activeTab === 'questions' && (
                <QuestionBankManagement
                  questions={questions}
                  subjects={subjects}
                  onRefresh={loadPlatformData}
                />
              )}
              {activeTab === 'assessments' && (
                <AssessmentBuilder
                  assessments={assessments}
                  subjects={subjects}
                  questions={questions}
                  onRefresh={loadPlatformData}
                />
              )}
              {activeTab === 'analytics' && (
                <AdminAnalytics
                  students={students}
                  assessments={assessments}
                  attempts={attempts}
                  questions={questions}
                />
              )}
              {activeTab === 'reports' && (
                <ReportGenerator
                  students={students}
                  assessments={assessments}
                  attempts={attempts}
                  questions={questions}
                />
              )}
              {activeTab === 'settings' && (
                <SystemSettings onRefresh={loadPlatformData} />
              )}
            </>
          )}

          {/* Student Views */}
          {user?.role === 'student' && (
            <>
              {(activeTab === 'student-dashboard' || activeTab === 'my-assessments') && (
                <StudentDashboard
                  student={currentStudentObj}
                  assessments={assessments}
                  attempts={attempts}
                  questions={questions}
                  onStartExam={(asm) => setActiveExam(asm)}
                  onNavigate={setActiveTab}
                />
              )}
              {activeTab === 'my-attempts' && (
                <AttemptHistory
                  student={currentStudentObj}
                  attempts={attempts}
                />
              )}
              {activeTab === 'my-analytics' && (
                <StudentAnalytics
                  student={currentStudentObj}
                  attempts={attempts}
                  assessments={assessments}
                  questions={questions}
                />
              )}
            </>
          )}
        </main>
      </div>

      <NotificationCenter
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkRead={async (id) => {
          await markNotificationRead(id);
          loadPlatformData();
        }}
      />
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainAppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
