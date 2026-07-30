import React, { useState } from 'react';
import { GraduationCap, Shield, User, Eye, EyeOff, AlertCircle, BookOpen, BarChart3, CheckCircle2, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LoginScreen = () => {
  const { loginAsStudent, loginAsAdmin } = useAuth();

  // Tab state: 'student' | 'admin'
  const [activeTab, setActiveTab] = useState('student');
  const [studentId, setStudentId] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStudentLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!studentId.trim()) {
      setError('Please enter your Student ID.');
      return;
    }
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 400)); // UX: brief spinner
      loginAsStudent(studentId.trim());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');
    // Demo: any password accepted for prototype
    if (adminPassword.trim().length < 1) {
      setError('Please enter the administrator password.');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    loginAsAdmin();
    setLoading(false);
  };

  const featureItems = [
    { icon: BookOpen, text: 'Computer-Based Examinations with Anti-Cheat Timer' },
    { icon: BarChart3, text: 'Deep Learning Analytics & Topic Mastery Reports' },
    { icon: CheckCircle2, text: 'Multi-Attempt Averaged Scoring System' },
    { icon: Zap, text: 'Instant Results with AI-Powered Personalized Insights' },
  ];

  return (
    <div className="login-page">
      {/* Left Hero Panel */}
      <div className="login-hero">
        <div className="login-hero-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '12px',
              background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <GraduationCap size={28} color="#ffffff" />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.1 }}>EduPulse CBT</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.65)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Assessment & Analytics Platform
              </div>
            </div>
          </div>

          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#ffffff', lineHeight: 1.2, marginBottom: '1rem' }}>
            Smarter Assessments.<br />
            Deeper Insights.
          </h1>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.75)', marginBottom: '2.5rem', lineHeight: 1.6 }}>
            A complete Computer-Based Testing platform built for modern schools — with powerful analytics that help students grow and administrators make data-driven decisions.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {featureItems.map(({ icon: Icon, text }, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '8px',
                  background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(6px)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Icon size={18} color="rgba(255,255,255,0.9)" />
                </div>
                <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.4 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative Orbs */}
        <div className="login-orb login-orb-1" />
        <div className="login-orb login-orb-2" />
      </div>

      {/* Right Login Panel */}
      <div className="login-form-panel">
        <div className="login-form-container">
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.35rem' }}>Welcome Back</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Sign in to access your portal
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="login-tabs">
            <button
              className={`login-tab ${activeTab === 'student' ? 'active' : ''}`}
              onClick={() => { setActiveTab('student'); setError(''); }}
            >
              <User size={16} /> Student Portal
            </button>
            <button
              className={`login-tab ${activeTab === 'admin' ? 'active' : ''}`}
              onClick={() => { setActiveTab('admin'); setError(''); }}
            >
              <Shield size={16} /> Administrator
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="login-error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Student Form */}
          {activeTab === 'student' && (
            <form onSubmit={handleStudentLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Student ID Number</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. STU-2026-001"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  autoFocus
                  autoComplete="username"
                />
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                  Enter the Student ID provided by your school administrator.
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', fontWeight: 700 }}
              >
                {loading ? 'Authenticating...' : 'Sign In as Student'}
              </button>

              <div style={{
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary-50)',
                border: '1px solid var(--primary-100)',
                fontSize: '0.8rem',
                color: 'var(--primary-700)'
              }}>
                <strong>Demo Student IDs:</strong> STU-2026-001, STU-2026-002, STU-2026-003
              </div>
            </form>
          )}

          {/* Admin Form */}
          {activeTab === 'admin' && (
            <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Administrator Email</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="admin@school.edu"
                  defaultValue="admin@school.edu"
                  readOnly
                  style={{ opacity: 0.75 }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Enter administrator password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    autoFocus
                    style={{ paddingRight: '3rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.25rem'
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', fontWeight: 700 }}
              >
                {loading ? 'Authenticating...' : 'Sign In as Administrator'}
              </button>

              <div style={{
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--warning-50, #fffbeb)',
                border: '1px solid var(--warning-200, #fde68a)',
                fontSize: '0.8rem',
                color: 'var(--warning-800, #92400e)'
              }}>
                <strong>Demo Mode:</strong> Any password is accepted for administrator access.
              </div>
            </form>
          )}

          <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Noble Borg International Academy &nbsp;·&nbsp; EduPulse CBT v1.0
          </div>
        </div>
      </div>
    </div>
  );
};
