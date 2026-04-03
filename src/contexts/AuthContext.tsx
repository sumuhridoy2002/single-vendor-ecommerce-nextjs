"use client"

import { getBaseUrl } from '@/lib/api/client';
import { globalQueryKeys } from '@/lib/query-keys';
import { setAccountSessionCookie, removeAccountSessionCookie } from '@/lib/auth-cookie';
import { useAddressStore } from '@/store/address-store';
import { useAccessToken } from '@/hooks/data/useAccessToken';
import { useRefreshToken } from '@/hooks/data/useRefreshToken';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { createContext, useCallback, useContext, useEffect } from 'react';

const AUTH_USER_KEY = 'auth_user';

// Types (match backend OTP-verify response data)
export interface User {
  id: number;
  name?: string;
  phone?: string;
  avatar?: string;
  joined_at?: string;
  email?: string;
  guest_user?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthLoading: boolean;
  isAuthenticated: boolean;
  sendOtp: (phone: string) => Promise<void>;
  verifyOtp: (phone: string, otp: string) => Promise<void>;
  loginAsGuest: () => Promise<void>;
  loginWithSocial: (token: string, user: User) => void;
  logout: () => Promise<void>;
  refetchUser: () => void;
  updateUser: (partial: Partial<User>) => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Query keys
const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
};

function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

function setStoredUser(user: User | null): void {
  if (typeof window === 'undefined') return;
  if (user === null) {
    localStorage.removeItem(AUTH_USER_KEY);
  } else {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  }
}

// Auth Provider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const queryClient = useQueryClient();
  const { getAccessToken, setAccessToken, removeAccessToken, hasAccessToken } = useAccessToken();
  const { removeRefreshToken } = useRefreshToken();

  const getCurrentUser = useCallback(async (): Promise<User | null> => {
    const accessToken = getAccessToken();
    if (!accessToken) return null;
    // No backend /me endpoint; use persisted user from localStorage
    return getStoredUser();
  }, [getAccessToken]);

  const sendOtpApi = useCallback(async (phone: string): Promise<void> => {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/customer/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    });

    const data = await response.json().catch(() => ({}));
    if (response.status !== 200) {
      throw new Error((data.message as string) || 'Failed to send OTP');
    }
  }, []);

  const verifyOtpApi = useCallback(async (phone: string, otp: string): Promise<User> => {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/customer/otp-verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp }),
    });

    const data = await response.json().catch(() => ({}));
    if (response.status !== 200 || !data.token || !data.data) {
      throw new Error((data.message as string) || 'Verification failed');
    }

    const user: User = {
      id: data.data.id,
      name: data.data.name,
      phone: data.data.phone,
      avatar: data.data.avatar,
      joined_at: data.data.joined_at,
      email: data.data.email,
    };

    setAccessToken(data.token);
    setStoredUser(user);
    setAccountSessionCookie();
    removeRefreshToken();

    return user;
  }, [setAccessToken, removeRefreshToken]);

  const loginAsGuestApi = useCallback(async (): Promise<User> => {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/customer/login-as-guest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json().catch(() => ({}));
    if (response.status !== 200 || !data.token || !data.data) {
      throw new Error((data.message as string) || 'Guest login failed');
    }

    const user: User = {
      id: data.data.id,
      name: data.data.name,
      avatar: data.data.avatar,
      joined_at: data.data.joined_at,
      guest_user: true,
    };

    setAccessToken(data.token);
    setStoredUser(user);
    setAccountSessionCookie();
    removeRefreshToken();

    return user;
  }, [setAccessToken, removeRefreshToken]);

  const logoutApi = useCallback(async (): Promise<void> => {
    removeAccessToken();
    removeRefreshToken();
    removeAccountSessionCookie();
    setStoredUser(null);
  }, [removeAccessToken, removeRefreshToken]);

  const hasToken = hasAccessToken();

  // Sync account_session cookie for middleware when token exists (e.g. after refresh)
  useEffect(() => {
    if (hasToken) setAccountSessionCookie();
  }, [hasToken]);

  const {
    data: user,
    isLoading: isAuthLoading,
    refetch: refetchUser,
  } = useQuery({
    queryKey: authKeys.user(),
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000,
    enabled: hasToken,
  });

  const sendOtpMutation = useMutation({
    mutationFn: sendOtpApi,
    onError: (error) => {
      console.error('Send OTP error:', error);
      throw error;
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: ({ phone, otp }: { phone: string; otp: string }) => verifyOtpApi(phone, otp),
    onSuccess: (userData) => {
      queryClient.setQueryData(authKeys.user(), userData);
      queryClient.invalidateQueries({ queryKey: authKeys.user() });
    },
    onError: (error) => {
      console.error('Verify OTP error:', error);
      throw error;
    },
  });

  const loginAsGuestMutation = useMutation({
    mutationFn: loginAsGuestApi,
    onSuccess: (userData) => {
      queryClient.setQueryData(authKeys.user(), userData);
      queryClient.invalidateQueries({ queryKey: authKeys.user() });
    },
    onError: (error) => {
      console.error('Login as guest error:', error);
      throw error;
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      queryClient.setQueryData(authKeys.user(), null);
      queryClient.removeQueries({ queryKey: authKeys.all });
      queryClient.removeQueries({ queryKey: globalQueryKeys.customerAddresses });
      useAddressStore.getState().setAddresses([]);
    },
    onError: (error) => {
      console.error('Logout error:', error);
      queryClient.setQueryData(authKeys.user(), null);
      queryClient.removeQueries({ queryKey: authKeys.all });
      queryClient.removeQueries({ queryKey: globalQueryKeys.customerAddresses });
      useAddressStore.getState().setAddresses([]);
    },
  });

  const sendOtp = async (phone: string) => {
    await sendOtpMutation.mutateAsync(phone);
  };

  const verifyOtp = async (phone: string, otp: string) => {
    await verifyOtpMutation.mutateAsync({ phone, otp });
  };

  const loginAsGuest = async () => {
    await loginAsGuestMutation.mutateAsync();
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  const loginWithSocial = useCallback((token: string, socialUser: User) => {
    setAccessToken(token);
    setStoredUser(socialUser);
    setAccountSessionCookie();
    queryClient.setQueryData(authKeys.user(), socialUser);
  }, [setAccessToken, queryClient]);

  const updateUser = useCallback((partial: Partial<User>) => {
    const current = getStoredUser();
    if (!current) return;
    const merged = { ...current, ...partial };
    setStoredUser(merged);
    queryClient.setQueryData(authKeys.user(), merged);
  }, [queryClient]);

  const value: AuthContextType = {
    user: user ?? null,
    isAuthLoading,
    isAuthenticated: !!user,
    sendOtp,
    verifyOtp,
    loginAsGuest,
    loginWithSocial,
    logout,
    refetchUser: () => {
      refetchUser();
    },
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
