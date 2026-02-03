
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, role: UserRole) => Promise<void>;
  register: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('ok_mekanik_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, role: UserRole) => {
    // In a real app, this would be an API call
    // For now, we simulate finding a user in localStorage
    const users = JSON.parse(localStorage.getItem('ok_mekanik_all_users') || '[]');
    const existingUser = users.find((u: User) => u.email === email && u.role === role);

    if (existingUser) {
      setUser(existingUser);
      localStorage.setItem('ok_mekanik_user', JSON.stringify(existingUser));
    } else {
      // For demo purposes, if not found, we create a dummy one or throw error
      // Let's throw error to be "real"
      throw new Error('User not found. Please register.');
    }
  };

  const register = async (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };

    const users = JSON.parse(localStorage.getItem('ok_mekanik_all_users') || '[]');
    users.push(newUser);
    localStorage.setItem('ok_mekanik_all_users', JSON.stringify(users));

    setUser(newUser);
    localStorage.setItem('ok_mekanik_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ok_mekanik_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
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
