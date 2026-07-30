/**
 * Core Analytics Engine for Student & Administrator Insights
 */

// Calculate student's averaged scores per assessment according to system rule
export const calculateAveragedScoresPerAssessment = (attempts, studentId = null) => {
  const filtered = studentId ? attempts.filter(a => a.studentId === studentId) : attempts;
  
  // Group attempts by assessmentId & studentId
  const grouped = {};
  filtered.forEach(att => {
    const key = `${att.studentId}_${att.assessmentId}`;
    if (!grouped[key]) {
      grouped[key] = {
        studentId: att.studentId,
        studentName: att.studentName,
        assessmentId: att.assessmentId,
        assessmentTitle: att.assessmentTitle,
        attempts: []
      };
    }
    grouped[key].attempts.push(att);
  });

  const results = [];
  Object.values(grouped).forEach(group => {
    const totalPercentage = group.attempts.reduce((sum, a) => sum + (a.percentage || 0), 0);
    const avgPercentage = group.attempts.length > 0 ? (totalPercentage / group.attempts.length) : 0;
    const highestPercentage = Math.max(...group.attempts.map(a => a.percentage || 0));
    const latestAttempt = group.attempts.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))[0];

    results.push({
      studentId: group.studentId,
      studentName: group.studentName,
      assessmentId: group.assessmentId,
      assessmentTitle: group.assessmentTitle,
      attemptCount: group.attempts.length,
      averagePercentage: parseFloat(avgPercentage.toFixed(1)),
      highestPercentage: parseFloat(highestPercentage.toFixed(1)),
      latestAttempt,
      allAttempts: group.attempts
    });
  });

  return results;
};

// Student Learning Analytics
export const getStudentAnalytics = (studentId, attempts, assessments, questions) => {
  const studentAttempts = attempts.filter(a => a.studentId === studentId);

  if (studentAttempts.length === 0) {
    return {
      totalTaken: 0,
      overallAverage: 0,
      highestScore: 0,
      lowestScore: 0,
      passRate: 0,
      subjectScores: [],
      topicScores: [],
      trends: [],
      insights: ["No assessment data available yet. Complete your first assessment to unlock detailed analytics!"]
    };
  }

  // Averaged assessment scores
  const averagedAssessments = calculateAveragedScoresPerAssessment(studentAttempts, studentId);
  const totalTaken = averagedAssessments.length;

  const averages = averagedAssessments.map(a => a.averagePercentage);
  const overallAverage = parseFloat((averages.reduce((a, b) => a + b, 0) / averages.length).toFixed(1));
  const highestScore = Math.max(...averages);
  const lowestScore = Math.min(...averages);
  const passCount = averages.filter(score => score >= 50).length;
  const passRate = parseFloat(((passCount / totalTaken) * 100).toFixed(1));

  // Subject Performance Breakdown
  const subjectMap = {};
  studentAttempts.forEach(att => {
    const asm = assessments.find(a => a.id === att.assessmentId);
    const subject = asm ? asm.subject : "General";

    if (!subjectMap[subject]) {
      subjectMap[subject] = { totalPoints: 0, maxPoints: 0, attempts: 0 };
    }
    subjectMap[subject].totalPoints += att.score;
    subjectMap[subject].maxPoints += att.totalPossible;
    subjectMap[subject].attempts += 1;
  });

  const subjectScores = Object.keys(subjectMap).map(subj => {
    const data = subjectMap[subj];
    const pct = data.maxPoints > 0 ? parseFloat(((data.totalPoints / data.maxPoints) * 100).toFixed(1)) : 0;
    return {
      subject: subj,
      percentage: pct,
      attemptsCount: data.attempts
    };
  });

  // Topic Performance Breakdown
  const topicMap = {};
  studentAttempts.forEach(att => {
    if (!att.answers) return;
    Object.entries(att.answers).forEach(([qId, ans]) => {
      const q = questions.find(item => item.id === qId);
      const topic = ans.topic || (q ? q.topic : "General");
      const subject = q ? q.subject : "General";

      if (!topicMap[topic]) {
        topicMap[topic] = { topic, subject, correct: 0, total: 0 };
      }
      topicMap[topic].total += 1;
      if (ans.correct) {
        topicMap[topic].correct += 1;
      }
    });
  });

  const topicScores = Object.values(topicMap).map(item => {
    const pct = item.total > 0 ? parseFloat(((item.correct / item.total) * 100).toFixed(1)) : 0;
    return {
      topic: item.topic,
      subject: item.subject,
      correctCount: item.correct,
      totalCount: item.total,
      percentage: pct
    };
  });

  // Performance Trends over time
  const sortedAttempts = [...studentAttempts].sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt));
  const trends = sortedAttempts.map(att => ({
    date: new Date(att.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    assessment: att.assessmentTitle,
    percentage: att.percentage,
    attemptNumber: att.attemptNumber
  }));

  // Automated Personalized Insights Generator
  const insights = [];

  // Strongest & Weakest Subjects
  if (subjectScores.length > 0) {
    const sortedSubjs = [...subjectScores].sort((a, b) => b.percentage - a.percentage);
    const strongestSubj = sortedSubjs[0];
    const weakestSubj = sortedSubjs[sortedSubjs.length - 1];

    if (strongestSubj && strongestSubj.percentage >= 75) {
      insights.push(`🌟 Strongest Subject: You show excellent mastery in ${strongestSubj.subject} with an average of ${strongestSubj.percentage}%.`);
    }
    if (weakestSubj && weakestSubj.percentage < 60) {
      insights.push(`⚠️ Focus Required: Your performance in ${weakestSubj.subject} is currently at ${weakestSubj.percentage}%. Targeted review is recommended.`);
    }
  }

  // Weak Topics (< 50%) & Strong Topics (>= 80%)
  const weakTopics = topicScores.filter(t => t.percentage < 50);
  const strongTopics = topicScores.filter(t => t.percentage >= 80);

  if (strongTopics.length > 0) {
    const names = strongTopics.map(t => t.topic).join(", ");
    insights.push(`💪 You consistently perform very well in ${names}.`);
  }

  if (weakTopics.length > 0) {
    weakTopics.forEach(t => {
      insights.push(`📚 Your ${t.topic} (${t.subject}) performance has remained below 50% across recent assessments (${t.percentage}%). Additional practice exercises are strongly recommended.`);
    });
  } else if (overallAverage >= 75) {
    insights.push("🚀 Great consistency across all topics! Maintain this study pace for your upcoming exams.");
  }

  return {
    totalTaken,
    overallAverage,
    highestScore,
    lowestScore,
    passRate,
    subjectScores,
    topicScores,
    trends,
    insights
  };
};

