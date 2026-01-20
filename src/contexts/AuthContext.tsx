"use client"

import { useAccessToken } from '@/hooks/data/useAccessToken';
import { useRefreshToken } from '@/hooks/data/useRefreshToken';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { createContext, useCallback, useContext } from 'react';

// Types
interface User {
  id: string;
  email: string;
  name?: string;
  // Add other user properties as needed
}

interface AuthContextType {
  user: User | null;
  isAuthLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  refetchUser: () => void;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  email: string;
  password: string;
  name?: string;
}

interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Query keys
const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
};

// Auth Provider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const queryClient = useQueryClient();
  const { getAccessToken, setAccessToken, removeAccessToken, hasAccessToken } = useAccessToken();
  const { refreshAccessToken, setRefreshToken, removeRefreshToken } = useRefreshToken();

  // API functions using hooks
  const getCurrentUser = useCallback(async (): Promise<User | null> => {
    const accessToken = getAccessToken();
    if (!accessToken) return null;

    // Replace with your actual API endpoint
    const response = await fetch('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: 'include',
    });

    if (response.status === 401) {
      // Access token expired, try to refresh
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        // Retry with new token
        const newAccessToken = getAccessToken();
        if (newAccessToken) {
          const retryResponse = await fetch('/api/auth/me', {
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
            },
            credentials: 'include',
          });
          if (retryResponse.ok) {
            return retryResponse.json();
          }
        }
      }
      // Refresh failed, clear tokens
      removeAccessToken();
      removeRefreshToken();
      return null;
    }

    if (!response.ok) {
      removeAccessToken();
      removeRefreshToken();
      return null;
    }

    return response.json();
  }, [getAccessToken, refreshAccessToken, removeAccessToken, removeRefreshToken]);

  const loginApi = useCallback(async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // Replace with your actual API endpoint
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const data = await response.json();

    // Store tokens using hooks
    if (data.accessToken) {
      setAccessToken(data.accessToken);
    }
    if (data.refreshToken) {
      setRefreshToken(data.refreshToken);
    }

    return {
      user: data.user,
      accessToken: data.accessToken || data.token || '',
      refreshToken: data.refreshToken || '',
    };
  }, [setAccessToken, setRefreshToken]);

  const registerApi = useCallback(async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    // Replace with your actual API endpoint
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    const data = await response.json();

    // Store tokens using hooks
    if (data.accessToken) {
      setAccessToken(data.accessToken);
    }
    if (data.refreshToken) {
      setRefreshToken(data.refreshToken);
    }

    return {
      user: data.user,
      accessToken: data.accessToken || data.token || '',
      refreshToken: data.refreshToken || '',
    };
  }, [setAccessToken, setRefreshToken]);

  const logoutApi = useCallback(async (): Promise<void> => {
    const accessToken = getAccessToken();

    if (accessToken) {
      // Optionally call logout endpoint
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: 'include',
        });
      } catch (error) {
        console.error('Logout API error:', error);
      }
    }

    // Clear tokens using hooks
    removeAccessToken();
    removeRefreshToken();
  }, [getAccessToken, removeAccessToken, removeRefreshToken]);

  // Check if token exists to determine if we should fetch user
  const hasToken = hasAccessToken();

  // Query to fetch current user
  const {
    data: user,
    isLoading: isAuthLoading,
    refetch: refetchUser,
  } = useQuery({
    queryKey: authKeys.user(),
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: hasToken, // Only run if token exists
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      queryClient.setQueryData(authKeys.user(), data.user);
      queryClient.invalidateQueries({ queryKey: authKeys.user() });
    },
    onError: (error) => {
      console.error('Login error:', error);
      throw error;
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: registerApi,
    onSuccess: (data) => {
      queryClient.setQueryData(authKeys.user(), data.user);
      queryClient.invalidateQueries({ queryKey: authKeys.user() });
    },
    onError: (error) => {
      console.error('Registration error:', error);
      throw error;
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      queryClient.setQueryData(authKeys.user(), null);
      queryClient.removeQueries({ queryKey: authKeys.all });
    },
    onError: (error) => {
      console.error('Logout error:', error);
      // Still clear local state even if API call fails
      queryClient.setQueryData(authKeys.user(), null);
      queryClient.removeQueries({ queryKey: authKeys.all });
    },
  });

  // Login function
  const login = async (email: string, password: string) => {
    await loginMutation.mutateAsync({ email, password });
  };

  // Register function
  const register = async (email: string, password: string, name?: string) => {
    await registerMutation.mutateAsync({ email, password, name });
  };

  // Logout function
  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  const value: AuthContextType = {
    user: user ?? null,
    isAuthLoading,
    isAuthenticated: !!user,
    login,
    logout,
    register,
    refetchUser: () => {
      refetchUser();
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export default
export default AuthContext;
