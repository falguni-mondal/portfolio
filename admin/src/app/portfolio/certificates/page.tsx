// admin/src/app/portfolio/certificates/page.tsx
'use client';

import {
  usePortfolioCms,
  prependPendingRecord,
  removePendingRecord,
} from '@/context/PortfolioContext';

export default function CertificatesSubpage() {
  const {
    portfolio,
    setPortfolio,
    pendingCertFiles,
    setPendingCertFiles,
    armedDragCard,
    dragSource,
    dragOverTarget,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    renderCardOrderControls,
  } = usePortfolioCms();

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-base font-bold">Verified Credentials &amp; Certificates</h3>
          <p className="text-xs opacity-60">
            New certificates are added at #01. Drag any card header (⋮⋮) or use ↑/↓ to reorder.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setPendingCertFiles((prev) => prependPendingRecord(prev));
            setPortfolio({
              ...portfolio,
              certificates: [
                {
                  _uid: `cert-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                  name: '',
                  organization: '',
                  year: '2026',
                  certId: '',
                  url: '/coming_soon.mp4',
                  fileId: '',
                },
                ...(portfolio.certificates || []),
              ],
            });
          }}
          className="liquid-glass-active cursor-pointer self-start rounded-full px-5 py-2.5 text-xs font-bold sm:self-auto"
        >
          + Add Certificate
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {(portfolio.certificates || []).map((c: any, idx: number) => {
          const certList = portfolio.certificates || [];
          const isDraggingThis =
            dragSource?.section === 'CERTIFICATES' && dragSource.index === idx;
          const isDragTarget =
            dragOverTarget?.section === 'CERTIFICATES' &&
            dragOverTarget.index === idx &&
            dragSource?.index !== idx;

          return (
            <div
              key={c._id || c._uid || idx}
              draggable={
                armedDragCard?.section === 'CERTIFICATES' && armedDragCard.index === idx
              }
              onDragStart={(e) => handleDragStart(e, 'CERTIFICATES', idx)}
              onDragOver={(e) => handleDragOver(e, 'CERTIFICATES', idx)}
              onDrop={(e) => handleDrop(e, 'CERTIFICATES', idx)}
              onDragEnd={handleDragEnd}
              className={`glass-subcard space-y-4 rounded-3xl p-4 transition sm:p-5 ${
                isDraggingThis ? 'scale-[0.98] opacity-50' : ''
              } ${isDragTarget ? 'ring-2 ring-[#FF5733]' : ''}`}
            >
              {renderCardOrderControls(
                'CERTIFICATES',
                idx,
                certList.length,
                'Certificate',
                () => {
                  setPendingCertFiles((prev) => removePendingRecord(prev, idx));
                  setPortfolio({
                    ...portfolio,
                    certificates: portfolio.certificates.filter(
                      (_: any, i: number) => i !== idx
                    ),
                  });
                },
                'Remove'
              )}

              <div>
                <label className="block text-xs font-bold opacity-80">Certificate Title *</label>
                <input
                  type="text"
                  value={c.name}
                  onChange={(e) => {
                    const next = [...portfolio.certificates];
                    next[idx] = { ...next[idx], name: e.target.value };
                    setPortfolio({ ...portfolio, certificates: next });
                  }}
                  placeholder="e.g. Job Ready Cohort"
                  className="glass-input mt-1.5 w-full rounded-xl px-3.5 py-2.5 text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-bold opacity-80">Organization</label>
                  <input
                    type="text"
                    value={c.organization}
                    onChange={(e) => {
                      const next = [...portfolio.certificates];
                      next[idx] = { ...next[idx], organization: e.target.value };
                      setPortfolio({ ...portfolio, certificates: next });
                    }}
                    placeholder="Sheryians / IIT"
                    className="glass-input mt-1.5 w-full rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold opacity-80">Issue Year</label>
                  <input
                    type="text"
                    value={c.year}
                    onChange={(e) => {
                      const next = [...portfolio.certificates];
                      next[idx] = { ...next[idx], year: e.target.value };
                      setPortfolio({ ...portfolio, certificates: next });
                    }}
                    placeholder="2025"
                    className="glass-input mt-1.5 w-full rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold opacity-80">Credential ID</label>
                  <input
                    type="text"
                    value={c.certId}
                    onChange={(e) => {
                      const next = [...portfolio.certificates];
                      next[idx] = { ...next[idx], certId: e.target.value };
                      setPortfolio({ ...portfolio, certificates: next });
                    }}
                    placeholder="Optional ID"
                    className="glass-input mt-1.5 w-full rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold opacity-80">
                  Certificate Link OR Upload File
                </label>
                <div className="mt-1.5 flex flex-col gap-2 sm:flex-row">
                  <input
                    type="text"
                    value={
                      pendingCertFiles[idx] ? `Queued: ${pendingCertFiles[idx].name}` : c.url
                    }
                    onChange={(e) => {
                      const next = [...portfolio.certificates];
                      next[idx] = { ...next[idx], url: e.target.value };
                      setPortfolio({ ...portfolio, certificates: next });
                    }}
                    placeholder="https://... or upload file"
                    className="glass-input w-full rounded-xl px-3.5 py-2 text-xs"
                  />
                  <label className="liquid-glass-active shrink-0 cursor-pointer rounded-xl px-4 py-2 text-center text-xs font-bold">
                    Upload File
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) setPendingCertFiles((p) => ({ ...p, [idx]: f }));
                        e.target.value = '';
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}