import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStudents, logActivity } from '../services/storageService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Default to Admin or active student for quick demo inspection
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('edupulse_cbt_active_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    return {
      id: "ADMIN-001",
      name: "Dr. Mukhtar (Principal Admin)",
      role: "admin",
      email: "admin@school.edu"
    };
  });

  const [activeSessions, setActiveSessions] = useState(new Set());

  useEffect(() => {
    if (user) {
      localStorage.setItem('edupulse_cbt_active_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('edupulse_cbt_active_user');
    }
  }, [user]);

  const loginAsStudent = async (studentId) => {
    const students = await getStudents();
    const found = students.find(s => s.id.toUpperCase() === studentId.trim().toUpperCase());

    if (!found) {
      throw new Error(`Student ID '${studentId}' not found. Please verify your ID.`);
    }

    if (found.status === 'deactivated') {
      throw new Error("This student account is currently deactivated. Contact school administrator.");
    }

    // Check single active session enforcement
    if (activeSessions.has(found.id)) {
      throw new Error("Active session detected on another device. Simultaneous logins are disabled for security.");
    }

    const studentUser = {
      id: found.id,
      name: found.name,
      class: found.class,
      role: 'student',
      email: found.email || `${found.id.toLowerCase()}@school.edu`
    };

    setActiveSessions(prev => new Set(prev).add(found.id));
    setUser(studentUser);
    logActivity("Student Authentication", `Student ${found.name} (${found.id}) logged in successfully.`, found.name);
    return studentUser;
  };

  const loginAsAdmin = () => {
    const adminUser = {
      id: "ADMIN-001",
      name: "Dr. Mukhtar (Principal Admin)",
      role: "admin",
      email: "admin@school.edu"
    };
    setUser(adminUser);
    logActivity("Administrator Authentication", "Administrator logged into management dashboard.", "Admin");
    return adminUser;
  };

  const switchRole = (newRole, optionalStudentId = "STU-2026-001") => {
    if (newRole === 'admin') {
      loginAsAdmin();
    } else {
      loginAsStudent(optionalStudentId);
    }
  };

  const logout = () => {
    if (user && user.role === 'student') {
      setActiveSessions(prev => {
        const copy = new Set(prev);
        copy.delete(user.id);
        return copy;
      });
      logActivity("User Logout", `Student ${user.name} logged out.`, user.name);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginAsStudent, loginAsAdmin, switchRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
