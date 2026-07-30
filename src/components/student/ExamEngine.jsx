import React, { useState, useEffect, useRef } from 'react';
import { Clock, ChevronLeft, ChevronRight, Bookmark, CheckCircle2, AlertTriangle, Menu, X, Save } from 'lucide-react';

export const ExamEngine = ({ assessment, questions, student, onSubmitAttempt, onCancel }) => {
  // Filter questions for this assessment
  const examQuestions = questions.filter(q => assessment.questionIds.includes(q.id));

  // Exam States
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [qId]: optionKey }
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
  const [secondsRemaining, setSecondsRemaining] = useState(assessment.durationMinutes * 60);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showNavDrawer, setShowNavDrawer] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  const startTimeRef = useRef(Date.now());

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinalSubmit(true); // Auto-submit on timeout
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const currentQuestion = examQuestions[currentIndex] || examQuestions[0];

  // Select Option & Trigger Auto-Save
  const handleSelectOption = (optionKey) => {
    if (!currentQuestion) return;

    setUserAnswers(prev => {
      const updated = { ...prev, [currentQuestion.id]: optionKey };
      // Save transient state to sessionStorage
      sessionStorage.setItem(`cbt_progress_${assessment.id}_${student.id}`, JSON.stringify(updated));
      return updated;
    });

    setIsAutoSaving(true);
    setTimeout(() => setIsAutoSaving(false), 500);
  };

  const handleToggleFlag = () => {
    if (!currentQuestion) return;
    setFlaggedQuestions(prev => {
      const copy = new Set(prev);
      if (copy.has(currentQuestion.id)) {
        copy.delete(currentQuestion.id);
      } else {
        copy.add(currentQuestion.id);
      }
      return copy;
    });
  };

  const handleClearOption = () => {
    if (!currentQuestion) return;
    setUserAnswers(prev => {
      const copy = { ...prev };
      delete copy[currentQuestion.id];
      return copy;
    });
  };

  // Format Timer MM:SS
  const formatTime = (totalSec) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleFinalSubmit = (isTimeout = false) => {
    const timeSpentSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);

    let totalScore = 0;
    let totalPossible = 0;
    const answerBreakdown = {};

    examQuestions.forEach(q => {
      const selected = userAnswers[q.id] || null;
      const isCorrect = selected === q.correctAnswer;
      const questionMarks = q.marks || 5;

      totalPossible += questionMarks;
      if (isCorrect) {
        totalScore += questionMarks;
      }

      answerBreakdown[q.id] = {
        selected,
        correct: isCorrect,
        correctOption: q.correctAnswer,
        marks: isCorrect ? questionMarks : 0,
        topic: q.topic,
        explanation: q.explanation
      };
    });

    const percentage = totalPossible > 0 ? parseFloat(((totalScore / totalPossible) * 100).toFixed(1)) : 0;

    let grade = "F";
    if (percentage >= 85) grade = "A+";
    else if (percentage >= 75) grade = "A";
    else if (percentage >= 65) grade = "B";
    else if (percentage >= 50) grade = "C";

    const attemptResult = {
      assessmentId: assessment.id,
      assessmentTitle: assessment.title,
      studentId: student.id,
      studentName: student.name,
      score: totalScore,
      totalPossible,
      percentage,
      grade,
      timeSpentSeconds,
      submittedAt: new Date().toISOString(),
      answers: answerBreakdown
    };

    sessionStorage.removeItem(`cbt_progress_${assessment.id}_${student.id}`);
    onSubmitAttempt(attemptResult, isTimeout);
  };

  const answeredCount = Object.keys(userAnswers).length;
  const flaggedCount = flaggedQuestions.size;
  const totalCount = examQuestions.length;

  return (
    <div className="cbt-container">
      {/* CBT Sticky Header */}
      <div className="cbt-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button className="mobile-menu-btn" onClick={() => setShowNavDrawer(!showNavDrawer)}>
            <Menu size={20} />
          </button>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{assessment.title}</h3>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Candidate: {student.name} ({student.id})
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isAutoSaving && (
            <span style={{ fontSize: '0.75rem', color: 'var(--success-600)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Save size={12} /> Auto-saving...
            </span>
          )}

          <div className={`timer-box ${secondsRemaining < 300 ? 'warning' : ''}`}>
            <Clock size={18} />
            <span>{formatTime(secondsRemaining)}</span>
          </div>

          <button className="btn btn-success btn-sm" onClick={() => setShowSubmitModal(true)}>
            Finish Exam
          </button>
        </div>
      </div>

      {/* CBT Body Layout */}
      <div className="cbt-layout">
        {/* Main Question Card */}
        <div className="question-card">
          <div className="question-meta">
            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary-600)' }}>
              Question {currentIndex + 1} of {totalCount}
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className={`btn btn-sm ${flaggedQuestions.has(currentQuestion?.id) ? 'btn-danger' : 'btn-secondary'}`}
                onClick={handleToggleFlag}
              >
                <Bookmark size={14} />
                {flaggedQuestions.has(currentQuestion?.id) ? 'Flagged for Review' : 'Mark for Review'}
              </button>
            </div>
          </div>

          {currentQuestion && (
            <div>
              <div className="question-text">
                {currentQuestion.question}
              </div>

              <div className="options-list">
                {['A', 'B', 'C', 'D'].map(optKey => {
                  const optionVal = currentQuestion[`option${optKey}`];
                  if (!optionVal) return null;

                  const isSelected = userAnswers[currentQuestion.id] === optKey;

                  return (
                    <div
                      key={optKey}
                      className={`option-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSelectOption(optKey)}
                    >
                      <span className="option-key">{optKey}</span>
                      <span style={{ fontSize: '0.95rem', fontWeight: isSelected ? 600 : 400 }}>
                        {optionVal}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Navigation Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                <button
                  className="btn btn-secondary"
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex(prev => prev - 1)}
                >
                  <ChevronLeft size={16} /> Previous
                </button>

                <button className="btn btn-secondary btn-sm" onClick={handleClearOption}>
                  Clear Choice
                </button>

                {currentIndex < totalCount - 1 ? (
                  <button className="btn btn-primary" onClick={() => setCurrentIndex(prev => prev + 1)}>
                    Next <ChevronRight size={16} />
                  </button>
                ) : (
                  <button className="btn btn-success" onClick={() => setShowSubmitModal(true)}>
                    Submit Exam
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Question Navigation Drawer Panel */}
        <div className="card" style={{ height: 'fit-content' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>
            Question Navigator
          </h4>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.75rem', flexWrap: 'wrap' }}>
            <span className="badge badge-success">Answered: {answeredCount}</span>
            <span className="badge badge-warning">Flagged: {flaggedCount}</span>
            <span className="badge badge-info">Unanswered: {totalCount - answeredCount}</span>
          </div>

          <div className="nav-grid">
            {examQuestions.map((q, idx) => {
              const isAnswered = !!userAnswers[q.id];
              const isFlagged = flaggedQuestions.has(q.id);
              const isCurrent = idx === currentIndex;

              let btnClass = '';
              if (isCurrent) btnClass += ' active';
              if (isFlagged) btnClass += ' flagged';
              else if (isAnswered) btnClass += ' answered';

              return (
                <button
                  key={q.id}
                  className={`nav-num-btn ${btnClass}`}
                  onClick={() => setCurrentIndex(idx)}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Submission Confirmation Modal */}
      {showSubmitModal && (
        <div className="modal-backdrop" onClick={() => setShowSubmitModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Confirm Exam Submission</h3>
            </div>
            <div className="modal-body">
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <CheckCircle2 size={48} className="text-success-600" style={{ margin: '0 auto 0.75rem' }} />
                <h4>Are you ready to submit your answers?</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Once submitted, your responses will be processed and logged.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', textAlign: 'center', padding: '1rem', backgroundColor: 'var(--neutral-100)', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--success-600)' }}>{answeredCount}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Answered</div>
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--warning-600)' }}>{flaggedCount}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Flagged</div>
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--danger-500)' }}>{totalCount - answeredCount}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Unanswered</div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowSubmitModal(false)}>
                Return to Questions
              </button>
              <button className="btn btn-success" onClick={() => handleFinalSubmit(false)}>
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
