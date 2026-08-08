import React, { useState } from 'react';
import { BookOpen, Plus, Clock, Shuffle, CheckCircle, AlertCircle, Trash2, Edit2, Play, Users } from 'lucide-react';
import { addAssessment, updateAssessment, saveAssessments, getStudents } from '../../services/storageService';

export const AssessmentBuilder = ({ assessments, subjects, questions, onRefresh }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState(null);

  const [students, setStudents] = useState([]);
  const [classOptions, setClassOptions] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    type: 'Examination',
    subject: subjects[0]?.name || 'Mathematics',
    targetClass: '',
    startDate: '2026-07-01T08:00',
    dueDate: '2026-08-30T23:59',
    durationMinutes: 30,
    maxAttempts: 2,
    randomizeQuestions: true,
    randomizeOptions: true,
    showResultsImmediately: true,
    allowAnswerReview: true,
    selectedQuestionIds: []
  });

  const [formError, setFormError] = useState('');

  // Load students and class options on mount
  React.useEffect(() => {
    async function loadStudents() {
      try {
        const data = await getStudents();
        setStudents(data);
        // classOptions will be set by the effect below when students change
      } catch (err) {
        console.error('Failed to load students', err);
      }
    }
    loadStudents();
  }, []);

  // Update class options whenever students list changes
  React.useEffect(() => {
    const classes = Array.from(new Set(students.map(s => s.class))).filter(Boolean);
    setClassOptions(classes);
    // Ensure the selected target class is valid
    if (!classes.includes(formData.targetClass) && classes.length > 0) {
      setFormData(prev => ({ ...prev, targetClass: classes[0] }));
    }
  }, [students]);


  const handleToggleQuestionSelect = (qId) => {
    setFormData(prev => {
      const exists = prev.selectedQuestionIds.includes(qId);
      const updated = exists
        ? prev.selectedQuestionIds.filter(id => id !== qId)
        : [...prev.selectedQuestionIds, qId];
      return { ...prev, selectedQuestionIds: updated };
    });
  };

  const handleSelectAllSubjectQuestions = () => {
    const allIds = subjectQuestions.map(q => q.id);
    setFormData(prev => ({ ...prev, selectedQuestionIds: allIds }));
  };

  const handleSaveAssessment = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.title.trim()) {
      setFormError('Assessment Title is required.');
      return;
    }

    if (formData.selectedQuestionIds.length === 0) {
      setFormError('Please select at least 1 question for this assessment.');
      return;
    }

    // Calculate total marks
    const totalMarks = formData.selectedQuestionIds.reduce((sum, qId) => {
      const q = questions.find(item => item.id === qId);
      return sum + (q ? q.marks : 5);
    }, 0);

    const assessmentPayload = {
      id: editingAssessment ? editingAssessment.id : `ASM-${Date.now()}`,
      ...formData,
      totalMarks,
      durationMinutes: parseInt(formData.durationMinutes) || 20,
      maxAttempts: parseInt(formData.maxAttempts) || 1,
      status: 'active',
      questionIds: formData.selectedQuestionIds
    };

    if (editingAssessment) {
      await updateAssessment(editingAssessment.id, assessmentPayload);
    } else {
      await addAssessment(assessmentPayload);
    }

    setShowModal(false);
    setEditingAssessment(null);
    onRefresh();
  };

  const handleDeleteAssessment = async (id) => {
    if (window.confirm("Are you sure you want to delete this assessment?")) {
      const updated = assessments.filter(a => a.id !== id);
      await saveAssessments(updated);
      onRefresh();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Assessment Management</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Configure examination time limits, randomized option pools, answer review privileges, and attempt limits.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => {
          setEditingAssessment(null);
          setFormData({
            title: '',
            type: 'Examination',
            subject: subjects[0]?.name || 'Mathematics',
            targetClass: 'SS 3 Alpha',
            startDate: '2026-07-01T08:00',
            dueDate: '2026-08-30T23:59',
            durationMinutes: 30,
            maxAttempts: 2,
            randomizeQuestions: true,
            randomizeOptions: true,
            showResultsImmediately: true,
            allowAnswerReview: true,
            selectedQuestionIds: subjectQuestions.map(q => q.id)
          });
          setShowModal(true);
        }}>
          <Plus size={16} />
          Create New Assessment
        </button>
      </div>

      {/* Assessment Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {assessments.map(asm => (
          <div key={asm.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span className="badge badge-info">{asm.type}</span>
                <span className="badge badge-success">{asm.status}</span>
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                {asm.title}
              </h3>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div><strong>Subject:</strong> {asm.subject} ({asm.targetClass})</div>
                <div><strong>Questions:</strong> {asm.questionIds?.length || 0} questions ({asm.totalMarks} Marks)</div>
                <div><strong>Time Limit:</strong> {asm.durationMinutes} Minutes</div>
                <div><strong>Max Attempts Allowed:</strong> {asm.maxAttempts} {asm.maxAttempts === 1 ? 'Attempt' : 'Attempts'}</div>
                <div style={{ fontSize: '0.75rem', marginTop: '0.2rem' }}>
                  <strong>Settings:</strong> {asm.randomizeQuestions ? 'Randomized' : 'Sequential'} | {asm.allowAnswerReview ? 'Review Enabled' : 'No Review'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
              <button
                className="btn btn-secondary btn-sm"
                style={{ flex: 1 }}
                onClick={() => {
                  setEditingAssessment(asm);
                  setFormData({ ...asm, selectedQuestionIds: asm.questionIds || [] });
                  setShowModal(true);
                }}
              >
                <Edit2 size={14} /> Edit Config
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDeleteAssessment(asm.id)}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Assessment Creation / Edit Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '750px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                {editingAssessment ? 'Edit Assessment Configuration' : 'Create New Assessment / Examination'}
              </h3>
            </div>

            <form onSubmit={handleSaveAssessment}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {formError && (
                  <div className="topic-insight-card warning">
                    <AlertCircle size={16} />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Assessment Title</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. SS3 Mathematics Third Term Mid-Term Exam"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">Assessment Type</label>
                    <select
                      className="form-select"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                      <option value="Examination">Examination</option>
                      <option value="Test">Test</option>
                      <option value="Quiz">Quiz</option>
                      <option value="Assignment">Assignment</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Subject</label>
                    <select
                      className="form-select"
                      value={formData.subject}
                      onChange={(e) => {
                        const subj = e.target.value;
                        const matchingQs = questions.filter(q => q.subject === subj);
                        setFormData({
                          ...formData,
                          subject: subj,
                          selectedQuestionIds: matchingQs.map(q => q.id)
                        });
                      }}
                    >
                      {subjects.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Target Class</label>
                    <select
                      className="form-select"
                      value={formData.targetClass}
                      onChange={(e) => setFormData({ ...formData, targetClass: e.target.value })}
                    >
                      {classOptions.map(cls => (
                        <option key={cls} value={cls}>{cls}</option>
                      ))}
                      {classOptions.length === 0 && (
                        <option disabled value="">No classes available</option>
                      )}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">Time Limit (Minutes)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.durationMinutes}
                      onChange={(e) => setFormData({ ...formData, durationMinutes: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Maximum Allowed Attempts</label>
                    <select
                      className="form-select"
                      value={formData.maxAttempts}
                      onChange={(e) => setFormData({ ...formData, maxAttempts: e.target.value })}
                    >
                      <option value={1}>1 Attempt</option>
                      <option value={2}>2 Attempts (Averaged)</option>
                      <option value={3}>3 Attempts (Averaged)</option>
                      <option value={99}>Unlimited Attempts</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Start Date & Time</label>
                    <input
                      type="datetime-local"
                      className="form-input"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>
                </div>

                {/* Toggles & Options */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.75rem',
                  padding: '1rem',
                  backgroundColor: 'var(--neutral-100)',
                  borderRadius: 'var(--radius-md)'
                }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                    <input
                      type="checkbox"
                      checked={formData.randomizeQuestions}
                      onChange={(e) => setFormData({ ...formData, randomizeQuestions: e.target.checked })}
                    />
                    Randomize Questions Order
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                    <input
                      type="checkbox"
                      checked={formData.randomizeOptions}
                      onChange={(e) => setFormData({ ...formData, randomizeOptions: e.target.checked })}
                    />
                    Randomize Answer Options
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                    <input
                      type="checkbox"
                      checked={formData.showResultsImmediately}
                      onChange={(e) => setFormData({ ...formData, showResultsImmediately: e.target.checked })}
                    />
                    Show Results Immediately
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                    <input
                      type="checkbox"
                      checked={formData.allowAnswerReview}
                      onChange={(e) => setFormData({ ...formData, allowAnswerReview: e.target.checked })}
                    />
                    Allow Answer & Solution Review
                  </label>
                </div>

                {/* Question Selection Grid */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>
                      Select Questions ({formData.selectedQuestionIds.length} Selected)
                    </h4>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={handleSelectAllSubjectQuestions}>
                      Select All {subjectQuestions.length} Questions
                    </button>
                  </div>

                  <div className="table-responsive" style={{ maxHeight: '200px' }}>
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th style={{ width: '40px' }}>Select</th>
                          <th>Question</th>
                          <th>Topic</th>
                          <th>Difficulty</th>
                          <th>Marks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subjectQuestions.map(q => {
                          const isSelected = formData.selectedQuestionIds.includes(q.id);
                          return (
                            <tr key={q.id}>
                              <td>
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => handleToggleQuestionSelect(q.id)}
                                />
                              </td>
                              <td style={{ fontSize: '0.85rem' }}>{q.question}</td>
                              <td><span className="badge badge-success">{q.topic}</span></td>
                              <td><span className="badge badge-warning">{q.difficulty}</span></td>
                              <td style={{ fontWeight: 700 }}>{q.marks}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Assessment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
