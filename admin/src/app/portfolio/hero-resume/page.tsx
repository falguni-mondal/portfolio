// admin/src/app/portfolio/hero-resume/page.tsx
'use client';

import { useState } from 'react';
import {
  usePortfolioCms,
  resolveAssetPreviewUrl,
  extractDisplayFileName,
} from '@/context/PortfolioContext';

export default function HeroResumeSubpage() {
  const {
    portfolio,
    setPortfolio,
    pendingHeroDarkFile,
    setPendingHeroDarkFile,
    pendingHeroLightFile,
    setPendingHeroLightFile,
    pendingResumeFile,
    setPendingResumeFile,
    heroDarkObjUrl,
    heroLightObjUrl,
    resumeObjUrl,
  } = usePortfolioCms();

  const [isResumeViewerOpen, setIsResumeViewerOpen] = useState(false);

  const activeHeroDarkUrl = portfolio.heroImageDark || '/me.webp';
  const activeHeroLightUrl = portfolio.heroImageLight || '/me_light.webp';
  const activeResumeUrl = portfolio.resumeUrl || '/falguni_mondal_resume.pdf';

  const heroDarkPreviewSrc =
    heroDarkObjUrl || resolveAssetPreviewUrl(activeHeroDarkUrl, '/me.webp');
  const heroLightPreviewSrc =
    heroLightObjUrl || resolveAssetPreviewUrl(activeHeroLightUrl, '/me_light.webp');

  const resumeInlineViewerSrc =
    resumeObjUrl || `/api/portfolio?previewPdf=${encodeURIComponent(activeResumeUrl)}`;

  return (
    <div className="space-y-6">
      {/* Hero Images Grid (Dark Mode & Light Mode) */}
      <div>
        <h3 className="text-base font-bold">Hero Portrait Images</h3>
        <p className="text-xs opacity-60">
          Preview your current active Hero portraits and queue replacements. Changes publish to
          ImageKit when you click Save &amp; Publish.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Dark Mode Hero Portrait */}
          <div className="glass-subcard flex flex-col gap-4 rounded-3xl p-4 sm:flex-row sm:p-5">
            <div className="relative mx-auto h-64 w-48 shrink-0 overflow-hidden rounded-2xl border border-neutral-500/20 bg-neutral-900 sm:mx-0">
              <img
                src={heroDarkPreviewSrc}
                alt="Dark Theme Hero Preview"
                className="h-full w-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.fallbackTried) {
                    target.dataset.fallbackTried = '1';
                    target.src = activeHeroDarkUrl;
                  }
                }}
              />
              <span
                className={`absolute top-2.5 left-2.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow ${
                  pendingHeroDarkFile
                    ? 'bg-amber-500 text-black'
                    : 'bg-emerald-600/90 text-white'
                }`}
              >
                {pendingHeroDarkFile ? 'Queued Preview' : 'Current File'}
              </span>
            </div>

            <div className="flex flex-1 flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider opacity-60">
                    Dark Theme Hero Image
                  </span>
                  <a
                    href={heroDarkPreviewSrc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold underline opacity-75 hover:opacity-100"
                  >
                    Open Full Image ↗
                  </a>
                </div>

                <div className="rounded-xl border border-neutral-500/15 p-2.5 text-xs">
                  <span className="block text-[10px] font-bold uppercase tracking-wider opacity-50">
                    {pendingHeroDarkFile ? 'Queued File Name' : 'Current Active File'}
                  </span>
                  <p className="mt-0.5 truncate font-mono text-[11px] font-semibold">
                    {pendingHeroDarkFile
                      ? pendingHeroDarkFile.name
                      : extractDisplayFileName(activeHeroDarkUrl, 'me.webp')}
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] font-bold opacity-75">
                    Image URL / Path
                  </label>
                  <input
                    type="text"
                    value={
                      pendingHeroDarkFile
                        ? `Queued: ${pendingHeroDarkFile.name}`
                        : activeHeroDarkUrl
                    }
                    onChange={(e) => {
                      setPendingHeroDarkFile(null);
                      setPortfolio({
                        ...portfolio,
                        heroImageDark: e.target.value,
                      });
                    }}
                    placeholder="/me.webp or https://ik.imagekit.io/..."
                    className="glass-input mt-1 w-full rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2">
                <label className="liquid-glass-active cursor-pointer rounded-full px-4 py-2 text-xs font-bold">
                  Upload Dark Hero Image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) setPendingHeroDarkFile(f);
                      e.target.value = '';
                    }}
                  />
                </label>

                {pendingHeroDarkFile && (
                  <button
                    type="button"
                    onClick={() => setPendingHeroDarkFile(null)}
                    className="cursor-pointer rounded-full border border-neutral-500/30 px-3.5 py-1.5 text-[11px] font-bold opacity-80 hover:opacity-100"
                  >
                    Cancel Queued
                  </button>
                )}

                {activeHeroDarkUrl !== '/me.webp' && !pendingHeroDarkFile && (
                  <button
                    type="button"
                    onClick={() =>
                      setPortfolio({
                        ...portfolio,
                        heroImageDark: '/me.webp',
                      })
                    }
                    className="cursor-pointer rounded-full border border-neutral-500/30 px-3.5 py-1.5 text-[11px] font-bold opacity-75 hover:opacity-100"
                  >
                    Reset Default
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Light Mode Hero Portrait */}
          <div className="glass-subcard flex flex-col gap-4 rounded-3xl p-4 sm:flex-row sm:p-5">
            <div className="relative mx-auto h-64 w-48 shrink-0 overflow-hidden rounded-2xl border border-neutral-500/20 bg-neutral-200 sm:mx-0">
              <img
                src={heroLightPreviewSrc}
                alt="Light Theme Hero Preview"
                className="h-full w-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.fallbackTried) {
                    target.dataset.fallbackTried = '1';
                    target.src = activeHeroLightUrl;
                  }
                }}
              />
              <span
                className={`absolute top-2.5 left-2.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow ${
                  pendingHeroLightFile
                    ? 'bg-amber-500 text-black'
                    : 'bg-emerald-600/90 text-white'
                }`}
              >
                {pendingHeroLightFile ? 'Queued Preview' : 'Current File'}
              </span>
            </div>

            <div className="flex flex-1 flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider opacity-60">
                    Light Theme Hero Image
                  </span>
                  <a
                    href={heroLightPreviewSrc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold underline opacity-75 hover:opacity-100"
                  >
                    Open Full Image ↗
                  </a>
                </div>

                <div className="rounded-xl border border-neutral-500/15 p-2.5 text-xs">
                  <span className="block text-[10px] font-bold uppercase tracking-wider opacity-50">
                    {pendingHeroLightFile ? 'Queued File Name' : 'Current Active File'}
                  </span>
                  <p className="mt-0.5 truncate font-mono text-[11px] font-semibold">
                    {pendingHeroLightFile
                      ? pendingHeroLightFile.name
                      : extractDisplayFileName(activeHeroLightUrl, 'me_light.webp')}
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] font-bold opacity-75">
                    Image URL / Path
                  </label>
                  <input
                    type="text"
                    value={
                      pendingHeroLightFile
                        ? `Queued: ${pendingHeroLightFile.name}`
                        : activeHeroLightUrl
                    }
                    onChange={(e) => {
                      setPendingHeroLightFile(null);
                      setPortfolio({
                        ...portfolio,
                        heroImageLight: e.target.value,
                      });
                    }}
                    placeholder="/me_light.webp or https://ik.imagekit.io/..."
                    className="glass-input mt-1 w-full rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2">
                <label className="liquid-glass-active cursor-pointer rounded-full px-4 py-2 text-xs font-bold">
                  Upload Light Hero Image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) setPendingHeroLightFile(f);
                      e.target.value = '';
                    }}
                  />
                </label>

                <button
                  type="button"
                  onClick={() => {
                    if (pendingHeroDarkFile) {
                      setPendingHeroLightFile(pendingHeroDarkFile);
                    } else {
                      setPendingHeroLightFile(null);
                      setPortfolio({
                        ...portfolio,
                        heroImageLight: activeHeroDarkUrl,
                        heroImageLightFileId: portfolio.heroImageDarkFileId || '',
                      });
                    }
                  }}
                  className="cursor-pointer rounded-full border border-neutral-500/30 px-3.5 py-1.5 text-[11px] font-bold opacity-80 hover:opacity-100"
                >
                  Same as Dark Image
                </button>

                {pendingHeroLightFile && (
                  <button
                    type="button"
                    onClick={() => setPendingHeroLightFile(null)}
                    className="cursor-pointer rounded-full border border-neutral-500/30 px-3.5 py-1.5 text-[11px] font-bold opacity-80 hover:opacity-100"
                  >
                    Cancel Queued
                  </button>
                )}

                {activeHeroLightUrl !== '/me_light.webp' && !pendingHeroLightFile && (
                  <button
                    type="button"
                    onClick={() =>
                      setPortfolio({
                        ...portfolio,
                        heroImageLight: '/me_light.webp',
                      })
                    }
                    className="cursor-pointer rounded-full border border-neutral-500/30 px-3.5 py-1.5 text-[11px] font-bold opacity-75 hover:opacity-100"
                  >
                    Reset Default
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resume PDF Preview & In-Browser Viewer */}
      <div className="glass-subcard space-y-4 rounded-3xl p-4 sm:p-6">
        <div className="flex flex-col justify-between gap-4 border-b border-neutral-500/15 pb-4 lg:flex-row lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-bold">Resume / CV Document (PDF)</h3>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                  pendingResumeFile
                    ? 'bg-amber-500 text-black'
                    : 'bg-emerald-600/90 text-white'
                }`}
              >
                {pendingResumeFile ? 'Queued New PDF (Unsaved)' : 'Current Active File'}
              </span>
            </div>
            <p className="mt-1 text-xs opacity-65">
              Current File:{' '}
              <span className="font-mono font-bold">
                {pendingResumeFile
                  ? pendingResumeFile.name
                  : extractDisplayFileName(activeResumeUrl, 'falguni_mondal_resume.pdf')}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsResumeViewerOpen(true)}
              className="glass-subcard cursor-pointer rounded-full border border-neutral-500/30 px-4 py-2.5 text-xs font-bold transition hover:border-neutral-500/60"
            >
              View Resume PDF (Full Screen)
            </button>

            <a
              href={resumeInlineViewerSrc}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-subcard cursor-pointer rounded-full border border-neutral-500/30 px-4 py-2.5 text-xs font-bold transition hover:border-neutral-500/60"
            >
              Open PDF in New Tab ↗
            </a>

            <label className="liquid-glass-active cursor-pointer rounded-full px-5 py-2.5 text-xs font-bold">
              Upload New Resume PDF
              <input
                type="file"
                accept="application/pdf,.pdf"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setPendingResumeFile(f);
                  e.target.value = '';
                }}
              />
            </label>

            {pendingResumeFile && (
              <button
                type="button"
                onClick={() => setPendingResumeFile(null)}
                className="cursor-pointer rounded-full border border-red-500/30 px-3.5 py-2 text-xs font-bold text-red-500 hover:bg-red-500 hover:text-white"
              >
                Cancel Queued PDF
              </button>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold opacity-80">
            Resume PDF URL / Path (Or upload a PDF file above)
          </label>
          <input
            type="text"
            value={pendingResumeFile ? `Queued: ${pendingResumeFile.name}` : activeResumeUrl}
            onChange={(e) => {
              setPendingResumeFile(null);
              setPortfolio({
                ...portfolio,
                resumeUrl: e.target.value,
              });
            }}
            placeholder="/falguni_mondal_resume.pdf or https://ik.imagekit.io/..."
            className="glass-input mt-1.5 w-full rounded-xl px-3.5 py-2.5 text-xs font-semibold"
          />
        </div>

        {/* Inline Live PDF Preview Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider opacity-60">
              Live Inline Resume Preview
            </span>
            <span className="text-[11px] opacity-55">
              Scroll inside the preview or click &ldquo;View Resume PDF (Full Screen)&rdquo;
            </span>
          </div>
          <div className="h-[460px] w-full overflow-hidden rounded-2xl border border-neutral-500/20 bg-neutral-900/5">
            <iframe
              key={resumeInlineViewerSrc}
              src={resumeInlineViewerSrc}
              title="Resume PDF Inline Preview"
              className="h-full w-full border-0 bg-white"
            />
          </div>
        </div>
      </div>

      {/* Fullscreen In-App Resume PDF Viewer Modal */}
      {isResumeViewerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm sm:p-6"
          onClick={() => setIsResumeViewerOpen(false)}
        >
          <div
            className="admin-surface-card flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl p-4 shadow-2xl sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-500/15 pb-3">
              <div>
                <h4 className="text-sm font-black sm:text-base">
                  Resume PDF Viewer —{' '}
                  {pendingResumeFile
                    ? `${pendingResumeFile.name} (Queued Preview)`
                    : extractDisplayFileName(activeResumeUrl, 'falguni_mondal_resume.pdf')}
                </h4>
                <p className="text-[11px] opacity-60">
                  Viewing directly in browser without downloading
                </p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={resumeInlineViewerSrc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-subcard rounded-full border border-neutral-500/30 px-3.5 py-1.5 text-xs font-bold"
                >
                  Open in New Browser Tab ↗
                </a>
                <button
                  type="button"
                  onClick={() => setIsResumeViewerOpen(false)}
                  className="liquid-glass-active cursor-pointer rounded-full px-4 py-1.5 text-xs font-bold"
                >
                  Close Viewer ✕
                </button>
              </div>
            </div>

            <div className="mt-3 flex-1 overflow-hidden rounded-2xl border border-neutral-500/20 bg-white">
              <iframe
                src={resumeInlineViewerSrc}
                title="Full Screen Resume PDF Viewer"
                className="h-full w-full border-0"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}