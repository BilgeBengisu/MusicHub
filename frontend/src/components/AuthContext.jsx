import { createContext, useState, useContext, useEffect } from 'react';
import apiEndpoints from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(apiEndpoints.profile, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        logout();
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await fetch(apiEndpoints.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.auth_token);
        setToken(data.auth_token);
        return { success: true };
      } else {
        const errorData = await response.json();
        console.log('Login error response:', errorData);
        return { success: false, error: errorData };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: { detail: 'Login failed. Please try again.' } };
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch(apiEndpoints.register, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        return { success: true };
      } else {
        const errorData = await response.json();
        console.log('Registration error response:', errorData);
        console.log('Attempted registration with data:', userData);
        return { success: false, error: errorData };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: { detail: 'Registration failed. Please try again.' } };
    }
  };

  const logout = () => {
    if (token) {
      fetch(apiEndpoints.logout, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
        },
      }).catch(error => console.error('Logout error:', error));
    }
    
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (userData) => {
    try {
      // Check if userData is FormData
      const isFormData = userData instanceof FormData;
      
      const response = await fetch(apiEndpoints.updateProfile, {
        method: 'PUT',
        headers: {
          'Authorization': `Token ${token}`,
          // Don't set Content-Type for FormData, browser will set it with boundary
          ...(isFormData ? {} : {'Content-Type': 'application/json'})
        },
        body: isFormData ? userData : JSON.stringify(userData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        return { success: true, user: updatedUser };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData };
      }
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: { detail: 'Update failed. Please try again.' } };
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 