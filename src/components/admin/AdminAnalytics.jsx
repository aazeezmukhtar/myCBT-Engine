import React, { useState } from 'react';
import { BarChart3, Users, Award, AlertCircle, HelpCircle, FileSpreadsheet, CheckCircle2 } from 'lucide-react';
import { getAdminAnalytics } from '../../services/analyticsService';
import { generateItemAnalysisPdf } from '../../services/pdfService';
import { exportToExcel } from '../../services/excelService';

export const AdminAnalytics = ({ students, assessments, attempts, questions }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const analytics = getAdminAnalytics(students, assessments, attempts, questions);

  const handleExportItemAnalysisExcel = () => {
    exportToExcel("Question_Item_Analysis_Report", "Item Analysis", analytics.questionItemAnalysis);
  };

  const handleExportItemAnalysisPdf = () => {
    generateItemAnalysisPdf(analytics.questionItemAnalysis);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="card-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>School-Wide Learning Analytics & Item Analysis</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Comprehensive performance insights, topic heatmaps, distractor analysis, and at-risk student monitoring.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-bar">
        <div
          className={`tab-item ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Performance Overview
        </div>
        <div
          className={`tab-item ${activeTab === 'item-analysis' ? 'active' : ''}`}
          onClick={() => setActiveTab('item-analysis')}
        >
          Question Item & Distractor Analysis
        </div>
        <div
          className={`tab-item ${activeTab === 'at-risk' ? 'active' : ''}`}
          onClick={() => setActiveTab('at-risk')}
        >
          Students Needing Support ({analytics.atRiskStudents.length})
        </div>
      </div>

      {/* Tab Content: Performance Overview */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="stat-grid">
            <div className="stat-card">
              <div className="stat-icon primary"><BarChart3 size={24} /></div>
              <div>
                <div className="stat-val">{analytics.schoolAverage}%</div>
                <div className="stat-lbl">School Average Score</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon success"><Award size={24} /></div>
              <div>
                <div className="stat-val">{analytics.overallPassRate}%</div>
                <div className="stat-lbl">Overall Pass Rate</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon secondary"><Users size={24} /></div>
              <div>
                <div className="stat-val">{analytics.totalAttemptsCount}</div>
                <div className="stat-lbl">Total Exam Attempts Logged</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon danger"><AlertCircle size={24} /></div>
              <div>
                <div className="stat-val">{analytics.atRiskStudents.length}</div>
                <div className="stat-lbl">At-Risk Students (&lt; 50% Avg)</div>
              </div>
            </div>
          </div>

          {/* Top Students Leaderboard */}
          <div className="card">
            <h3 className="card-title" style={{ marginBottom: '1rem' }}>
              <Award className="text-success-600" size={20} />
              <span>Top Academic Leaders Across All Examinations</span>
            </h3>

            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Student ID</th>
                    <th>Student Name</th>
                    <th>Class</th>
                    <th>Assessments Taken</th>
                    <th>Average Score</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.topStudents.map((s, idx) => (
                    <tr key={s.studentId}>
                      <td style={{ fontWeight: 800 }}>#{idx + 1}</td>
                      <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>{s.studentId}</td>
                      <td style={{ fontWeight: 600 }}>{s.name}</td>
                      <td>{s.class}</td>
                      <td>{s.assessmentsTaken}</td>
                      <td>
                        <span className="badge badge-success" style={{ fontSize: '0.85rem' }}>
                          {s.averagePercentage}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Question Item Analysis */}
      {activeTab === 'item-analysis' && (
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Item Analysis & Distractor Identification</h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                Identifies difficult questions and common wrong answer distractors chosen by students.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-secondary btn-sm" onClick={handleExportItemAnalysisExcel}>
                Export Excel
              </button>
              <button className="btn btn-primary btn-sm" onClick={handleExportItemAnalysisPdf}>
                Export PDF
              </button>
            </div>
          </div>

          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Question ID</th>
                  <th>Question Text</th>
                  <th>Subject & Topic</th>
                  <th>Difficulty</th>
                  <th>Attempts</th>
                  <th>Correct %</th>
                  <th>Wrong %</th>
                  <th>Most Selected Distractor</th>
                </tr>
              </thead>
              <tbody>
                {analytics.questionItemAnalysis.map(q => (
                  <tr key={q.questionId}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>{q.questionId}</td>
                    <td style={{ maxWidth: '240px', fontSize: '0.825rem' }}>{q.questionText}</td>
                    <td>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{q.subject}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{q.topic}</div>
                    </td>
                    <td><span className="badge badge-warning">{q.difficulty}</span></td>
                    <td style={{ fontWeight: 700 }}>{q.attemptsCount}</td>
                    <td style={{ color: 'var(--success-700)', fontWeight: 700 }}>{q.correctPercentage}%</td>
                    <td style={{ color: 'var(--danger-600)', fontWeight: 700 }}>{q.wrongPercentage}%</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--warning-600)', fontWeight: 600 }}>
                      {q.mostSelectedWrong}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content: At-Risk Students */}
      {activeTab === 'at-risk' && (
        <div className="card">
          <h3 className="card-title" style={{ color: 'var(--danger-600)', marginBottom: '1rem' }}>
            <AlertCircle size={20} />
            <span>Students Requiring Targeted Remedial Assistance (&lt; 50% Average)</span>
          </h3>

          {analytics.atRiskStudents.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No students are currently flagged as at-risk. Great job!
            </div>
          ) : (
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Student Name</th>
                    <th>Class</th>
                    <th>Taken Exams</th>
                    <th>Averaged Percentage</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.atRiskStudents.map(s => (
                    <tr key={s.studentId}>
                      <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>{s.studentId}</td>
                      <td style={{ fontWeight: 600 }}>{s.name}</td>
                      <td>{s.class}</td>
                      <td>{s.assessmentsTaken}</td>
                      <td><span className="badge badge-danger" style={{ fontSize: '0.85rem' }}>{s.averagePercentage}%</span></td>
                      <td><span className="badge badge-warning">Remediation Needed</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
