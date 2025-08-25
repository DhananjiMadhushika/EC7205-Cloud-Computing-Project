// AuthProvider.tsx

import axios from 'axios';

import React, { createContext, useContext, useEffect, useState } from 'react';


interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  handleLoginSuccess: (role: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  
  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true);
      const token = sessionStorage.getItem('authToken');
      
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:3000/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.status === 200) {
          setIsAuthenticated(true);
          setUser(response.data);
          
          sessionStorage.setItem('userRole', response.data.role);
        }
      } catch (error) {
        console.error('Error verifying token:', error);
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('userRole');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const handleLoginSuccess = (role: string) => {
    setIsAuthenticated(true);
    
    sessionStorage.setItem('userRole', role);
    
    const fetchUserData = async () => {
      const token = sessionStorage.getItem('authToken');
      if (!token) return;

      try {
        const response = await axios.get('http://localhost:3000/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.status === 200) {
          setUser(response.data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  };

  const logout = () => {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userID');
    sessionStorage.removeItem('userRole');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, handleLoginSuccess, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};