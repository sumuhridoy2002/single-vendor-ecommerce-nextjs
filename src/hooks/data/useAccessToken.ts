import { useMutation, useQueryClient } from '@tanstack/react-query';

const TOKEN_KEY = 'access_token';

/**
 * Hook for managing access token (stored in localStorage)
 */
export const useAccessToken = () => {
  const queryClient = useQueryClient();

  /**
   * Get the current access token from localStorage
   */
  const getAccessToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  };

  /**
   * Check if access token exists
   */
  const hasAccessToken = (): boolean => {
    return getAccessToken() !== null;
  };

  /**
   * Set access token in localStorage
   */
  const setAccessToken = (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, token);
  };

  /**
   * Remove access token from localStorage
   */
  const removeAccessToken = (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
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
