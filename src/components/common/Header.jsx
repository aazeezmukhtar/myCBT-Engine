import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Menu, Sun, Moon, Bell, Shield, User, ArrowRightLeft, LogOut, RefreshCw } from 'lucide-react';
import { resetToDefaults } from '../../services/storageService';

export const Header = ({ onToggleSidebar, onOpenNotifications, unreadCount, currentViewName }) => {
  const { user, switchRole, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleResetData = async () => {
    if (window.confirm("Reset all platform data back to initial seed defaults?")) {
      await resetToDefaults();
      window.location.reload();
    }
  };

  return (
    <header className="top-header">
      <div className="header-title-group">
        <button className="mobile-menu-btn" onClick={onToggleSidebar} title="Toggle Navigation">
          <Menu size={20} />
        </button>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{currentViewName}</h2>
        </div>
      </div>

      <div className="header-right">
        {/* Role Badge & Quick Switcher */}
        <span className={`role-badge ${user?.role || 'admin'}`}>
          <Shield size={12} />
          {user?.role === 'admin' ? 'Administrator' : `Student (${user?.class || 'SS 3'})`}
        </span>

        <button
          className="quick-switch-btn"
          onClick={() => switchRole(user?.role === 'admin' ? 'student' : 'admin')}
          title="Switch role for testing"
        >
          <ArrowRightLeft size={14} />
          <span>Switch to {user?.role === 'admin' ? 'Student' : 'Admin'}</span>
        </button>

        {/* Theme Toggle */}
        <button className="icon-btn" onClick={toggleTheme} title="Toggle Light/Dark Theme">
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* Notification Bell */}
        <button className="icon-btn" onClick={onOpenNotifications} title="Notifications">
          <Bell size={18} />
          {unreadCount > 0 && <span className="notification-dot"></span>}
        </button>

        {/* User Profile */}
        <div style={{ position: 'relative' }}>
          <button className="icon-btn" onClick={() => setShowProfileMenu(!showProfileMenu)}>
            <User size={18} />
          </button>

          {showProfileMenu && (
            <div className="card" style={{
              position: 'absolute',
              right: 0,
              top: '48px',
              width: '240px',
              padding: '0.75rem',
              zIndex: 100,
              boxShadow: 'var(--shadow-xl)'
            }}>
              <div style={{ padding: '0.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.5rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{user?.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.email || user?.id}</div>
              </div>

              <button
                onClick={handleResetData}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.85rem',
                  color: 'var(--warning-600)',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                <RefreshCw size={14} />
                Reset Sample Seed Data
              </button>

              <button
                onClick={logout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.85rem',
                  color: 'var(--danger-500)',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
