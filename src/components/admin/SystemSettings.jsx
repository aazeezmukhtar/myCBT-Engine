import React, { useState, useEffect } from 'react';
import { Settings, Save, RotateCcw, School, Clock, Shield, Globe2, GraduationCap, CheckCircle2 } from 'lucide-react';
import { getSettings, saveSettings, resetToDefaults } from '../../services/storageService';

export const SystemSettings = ({ onRefresh }) => {
  const [settings, setSettings] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getSettings().then(s => s && setSettings(s));
  }, []);

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    await saveSettings(settings);
    setSaved(true);
    if (onRefresh) onRefresh();
    setTimeout(() => setSaved(false), 2500);
  };

  const handleResetAll = async () => {
    if (window.confirm('Reset all platform data to factory seed defaults? This cannot be undone.')) {
      await resetToDefaults();
      window.location.reload();
    }
  };

  if (!settings) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading settings…</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Header */}
      <div className="card-header">
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>System Settings & Configuration</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Configure school identity, academic session, and platform-wide behaviour rules.
          </p>
        </div>
      </div>

      {/* School Identity */}
      <div className="card">
        <h3 className="card-title" style={{ marginBottom: '1.5rem' }}>
          <School className="text-primary-600" size={20} />
          <span>School Identity</span>
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">School / Institution Name</label>
            <input
              type="text"
              className="form-input"
              value={settings.schoolName || ''}
              onChange={(e) => handleChange('schoolName', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Academic Session</label>
            <input
              type="text"
              className="form-input"
              value={settings.session || ''}
              onChange={(e) => handleChange('session', e.target.value)}
              placeholder="e.g. 2025/2026 Academic Session"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Academic Term</label>
            <select
              className="form-select"
              value={settings.term || 'Third Term'}
              onChange={(e) => handleChange('term', e.target.value)}
            >
              <option>First Term</option>
              <option>Second Term</option>
              <option>Third Term</option>
            </select>
          </div>
        </div>
      </div>

      {/* Assessment Rules */}
      <div className="card">
        <h3 className="card-title" style={{ marginBottom: '1.5rem' }}>
          <GraduationCap className="text-primary-600" size={20} />
          <span>Assessment & Grading Rules</span>
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">
              Minimum Pass Percentage
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                (Current: {settings.passPercentage}%)
              </span>
            </label>
            <input
              type="number"
              className="form-input"
              value={settings.passPercentage || 50}
              min={0} max={100}
              onChange={(e) => handleChange('passPercentage', Number(e.target.value))}
            />
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              Students scoring below this percentage are marked as Failed.
            </div>
          </div>
        </div>

        {/* Grading Scale Display */}
        <div style={{ marginTop: '1.5rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-main)' }}>
            Grading Scale Reference
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {[
              { grade: 'A+', range: '85 – 100%', color: 'var(--success-600)' },
              { grade: 'A', range: '75 – 84%', color: 'var(--success-500)' },
              { grade: 'B', range: '65 – 74%', color: 'var(--primary-500)' },
              { grade: 'C', range: `${settings.passPercentage} – 64%`, color: 'var(--warning-600)' },
              { grade: 'F', range: `Below ${settings.passPercentage}%`, color: 'var(--danger-500)' },
            ].map(g => (
              <div key={g.grade} style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)',
                fontSize: '0.82rem'
              }}>
                <span style={{ fontWeight: 800, color: g.color }}>{g.grade}</span>
                <span style={{ color: 'var(--text-muted)' }}>{g.range}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Security & Session Settings */}
      <div className="card">
        <h3 className="card-title" style={{ marginBottom: '1.5rem' }}>
          <Shield className="text-primary-600" size={20} />
          <span>Security & Session Management</span>
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Single Session Toggle */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)'
          }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Single-Device Session Enforcement</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                Prevents a student from being logged in on multiple devices simultaneously.
              </div>
            </div>
            <button
              className={`toggle-btn ${settings.singleSessionEnforcement ? 'on' : ''}`}
              onClick={() => handleChange('singleSessionEnforcement', !settings.singleSessionEnforcement)}
            >
              <span className="toggle-knob" />
            </button>
          </div>

          {/* Student Theme Change Toggle */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)'
          }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Allow Students to Change Theme</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                If enabled, students can switch between light and dark mode independently.
              </div>
            </div>
            <button
              className={`toggle-btn ${settings.allowStudentThemeChange ? 'on' : ''}`}
              onClick={() => handleChange('allowStudentThemeChange', !settings.allowStudentThemeChange)}
            >
              <span className="toggle-knob" />
            </button>
          </div>

          {/* SIS Auto-Sync Toggle */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)'
          }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>SIS Auto-Sync (Future Integration)</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                When enabled, assessment results will be queued for automatic sync with the School Information System.
              </div>
            </div>
            <button
              className={`toggle-btn ${settings.sisAutoSyncEnabled ? 'on' : ''}`}
              onClick={() => handleChange('sisAutoSyncEnabled', !settings.sisAutoSyncEnabled)}
            >
              <span className="toggle-knob" />
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button className="btn btn-primary" onClick={handleSave} style={{ minWidth: '180px' }}>
          {saved ? <><CheckCircle2 size={16} /> Saved Successfully!</> : <><Save size={16} /> Save Settings</>}
        </button>
        <button
          className="btn btn-danger"
          onClick={handleResetAll}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <RotateCcw size={16} /> Reset All Data to Defaults
        </button>
      </div>
    </div>
  );
};