// Administrator School Analytics
export const getAdminAnalytics = (students, assessments, attempts, questions) => {
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'active').length;
  const totalAssessments = assessments.length;
  const totalAttemptsCount = attempts.length;

  // School-wide averaged scores
  const allAveraged = calculateAveragedScoresPerAssessment(attempts);
  const totalAssessmentsTaken = allAveraged.length;

  const averages = allAveraged.map(a => a.averagePercentage);
  const schoolAverage = averages.length > 0 ? parseFloat((averages.reduce((a, b) => a + b, 0) / averages.length).toFixed(1)) : 0;
  const highestScore = averages.length > 0 ? Math.max(...averages) : 0;
  const lowestScore = averages.length > 0 ? Math.min(...averages) : 0;
  const passCount = averages.filter(s => s >= 50).length;
  const overallPassRate = averages.length > 0 ? parseFloat(((passCount / averages.length) * 100).toFixed(1)) : 0;

  // Top Performing Students & At-Risk Students
  const studentPerformance = {};
  students.forEach(s => {
    const sAveraged = calculateAveragedScoresPerAssessment(attempts, s.id);
    if (sAveraged.length > 0) {
      const avg = parseFloat((sAveraged.reduce((sum, item) => sum + item.averagePercentage, 0) / sAveraged.length).toFixed(1));
      studentPerformance[s.id] = {
        studentId: s.id,
        name: s.name,
        class: s.class,
        assessmentsTaken: sAveraged.length,
        averagePercentage: avg
      };
    }
  });

  const studentPerfList = Object.values(studentPerformance);
  const topStudents = [...studentPerfList].sort((a, b) => b.averagePercentage - a.averagePercentage).slice(0, 5);
  const atRiskStudents = [...studentPerfList].filter(s => s.averagePercentage < 50);

  // Question Item Distractor Analysis
  const questionItemAnalysis = questions.map(q => {
    let qAttempts = 0;
    let correctCount = 0;
    const optionCounts = { A: 0, B: 0, C: 0, D: 0 };

    attempts.forEach(att => {
      if (att.answers && att.answers[q.id]) {
        qAttempts += 1;
        const sel = att.answers[q.id].selected;
        if (sel && optionCounts[sel] !== undefined) {
          optionCounts[sel] += 1;
        }
        if (att.answers[q.id].correct) {
          correctCount += 1;
        }
      }
    });

    const correctPct = qAttempts > 0 ? parseFloat(((correctCount / qAttempts) * 100).toFixed(1)) : 0;
    const wrongPct = qAttempts > 0 ? parseFloat((100 - correctPct).toFixed(1)) : 0;

    // Find most selected wrong option
    let mostSelectedWrong = "N/A";
    let maxWrongCount = 0;
    Object.entries(optionCounts).forEach(([opt, count]) => {
      if (opt !== q.correctAnswer && count > maxWrongCount) {
        maxWrongCount = count;
        mostSelectedWrong = `Option ${opt} (${count} choices)`;
      }
    });

    return {
      questionId: q.id,
      questionText: q.question,
      subject: q.subject,
      topic: q.topic,
      difficulty: q.difficulty,
      correctAnswer: q.correctAnswer,
      attemptsCount: qAttempts,
      correctPercentage: correctPct,
      wrongPercentage: wrongPct,
      mostSelectedWrong
    };
  });

  return {
    totalStudents,
    activeStudents,
    totalAssessments,
    totalAttemptsCount,
    totalAssessmentsTaken,
    schoolAverage,
    highestScore,
    lowestScore,
    overallPassRate,
    topStudents,
    atRiskStudents,
    questionItemAnalysis
  };
};
