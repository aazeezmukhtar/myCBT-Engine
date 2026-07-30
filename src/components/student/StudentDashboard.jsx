import React from 'react';
import { BookCheck, Award, Clock, ArrowRight, CheckCircle2, History, AlertCircle } from 'lucide-react';
import { getStudentAnalytics, calculateAveragedScoresPerAssessment } from '../../services/analyticsService';

export const StudentDashboard = ({ student, assessments, attempts, questions, onStartExam, onNavigate }) => {
  const analytics = getStudentAnalytics(student.id, attempts, assessments, questions);
  const studentAttempts = attempts.filter(a => a.studentId === student.id);
  const averagedScores = calculateAveragedScoresPerAssessment(studentAttempts, student.id);

  // Available Assessments for student's class
  const availableAssessments = assessments.filter(a => a.status === 'active');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Student Welcome Banner */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, #0f172a, #312e81)',
        color: '#ffffff',
        border: 'none'
      }}>
        <h2 style={{ fontSize: '1.5rem', color: '#ffffff', marginBottom: '0.4rem' }}>
          Welcome back, {student.name}!
        </h2>
        <p style={{ opacity: 0.9, fontSize: '0.9rem' }}>
          Student ID: <strong>{student.id}</strong> | Class: <strong>{student.class}</strong>
        </p>

        {/* Personalized Insight Highlight */}
        {analytics.insights.length > 0 && (
          <div style={{
            marginTop: '1rem',
            padding: '0.85rem 1rem',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 'var(--radius-md)',
            backdropFilter: 'blur(4px)',
            borderLeft: '4px solid #6366f1',
            fontSize: '0.875rem'
          }}>
            {analytics.insights[0]}
          </div>
        )}
      </div>

      {/* Metrics Row */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon primary"><Award size={24} /></div>
          <div>
            <div className="stat-val">{analytics.overallAverage}%</div>
            <div className="stat-lbl">Overall Recorded Average</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon success"><BookCheck size={24} /></div>
          <div>
            <div className="stat-val">{analytics.totalTaken}</div>
            <div className="stat-lbl">Assessments Completed</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon secondary"><CheckCircle2 size={24} /></div>
          <div>
            <div className="stat-val">{analytics.passRate}%</div>
            <div className="stat-lbl">Pass Rate</div>
          </div>
        </div>
      </div>

      {/* Available Assessments Section */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <BookCheck className="text-primary-600" size={20} />
            <span>Available Examinations & Assignments</span>
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          {availableAssessments.map(asm => {
            const asmAttempts = studentAttempts.filter(a => a.assessmentId === asm.id);
            const attemptsUsed = asmAttempts.length;
            const canAttempt = attemptsUsed < asm.maxAttempts || asm.maxAttempts >= 99;

            const group = averagedScores.find(g => g.assessmentId === asm.id);

            return (
              <div key={asm.id} style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-card)',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span className="badge badge-info">{asm.type}</span>
                    <span className="badge badge-warning">
                      {attemptsUsed} / {asm.maxAttempts >= 99 ? '∞' : asm.maxAttempts} Attempts Used
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                    {asm.title}
                  </h4>

                  <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    <div>Subject: <strong>{asm.subject}</strong></div>
                    <div>Duration: <strong>{asm.durationMinutes} Mins</strong> | Questions: <strong>{asm.questionIds?.length}</strong></div>
                    {group && (
                      <div style={{ marginTop: '0.4rem', color: 'var(--primary-600)', fontWeight: 700 }}>
                        Recorded Final Average Score: {group.averagePercentage}%
                      </div>
                    )}
                  </div>
                </div>

                <button
                  className={`btn ${canAttempt ? 'btn-primary' : 'btn-secondary'}`}
                  disabled={!canAttempt}
                  onClick={() => onStartExam(asm)}
                  style={{ width: '100%' }}
                >
                  {attemptsUsed > 0 ? 'Retake Examination' : 'Start Examination'}
                  <ArrowRight size={16} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
