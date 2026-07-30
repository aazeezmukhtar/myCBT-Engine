import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * PDF Report Generator Service
 */

const addPdfHeader = (doc, title, subtitle) => {
  doc.setFillColor(15, 23, 42); // Navy primary header
  doc.rect(0, 0, 210, 28, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text("Noble Borg International Academy", 14, 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(203, 213, 225);
  doc.text(title.toUpperCase(), 14, 22);

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(subtitle || title, 14, 38);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`Generated Date: ${new Date().toLocaleDateString()} | Platform: EduPulse CBT`, 14, 44);

  doc.setLineWidth(0.5);
  doc.setDrawColor(226, 232, 240);
  doc.line(14, 48, 196, 48);
};

export const generateStudentResultPdf = (student, attempts, analytics) => {
  const doc = new jsPDF();
  addPdfHeader(doc, "Student Official Result Report", `Performance Summary for ${student.name} (${student.id})`);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text("Overall Performance Metrics", 14, 56);

  const summaryData = [
    ["Class", student.class, "Total Assessments Taken", String(analytics.totalTaken)],
    ["Overall Average Score", `${analytics.overallAverage}%`, "Pass Rate", `${analytics.passRate}%`],
    ["Highest Score", `${analytics.highestScore}%`, "Lowest Score", `${analytics.lowestScore}%`]
  ];

  doc.autoTable({
    startY: 60,
    head: [],
    body: summaryData,
    theme: 'plain',
    styles: { fontSize: 9, cellPadding: 2 },
    columnStyles: { 0: { fontStyle: 'bold', width: 40 }, 2: { fontStyle: 'bold', width: 45 } }
  });

  let currentY = doc.lastAutoTable.finalY + 10;

  // Subject Performance Table
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text("Subject Mastery Breakdown", 14, currentY);

  const subjectTableHead = [["Subject", "Attempts Taken", "Average Percentage", "Status"]];
  const subjectTableBody = analytics.subjectScores.map(s => [
    s.subject,
    String(s.attemptsCount),
    `${s.percentage}%`,
    s.percentage >= 50 ? "PASSED" : "NEEDS IMPROVEMENT"
  ]);

  doc.autoTable({
    startY: currentY + 4,
    head: subjectTableHead,
    body: subjectTableBody,
    theme: 'striped',
    headStyles: { fillColor: [79, 70, 229] },
    styles: { fontSize: 9 }
  });

  currentY = doc.lastAutoTable.finalY + 10;

  // Attempt History Table
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text("Completed Attempt Log", 14, currentY);

  const attemptHead = [["Assessment Title", "Attempt #", "Score", "Percentage", "Grade", "Date"]];
  const attemptBody = attempts.map(att => [
    att.assessmentTitle,
    `Attempt ${att.attemptNumber}`,
    `${att.score}/${att.totalPossible}`,
    `${att.percentage}%`,
    att.grade || "N/A",
    new Date(att.submittedAt).toLocaleDateString()
  ]);

  doc.autoTable({
    startY: currentY + 4,
    head: attemptHead,
    body: attemptBody,
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42] },
    styles: { fontSize: 8 }
  });

  doc.save(`${student.name.replace(/\s+/g, '_')}_Result_Report.pdf`);
};

export const generateClassReportPdf = (className, classStudents, attempts) => {
  const doc = new jsPDF();
  addPdfHeader(doc, "Class Performance Report", `Class Roster & Analytics: ${className}`);

  const tableHead = [["Student ID", "Student Name", "Assessments Taken", "Avg Percentage", "Pass Status"]];
  const tableBody = classStudents.map(student => {
    const sAttempts = attempts.filter(a => a.studentId === student.id);
    const avg = sAttempts.length > 0 
      ? (sAttempts.reduce((sum, a) => sum + (a.percentage || 0), 0) / sAttempts.length).toFixed(1)
      : "N/A";

    return [
      student.id,
      student.name,
      String(sAttempts.length),
      avg !== "N/A" ? `${avg}%` : "N/A",
      avg !== "N/A" && parseFloat(avg) >= 50 ? "PASSING" : (avg === "N/A" ? "NO DATA" : "AT RISK")
    ];
  });

  doc.autoTable({
    startY: 55,
    head: tableHead,
    body: tableBody,
    theme: 'striped',
    headStyles: { fillColor: [79, 70, 229] }
  });

  doc.save(`Class_${className.replace(/\s+/g, '_')}_Report.pdf`);
};

export const generateItemAnalysisPdf = (questionItemAnalysis) => {
  const doc = new jsPDF('landscape');
  addPdfHeader(doc, "Question Item Analysis Report", "Statistical Performance & Distractor Analysis");

  const tableHead = [["QID", "Subject", "Topic", "Difficulty", "Attempts", "Correct %", "Wrong %", "Most Common Distractor"]];
  const tableBody = questionItemAnalysis.map(q => [
    q.questionId,
    q.subject,
    q.topic,
    q.difficulty,
    String(q.attemptsCount),
    `${q.correctPercentage}%`,
    `${q.wrongPercentage}%`,
    q.mostSelectedWrong
  ]);

  doc.autoTable({
    startY: 55,
    head: tableHead,
    body: tableBody,
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42] },
    styles: { fontSize: 8 }
  });

  doc.save("Question_Item_Analysis_Report.pdf");
};
