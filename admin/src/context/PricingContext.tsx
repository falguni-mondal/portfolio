// admin/src/context/PricingContext.tsx
'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type FC,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdmin } from '@/context/AdminContext';

export interface RateItemMeta {
  key: string;
  label: string;
  desc: string;
}

const EMPTY_PRICING_FALLBACK = {
  exchangeRateInrPerUsd: 95.15,
  usdPerInrRate: 0.01051,
  exchangeRateLastUpdated: null,
  globalMultiplier: 1,
  activeOfferDiscountPercent: 0,
  gstRegistered: false,
  rates: {},
};

interface PricingContextValue {
  pricingConfig: any;
  setPricingConfig: Dispatch<SetStateAction<any>>;
}

const PricingContext = createContext<PricingContextValue | null>(null);

export const usePricing = () => {
  const ctx = useContext(PricingContext);
  if (!ctx) throw new Error('usePricing must be used within PricingProvider');
  return ctx;
};

export const PricingRateGrid: FC<{ items: RateItemMeta[] }> = ({ items }) => {
  const { pricingConfig, setPricingConfig } = usePricing();

  return (
    <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        const rateObj = pricingConfig.rates?.[item.key] || { inr: 0, usd: 0 };
        return (
          <div key={item.key} className="glass-subcard rounded-2xl p-4">
            <div className="text-xs font-bold">{item.label}</div>
            <p className="mt-0.5 text-[11px] opacity-60">{item.desc}</p>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase opacity-60">
                  India Billed (₹ INR)
                </label>
                <input
                  type="number"
                  value={rateObj.inr}
                  onChange={(e) => {
                    const newInr = Number(e.target.value);
                    const usdRate = Number(pricingConfig.usdPerInrRate || 0.01051);
                    const autoUsd =
                      newInr === 0
                        ? 0
                        : Math.max(1, Math.round(newInr * usdRate * (1.3 / 0.97)));
                    setPricingConfig({
                      ...pricingConfig,
                      rates: {
                        ...pricingConfig.rates,
                        [item.key]: { inr: newInr, usd: autoUsd },
                      },
                    });
                  }}
                  className="glass-input mt-1 w-full rounded-xl px-3 py-1.5 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase opacity-60">
                  Intl Billed ($ USD)
                </label>
                <input
                  type="number"
                  value={rateObj.usd}
                  onChange={(e) =>
                    setPricingConfig({
                      ...pricingConfig,
                      rates: {
                        ...pricingConfig.rates,
                        [item.key]: { ...rateObj, usd: Number(e.target.value) },
                      },
                    })
                  }
                  className="glass-input mt-1 w-full rounded-xl px-3 py-1.5 text-xs font-bold"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const PricingProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const {
    authenticated,
    pricingConfig,
    setPricingConfig,
    pricingLoading,
    ensurePricingLoaded,
  } = useAdmin();

  const activePricingConfig = pricingConfig || EMPTY_PRICING_FALLBACK;

  const [savingPricing, setSavingPricing] = useState(false);
  const [syncingRate, setSyncingRate] = useState(false);
  const [pricingSavedToast, setPricingSavedToast] = useState(false);

  useEffect(() => {
    if (authenticated) {
      ensurePricingLoaded();
    }
  }, [authenticated, ensurePricingLoaded]);

  const handleForceExchangeRateSync = async () => {
    setSyncingRate(true);
    const res = await fetch('/api/pricing-config?syncRate=1');
    if (res.ok) {
      setPricingConfig(await res.json());
    }
    setSyncingRate(false);
  };

  const categoryNavItems = [
    { href: '/pricing/pages-content', title: 'Pages, Sections & Languages' },
    { href: '/pricing/motion-ui', title: 'Interactive Features & Motion' },
    { href: '/pricing/webgl-3d', title: 'WebGL & Interactive 3D' },
    { href: '/pricing/backend', title: 'Backend, Auth, Database & Bundles' },
    { href: '/pricing/seo-deploy', title: 'SEO, Performance, Deployment & Hourly' },
  ];

  const isLoaded = Boolean(pricingConfig) && !pricingLoading;

  return (
    <PricingContext.Provider value={{ pricingConfig: activePricingConfig, setPricingConfig }}>
      {!isLoaded && (
        <div className="admin-surface-card rounded-3xl p-8 text-center text-xs font-semibold opacity-70">
          Loading Master Price Controls...
        </div>
      )}

      {/* Always keep {children} mounted in the render tree so Next.js 16 instant-navigation validation succeeds */}
      <div className={isLoaded ? 'admin-surface-card space-y-8 rounded-3xl p-4 sm:p-8' : 'hidden'}>
        <div className="flex flex-col justify-between gap-4 border-b border-neutral-500/15 pb-6 sm:flex-row sm:items-center">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest opacity-50">
              prices.byfalguni.com Engine Configuration
            </span>
            <h2 className="mt-1 text-xl font-black sm:text-2xl">
              Master Price &amp; Offer Controls
            </h2>
          </div>

          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            {pricingSavedToast && (
              <span className="text-xs font-bold opacity-80">✓ Saved to MongoDB</span>
            )}
            <button
              type="button"
              disabled={savingPricing}
              onClick={async () => {
                setSavingPricing(true);
                await fetch('/api/pricing-config', {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(activePricingConfig),
                });
                setSavingPricing(false);
                setPricingSavedToast(true);
                setTimeout(() => setPricingSavedToast(false), 3000);
              }}
              className="liquid-glass-active cursor-pointer rounded-full px-7 py-3.5 text-xs font-bold shadow-md"
            >
              {savingPricing ? 'Saving...' : 'Save Master Pricing →'}
            </button>
          </div>
        </div>

        {/* Global Controls & 12h Cron Exchange Rate Telemetry */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="glass-subcard flex flex-col justify-between rounded-2xl p-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">
                  Live ExchangeRate-API (12h Cron)
                </span>
                <button
                  type="button"
                  disabled={syncingRate}
                  onClick={handleForceExchangeRateSync}
                  className="cursor-pointer text-[11px] font-bold underline opacity-75 hover:opacity-100"
                >
                  {syncingRate ? 'Syncing...' : 'Sync Now'}
                </button>
              </div>
              <p className="mt-2 text-xl font-black">
                $1 = ₹{activePricingConfig.exchangeRateInrPerUsd || 95.15}
              </p>
              <p className="mt-0.5 font-mono text-[11px] opacity-65">
                1 INR = ${activePricingConfig.usdPerInrRate || 0.01051} USD
              </p>
            </div>
            <p className="mt-2 text-[10px] opacity-50">
              Last synced:{' '}
              {activePricingConfig.exchangeRateLastUpdated
                ? new Date(activePricingConfig.exchangeRateLastUpdated).toLocaleString('en-IN', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  })
                : 'Auto-scheduled'}
            </p>
          </div>

          <div className="glass-subcard rounded-2xl p-4">
            <label className="block text-xs font-bold opacity-80">
              Global Price Multiplier (e.g. 1.10 = +10%)
            </label>
            <p className="text-[11px] opacity-55">
              Scales all base &amp; add-on prices across the entire calculator.
            </p>
            <input
              type="number"
              step="0.05"
              value={activePricingConfig.globalMultiplier}
              onChange={(e) =>
                setPricingConfig({
                  ...activePricingConfig,
                  globalMultiplier: Number(e.target.value),
                })
              }
              className="glass-input mt-2.5 w-full rounded-xl px-3.5 py-2 text-sm font-bold"
            />
          </div>

          <div className="glass-subcard rounded-2xl p-4">
            <label className="block text-xs font-bold opacity-80">
              Global Offer Discount % (Max 25%)
            </label>
            <p className="text-[11px] opacity-55">
              Applied strictly to final project total for seasonal/festival offers.
            </p>
            <input
              type="number"
              min={0}
              max={25}
              value={activePricingConfig.activeOfferDiscountPercent}
              onChange={(e) =>
                setPricingConfig({
                  ...activePricingConfig,
                  activeOfferDiscountPercent: Number(e.target.value),
                })
              }
              className="glass-input mt-2.5 w-full rounded-xl px-3.5 py-2 text-sm font-bold"
            />
          </div>

          <div className="glass-subcard flex flex-col justify-between rounded-2xl p-4">
            <div>
              <span className="block text-xs font-bold opacity-80">
                Indian GST Registration Status
              </span>
              <p className="mt-0.5 text-[11px] opacity-55">
                When enabled, adds +18% GST to Indian client quotes.
              </p>
            </div>
            <label className="mt-3 flex cursor-pointer items-center gap-2.5 text-xs font-bold">
              <input
                type="checkbox"
                checked={Boolean(activePricingConfig.gstRegistered)}
                onChange={(e) =>
                  setPricingConfig({
                    ...activePricingConfig,
                    gstRegistered: e.target.checked,
                  })
                }
                className="h-4 w-4 cursor-pointer"
              />
              <span>
                {activePricingConfig.gstRegistered ? '18% GST Active' : 'No GST (<₹20L)'}
              </span>
            </label>
          </div>
        </div>

        {/* Category Filter Subpage Route Tabs */}
        <div>
          <nav className="flex flex-wrap gap-2 border-b border-neutral-500/15 pb-4">
            {categoryNavItems.map((cat) => {
              const isActive = pathname === cat.href;
              return (
                <Link
                  key={cat.href}
                  href={cat.href}
                  prefetch={true}
                  className={`cursor-pointer rounded-full px-4 py-2 text-xs font-bold transition ${
                    isActive ? 'liquid-glass-active' : 'glass-subcard'
                  }`}
                >
                  {cat.title}
                </Link>
              );
            })}
          </nav>

          {children}
        </div>
      </div>
    </PricingContext.Provider>
  );
};