import React, { createContext, useContext, useState, useEffect } from 'react';
import { portalService } from '../services/portalService';
import { INITIAL_USERS } from '../services/mockData';

const AuthContext = createContext();

export const ROLES = {
  EXECUTIVE: 'executive',
  GAME_MANAGER: 'game_manager',
  FINANCE_OFFICER: 'finance_officer',
  MEMBER: 'member',
};

export const ROLE_LABELS = {
  executive: 'Executive Officer',
  game_manager: 'Game Manager',
  finance_officer: 'Finance Officer',
  member: 'General Member',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    portalService.init();
    const currentUser = portalService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = (email, _password) => {
    const users = portalService.getUsers();
    // In demo environment, match by email or student ID
    const found = users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() ||
        u.studentId.toLowerCase() === email.toLowerCase() ||
        u.ign.toLowerCase() === email.toLowerCase()
    );

    if (!found) {
      throw new Error('Invalid credentials. Check your email, IGN, or Student ID.');
    }

    portalService.setCurrentUser(found);
    setUser(found);
    return found;
  };

  const register = (userData) => {
    const newUser = portalService.registerUser(userData);
    portalService.setCurrentUser(newUser);
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    portalService.setCurrentUser(null);
    setUser(null);
  };

  // Quick switch for reviewers & evaluators to test all 4 RBAC levels
  const switchRole = (targetRole) => {
    const users = portalService.getUsers();
    let targetUser = users.find((u) => u.role === targetRole);
    if (!targetUser) {
      targetUser = INITIAL_USERS.find((u) => u.role === targetRole);
    }
    if (targetUser) {
      portalService.setCurrentUser(targetUser);
      setUser({ ...targetUser });
    }
  };

  const refreshUser = () => {
    if (user) {
      const refreshed = portalService.getUserById(user.id);
      if (refreshed) {
        setUser({ ...refreshed });
      }
    }
  };

  const hasRole = (role) => {
    if (!user) return false;
    return user.role === role;
  };

  const hasAnyRole = (roles = []) => {
    if (!user) return false;
    // Executive has super-admin permissions across modules unless specifically restricted
    if (user.role === ROLES.EXECUTIVE) return true;
    return roles.includes(user.role);
  };

  const value = {
    user,
    role: user?.role || null,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
    switchRole,
    refreshUser,
    hasRole,
    hasAnyRole,
    ROLES,
    ROLE_LABELS,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
