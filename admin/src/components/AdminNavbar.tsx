// admin/src/components/AdminNavbar.tsx
import { useState, type FC, type ReactNode } from 'react';
import { ThemeIcon } from './LiquidGlassDefs';

export type AdminTab = 'RESPONSES' | 'PORTFOLIO' | 'PRICING_SETTINGS';

interface Props {
  mainTab: AdminTab;
  setMainTab: (tab: AdminTab) => void;
  quotesCount: number;
  darkMode: boolean;
  toggleDarkMode: () => void;
  onLogout: () => void;
}

export const AdminNavbar: FC<Props> = ({
  mainTab,
  setMainTab,
  quotesCount,
  darkMode,
  toggleDarkMode,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: AdminTab; label: string; icon: ReactNode }[] = [
    {
      id: 'RESPONSES',
      label: `Client Responses (${quotesCount})`,
      icon: (
        <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
    {
      id: 'PORTFOLIO',
      label: 'Portfolio CMS',
      icon: (
        <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18M9 21V9" />
        </svg>
      ),
    },
    {
      id: 'PRICING_SETTINGS',
      label: 'Master Price Controls',
      icon: (
        <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M2 12h3M19 12h3M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12" />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* DESKTOP STICKY HEADER BAR */}
      <header className="sticky top-0 z-40 hidden border-b border-neutral-200/80 bg-white/95 px-6 py-4 backdrop-blur-md dark:border-neutral-800 dark:bg-[#111113]/95 lg:block">
        <div className="mx-auto flex max-w-[1750px] items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-black tracking-tighter">
              BY<span className="text-[#ff5733]">F</span>.
            </span>
            <span className="text-xs font-bold uppercase tracking-widest opacity-50">
              Admin Command Center
            </span>
          </div>

          <div className="flex items-center gap-2">
            {navItems.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setMainTab(t.id)}
                className={`cursor-pointer rounded-full px-5 py-2 text-xs font-bold transition ${
                  mainTab === t.id
                    ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950'
                    : 'text-neutral-600 hover:bg-neutral-200/60 dark:text-neutral-300 dark:hover:bg-neutral-800'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleDarkMode}
              className="glass-subcard flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-xs font-bold"
            >
              <ThemeIcon darkMode={darkMode} />
              <span>{darkMode ? 'Light' : 'Dark'}</span>
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="glass-subcard cursor-pointer rounded-full px-4 py-2 text-xs font-semibold hover:bg-red-500/15 hover:text-red-500"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE 3 POPUP TABS (Each wrapped in its own fixed positioning container like Pricing HUD) */}
      {mobileMenuOpen &&
        navItems.map((item, idx) => {
          const bottomOffsets = ['bottom-[180px]', 'bottom-[130px]', 'bottom-[80px]'];
          const isActive = mainTab === item.id;
          return (
            <div
              key={item.id}
              className={`fixed left-1/2 z-50 w-[240px] -translate-x-1/2 lg:hidden ${bottomOffsets[idx]}`}
            >
              <button
                type="button"
                onClick={() => {
                  setMainTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-full px-6 py-3 text-xs font-bold transition-all ${
                  isActive ? 'liquid-glass-active' : 'liquid-glass-pill'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            </div>
          );
        })}

      {/* MOBILE BOTTOM CAPSULE NAVBAR (Exact same fixed outer + inner .liquid-glass-pill as Pricing HUD) */}
      <div className="fixed bottom-4 left-1/2 z-50 w-fit -translate-x-1/2 lg:hidden">
        <div className="liquid-glass-pill flex items-center gap-4 rounded-full p-1.5">
          {/* Light BG Circle for BYF. Logo */}
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white bg-[#f4f4f4] text-xs font-black tracking-tighter text-neutral-950 shadow-sm">
            BY<span className="text-[#ff5733]">F</span>.
          </div>

          <button
            type="button"
            onClick={toggleDarkMode}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full opacity-80 hover:opacity-100"
            title="Toggle Theme"
          >
            <ThemeIcon darkMode={darkMode} />
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
            className="liquid-glass-active flex h-11 w-11 cursor-pointer items-center justify-center rounded-full"
          >
            {mobileMenuOpen ? (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path strokeLinecap="round" d="M6 6l12 12M6 18L18 6" />
              </svg>
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path strokeLinecap="round" d="M5 9h14M5 15h14" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </>
  );
};