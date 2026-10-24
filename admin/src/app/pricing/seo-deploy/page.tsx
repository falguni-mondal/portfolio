// admin/src/app/pricing/seo-deploy/page.tsx
'use client';

import { PricingRateGrid, type RateItemMeta } from '@/context/PricingContext';

const SEO_DEPLOY_ITEMS: RateItemMeta[] = [
  { key: 'nextjsSeo', label: 'Advanced Next.js SEO Setup', desc: 'Dynamic sitemaps, OpenGraph, JSON-LD' },
  { key: 'speedOptimization', label: 'Performance & Speed Tuning', desc: 'Core Web Vitals & mobile data tuning' },
  { key: 'analyticsSetup', label: 'Analytics Setup', desc: 'Traffic & visitor tracking setup' },
  { key: 'cookieBanner', label: 'Cookie Consent Banner', desc: 'Privacy consent pop-up banner' },
  { key: 'hourlyRate', label: 'Hourly Custom Dev Rate', desc: 'Billed with a 2-hour minimum' },
  { key: 'hostingFrontend', label: 'One-Time Hosting Setup (Frontend)', desc: 'Vercel / Netlify / Hostinger setup' },
  { key: 'hostingFullstack', label: 'One-Time Hosting Setup (Full-Stack)', desc: 'Frontend + Backend + MongoDB Atlas' },
  { key: 'domainDnsSsl', label: 'Domain, DNS & SSL Setup', desc: 'Custom domain connection & HTTPS' },
];

export default function SeoDeployPricingPage() {
  return <PricingRateGrid items={SEO_DEPLOY_ITEMS} />;
}