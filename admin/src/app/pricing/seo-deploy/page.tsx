// admin/src/app/pricing/seo-deploy/page.tsx
'use client';

import { PricingRateGrid, type RateItemMeta } from '@/context/PricingContext';

const SEO_DEPLOY_ITEMS: RateItemMeta[] = [
  { key: 'nextjsSeo', label: 'Advanced Next.js SEO Setup', desc: 'Dynamic sitemaps, OpenGraph, JSON-LD' },
  { key: 'speedOptimization', label: 'Performance & Speed Tuning', desc: 'Core Web Vitals & mobile data tuning' },
  { key: 'analyticsSetup', label: 'Analytics Setup', desc: 'Traffic & visitor tracking setup' },
  { key: 'cookieBanner', label: 'Cookie Consent Banner', desc: 'Privacy consent pop-up banner' },
  { key: 'hourlyRate', label: 'Hourly Custom Dev Rate', desc: 'Billed with a 2-hour minimum' },
];

export default function SeoDeployPricingPage() {
  return (
    <div className="space-y-4">
      <div className="glass-subcard rounded-2xl p-4 text-xs">
        <span className="font-bold text-[#ff5733]">✓ Complimentary Deployment Policy:</span>{' '}
        <span className="opacity-80">
          One-Time Hosting Setup (Frontend &amp; Full-Stack) and Domain, DNS &amp; SSL Setup are
          provided free of charge (₹0 / $0) and are never billed to clients.
        </span>
      </div>
      <PricingRateGrid items={SEO_DEPLOY_ITEMS} />
    </div>
  );
}