'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/queryClient';
import { ToastProvider } from '@/hooks/useToast';
import ToastViewport from '@/components/ui/Toast';
import { AuthProvider } from '@/hooks/useAuth';
import { AuthGate } from '@/components/auth/AuthGate';

export function Providers({ children }: { children: React.ReactNode }) {
  const client = getQueryClient();
  return (
    <QueryClientProvider client={client}>
      <AuthProvider>
        <ToastProvider>
          <AuthGate>{children}</AuthGate>
          <ToastViewport />
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
