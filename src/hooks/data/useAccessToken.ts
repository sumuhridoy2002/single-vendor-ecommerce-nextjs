import { getCookie, removeCookie, setCookie } from '@/lib/cookies';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const TOKEN_KEY = 'access_token';
const TOKEN_EXPIRY_DAYS = 1; // 1 day

/**
 * Hook for managing access token
 */
export const useAccessToken = () => {
  const queryClient = useQueryClient();

  /**
   * Get the current access token from cookies
   */
  const getAccessToken = (): string | null => {
    return getCookie(TOKEN_KEY);
  };

  /**
   * Check if access token exists
   */
  const hasAccessToken = (): boolean => {
    return getAccessToken() !== null;
  };

  /**
   * Set access token in cookies
   */
  const setAccessToken = (token: string): void => {
    setCookie(TOKEN_KEY, token, TOKEN_EXPIRY_DAYS);
  };

  /**
   * Remove access token from cookies
   */
  const removeAccessToken = (): void => {
    removeCookie(TOKEN_KEY);
  };

  /**
   * Mutation to update access token
   */
  const updateAccessTokenMutation = useMutation({
    mutationFn: async (token: string) => {
      setAccessToken(token);
      return token;
    },
    onSuccess: () => {
      // Invalidate auth queries when token is updated
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });

  /**
   * Update access token using mutation
   */
  const updateAccessToken = async (token: string) => {
    await updateAccessTokenMutation.mutateAsync(token);
  };

  return {
    getAccessToken,
    hasAccessToken,
    setAccessToken,
    removeAccessToken,
    updateAccessToken,
    isUpdating: updateAccessTokenMutation.isPending,
  };
};
