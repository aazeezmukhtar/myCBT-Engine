import * as XLSX from 'xlsx';

/**
 * Excel Pre-Validation & Import / Export Utilities
 */

// Parse Excel file buffer into raw JSON rows
export const parseExcelFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
        resolve(jsonData);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

// Validate Student Spreadsheet Upload
export const validateStudentSpreadsheet = (rawRows, existingStudents = []) => {
  const errors = [];
  const validRows = [];
  const existingIds = new Set(existingStudents.map(s => String(s.id).trim().toUpperCase()));
  const seenUploadIds = new Set();

  rawRows.forEach((row, index) => {
    const rowNum = index + 2; // Row number in Excel (header is row 1)
    const studentId = String(row["Student ID"] || row["student_id"] || row["ID"] || "").trim();
    const studentName = String(row["Student Name"] || row["student_name"] || row["Name"] || "").trim();
    const studentClass = String(row["Class"] || row["class"] || row["Grade"] || "").trim();

    const rowErrors = [];

    if (!studentId) {
      rowErrors.push("Missing Student ID");
    } else if (seenUploadIds.has(studentId.toUpperCase())) {
      rowErrors.push(`Duplicate Student ID '${studentId}' in upload file`);
    } else if (existingIds.has(studentId.toUpperCase())) {
      rowErrors.push(`Student ID '${studentId}' already exists in database`);
    }

    if (!studentName) {
      rowErrors.push("Missing Student Name");
    }

    if (!studentClass) {
      rowErrors.push("Missing Class");
    }

    if (rowErrors.length > 0) {
      errors.push({
        rowNumber: rowNum,
        data: { studentId, studentName, studentClass },
        reasons: rowErrors
      });
    } else {
      seenUploadIds.add(studentId.toUpperCase());
      validRows.push({
        id: studentId,
        name: studentName,
        class: studentClass,
        status: "active",
        joinedDate: new Date().toISOString().split("T")[0]
      });
    }
  });

  return {
    isValid: errors.length === 0,
    totalParsed: rawRows.length,
    validCount: validRows.length,
    invalidCount: errors.length,
    validRows,
    errors
  };
};

// Validate Question Spreadsheet Upload
export const validateQuestionSpreadsheet = (rawRows) => {
  const errors = [];
  const validRows = [];

  rawRows.forEach((row, index) => {
    const rowNum = index + 2;
    const questionText = String(row["Question"] || "").trim();
    const optionA = String(row["Option A"] || row["OptionA"] || "").trim();
    const optionB = String(row["Option B"] || row["OptionB"] || "").trim();
    const optionC = String(row["Option C"] || row["OptionC"] || "").trim();
    const optionD = String(row["Option D"] || row["OptionD"] || "").trim();
    const correctAnswer = String(row["Correct Answer"] || row["CorrectAnswer"] || "").trim().toUpperCase();
    const subject = String(row["Subject"] || "").trim();
    const topic = String(row["Topic"] || "").trim();
    const marksRaw = row["Marks"];
    const difficultyRaw = String(row["Difficulty Level"] || row["Difficulty"] || "Medium").trim();
    const explanation = String(row["Explanation"] || "").trim();

    const rowErrors = [];

    if (!questionText) rowErrors.push("Missing Question text");
    if (!optionA) rowErrors.push("Missing Option A");
    if (!optionB) rowErrors.push("Missing Option B");
    if (!correctAnswer || !["A", "B", "C", "D"].includes(correctAnswer)) {
      rowErrors.push("Correct Answer must be A, B, C, or D");
    }
    if (!subject) rowErrors.push("Missing Subject");
    if (!topic) rowErrors.push("Missing Topic");

    const marks = parseInt(marksRaw) || 5;
    const difficulty = ["Easy", "Medium", "Hard"].includes(difficultyRaw) ? difficultyRaw : "Medium";

    if (rowErrors.length > 0) {
      errors.push({
        rowNumber: rowNum,
        questionText: questionText.substring(0, 40) + "...",
        reasons: rowErrors
      });
    } else {
      validRows.push({
        id: `Q-${Date.now()}-${index}`,
        subject,
        topic,
        question: questionText,
        optionA,
        optionB,
        optionC,
        optionD,
        correctAnswer,
        marks,
        difficulty,
        explanation
      });
    }
  });

  return {
    isValid: errors.length === 0,
    totalParsed: rawRows.length,
    validCount: validRows.length,
    invalidCount: errors.length,
    validRows,
    errors
  };
};

// Export Data array to downloadable Excel (.xlsx) file
export const exportToExcel = (filename, sheetName, dataArray) => {
  const worksheet = XLSX.utils.json_to_sheet(dataArray);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName || "Data");
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};
