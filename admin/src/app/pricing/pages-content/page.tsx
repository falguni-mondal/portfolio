// admin/src/app/pricing/pages-content/page.tsx
'use client';

import { PricingRateGrid, type RateItemMeta } from '@/context/PricingContext';

const PAGES_CONTENT_ITEMS: RateItemMeta[] = [
  { key: 'page1', label: '1st Static Page', desc: 'Base first static page (up to 6 sections)' },
  { key: 'page2to5', label: 'Pages 2 to 5 (per page)', desc: 'Each additional static page up to 5' },
  { key: 'page6plus', label: 'Page 6+ (per page)', desc: 'Each static page beyond 5 pages' },
  { key: 'extraSectionStatic', label: 'Extra Section (Static/Basic)', desc: 'Beyond 6 sections on a page' },
  { key: 'extraSectionAdvanced', label: 'Extra Section (Adv. Animation)', desc: 'Beyond 6 sections with award motion' },
  { key: 'dynamicTemplate20', label: 'Dynamic Catalog Template (20 items)', desc: 'Uniform layout from CSV/JSON' },
  { key: 'extraDynamic10', label: 'Each Extra 10 Catalog Items', desc: 'Additional 10 items on same template' },
  { key: 'multiLangFirst', label: 'Multi-Language Setup (+1st lang)', desc: 'Language switcher + 1st extra language' },
  { key: 'multiLangExtra', label: 'Each Further Language', desc: 'Per additional language route' },
  { key: 'rtlSurcharge', label: 'Right-to-Left (RTL) Surcharge', desc: 'Arabic / Urdu layout adjustment' },
];

export default function PagesContentPricingPage() {
  return <PricingRateGrid items={PAGES_CONTENT_ITEMS} />;
}