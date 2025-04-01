// This file implements authentication context for the application
// It provides login, register, logout functionality and maintains user state across the app

import React, { createContext, useState, useContext, useEffect } from 'react';
// Import React hooks and context API for state management

// Create a new context for authentication data
const AuthContext = createContext(null);

// Define API URL for authentication endpoints
export const API_URL = 'http://localhost:3000/api';

// AuthProvider component that wraps the app and provides authentication state and methods
export const AuthProvider = ({ children }) => {
  // State for authenticated user, loading status, and error messages
  const [user, setUser] = useState(null); // Current user information
  const [loading, setLoading] = useState(true); // Loading state for initial auth check
  const [error, setError] = useState(null); // Error messages from auth operations

  // Check authentication status when component mounts
  useEffect(() => {
    checkAuth();
  }, []);

  // Function to refresh user data
  const refreshUserData = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        return data.user;
      }
    } catch (err) {
      console.error('Error refreshing user data:', err);
    }
    return null;
  };

  // Login function that authenticates user with server
  const login = async (userData) => {
    setError(null); // Clear any previous errors
    try {
      // Send login request to API
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        credentials: 'include', // Include cookies in request for session-based auth
      });

      const data = await response.json();

      // Handle unsuccessful login
      if (!response.ok) {
        throw new Error(data.message || 'Кіру кезінде қате туындады');
      }

      // Set user data in state and localStorage on successful login
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      return { success: true };
    } catch (err) {
      // Handle and store error
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Register function for creating new user accounts
  const register = async (userData) => {
    setError(null); // Clear any previous errors
    try {
      // Send registration request to API
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        credentials: 'include',
      });

      const data = await response.json();

      // Handle unsuccessful registration
      if (!response.ok) {
        throw new Error(data.message || 'Тіркеу кезінде қате туындады');
      }

      // Login the user after successful registration
      await login({
        login: data.user.email,
        password: data.user.password,
      });

      // Set user data in state and localStorage
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      return { success: true };
    } catch (err) {
      // Handle and store error
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Logout function to end the user session
  const logout = async () => {
    try {
      // Send logout request to API
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear user data from state and localStorage regardless of API response
      setUser(null);
      localStorage.removeItem('user');
    }
  };

  // Function to check if user is authenticated (called on app load)
  const checkAuth = async () => {
    setLoading(true);
    try {
      // First try to get user from localStorage for faster loading
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      // Verify authentication with server
      const response = await fetch(`${API_URL}/auth/me`, {
        credentials: 'include',
      });

      if (response.ok) {
        // If server confirms auth, update user data
        const data = await response.json();
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      } else {
        // If server check fails, clear local storage
        setUser(null);
        localStorage.removeItem('user');
      }
    } catch (err) {
      console.error('Auth check error:', err);
      // Clear user data on error
      setUser(null);
      localStorage.removeItem('user');
    } finally {
      // Set loading to false when check is complete
      setLoading(false);
    }
  };

  // Provide auth context values to all child components
  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        checkAuth,
        refreshUserData,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access to auth context in components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
