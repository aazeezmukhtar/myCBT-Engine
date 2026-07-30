import React from 'react';
import { Award, BookOpen, AlertCircle, CheckCircle2, TrendingUp, Sparkles, Brain } from 'lucide-react';
import { getStudentAnalytics } from '../../services/analyticsService';

export const StudentAnalytics = ({ student, attempts, assessments, questions }) => {
  const analytics = getStudentAnalytics(student.id, attempts, assessments, questions);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner */}
      <div className="card-header">
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Personalized Learning Analytics & Topic Mastery</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Track subject averages, pinpoint sub-topic strengths and weaknesses, and review AI personalized recommendations.
          </p>
        </div>
      </div>

      {/* Automated Personalized Feedback Box */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, #4338ca, #3b82f6)',
        color: '#ffffff',
        border: 'none'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Sparkles size={22} className="text-warning-500" />
          <h3 style={{ fontSize: '1.2rem', color: '#ffffff', fontWeight: 700 }}>
            Personalized Academic Insights & Action Plan
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {analytics.insights.map((insight, idx) => (
            <div
              key={idx}
              style={{
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(6px)',
                fontSize: '0.9rem',
                lineHeight: 1.4
              }}
            >
              {insight}
            </div>
          ))}
        </div>
      </div>

      {/* Overall Performance Cards */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon primary"><Award size={24} /></div>
          <div>
            <div className="stat-val">{analytics.overallAverage}%</div>
            <div className="stat-lbl">Overall Recorded Average</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon success"><TrendingUp size={24} /></div>
          <div>
            <div className="stat-val">{analytics.highestScore}%</div>
            <div className="stat-lbl">Highest Exam Score</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon warning"><AlertCircle size={24} /></div>
          <div>
            <div className="stat-val">{analytics.lowestScore}%</div>
            <div className="stat-lbl">Lowest Exam Score</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon secondary"><CheckCircle2 size={24} /></div>
          <div>
            <div className="stat-val">{analytics.passRate}%</div>
            <div className="stat-lbl">Pass Rate Percentage</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Subject & Topic Mastery */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Subject Mastery Progress Bars */}
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: '1.25rem' }}>
            <BookOpen className="text-primary-600" size={20} />
            <span>Subject Performance Breakdown</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {analytics.subjectScores.map(subj => (
              <div key={subj.subject}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontWeight: 600, fontSize: '0.9rem' }}>
                  <span>{subj.subject}</span>
                  <span style={{ color: subj.percentage >= 50 ? 'var(--success-700)' : 'var(--danger-600)' }}>
                    {subj.percentage}% Average
                  </span>
                </div>
                <div className="progress-bar-bg">
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${subj.percentage}%`,
                      backgroundColor: subj.percentage >= 75 ? 'var(--success-500)' : subj.percentage >= 50 ? 'var(--primary-500)' : 'var(--danger-500)'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Topic Mastery Detailed Cards */}
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: '1.25rem' }}>
            <Brain className="text-secondary-600" size={20} />
            <span>Topic Mastery & Weak Area Diagnostics</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {analytics.topicScores.map(top => {
              const isWeak = top.percentage < 50;
              const isStrong = top.percentage >= 75;

              return (
                <div
                  key={top.topic}
                  className={`topic-insight-card ${isWeak ? 'warning' : ''}`}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{top.topic}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{top.subject}</div>
                    </div>
                    <span className={`badge ${isWeak ? 'badge-danger' : isStrong ? 'badge-success' : 'badge-info'}`}>
                      {top.percentage}% Mastery
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
