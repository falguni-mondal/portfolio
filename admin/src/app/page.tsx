// admin/src/app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { LiquidGlassDefs } from '@/components/LiquidGlassDefs';
import { AdminNavbar, type AdminTab } from '@/components/AdminNavbar';
import { AdminLoginGate } from '@/components/AdminLoginGate';
import { ResponsesTab } from '@/components/ResponsesTab';
import { PortfolioCmsTab } from '@/components/PortfolioCmsTab';
import { MasterPricingTab } from '@/components/MasterPricingTab';

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [mainTab, setMainTab] = useState<AdminTab>('RESPONSES');

  const [quotes, setQuotes] = useState<any[]>([]);
  const [portfolio, setPortfolio] = useState<any>(null);
  const [pricingConfig, setPricingConfig] = useState<any>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('byf-admin-theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('byf-admin-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('byf-admin-theme', 'light');
    }
  };

  const loadAdminData = async () => {
    const [qRes, pRes, cRes] = await Promise.all([
      fetch('/api/quotes'),
      fetch('/api/portfolio'),
      fetch('/api/pricing-config'),
    ]);
    if (qRes.ok) setQuotes(await qRes.json());
    if (pRes.ok) setPortfolio(await pRes.json());
    if (cRes.ok) setPricingConfig(await cRes.json());
  };

  useEffect(() => {
    fetch('/api/auth/login')
      .then((r) => r.json())
      .then((d) => {
        setAuthenticated(Boolean(d.authenticated));
        if (d.authenticated) loadAdminData();
      })
      .catch(() => setAuthenticated(false));
  }, []);

  if (authenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm font-semibold">
        Initializing BYF. Command Center...
      </div>
    );
  }

  if (!authenticated) {
    return (
      <AdminLoginGate
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        onSuccess={() => {
          setAuthenticated(true);
          loadAdminData();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen w-full pb-36 lg:pb-16">
      <LiquidGlassDefs />

      <AdminNavbar
        mainTab={mainTab}
        setMainTab={setMainTab}
        quotesCount={quotes.length}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        onLogout={async () => {
          await fetch('/api/auth/login', { method: 'DELETE' });
          setAuthenticated(false);
        }}
      />

      <main className="mx-auto w-full max-w-[1750px] px-3 pt-4 sm:px-6 lg:pt-8">
        {mainTab === 'RESPONSES' && <ResponsesTab quotes={quotes} setQuotes={setQuotes} />}
        {mainTab === 'PORTFOLIO' && portfolio && (
          <PortfolioCmsTab portfolio={portfolio} setPortfolio={setPortfolio} />
        )}
        {mainTab === 'PRICING_SETTINGS' && pricingConfig && (
          <MasterPricingTab
            pricingConfig={pricingConfig}
            setPricingConfig={setPricingConfig}
          />
        )}
      </main>
    </div>
  );
}