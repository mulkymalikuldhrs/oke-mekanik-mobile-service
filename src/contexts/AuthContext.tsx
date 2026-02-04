<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> origin/feature/project-upgrade-and-integration-15484867582762648399
import { createContext, useContext, useState } from 'react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthContextType {
  user: User | null;
  login: (user: User, token: string) => void;
  logout: () => void;
<<<<<<< HEAD
=======

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  login: (email: string, role: UserRole) => Promise<void>;
  register: (name: string, email: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
>>>>>>> origin/feat/production-ready-upgrade-13949670600845112772
=======
>>>>>>> origin/feature/project-upgrade-and-integration-15484867582762648399
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> origin/feature/project-upgrade-and-integration-15484867582762648399
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (user: User, token: string) => {
    setUser(user);
    localStorage.setItem('token', token);
<<<<<<< HEAD
=======
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved session
    const savedUser = localStorage.getItem('user');
    const savedRole = localStorage.getItem('role');
    if (savedUser && savedRole) {
      setUser(JSON.parse(savedUser));
      setRole(savedRole as UserRole);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, role: UserRole) => {
    setIsLoading(true);
    // Mock login logic
    setTimeout(() => {
      const mockUser: User = {
        id: role === 'customer' ? 'C1' : 'M1',
        name: role === 'customer' ? 'Customer User' : 'Mechanic User',
        email,
        role,
      };
      setUser(mockUser);
      setRole(role);
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('role', role);
      setIsLoading(false);
    }, 1000);
  };

  const register = async (name: string, email: string, role: UserRole) => {
    setIsLoading(true);
    // Mock register logic
    setTimeout(() => {
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        role,
      };
      setUser(mockUser);
      setRole(role);
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('role', role);
      setIsLoading(false);
    }, 1000);
>>>>>>> origin/feat/production-ready-upgrade-13949670600845112772
=======
>>>>>>> origin/feature/project-upgrade-and-integration-15484867582762648399
  };

  const logout = () => {
    setUser(null);
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> origin/feature/project-upgrade-and-integration-15484867582762648399
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
<<<<<<< HEAD
=======
    setRole(null);
    localStorage.removeItem('user');
    localStorage.removeItem('role');
  };

  return (
    <AuthContext.Provider value={{
      user,
      role,
      login,
      register,
      logout,
      isAuthenticated: !!user,
      isLoading
    }}>
>>>>>>> origin/feat/production-ready-upgrade-13949670600845112772
=======
>>>>>>> origin/feature/project-upgrade-and-integration-15484867582762648399
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
