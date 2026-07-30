import React, { useState } from 'react';
import { X, Upload, FileSpreadsheet, AlertCircle, CheckCircle2, AlertTriangle, Download } from 'lucide-react';
import { parseExcelFile, validateStudentSpreadsheet, validateQuestionSpreadsheet, exportToExcel } from '../../services/excelService';

export const ExcelUploadModal = ({ isOpen, onClose, type = 'students', existingData = [], onImportSuccess }) => {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  if (!isOpen) return null;

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setIsProcessing(true);
    setErrorMsg(null);
    setValidationResult(null);

    try {
      const rawRows = await parseExcelFile(selectedFile);
      if (rawRows.length === 0) {
        throw new Error("The selected file contains no data rows.");
      }

      let res;
      if (type === 'students') {
        res = validateStudentSpreadsheet(rawRows, existingData);
      } else {
        res = validateQuestionSpreadsheet(rawRows);
      }

      setValidationResult(res);
    } catch (err) {
      setErrorMsg(err.message || "Failed to process Excel spreadsheet.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmImport = () => {
    if (!validationResult || validationResult.validCount === 0) return;
    onImportSuccess(validationResult.validRows);
    onClose();
  };

  const handleDownloadTemplate = () => {
    if (type === 'students') {
      const template = [
        { "Student ID": "STU-2026-100", "Student Name": "John Doe", "Class": "SS 3 Alpha" },
        { "Student ID": "STU-2026-101", "Student Name": "Jane Smith", "Class": "SS 3 Beta" }
      ];
      exportToExcel("Student_Import_Template", "Students", template);
    } else {
      const template = [
        {
          "Question": "What is the square root of 64?",
          "Option A": "6",
          "Option B": "8",
          "Option C": "10",
          "Option D": "12",
          "Correct Answer": "B",
          "Subject": "Mathematics",
          "Topic": "Algebra",
          "Marks": 5,
          "Difficulty Level": "Easy",
          "Explanation": "8 * 8 = 64."
        }
      ];
      exportToExcel("Question_Bank_Template", "Questions", template);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '750px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.1rem' }}>
            <FileSpreadsheet className="text-primary-600" size={22} />
            <span>Import {type === 'students' ? 'Students' : 'Question Bank'} Spreadsheet</span>
          </div>
          <button className="icon-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="modal-body">
          {/* Top Info & Template Download */}
          <div style={{
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
            padding: '0.85rem',
            backgroundColor: 'var(--neutral-100)',
            borderRadius: 'var(--radius-md)'
          }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Upload Excel (.xlsx, .xls) or CSV files. Pre-validation automatically checks for duplicates and syntax errors.
            </div>
            <button className="btn btn-secondary btn-sm" onClick={handleDownloadTemplate}>
              <Download size={14} />
              Sample Template
            </button>
          </div>

          {/* File Upload Drop Area */}
          <div style={{
            border: '2px dashed var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem 1rem',
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: 'var(--bg-app)',
            marginBottom: '1.5rem'
          }}>
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              id="spreadsheet-upload-input"
            />
            <label htmlFor="spreadsheet-upload-input" style={{ cursor: 'pointer', display: 'block' }}>
              <Upload size={36} style={{ color: 'var(--primary-600)', marginBottom: '0.5rem' }} />
              <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                {file ? file.name : "Click or drag spreadsheet file here to upload"}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Supports .xlsx, .xls, .csv files up to 10MB
              </div>
            </label>
          </div>

          {/* Processing state */}
          {isProcessing && (
            <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--primary-600)', fontWeight: 600 }}>
              Analyzing and validating spreadsheet rows...
            </div>
          )}

          {/* Fatal Error Message */}
          {errorMsg && (
            <div className="topic-insight-card warning">
              <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={18} />
                <span>Spreadsheet Error</span>
              </div>
              <div style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>{errorMsg}</div>
            </div>
          )}

          {/* Validation Feedback & Summary Cards */}
          {validationResult && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--neutral-100)', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{validationResult.totalParsed}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Rows</div>
                </div>

                <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--success-50)', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--success-700)' }}>{validationResult.validCount}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--success-700)' }}>Valid Rows</div>
                </div>

                <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--danger-50)', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--danger-600)' }}>{validationResult.invalidCount}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--danger-600)' }}>Invalid / Flagged</div>
                </div>
              </div>

              {/* Error Detail Table */}
              {validationResult.errors.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--danger-600)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <AlertTriangle size={16} />
                    <span>Spreadsheet Validation Errors (Flagged Rows Will Be Skipped)</span>
                  </h4>
                  <div className="table-responsive" style={{ maxHeight: '200px' }}>
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Row #</th>
                          <th>Row Details</th>
                          <th>Validation Failure Reasons</th>
                        </tr>
                      </thead>
                      <tbody>
                        {validationResult.errors.map((err, idx) => (
                          <tr key={idx}>
                            <td style={{ fontWeight: 700 }}>Row {err.rowNumber}</td>
                            <td style={{ fontSize: '0.8rem' }}>
                              {err.data ? `${err.data.studentId || ''} - ${err.data.studentName || ''}` : err.questionText}
                            </td>
                            <td>
                              <ul style={{ paddingLeft: '1rem', color: 'var(--danger-600)', fontSize: '0.8rem' }}>
                                {err.reasons.map((r, rIdx) => <li key={rIdx}>{r}</li>)}
                              </ul>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-primary"
            disabled={!validationResult || validationResult.validCount === 0}
            onClick={handleConfirmImport}
          >
            <CheckCircle2 size={16} />
            Import {validationResult?.validCount || 0} Valid Records
          </button>
        </div>
      </div>
    </div>
  );
};
