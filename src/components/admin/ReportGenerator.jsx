import React, { useState } from 'react';
import { FileSpreadsheet, Download, FileText, CheckCircle2 } from 'lucide-react';
import { generateStudentResultPdf, generateClassReportPdf, generateItemAnalysisPdf } from '../../services/pdfService';
import { exportToExcel } from '../../services/excelService';
import { getStudentAnalytics, getAdminAnalytics } from '../../services/analyticsService';

export const ReportGenerator = ({ students, assessments, attempts, questions }) => {
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [selectedClass, setSelectedClass] = useState('SS 3 Alpha');
  const [reportType, setReportType] = useState('student-result');

  const classesList = Array.from(new Set(students.map(s => s.class)));
  const adminAnalytics = getAdminAnalytics(students, assessments, attempts, questions);

  const handleGeneratePdf = () => {
    if (reportType === 'student-result') {
      const student = students.find(s => s.id === selectedStudentId);
      if (!student) return;
      const sAnalytics = getStudentAnalytics(student.id, attempts, assessments, questions);
      generateStudentResultPdf(student, attempts.filter(a => a.studentId === student.id), sAnalytics);
    } else if (reportType === 'class-report') {
      const classStudents = students.filter(s => s.class === selectedClass);
      generateClassReportPdf(selectedClass, classStudents, attempts);
    } else if (reportType === 'item-analysis') {
      generateItemAnalysisPdf(adminAnalytics.questionItemAnalysis);
    }
  };

  const handleGenerateExcel = () => {
    if (reportType === 'student-result') {
      const student = students.find(s => s.id === selectedStudentId);
      const sAttempts = attempts.filter(a => a.studentId === selectedStudentId);
      const rows = sAttempts.map(att => ({
        "Student ID": att.studentId,
        "Student Name": att.studentName,
        "Assessment Title": att.assessmentTitle,
        "Attempt Number": att.attemptNumber,
        "Score": att.score,
        "Total Possible": att.totalPossible,
        "Percentage": att.percentage,
        "Grade": att.grade,
        "Date": new Date(att.submittedAt).toLocaleString()
      }));
      exportToExcel(`Student_${selectedStudentId}_Report`, "Attempts", rows);
    } else if (reportType === 'class-report') {
      const classStudents = students.filter(s => s.class === selectedClass);
      const rows = classStudents.map(st => {
        const sAttempts = attempts.filter(a => a.studentId === st.id);
        const avg = sAttempts.length > 0
          ? (sAttempts.reduce((sum, a) => sum + (a.percentage || 0), 0) / sAttempts.length).toFixed(1)
          : "N/A";
        return {
          "Student ID": st.id,
          "Student Name": st.name,
          "Class": st.class,
          "Assessments Taken": sAttempts.length,
          "Average Percentage": avg
        };
      });
      exportToExcel(`Class_${selectedClass.replace(/\s+/g, '_')}_Report`, "Class Summary", rows);
    } else if (reportType === 'item-analysis') {
      exportToExcel("Item_Analysis_Report", "Item Analysis", adminAnalytics.questionItemAnalysis);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card-header">
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Official Report Generator</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Generate executive downloadable reports in PDF and Excel formats.
          </p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: '700px' }}>
        <h3 className="card-title" style={{ marginBottom: '1.25rem' }}>
          <FileText className="text-primary-600" size={20} />
          <span>Configure Report Exports</span>
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">Report Category</label>
            <select className="form-select" value={reportType} onChange={(e) => setReportType(e.target.value)}>
              <option value="student-result">Individual Student Result & Progress Report</option>
              <option value="class-report">Class Summary & Mastery Report</option>
              <option value="item-analysis">Question Item & Distractor Analysis Report</option>
            </select>
          </div>

          {reportType === 'student-result' && (
            <div className="form-group">
              <label className="form-label">Select Student</label>
              <select className="form-select" value={selectedStudentId} onChange={(e) => setSelectedStudentId(e.target.value)}>
                {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.id} - {s.class})</option>)}
              </select>
            </div>
          )}

          {reportType === 'class-report' && (
            <div className="form-group">
              <label className="form-label">Select Target Class</label>
              <select className="form-select" value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
                {classesList.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleGeneratePdf}>
              <Download size={16} />
              Download PDF Report
            </button>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={handleGenerateExcel}>
              <FileSpreadsheet size={16} />
              Export Excel Spreadsheet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
