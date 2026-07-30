import React from 'react';
import { Award, Clock, CheckCircle2, XCircle, ArrowLeft, RefreshCw, HelpCircle } from 'lucide-react';
import { calculateAveragedScoresPerAssessment } from '../../services/analyticsService';

export const ResultScreen = ({ attempt, allAttempts, questions, onBackToDashboard }) => {
  const studentAttempts = allAttempts.filter(a => a.studentId === attempt.studentId && a.assessmentId === attempt.assessmentId);
  const group = calculateAveragedScoresPerAssessment(studentAttempts, attempt.studentId)[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
      {/* Result Card Header */}
      <div className="card" style={{
        background: attempt.percentage >= 50
          ? 'linear-gradient(135deg, #15803d, #047857)'
          : 'linear-gradient(135deg, #b91c1c, #991b1b)',
        color: '#ffffff',
        border: 'none',
        textAlign: 'center',
        padding: '2.5rem 1.5rem'
      }}>
        <Award size={48} style={{ margin: '0 auto 0.75rem' }} />
        <h2 style={{ fontSize: '1.8rem', color: '#ffffff', marginBottom: '0.25rem' }}>
          {attempt.percentage >= 50 ? 'Assessment Completed Successfully!' : 'Assessment Completed'}
        </h2>
        <p style={{ opacity: 0.9, fontSize: '0.95rem' }}>{attempt.assessmentTitle}</p>

        <div style={{
          fontSize: '3rem',
          fontWeight: 800,
          margin: '1rem 0 0.5rem',
          lineHeight: 1
        }}>
          {attempt.percentage}%
        </div>
        <div style={{ fontSize: '1rem', fontWeight: 600 }}>Grade: {attempt.grade}</div>
      </div>

      {/* Attempt Summary Grid */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon primary"><Award size={24} /></div>
          <div>
            <div className="stat-val">{attempt.score} / {attempt.totalPossible}</div>
            <div className="stat-lbl">Raw Score</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon success"><CheckCircle2 size={24} /></div>
          <div>
            <div className="stat-val">{group ? `${group.averagePercentage}%` : `${attempt.percentage}%`}</div>
            <div className="stat-lbl">Averaged Score Across Attempts</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon warning"><Clock size={24} /></div>
          <div>
            <div className="stat-val">{Math.round(attempt.timeSpentSeconds / 60)} Mins</div>
            <div className="stat-lbl">Time Spent</div>
          </div>
        </div>
      </div>

      {/* Answer Review Section */}
      <div className="card">
        <h3 className="card-title" style={{ marginBottom: '1.25rem' }}>
          <HelpCircle className="text-primary-600" size={20} />
          <span>Question-by-Question Review</span>
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {Object.entries(attempt.answers || {}).map(([qId, ans], idx) => {
            const q = questions.find(item => item.id === qId);
            return (
              <div
                key={qId}
                style={{
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${ans.correct ? 'var(--success-500)' : 'var(--danger-500)'}`,
                  backgroundColor: ans.correct ? 'var(--success-50)' : 'var(--danger-50)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {ans.correct ? <CheckCircle2 className="text-success-600" size={18} /> : <XCircle className="text-danger-500" size={18} />}
                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Question {idx + 1}</span>
                    <span className="badge badge-info">{ans.topic || 'General'}</span>
                  </div>
                  <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{ans.marks} Marks</span>
                </div>

                <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.75rem' }}>
                  {q ? q.question : 'Question text'}
                </div>

                <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', color: 'var(--text-main)' }}>
                  <div><strong>Your Choice:</strong> {ans.selected ? `Option ${ans.selected}` : 'No Choice'}</div>
                  <div><strong>Correct Choice:</strong> Option {ans.correctOption}</div>
                  {ans.explanation && (
                    <div style={{ marginTop: '0.5rem', padding: '0.5rem', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-sm)' }}>
                      <strong>Solution Explanation:</strong> {ans.explanation}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <button className="btn btn-primary" onClick={onBackToDashboard}>
          <ArrowLeft size={16} /> Return to Dashboard
        </button>
      </div>
    </div>
  );
};
