import React, { useState } from 'react';
import {
  FileQuestion, Plus, Upload, Search, Trash2, BookOpen, Tag,
  AlertCircle, ChevronRight, X, Check, Pencil, GraduationCap
} from 'lucide-react';
import { ExcelUploadModal } from '../common/ExcelUploadModal';
import { addQuestionsBatch, saveQuestions, saveSubjects } from '../../services/storageService';

/* ─────────────────────────────────────────────────────────
   Main Component
───────────────────────────────────────────────────────── */
export const QuestionBankManagement = ({ questions, subjects, onRefresh }) => {
  const [activeTab, setActiveTab] = useState('questions'); // 'questions' | 'subjects'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Header */}
      <div className="card-header">
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Question Bank</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Manage subjects, topics, and questions used across all assessments.
          </p>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="tab-bar">
        <button
          className={`tab-item ${activeTab === 'questions' ? 'active' : ''}`}
          onClick={() => setActiveTab('questions')}
        >
          <FileQuestion size={15} style={{ display: 'inline', marginRight: '0.35rem' }} />
          Questions ({questions.length})
        </button>
        <button
          className={`tab-item ${activeTab === 'subjects' ? 'active' : ''}`}
          onClick={() => setActiveTab('subjects')}
        >
          <BookOpen size={15} style={{ display: 'inline', marginRight: '0.35rem' }} />
          Subjects &amp; Topics ({subjects.length})
        </button>
      </div>

      {activeTab === 'questions' && (
        <QuestionsTab questions={questions} subjects={subjects} onRefresh={onRefresh} />
      )}
      {activeTab === 'subjects' && (
        <SubjectsTab subjects={subjects} onRefresh={onRefresh} />
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   SUBJECTS TAB
───────────────────────────────────────────────────────── */
const SubjectsTab = ({ subjects, onRefresh }) => {
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectCode, setNewSubjectCode] = useState('');
  const [subjectError, setSubjectError] = useState('');

  // Per-subject new topic input
  const [topicInputs, setTopicInputs] = useState({}); // { [subjectId]: string }
  const [editingSubjectId, setEditingSubjectId] = useState(null);
  const [editSubjectName, setEditSubjectName] = useState('');

  /* ── Subject CRUD ── */
  const handleAddSubject = async () => {
    setSubjectError('');
    const name = newSubjectName.trim();
    const code = newSubjectCode.trim();

    if (!name) { setSubjectError('Subject name is required.'); return; }
    if (subjects.some(s => s.name.toLowerCase() === name.toLowerCase())) {
      setSubjectError('A subject with that name already exists.');
      return;
    }

    const newSubject = {
      id: `SUB-${Date.now()}`,
      name,
      code: code || name.toUpperCase().slice(0, 6),
      topics: []
    };

    await saveSubjects([...subjects, newSubject]);
    setNewSubjectName('');
    setNewSubjectCode('');
    setShowAddSubjectModal(false);
    onRefresh();
  };

  const handleDeleteSubject = async (subjectId) => {
    if (!window.confirm('Delete this subject and all its topics? Questions already using it will keep their subject label.')) return;
    await saveSubjects(subjects.filter(s => s.id !== subjectId));
    onRefresh();
  };

  const handleRenameSubject = async (subjectId) => {
    const trimmed = editSubjectName.trim();
    if (!trimmed) return;
    if (subjects.some(s => s.name.toLowerCase() === trimmed.toLowerCase() && s.id !== subjectId)) return;
    await saveSubjects(subjects.map(s => s.id === subjectId ? { ...s, name: trimmed } : s));
    setEditingSubjectId(null);
    onRefresh();
  };

  /* ── Topic CRUD ── */
  const handleAddTopic = async (subjectId) => {
    const topicName = (topicInputs[subjectId] || '').trim();
    if (!topicName) return;

    const subject = subjects.find(s => s.id === subjectId);
    if (!subject) return;
    if (subject.topics.map(t => t.toLowerCase()).includes(topicName.toLowerCase())) return;

    await saveSubjects(subjects.map(s =>
      s.id === subjectId ? { ...s, topics: [...s.topics, topicName] } : s
    ));
    setTopicInputs(prev => ({ ...prev, [subjectId]: '' }));
    onRefresh();
  };

  const handleDeleteTopic = async (subjectId, topic) => {
    await saveSubjects(subjects.map(s =>
      s.id === subjectId ? { ...s, topics: s.topics.filter(t => t !== topic) } : s
    ));
    onRefresh();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn btn-primary" onClick={() => setShowAddSubjectModal(true)}>
          <Plus size={16} /> Add New Subject
        </button>
      </div>

      {subjects.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          No subjects yet. Click <strong>Add New Subject</strong> to get started.
        </div>
      )}

      {/* Subject Cards */}
      {subjects.map(subject => (
        <div key={subject.id} className="card">
          {/* Subject Header Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, var(--primary-500), var(--secondary-500))',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <GraduationCap size={20} color="#fff" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                {editingSubjectId === subject.id ? (
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input
                      type="text"
                      className="form-input"
                      value={editSubjectName}
                      onChange={e => setEditSubjectName(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') handleRenameSubject(subject.id); if (e.key === 'Escape') setEditingSubjectId(null); }}
                      autoFocus
                      style={{ maxWidth: '240px' }}
                    />
                    <button className="btn btn-primary btn-sm" onClick={() => handleRenameSubject(subject.id)}><Check size={14} /></button>
                    <button className="btn btn-secondary btn-sm" onClick={() => setEditingSubjectId(null)}><X size={14} /></button>
                  </div>
                ) : (
                  <>
                    <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>{subject.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Code: {subject.code} &nbsp;·&nbsp; {subject.topics.length} topic(s)</div>
                  </>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {editingSubjectId !== subject.id && (
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => { setEditingSubjectId(subject.id); setEditSubjectName(subject.name); }}
                  title="Rename subject"
                >
                  <Pencil size={14} />
                </button>
              )}
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDeleteSubject(subject.id)}
                title="Delete subject"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          {/* Topics List */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem', minHeight: '32px' }}>
            {subject.topics.length === 0 && (
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                No topics yet — add one below.
              </span>
            )}
            {subject.topics.map(topic => (
              <div
                key={topic}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.3rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--primary-50)',
                  border: '1px solid var(--primary-200)',
                  color: 'var(--primary-700)',
                  fontSize: '0.82rem', fontWeight: 600
                }}
              >
                <Tag size={11} />
                {topic}
                <button
                  onClick={() => handleDeleteTopic(subject.id, topic)}
                  style={{ display: 'flex', marginLeft: '0.15rem', color: 'var(--primary-400)', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
                  title="Remove topic"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>

          {/* Add Topic Inline */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              className="form-input"
              placeholder="New topic name (e.g. Algebra)"
              value={topicInputs[subject.id] || ''}
              onChange={e => setTopicInputs(prev => ({ ...prev, [subject.id]: e.target.value }))}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddTopic(subject.id); } }}
              style={{ flex: 1 }}
            />
            <button
              className="btn btn-secondary"
              onClick={() => handleAddTopic(subject.id)}
              disabled={!(topicInputs[subject.id] || '').trim()}
            >
              <Plus size={15} /> Add Topic
            </button>
          </div>
        </div>
      ))}

      {/* Add Subject Modal */}
      {showAddSubjectModal && (
        <div className="modal-backdrop" onClick={() => setShowAddSubjectModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Add New Subject</h3>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {subjectError && (
                <div className="login-error">
                  <AlertCircle size={15} /> {subjectError}
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Subject Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Physics, Chemistry, History"
                  value={newSubjectName}
                  onChange={e => setNewSubjectName(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleAddSubject(); }}
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label className="form-label">Subject Code (optional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. PHY101"
                  value={newSubjectCode}
                  onChange={e => setNewSubjectCode(e.target.value)}
                />
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                  Auto-generated from name if left blank.
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => { setShowAddSubjectModal(false); setSubjectError(''); }}>Cancel</button>
              <button className="btn btn-primary" onClick={handleAddSubject}>Add Subject</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   QUESTIONS TAB
───────────────────────────────────────────────────────── */
const QuestionsTab = ({ questions, subjects, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [selectedTopic, setSelectedTopic] = useState('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({
    subject: subjects[0]?.name || '',
    topic: subjects[0]?.topics[0] || '',
    question: '',
    optionA: '', optionB: '', optionC: '', optionD: '',
    correctAnswer: 'A',
    marks: 5,
    difficulty: 'Medium',
    explanation: ''
  });
  const [formError, setFormError] = useState('');

  const currentSubjectObj = subjects.find(s => s.name === selectedSubject);
  const availableTopics = currentSubjectObj ? currentSubjectObj.topics : [];

  const formSubjectObj = subjects.find(s => s.name === formData.subject);
  const formAvailableTopics = formSubjectObj ? formSubjectObj.topics : [];

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (q.topic || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'ALL' || q.subject === selectedSubject;
    const matchesTopic = selectedTopic === 'ALL' || q.topic === selectedTopic;
    const matchesDifficulty = selectedDifficulty === 'ALL' || q.difficulty === selectedDifficulty;
    return matchesSearch && matchesSubject && matchesTopic && matchesDifficulty;
  });

  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!formData.question.trim() || !formData.optionA.trim() || !formData.optionB.trim()) {
      setFormError('Question text and Options A & B are required.');
      return;
    }
    if (!formData.subject) {
      setFormError('Please select a subject. Add a subject first under the "Subjects & Topics" tab.');
      return;
    }
    await addQuestionsBatch([{ id: `Q-${Date.now()}`, ...formData, marks: parseInt(formData.marks) || 5 }]);
    setShowAddModal(false);
    setFormData({ subject: subjects[0]?.name || '', topic: subjects[0]?.topics[0] || '', question: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: 'A', marks: 5, difficulty: 'Medium', explanation: '' });
    onRefresh();
  };

  const handleDeleteQuestion = async (id) => {
    if (window.confirm('Delete this question from the bank?')) {
      await saveQuestions(questions.filter(q => q.id !== id));
      onRefresh();
    }
  };

  const handleImportExcel = async (validRows) => {
    await addQuestionsBatch(validRows);
    onRefresh();
  };

  return (
    <>
      {/* Controls Row */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button className="btn btn-secondary" onClick={() => setShowUploadModal(true)}>
          <Upload size={16} /> Import Excel
        </button>
        <button
          className="btn btn-primary"
          onClick={() => {
            if (subjects.length === 0) {
              alert('No subjects available. Please add a subject first under the "Subjects & Topics" tab.');
              return;
            }
            setShowAddModal(true);
          }}
        >
          <Plus size={16} /> Add Question
        </button>
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            <input type="text" className="form-input" style={{ paddingLeft: '36px' }} placeholder="Search questions..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <select className="form-select" value={selectedSubject} onChange={e => { setSelectedSubject(e.target.value); setSelectedTopic('ALL'); }}>
            <option value="ALL">All Subjects</option>
            {subjects.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
          </select>
          <select className="form-select" value={selectedTopic} onChange={e => setSelectedTopic(e.target.value)} disabled={selectedSubject === 'ALL'}>
            <option value="ALL">All Topics</option>
            {availableTopics.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select className="form-select" value={selectedDifficulty} onChange={e => setSelectedDifficulty(e.target.value)}>
            <option value="ALL">All Difficulties</option>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>
      </div>

      {/* Summary */}
      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
        Showing {filteredQuestions.length} of {questions.length} questions
      </div>

      {/* Questions List */}
      {filteredQuestions.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          No questions match the current filters.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredQuestions.map((q, idx) => (
            <div key={q.id} className="card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span className="badge badge-info">{q.subject}</span>
                  <span className="badge badge-success">{q.topic}</span>
                  <span className="badge badge-warning">{q.difficulty}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>{q.marks} Marks</span>
                </div>
                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteQuestion(q.id)} title="Delete"><Trash2 size={14} /></button>
              </div>

              <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '1rem' }}>
                {idx + 1}. {q.question}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.5rem', marginBottom: '0.75rem' }}>
                {['A', 'B', 'C', 'D'].map(key => q[`option${key}`] ? (
                  <div key={key} className={`option-item ${q.correctAnswer === key ? 'selected' : ''}`} style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}>
                    <span className="option-key">{key}</span> {q[`option${key}`]}
                  </div>
                ) : null)}
              </div>

              {q.explanation && (
                <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', backgroundColor: 'var(--neutral-100)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
                  <strong>Explanation:</strong> {q.explanation}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Excel Import Modal */}
      <ExcelUploadModal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} type="questions" onImportSuccess={handleImportExcel} />

      {/* Add Question Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '660px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Add New Question</h3>
            </div>
            <form onSubmit={handleSaveQuestion}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {formError && <div className="login-error"><AlertCircle size={15} /> {formError}</div>}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">Subject *</label>
                    <select
                      className="form-select"
                      value={formData.subject}
                      onChange={e => {
                        const subj = subjects.find(s => s.name === e.target.value);
                        setFormData(prev => ({ ...prev, subject: e.target.value, topic: subj?.topics[0] || '' }));
                      }}
                    >
                      {subjects.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Topic</label>
                    {formAvailableTopics.length > 0 ? (
                      <select
                        className="form-select"
                        value={formData.topic}
                        onChange={e => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                      >
                        {formAvailableTopics.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    ) : (
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Enter topic (no topics defined for this subject)"
                        value={formData.topic}
                        onChange={e => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                      />
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Question Text *</label>
                  <textarea className="form-textarea" rows={3} placeholder="Enter the question..." value={formData.question} onChange={e => setFormData(p => ({ ...p, question: e.target.value }))} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  {['A', 'B', 'C', 'D'].map(key => (
                    <div key={key} className="form-group">
                      <label className="form-label">Option {key}{key === 'A' || key === 'B' ? ' *' : ' (optional)'}</label>
                      <input type="text" className="form-input" value={formData[`option${key}`]} onChange={e => setFormData(p => ({ ...p, [`option${key}`]: e.target.value }))} />
                    </div>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">Correct Answer *</label>
                    <select className="form-select" value={formData.correctAnswer} onChange={e => setFormData(p => ({ ...p, correctAnswer: e.target.value }))}>
                      {['A', 'B', 'C', 'D'].map(k => <option key={k} value={k}>Option {k}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Marks</label>
                    <input type="number" className="form-input" min={1} value={formData.marks} onChange={e => setFormData(p => ({ ...p, marks: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Difficulty</label>
                    <select className="form-select" value={formData.difficulty} onChange={e => setFormData(p => ({ ...p, difficulty: e.target.value }))}>
                      <option>Easy</option><option>Medium</option><option>Hard</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Explanation (shown after submission)</label>
                  <input type="text" className="form-input" placeholder="Step-by-step solution..." value={formData.explanation} onChange={e => setFormData(p => ({ ...p, explanation: e.target.value }))} />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Question</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
