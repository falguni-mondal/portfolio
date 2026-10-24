// admin/src/app/portfolio/layout.tsx
import type { ReactNode } from 'react';
import { PortfolioProvider } from '@/context/PortfolioContext';

export default function PortfolioLayout({ children }: { children: ReactNode }) {
  return <PortfolioProvider>{children}</PortfolioProvider>;
}