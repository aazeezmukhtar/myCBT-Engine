import React from 'react';
import { History, Award, CheckCircle2 } from 'lucide-react';
import { calculateAveragedScoresPerAssessment } from '../../services/analyticsService';

export const AttemptHistory = ({ student, attempts }) => {
  const studentAttempts = attempts.filter(a => a.studentId === student.id);
  const averagedScores = calculateAveragedScoresPerAssessment(studentAttempts, student.id);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card-header">
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Complete Examination Attempt History</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Review all prior attempt logs and your final recorded average score per assessment.
          </p>
        </div>
      </div>

      {/* Assessment Average Score Summaries */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {averagedScores.map(group => (
          <div key={group.assessmentId} className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{group.assessmentTitle}</h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Total Attempts Taken: {group.attemptCount}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span className="badge badge-success" style={{ fontSize: '0.9rem', padding: '0.35rem 0.85rem' }}>
                  Recorded Average Score: {group.averagePercentage}%
                </span>
              </div>
            </div>

            {/* Individual Attempt Sub-table */}
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Attempt #</th>
                    <th>Score / Max</th>
                    <th>Percentage</th>
                    <th>Grade</th>
                    <th>Time Spent</th>
                    <th>Submitted Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  {group.allAttempts.map(att => (
                    <tr key={att.id}>
                      <td style={{ fontWeight: 700 }}>Attempt {att.attemptNumber}</td>
                      <td>{att.score} / {att.totalPossible}</td>
                      <td style={{ fontWeight: 700 }}>{att.percentage}%</td>
                      <td><span className="badge badge-info">{att.grade || 'C'}</span></td>
                      <td>{Math.round(att.timeSpentSeconds / 60)} Mins</td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {new Date(att.submittedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
