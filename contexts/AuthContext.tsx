import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (email: string) => Promise<void>;
  logout: () => void;
  selectRole: (role: UserRole) => void;
  signup: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for a logged-in user session on initial load
    const checkUserSession = async () => {
      try {
        const sessionUser = await api.checkSession();
        if (sessionUser) {
          setUser(sessionUser);
        }
      } catch (error) {
        console.error("Session check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };
    checkUserSession();
  }, []);

  const signup = async (email: string, password: string): Promise<void> => {
    await api.signup(email, password);
  };

  const login = async (email: string, password: string): Promise<void> => {
    const loggedInUser = await api.login(email, password);
    setUser(loggedInUser);
  };
  
  const loginWithGoogle = async (email: string): Promise<void> => {
    const loggedInUser = await api.loginWithGoogle(email);
    setUser(loggedInUser);
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
  };

  const selectRole = async (role: UserRole) => {
    if (user) {
      const updatedUser = await api.selectRole(user.email, role);
      setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, selectRole, signup, loginWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};