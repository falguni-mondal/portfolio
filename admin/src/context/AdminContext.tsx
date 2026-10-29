// admin/src/context/AdminContext.tsx
'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type FC,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { LiquidGlassDefs } from '@/components/LiquidGlassDefs';
import { AdminNavbar } from '@/components/AdminNavbar';
import { AdminLoginGate } from '@/components/AdminLoginGate';

interface AdminContextValue {
  authenticated: boolean | null;
  darkMode: boolean;
  toggleDarkMode: () => void;
  quotes: any[];
  setQuotes: Dispatch<SetStateAction<any[]>>;
  quotesLoading: boolean;
  ensureQuotesLoaded: () => Promise<void>;
  portfolio: any;
  setPortfolio: Dispatch<SetStateAction<any>>;
  portfolioLoading: boolean;
  ensurePortfolioLoaded: () => Promise<void>;
  pricingConfig: any;
  setPricingConfig: Dispatch<SetStateAction<any>>;
  pricingLoading: boolean;
  ensurePricingLoaded: () => Promise<void>;
}

const AdminContext = createContext<AdminContextValue | null>(null);

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
};

export const AdminProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    try {
      return localStorage.getItem('byf-admin-theme') !== 'light';
    } catch {
      return true;
    }
  });

  const [quotes, setQuotes] = useState<any[]>([]);
  const [quotesLoading, setQuotesLoading] = useState(false);
  const quotesLoadedRef = useRef(false);

  const [portfolio, setPortfolio] = useState<any>(null);
  const [portfolioLoading, setPortfolioLoading] = useState(false);
  const portfolioLoadedRef = useRef(false);

  const [pricingConfig, setPricingConfig] = useState<any>(null);
  const [pricingLoading, setPricingLoading] = useState(false);
  const pricingLoadedRef = useRef(false);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('byf-admin-theme');
      const isDark = savedTheme !== 'light';
      setDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('byf-admin-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('byf-admin-theme', 'light');
      }
      return next;
    });
  }, []);

  const ensureQuotesLoaded = useCallback(async () => {
    if (quotesLoadedRef.current) return;
    quotesLoadedRef.current = true;
    setQuotesLoading(true);
    try {
      const res = await fetch('/api/quotes');
      if (res.ok) {
        setQuotes(await res.json());
      } else {
        quotesLoadedRef.current = false;
      }
    } catch {
      quotesLoadedRef.current = false;
    } finally {
      setQuotesLoading(false);
    }
  }, []);

  const ensurePortfolioLoaded = useCallback(async () => {
    if (portfolioLoadedRef.current) return;
    portfolioLoadedRef.current = true;
    setPortfolioLoading(true);
    try {
      const res = await fetch('/api/portfolio');
      if (res.ok) {
        setPortfolio(await res.json());
      } else {
        portfolioLoadedRef.current = false;
      }
    } catch {
      portfolioLoadedRef.current = false;
    } finally {
      setPortfolioLoading(false);
    }
  }, []);

  const ensurePricingLoaded = useCallback(async () => {
    if (pricingLoadedRef.current) return;
    pricingLoadedRef.current = true;
    setPricingLoading(true);
    try {
      const res = await fetch('/api/pricing-config');
      if (res.ok) {
        setPricingConfig(await res.json());
      } else {
        pricingLoadedRef.current = false;
      }
    } catch {
      pricingLoadedRef.current = false;
    } finally {
      setPricingLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch('/api/auth/login')
      .then((r) => r.json())
      .then((d) => {
        const isAuth = Boolean(d.authenticated);
        setAuthenticated(isAuth);
        if (isAuth) {
          ensureQuotesLoaded();
          ensurePricingLoaded();
        }
      })
      .catch(() => setAuthenticated(false));
  }, [ensureQuotesLoaded, ensurePricingLoaded]);

  const handleLogout = async () => {
    await fetch('/api/auth/login', { method: 'DELETE' });
    quotesLoadedRef.current = false;
    portfolioLoadedRef.current = false;
    pricingLoadedRef.current = false;
    setQuotes([]);
    setPortfolio(null);
    setPricingConfig(null);
    setAuthenticated(false);
  };

  return (
    <AdminContext.Provider
      value={{
        authenticated,
        darkMode,
        toggleDarkMode,
        quotes,
        setQuotes,
        quotesLoading,
        ensureQuotesLoaded,
        portfolio,
        setPortfolio,
        portfolioLoading,
        ensurePortfolioLoaded,
        pricingConfig,
        setPricingConfig,
        pricingLoading,
        ensurePricingLoaded,
      }}
    >
      {authenticated === null && (
        <div className="flex min-h-screen items-center justify-center text-sm font-semibold">
          Initializing BYF. Command Center...
        </div>
      )}

      {authenticated === false && (
        <AdminLoginGate
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          onSuccess={() => {
            setAuthenticated(true);
            ensureQuotesLoaded();
            ensurePricingLoaded();
          }}
        />
      )}

      {/* Always keep {children} mounted in the render tree so Next.js 16 instant-navigation validation succeeds */}
      <div className={authenticated === true ? 'min-h-screen w-full pb-36 lg:pb-16' : 'hidden'}>
        <LiquidGlassDefs />

        <AdminNavbar
          quotesCount={quotes.length}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          onLogout={handleLogout}
        />

        <main className="mx-auto w-full max-w-[1750px] px-3 pt-4 sm:px-6 lg:pt-8">
          {children}
        </main>
      </div>
    </AdminContext.Provider>
  );
};