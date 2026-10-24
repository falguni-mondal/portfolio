// admin/src/app/portfolio/page.tsx
import { redirect } from 'next/navigation';

export default function PortfolioIndexPage() {
  redirect('/portfolio/hero-resume');
}