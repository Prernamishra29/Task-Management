'use client';

import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Types
type User = {
  id: string;
  name: string;
  email: string;
};

type LoginCredentials = {
  email: string;
  password: string;
};

type RegisterCredentials = {
  name: string;
  email: string;
  password: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check if token is still valid
  const isTokenValid = (token: string): boolean => {
    try {
      const decoded: any = jwtDecode(token);
      // Check if token is expired
      return decoded.exp * 1000 > Date.now();
    } catch (error) {
      return false;
    }
  };

  // Setup axios interceptor for token
  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, [token]);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        
        if (storedToken && isTokenValid(storedToken)) {
          setToken(storedToken);
          
          // Get user data from API
          const response = await axios.get(`${API_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });
          
          setUser(response.data);
        } else {
          // Token invalid, clear storage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login function
  const login = async (credentials: LoginCredentials) => {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    const { token: newToken, user: userData } = response.data;
    
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    
    setToken(newToken);
    setUser(userData);
  };

  // Register function
  const register = async (credentials: RegisterCredentials) => {
    const response = await axios.post(`${API_URL}/auth/register`, credentials);
    const { token: newToken, user: userData } = response.data;
    
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    
    setToken(newToken);
    setUser(userData);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};