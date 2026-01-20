import { getCookie, removeCookie, setCookie } from '@/lib/cookies';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const TOKEN_KEY = 'refresh_token';
const TOKEN_EXPIRY_DAYS = 7; // 7 days

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken?: string;
}

/**
 * Hook for managing refresh token
 */
export const useRefreshToken = () => {
  const queryClient = useQueryClient();

  /**
   * Get the current refresh token from cookies
   */
  const getRefreshToken = (): string | null => {
    return getCookie(TOKEN_KEY);
  };

  /**
   * Check if refresh token exists
   */
  const hasRefreshToken = (): boolean => {
    return getRefreshToken() !== null;
  };

  /**
   * Set refresh token in cookies
   */
  const setRefreshToken = (token: string): void => {
    setCookie(TOKEN_KEY, token, TOKEN_EXPIRY_DAYS);
  };

  /**
   * Remove refresh token from cookies
   */
  const removeRefreshToken = (): void => {
    removeCookie(TOKEN_KEY);
  };

  /**
   * Mutation to refresh access token using refresh token
   */
  const refreshAccessTokenMutation = useMutation({
    mutationFn: async (): Promise<RefreshTokenResponse> => {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      // Replace with your actual API endpoint
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
        credentials: 'include',
      });

      if (!response.ok) {
        // Refresh failed, clear tokens
        removeRefreshToken();
        removeCookie('access_token');
        throw new Error('Token refresh failed');
      }

      const data: RefreshTokenResponse = await response.json();

      // Update tokens in cookies
      if (data.accessToken) {
        setCookie('access_token', data.accessToken, 1);
      }
      if (data.refreshToken) {
        setRefreshToken(data.refreshToken);
      }

      return data;
    },
    onSuccess: () => {
      // Invalidate auth queries when token is refreshed
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
    onError: () => {
      // Clear tokens on error
      removeRefreshToken();
      removeCookie('access_token');
      queryClient.setQueryData(['auth', 'user'], null);
    },
  });

  /**
   * Refresh access token using refresh token
   */
  const refreshAccessToken = async (): Promise<boolean> => {
    try {
      await refreshAccessTokenMutation.mutateAsync();
      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  };

  /**
   * Mutation to update refresh token
   */
  const updateRefreshTokenMutation = useMutation({
    mutationFn: async (token: string) => {
      setRefreshToken(token);
      return token;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });

  /**
   * Update refresh token using mutation
   */
  const updateRefreshToken = async (token: string) => {
    await updateRefreshTokenMutation.mutateAsync(token);
  };

  return {
    getRefreshToken,
    hasRefreshToken,
    setRefreshToken,
    removeRefreshToken,
    refreshAccessToken,
    updateRefreshToken,
    isRefreshing: refreshAccessTokenMutation.isPending,
    isUpdating: updateRefreshTokenMutation.isPending,
  };
};
