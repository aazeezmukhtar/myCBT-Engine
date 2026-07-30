import React, { useState } from 'react';
import { Users, Upload, Plus, Search, Edit3, Power, CheckCircle, AlertCircle, Key } from 'lucide-react';
import { ExcelUploadModal } from '../common/ExcelUploadModal';
import { addStudent, updateStudent } from '../../services/storageService';

export const StudentManagement = ({ students, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  // New Student Form State
  const [formData, setFormData] = useState({ id: '', name: '', class: 'SS 3 Alpha', status: 'active' });
  const [formError, setFormError] = useState('');

  // Extract unique classes
  const classesList = Array.from(new Set(students.map(s => s.class)));

  // Filtering
  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = classFilter === 'ALL' || s.class === classFilter;
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    return matchesSearch && matchesClass && matchesStatus;
  });

  const handleSaveManualStudent = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.id.trim() || !formData.name.trim()) {
      setFormError('Student ID and Full Name are required.');
      return;
    }

    if (editingStudent) {
      await updateStudent(editingStudent.id, { name: formData.name, class: formData.class, status: formData.status });
    } else {
      const exists = students.some(s => s.id.toUpperCase() === formData.id.trim().toUpperCase());
      if (exists) {
        setFormError(`Student ID '${formData.id}' already exists.`);
        return;
      }
      await addStudent({
        id: formData.id.trim().toUpperCase(),
        name: formData.name.trim(),
        class: formData.class,
        status: 'active',
        joinedDate: new Date().toISOString().split('T')[0]
      });
    }

    setShowAddModal(false);
    setEditingStudent(null);
    setFormData({ id: '', name: '', class: 'SS 3 Alpha', status: 'active' });
    onRefresh();
  };

  const handleToggleStatus = async (student) => {
    const newStatus = student.status === 'active' ? 'deactivated' : 'active';
    await updateStudent(student.id, { status: newStatus });
    onRefresh();
  };

  const handleImportExcelRows = async (importedRows) => {
    for (const s of importedRows) {
      await addStudent(s);
    }
    onRefresh();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Header Card */}
      <div className="card-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Student Roster Management</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Import rosters from SIS Excel files or manage student credentials and active status.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={() => setShowUploadModal(true)}>
            <Upload size={16} />
            Import Excel Spreadsheet
          </button>
          <button className="btn btn-primary" onClick={() => {
            setEditingStudent(null);
            setFormData({ id: '', name: '', class: 'SS 3 Alpha', status: 'active' });
            setShowAddModal(true);
          }}>
            <Plus size={16} />
            Add Student
          </button>
        </div>
      </div>

      {/* Info Banner on Student ID Login */}
      <div style={{
        padding: '0.85rem 1rem',
        borderRadius: 'var(--radius-md)',
        background: 'var(--primary-50)',
        border: '1px solid var(--primary-200)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        fontSize: '0.85rem',
        color: 'var(--primary-900)'
      }}>
        <Key size={18} className="text-primary-600" />
        <span>
          <strong>Authentication Notice:</strong> A student's <strong>Student ID</strong> serves as their default login credential across all CBT examinations.
        </span>
      </div>

      {/* Filters Bar */}
      <div className="card" style={{ padding: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {/* Search Box */}
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '36px' }}
              placeholder="Search by Student Name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Class Filter */}
          <select className="form-select" value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
            <option value="ALL">All Classes</option>
            {classesList.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Status Filter */}
          <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="ALL">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="deactivated">Deactivated Only</option>
          </select>
        </div>
      </div>

      {/* Table Card */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Student Name</th>
                <th>Class</th>
                <th>Enrolled Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No student records found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredStudents.map(student => (
                  <tr key={student.id}>
                    <td style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--primary-600)' }}>
                      {student.id}
                    </td>
                    <td style={{ fontWeight: 600 }}>{student.name}</td>
                    <td>{student.class}</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {student.joinedDate || '2026-01-10'}
                    </td>
                    <td>
                      <span className={`badge ${student.status === 'active' ? 'badge-success' : 'badge-danger'}`}>
                        {student.status === 'active' ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            setEditingStudent(student);
                            setFormData({ id: student.id, name: student.name, class: student.class, status: student.status });
                            setShowAddModal(true);
                          }}
                          title="Edit Student Details"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          className={`btn btn-sm ${student.status === 'active' ? 'btn-danger' : 'btn-success'}`}
                          onClick={() => handleToggleStatus(student)}
                          title={student.status === 'active' ? 'Deactivate Account' : 'Activate Account'}
                        >
                          <Power size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Excel Upload Modal */}
      <ExcelUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        type="students"
        existingData={students}
        onImportSuccess={handleImportExcelRows}
      />

      {/* Manual Student Add/Edit Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                {editingStudent ? 'Edit Student Record' : 'Add New Student'}
              </h3>
            </div>
            <form onSubmit={handleSaveManualStudent}>
              <div className="modal-body">
                {formError && (
                  <div className="topic-insight-card warning" style={{ marginBottom: '1rem' }}>
                    <AlertCircle size={16} />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Student ID (Login Username)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. STU-2026-010"
                    disabled={!!editingStudent}
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Samuel Jackson"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Class</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. SS 3 Alpha"
                    value={formData.class}
                    onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingStudent ? 'Save Changes' : 'Add Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
