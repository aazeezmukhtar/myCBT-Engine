import React from 'react';
import { Users, FileQuestion, BookOpen, Award, ArrowUpRight, Plus, Upload, BarChart2, Activity } from 'lucide-react';
import { getAdminAnalytics } from '../../services/analyticsService';

export const AdminDashboard = ({ students, questions, assessments, attempts, onNavigate }) => {
  const analytics = getAdminAnalytics(students, assessments, attempts, questions);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Welcome Banner */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, #4f46e5, #0891b2)',
        color: '#ffffff',
        border: 'none',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h2 style={{ fontSize: '1.5rem', color: '#ffffff', marginBottom: '0.5rem' }}>
            Administrator Command Center
          </h2>
          <p style={{ opacity: 0.9, maxWidth: '600px', fontSize: '0.925rem' }}>
            Welcome back! Monitor school-wide exam participation, student subject mastery, item distractor metrics, and generate official academic reports.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
            <button className="btn btn-secondary" onClick={() => onNavigate('students')}>
              <Upload size={16} />
              Import Student Roster
            </button>
            <button className="btn btn-secondary" onClick={() => onNavigate('questions')}>
              <Plus size={16} />
              Add Questions
            </button>
            <button className="btn btn-secondary" onClick={() => onNavigate('assessments')}>
              <BookOpen size={16} />
              Create Assessment
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon primary"><Users size={24} /></div>
          <div>
            <div className="stat-val">{analytics.totalStudents}</div>
            <div className="stat-lbl">Enrolled Students ({analytics.activeStudents} Active)</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon secondary"><FileQuestion size={24} /></div>
          <div>
            <div className="stat-val">{analytics.totalQuestions || questions.length}</div>
            <div className="stat-lbl">Question Bank Items</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon warning"><BookOpen size={24} /></div>
          <div>
            <div className="stat-val">{analytics.totalAssessments}</div>
            <div className="stat-lbl">Active & Scheduled Exams</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon success"><Award size={24} /></div>
          <div>
            <div className="stat-val">{analytics.schoolAverage}%</div>
            <div className="stat-lbl">School-Wide Score Average</div>
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* At Risk Alert List */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title" style={{ color: 'var(--danger-600)' }}>
              <Activity size={18} />
              <span>Students Needing Academic Support</span>
            </h3>
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('analytics')}>
              View Analytics
            </button>
          </div>

          {analytics.atRiskStudents.length === 0 ? (
            <div style={{ padding: '1.5rem 0', color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center' }}>
              All students currently maintain a 50%+ passing average score!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {analytics.atRiskStudents.map(student => (
                <div
                  key={student.studentId}
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'space-between',
                    backgroundColor: 'var(--danger-50)'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{student.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      ID: {student.studentId} | Class: {student.class}
                    </div>
                  </div>
                  <span className="badge badge-danger">Avg: {student.averagePercentage}%</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Performers Leaderboard */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title" style={{ color: 'var(--success-700)' }}>
              <Award size={18} />
              <span>Top Academic Performers</span>
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {analytics.topStudents.map((student, idx) => (
              <div
                key={student.studentId}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'space-between',
                  backgroundColor: 'var(--bg-card)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: idx === 0 ? '#f59e0b' : idx === 1 ? '#94a3b8' : '#b45309',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center'
                  }}>
                    {idx + 1}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{student.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Class: {student.class}</div>
                  </div>
                </div>

                <span className="badge badge-success">{student.averagePercentage}% Avg</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
