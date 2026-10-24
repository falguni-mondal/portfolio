// admin/src/app/pricing/layout.tsx
import type { ReactNode } from 'react';
import { PricingProvider } from '@/context/PricingContext';

export default function PricingLayout({ children }: { children: ReactNode }) {
  return <PricingProvider>{children}</PricingProvider>;
}