// admin/src/app/portfolio/arsenal-contact/page.tsx
'use client';

import { usePortfolioCms } from '@/context/PortfolioContext';

export default function ArsenalContactSubpage() {
  const { portfolio, setPortfolio } = usePortfolioCms();

  return (
    <div className="space-y-6">
      <div className="glass-subcard rounded-3xl p-4 sm:p-5">
        <label className="block text-xs font-bold uppercase tracking-wider opacity-70">
          Core Arsenal Skills (Comma-Separated)
        </label>
        <input
          type="text"
          value={(portfolio.arsenal || []).join(', ')}
          onChange={(e) =>
            setPortfolio({
              ...portfolio,
              arsenal: e.target.value.split(',').map((s: string) => s.trim()),
            })
          }
          className="glass-input mt-2 w-full rounded-2xl px-4 py-3 text-xs font-semibold"
        />
      </div>

      <div className="glass-subcard rounded-3xl p-4 sm:p-5">
        <h4 className="text-xs font-bold uppercase tracking-wider opacity-70">
          Contact &amp; Social URLs
        </h4>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            { key: 'mail', label: 'Primary Contact Email' },
            { key: 'linkedin', label: 'LinkedIn Profile URL' },
            { key: 'github', label: 'GitHub Profile URL' },
            { key: 'insta', label: 'Instagram Profile URL' },
          ].map((f) => (
            <div key={f.key}>
              <label className="block text-xs font-bold opacity-80">{f.label}</label>
              <input
                type="text"
                value={portfolio.contact?.[f.key] || ''}
                onChange={(e) =>
                  setPortfolio({
                    ...portfolio,
                    contact: { ...portfolio.contact, [f.key]: e.target.value },
                  })
                }
                className="glass-input mt-1.5 w-full rounded-xl px-3.5 py-2.5 text-xs font-semibold"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}