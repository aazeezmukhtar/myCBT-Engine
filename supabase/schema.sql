-- Supabase Schema for EduPulse CBT

CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY,
  school_name TEXT,
  session TEXT,
  term TEXT,
  pass_percentage INTEGER,
  single_session_enforcement BOOLEAN,
  allow_student_theme_change BOOLEAN,
  sis_auto_sync_enabled BOOLEAN
);

CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  class TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  joined_date TEXT,
  email TEXT
);

CREATE TABLE IF NOT EXISTS subjects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT,
  topics TEXT[]
);

CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  subject TEXT,
  topic TEXT,
  question TEXT NOT NULL,
  options JSONB,
  correct_answer TEXT,
  marks INTEGER,
  difficulty TEXT,
  explanation TEXT
);

CREATE TABLE IF NOT EXISTS assessments (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT,
  subject TEXT,
  target_class TEXT,
  start_date TEXT,
  due_date TEXT,
  duration_minutes INTEGER,
  max_attempts INTEGER,
  randomize_questions BOOLEAN,
  randomize_options BOOLEAN,
  show_results_immediately BOOLEAN,
  allow_answer_review BOOLEAN,
  question_ids TEXT[],
  total_marks INTEGER,
  status TEXT
);

CREATE TABLE IF NOT EXISTS attempts (
  id TEXT PRIMARY KEY,
  student_id TEXT,
  assessment_id TEXT,
  assessment_title TEXT,
  score INTEGER,
  total_marks INTEGER,
  percentage DECIMAL,
  time_spent_seconds INTEGER,
  status TEXT,
  completed_at TEXT,
  attempt_number INTEGER,
  answers JSONB
);

CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT,
  type TEXT,
  date TEXT,
  read BOOLEAN DEFAULT false,
  target_role TEXT
);

CREATE TABLE IF NOT EXISTS activity_logs (
  id TEXT PRIMARY KEY,
  action TEXT,
  details TEXT,
  timestamp TEXT,
  user_name TEXT
);

-- Seed initial settings
INSERT INTO settings (
  id, school_name, session, term, pass_percentage, single_session_enforcement, allow_student_theme_change, sis_auto_sync_enabled
) VALUES (
  'school-settings-1',
  'EduPulse Model College',
  '2025/2026 Academic Session',
  'Third Term',
  50,
  true,
  true,
  false
) ON CONFLICT (id) DO NOTHING;

-- RLS Policies (Simple for this exercise, allowing all since app doesn't have true auth)
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all authenticated settings" ON settings FOR ALL USING (true);
CREATE POLICY "Allow all authenticated students" ON students FOR ALL USING (true);
CREATE POLICY "Allow all authenticated subjects" ON subjects FOR ALL USING (true);
CREATE POLICY "Allow all authenticated questions" ON questions FOR ALL USING (true);
CREATE POLICY "Allow all authenticated assessments" ON assessments FOR ALL USING (true);
CREATE POLICY "Allow all authenticated attempts" ON attempts FOR ALL USING (true);
CREATE POLICY "Allow all authenticated notifications" ON notifications FOR ALL USING (true);
CREATE POLICY "Allow all authenticated activity_logs" ON activity_logs FOR ALL USING (true);
