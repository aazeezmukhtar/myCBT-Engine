import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileQuestion,
  BarChart3,
  FileSpreadsheet,
  Settings,
  GraduationCap,
  History,
  Award,
  BookCheck
} from 'lucide-react';

export const Navigation = ({ activeTab, setActiveTab, isOpen, onCloseMobile }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const adminNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Student Roster', icon: Users },
    { id: 'questions', label: 'Question Bank', icon: FileQuestion },
    { id: 'assessments', label: 'Assessments', icon: BookOpen },
    { id: 'analytics', label: 'School Analytics', icon: BarChart3 },
    { id: 'reports', label: 'Report Generator', icon: FileSpreadsheet },
    { id: 'settings', label: 'System Settings', icon: Settings }
  ];

  const studentNavItems = [
    { id: 'student-dashboard', label: 'My Dashboard', icon: LayoutDashboard },
    { id: 'my-assessments', label: 'Available Assessments', icon: BookCheck },
    { id: 'my-attempts', label: 'Attempt History', icon: History },
    { id: 'my-analytics', label: 'Learning Analytics', icon: Award }
  ];

  const navItems = isAdmin ? adminNavItems : studentNavItems;

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onCloseMobile}></div>}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-icon">
            <GraduationCap size={22} />
          </div>
          <div>
            <div className="brand-title">EduPulse CBT</div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Analytics Platform</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-title">
            {isAdmin ? 'Administration' : 'Student Portal'}
          </div>

          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`nav-link ${isActive ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab(item.id);
                  onCloseMobile();
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>

        <div className="sidebar-user">
          <div className="avatar">
            {user?.name ? user.name.charAt(0) : 'U'}
          </div>
          <div className="user-info">
            <div className="user-name">{user?.name}</div>
            <div className="user-role-text">{user?.role === 'admin' ? 'Administrator' : user?.id}</div>
          </div>
        </div>
      </aside>
    </>
  );
};
