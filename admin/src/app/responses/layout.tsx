// admin/src/app/responses/layout.tsx
import type { ReactNode } from 'react';
import { ResponsesProvider } from '@/context/ResponsesContext';

export default function ResponsesLayout({ children }: { children: ReactNode }) {
  return <ResponsesProvider>{children}</ResponsesProvider>;
}