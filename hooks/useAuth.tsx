'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authApi, clearAuth, getStoredUser, getToken, type AuthUser } from '@/lib/auth';

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // On mount: hydrate from localStorage and validate token by calling /me.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const token = getToken();
      if (!token) {
        setIsLoading(false);
        return;
      }
      const cached = getStoredUser();
      if (cached) setUser(cached);

      try {
        const fresh = await authApi.me();
        if (!cancelled) setUser(fresh);
      } catch {
        if (!cancelled) {
          clearAuth();
          setUser(null);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const u = await authApi.login(email, password);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
    router.replace('/login');
  }, [router]);

  // Redirect to /login when an unauthenticated user lands on a protected route.
  useEffect(() => {
    if (isLoading) return;
    if (!user && !pathname.startsWith('/login')) {
      const next = encodeURIComponent(pathname + (typeof window !== 'undefined' ? window.location.search : ''));
      router.replace(`/login?next=${next}`);
    }
  }, [isLoading, user, pathname, router]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      logout,
    }),
    [user, isLoading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
