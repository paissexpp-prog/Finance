import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, UserWithPassword } from '@/lib/types';

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('currentUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Get all users from localStorage
      const usersData = localStorage.getItem('users');
      const users: User[] = usersData ? JSON.parse(usersData) : [];

      // Check owner credentials
      if (username === 'paisx' && password === '2009') {
        const ownerUser: User = {
          id: 'owner-1',
          username: 'paisx',
          role: 'owner',
          createdAt: new Date().toISOString(),
        };
        setUser(ownerUser);
        localStorage.setItem('currentUser', JSON.stringify(ownerUser));
        return;
      }

      // Check regular users
      const foundUser = (users as UserWithPassword[]).find(u => u.username === username && u.password === password);
      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        return;
      }

      throw new Error('Username atau password salah');
    } catch (error) {
      setUser(null);
      localStorage.removeItem('currentUser');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
