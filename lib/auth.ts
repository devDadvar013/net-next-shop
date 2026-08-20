'use client';

import { api, extractErrorMessage } from './api';

const TOKEN_KEY = 'shoporders.token';
const USER_KEY  = 'shoporders.user';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
}

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const getStoredUser = (): AuthUser | null => {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
};

export const setToken = (token: string) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
};

export const setStoredUser = (user: AuthUser) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearAuth = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const authApi = {
  login: async (email: string, password: string, device_name?: string) => {
    try {
      const { data } = await api.post<{
        message: string;
        data: { user: AuthUser; token: string };
      }>('/auth/login', { email, password, device_name });
      setToken(data.data.token);
      setStoredUser(data.data.user);
      return data.data.user;
    } catch (err) {
      throw new Error(extractErrorMessage(err));
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      // ignore network errors on logout — we still clear local state
      console.warn('Logout request failed:', err);
    } finally {
      clearAuth();
    }
  },

  me: async (): Promise<AuthUser> => {
    try {
      const { data } = await api.get<{ data: AuthUser }>('/auth/me');
      setStoredUser(data.data);
      return data.data;
    } catch (err) {
      throw new Error(extractErrorMessage(err));
    }
  },
};
