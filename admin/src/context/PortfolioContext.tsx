// admin/src/context/PortfolioContext.tsx
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
  type DragEvent,
} from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdmin } from '@/context/AdminContext';

export type ReorderableSection = 'EXPERIENCE' | 'WORKS' | 'LAB' | 'CERTIFICATES';

const EMPTY_PORTFOLIO_FALLBACK = {
  heroImageDark: '/me.webp',
  heroImageDarkFileId: '',
  heroImageLight: '/me_light.webp',
  heroImageLightFileId: '',
  resumeUrl: '/falguni_mondal_resume.pdf',
  resumeFileId: '',
  arsenal: [],
  experience: [],
  works: [],
  lab: [],
  certificates: [],
  contact: {},
};

const FRONTEND_BASE_URL = (
  process.env.NEXT_PUBLIC_FRONTEND_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  'https://byfalguni.com'
).replace(/\/$/, '');

export const resolveAssetPreviewUrl = (rawUrl?: string, fallbackPath = ''): string => {
  const target = (rawUrl && String(rawUrl).trim()) || fallbackPath;
  if (!target) return '';
  if (
    target.startsWith('http://') ||
    target.startsWith('https://') ||
    target.startsWith('blob:') ||
    target.startsWith('data:')
  ) {
    return target;
  }
  return `${FRONTEND_BASE_URL}/${target.replace(/^\//, '')}`;
};

export const extractDisplayFileName = (rawUrl?: string, fallback = 'Default file'): string => {
  const target = (rawUrl && String(rawUrl).trim()) || '';
  if (!target) return fallback;
  try {
    const withoutQuery = target.split('?')[0].split('#')[0];
    const parts = withoutQuery.split('/').filter(Boolean);
    const last = parts[parts.length - 1] || fallback;
    return decodeURIComponent(last);
  } catch {
    return target;
  }
};

export const moveArrayItem = <T,>(arr: T[], fromIdx: number, toIdx: number): T[] => {
  if (
    fromIdx === toIdx ||
    fromIdx < 0 ||
    toIdx < 0 ||
    fromIdx >= arr.length ||
    toIdx >= arr.length
  ) {
    return arr;
  }
  const next = [...arr];
  const [moved] = next.splice(fromIdx, 1);
  next.splice(toIdx, 0, moved);
  return next;
};

export const prependPendingRecord = <T,>(record: Record<number, T>): Record<number, T> => {
  const next: Record<number, T> = {};
  Object.entries(record).forEach(([k, val]) => {
    next[Number(k) + 1] = val;
  });
  return next;
};

export const removePendingRecord = <T,>(
  record: Record<number, T>,
  removedIdx: number
): Record<number, T> => {
  const next: Record<number, T> = {};
  Object.entries(record).forEach(([k, val]) => {
    const idx = Number(k);
    if (idx < removedIdx) next[idx] = val;
    else if (idx > removedIdx) next[idx - 1] = val;
  });
  return next;
};

export const reorderPendingRecord = <T,>(
  record: Record<number, T>,
  length: number,
  fromIdx: number,
  toIdx: number
): Record<number, T> => {
  const slots: (T | undefined)[] = Array.from({ length }, (_, i) => record[i]);
  const reordered = moveArrayItem(slots, fromIdx, toIdx);
  const next: Record<number, T> = {};
  reordered.forEach((val, i) => {
    if (val !== undefined) next[i] = val;
  });
  return next;
};

interface PortfolioContextValue {
  portfolio: any;
  setPortfolio: Dispatch<SetStateAction<any>>;
  pendingHeroDarkFile: File | null;
  setPendingHeroDarkFile: Dispatch<SetStateAction<File | null>>;
  pendingHeroLightFile: File | null;
  setPendingHeroLightFile: Dispatch<SetStateAction<File | null>>;
  pendingResumeFile: File | null;
  setPendingResumeFile: Dispatch<SetStateAction<File | null>>;
  heroDarkObjUrl: string | null;
  heroLightObjUrl: string | null;
  resumeObjUrl: string | null;
  pendingWorkFiles: Record<number, File>;
  setPendingWorkFiles: Dispatch<SetStateAction<Record<number, File>>>;
  pendingLabFiles1: Record<number, File>;
  setPendingLabFiles1: Dispatch<SetStateAction<Record<number, File>>>;
  pendingLabFiles2: Record<number, File>;
  setPendingLabFiles2: Dispatch<SetStateAction<Record<number, File>>>;
  pendingCertFiles: Record<number, File>;
  setPendingCertFiles: Dispatch<SetStateAction<Record<number, File>>>;
  armedDragCard: { section: ReorderableSection; index: number } | null;
  dragSource: { section: ReorderableSection; index: number } | null;
  dragOverTarget: { section: ReorderableSection; index: number } | null;
  handleDragStart: (
    e: DragEvent<HTMLDivElement>,
    section: ReorderableSection,
    index: number
  ) => void;
  handleDragOver: (
    e: DragEvent<HTMLDivElement>,
    section: ReorderableSection,
    index: number
  ) => void;
  handleDrop: (
    e: DragEvent<HTMLDivElement>,
    section: ReorderableSection,
    targetIndex: number
  ) => void;
  handleDragEnd: () => void;
  renderCardOrderControls: (
    section: ReorderableSection,
    idx: number,
    totalCount: number,
    labelPrefix: string,
    onRemove: () => void,
    removeLabel?: string
  ) => ReactNode;
}

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

export const usePortfolioCms = () => {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error('usePortfolioCms must be used within PortfolioProvider');
  return ctx;
};

export const PortfolioProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const {
    authenticated,
    portfolio,
    setPortfolio,
    portfolioLoading,
    ensurePortfolioLoaded,
  } = useAdmin();

  const activePortfolio = portfolio || EMPTY_PORTFOLIO_FALLBACK;

  const [pendingHeroDarkFile, setPendingHeroDarkFile] = useState<File | null>(null);
  const [pendingHeroLightFile, setPendingHeroLightFile] = useState<File | null>(null);
  const [pendingResumeFile, setPendingResumeFile] = useState<File | null>(null);

  const [heroDarkObjUrl, setHeroDarkObjUrl] = useState<string | null>(null);
  const [heroLightObjUrl, setHeroLightObjUrl] = useState<string | null>(null);
  const [resumeObjUrl, setResumeObjUrl] = useState<string | null>(null);

  const [pendingWorkFiles, setPendingWorkFiles] = useState<Record<number, File>>({});
  const [pendingLabFiles1, setPendingLabFiles1] = useState<Record<number, File>>({});
  const [pendingLabFiles2, setPendingLabFiles2] = useState<Record<number, File>>({});
  const [pendingCertFiles, setPendingCertFiles] = useState<Record<number, File>>({});

  const [armedDragCard, setArmedDragCard] = useState<{
    section: ReorderableSection;
    index: number;
  } | null>(null);
  const [dragSource, setDragSource] = useState<{
    section: ReorderableSection;
    index: number;
  } | null>(null);
  const [dragOverTarget, setDragOverTarget] = useState<{
    section: ReorderableSection;
    index: number;
  } | null>(null);

  const [savingPortfolio, setSavingPortfolio] = useState(false);
  const [portfolioStatusMsg, setPortfolioStatusMsg] = useState('');

  useEffect(() => {
    if (authenticated) {
      ensurePortfolioLoaded();
    }
  }, [authenticated, ensurePortfolioLoaded]);

  useEffect(() => {
    if (!pendingHeroDarkFile) {
      setHeroDarkObjUrl(null);
      return;
    }
    const url = URL.createObjectURL(pendingHeroDarkFile);
    setHeroDarkObjUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [pendingHeroDarkFile]);

  useEffect(() => {
    if (!pendingHeroLightFile) {
      setHeroLightObjUrl(null);
      return;
    }
    const url = URL.createObjectURL(pendingHeroLightFile);
    setHeroLightObjUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [pendingHeroLightFile]);

  useEffect(() => {
    if (!pendingResumeFile) {
      setResumeObjUrl(null);
      return;
    }
    const url = URL.createObjectURL(pendingResumeFile);
    setResumeObjUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [pendingResumeFile]);

  useEffect(() => {
    const clearArmed = () => setArmedDragCard(null);
    window.addEventListener('mouseup', clearArmed);
    return () => window.removeEventListener('mouseup', clearArmed);
  }, []);

  const uploadSingleFileToImageKit = async (
    file: File,
    folder: string
  ): Promise<{ url: string; fileId: string }> => {
    const authRes = await fetch('/api/imagekit-auth');
    if (!authRes.ok) throw new Error('Failed to get ImageKit signature');
    const { token, expire, signature, publicKey } = await authRes.json();

    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', `${Date.now()}_${file.name}`);
    formData.append('publicKey', publicKey);
    formData.append('signature', signature);
    formData.append('expire', String(expire));
    formData.append('token', token);
    formData.append('folder', folder);

    const upRes = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
      method: 'POST',
      body: formData,
    });
    if (!upRes.ok) throw new Error(`ImageKit upload failed for ${file.name}`);
    const data = await upRes.json();
    return { url: data.url, fileId: data.fileId };
  };

  const handleReorderSection = (
    section: ReorderableSection,
    fromIdx: number,
    toIdx: number
  ) => {
    if (fromIdx === toIdx || !portfolio) return;

    if (section === 'EXPERIENCE') {
      const list = portfolio.experience || [];
      if (toIdx < 0 || toIdx >= list.length) return;
      setPortfolio({
        ...portfolio,
        experience: moveArrayItem(list, fromIdx, toIdx),
      });
    } else if (section === 'WORKS') {
      const list = portfolio.works || [];
      if (toIdx < 0 || toIdx >= list.length) return;
      setPendingWorkFiles((prev) => reorderPendingRecord(prev, list.length, fromIdx, toIdx));
      setPortfolio({
        ...portfolio,
        works: moveArrayItem(list, fromIdx, toIdx),
      });
    } else if (section === 'LAB') {
      const list = portfolio.lab || [];
      if (toIdx < 0 || toIdx >= list.length) return;
      setPendingLabFiles1((prev) => reorderPendingRecord(prev, list.length, fromIdx, toIdx));
      setPendingLabFiles2((prev) => reorderPendingRecord(prev, list.length, fromIdx, toIdx));
      setPortfolio({
        ...portfolio,
        lab: moveArrayItem(list, fromIdx, toIdx),
      });
    } else if (section === 'CERTIFICATES') {
      const list = portfolio.certificates || [];
      if (toIdx < 0 || toIdx >= list.length) return;
      setPendingCertFiles((prev) => reorderPendingRecord(prev, list.length, fromIdx, toIdx));
      setPortfolio({
        ...portfolio,
        certificates: moveArrayItem(list, fromIdx, toIdx),
      });
    }
  };

  const handleDragStart = (
    e: DragEvent<HTMLDivElement>,
    section: ReorderableSection,
    index: number
  ) => {
    setDragSource({ section, index });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', `${section}:${index}`);
  };

  const handleDragOver = (
    e: DragEvent<HTMLDivElement>,
    section: ReorderableSection,
    index: number
  ) => {
    if (!dragSource || dragSource.section !== section) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverTarget?.section !== section || dragOverTarget?.index !== index) {
      setDragOverTarget({ section, index });
    }
  };

  const handleDrop = (
    e: DragEvent<HTMLDivElement>,
    section: ReorderableSection,
    targetIndex: number
  ) => {
    e.preventDefault();
    if (dragSource && dragSource.section === section && dragSource.index !== targetIndex) {
      handleReorderSection(section, dragSource.index, targetIndex);
    }
    setDragSource(null);
    setDragOverTarget(null);
    setArmedDragCard(null);
  };

  const handleDragEnd = () => {
    setDragSource(null);
    setDragOverTarget(null);
    setArmedDragCard(null);
  };

  const handleSaveAndPublishPortfolio = async () => {
    if (!portfolio) return;
    setSavingPortfolio(true);
    setPortfolioStatusMsg('Uploading queued files to ImageKit...');

    try {
      const deletedFileIds: string[] = [];

      let nextHeroImageDark = portfolio.heroImageDark || '/me.webp';
      let nextHeroImageDarkFileId = portfolio.heroImageDarkFileId || '';
      let nextHeroImageLight = portfolio.heroImageLight || '/me_light.webp';
      let nextHeroImageLightFileId = portfolio.heroImageLightFileId || '';
      let nextResumeUrl = portfolio.resumeUrl || '/falguni_mondal_resume.pdf';
      let nextResumeFileId = portfolio.resumeFileId || '';

      if (pendingHeroDarkFile) {
        if (
          nextHeroImageDarkFileId &&
          nextHeroImageDarkFileId !== nextHeroImageLightFileId
        ) {
          deletedFileIds.push(nextHeroImageDarkFileId);
        }
        const uploaded = await uploadSingleFileToImageKit(pendingHeroDarkFile, '/Portfolio/Hero');
        nextHeroImageDark = uploaded.url;
        nextHeroImageDarkFileId = uploaded.fileId;
      }

      if (pendingHeroLightFile) {
        if (
          nextHeroImageLightFileId &&
          nextHeroImageLightFileId !== nextHeroImageDarkFileId
        ) {
          deletedFileIds.push(nextHeroImageLightFileId);
        }
        const uploaded = await uploadSingleFileToImageKit(pendingHeroLightFile, '/Portfolio/Hero');
        nextHeroImageLight = uploaded.url;
        nextHeroImageLightFileId = uploaded.fileId;
      }

      if (pendingResumeFile) {
        if (nextResumeFileId) {
          deletedFileIds.push(nextResumeFileId);
        }
        const uploaded = await uploadSingleFileToImageKit(pendingResumeFile, '/Portfolio/Resume');
        nextResumeUrl = uploaded.url;
        nextResumeFileId = uploaded.fileId;
      }

      const nextWorks = (portfolio.works || []).map((w: any) => ({ ...w }));
      const nextLab = (portfolio.lab || []).map((l: any) => ({ ...l }));
      const nextCerts = (portfolio.certificates || []).map((c: any) => ({ ...c }));

      for (const [idxStr, file] of Object.entries(pendingWorkFiles)) {
        const idx = Number(idxStr);
        if (nextWorks[idx]) {
          if (nextWorks[idx].videoFileId) deletedFileIds.push(nextWorks[idx].videoFileId);
          const uploaded = await uploadSingleFileToImageKit(file, '/Portfolio/Works');
          nextWorks[idx].videoUrl = uploaded.url;
          nextWorks[idx].videoFileId = uploaded.fileId;
        }
      }

      for (const [idxStr, file] of Object.entries(pendingLabFiles1)) {
        const idx = Number(idxStr);
        if (nextLab[idx]) {
          if (nextLab[idx].image1FileId) deletedFileIds.push(nextLab[idx].image1FileId);
          const uploaded = await uploadSingleFileToImageKit(file, '/Portfolio/Personal_Projects');
          nextLab[idx].image1 = uploaded.url;
          nextLab[idx].image1FileId = uploaded.fileId;
        }
      }

      for (const [idxStr, file] of Object.entries(pendingLabFiles2)) {
        const idx = Number(idxStr);
        if (nextLab[idx]) {
          if (nextLab[idx].image2FileId) deletedFileIds.push(nextLab[idx].image2FileId);
          const uploaded = await uploadSingleFileToImageKit(file, '/Portfolio/Personal_Projects');
          nextLab[idx].image2 = uploaded.url;
          nextLab[idx].image2FileId = uploaded.fileId;
        }
      }

      for (const [idxStr, file] of Object.entries(pendingCertFiles)) {
        const idx = Number(idxStr);
        if (nextCerts[idx]) {
          if (nextCerts[idx].fileId) deletedFileIds.push(nextCerts[idx].fileId);
          const uploaded = await uploadSingleFileToImageKit(file, '/Portfolio/Certificates');
          nextCerts[idx].url = uploaded.url;
          nextCerts[idx].fileId = uploaded.fileId;
        }
      }

      setPortfolioStatusMsg('Syncing database & cleaning replaced files...');

      const res = await fetch('/api/portfolio', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...portfolio,
          heroImageDark: nextHeroImageDark,
          heroImageDarkFileId: nextHeroImageDarkFileId,
          heroImageLight: nextHeroImageLight,
          heroImageLightFileId: nextHeroImageLightFileId,
          resumeUrl: nextResumeUrl,
          resumeFileId: nextResumeFileId,
          works: nextWorks,
          lab: nextLab,
          certificates: nextCerts,
          deletedFileIds,
        }),
      });

      if (res.ok) {
        const savedDoc = await res.json();
        setPortfolio(savedDoc);
        setPendingHeroDarkFile(null);
        setPendingHeroLightFile(null);
        setPendingResumeFile(null);
        setPendingWorkFiles({});
        setPendingLabFiles1({});
        setPendingLabFiles2({});
        setPendingCertFiles({});
        setPortfolioStatusMsg('Published to byfalguni.com');
        setTimeout(() => setPortfolioStatusMsg(''), 3500);
      } else {
        throw new Error('Failed to save portfolio changes');
      }
    } catch (err: unknown) {
      setPortfolioStatusMsg(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSavingPortfolio(false);
    }
  };

  const renderCardOrderControls = (
    section: ReorderableSection,
    idx: number,
    totalCount: number,
    labelPrefix: string,
    onRemove: () => void,
    removeLabel = 'Remove'
  ) => (
    <div
      onMouseDown={() => setArmedDragCard({ section, index: idx })}
      onMouseUp={() => setArmedDragCard(null)}
      title="Drag this header bar to change item sequence"
      className="flex cursor-grab flex-wrap items-center justify-between gap-2 border-b border-neutral-500/15 pb-3 select-none active:cursor-grabbing"
    >
      <div className="flex items-center gap-2.5">
        <span className="inline-flex items-center gap-1 rounded-full border border-neutral-500/25 px-2.5 py-1 font-mono text-[11px] font-bold opacity-75">
          <span>⋮⋮</span>
          <span className="hidden sm:inline">Drag</span>
        </span>
        <span className="text-xs font-bold uppercase tracking-wider opacity-60">
          {labelPrefix} #{String(idx + 1).padStart(2, '0')}
        </span>
      </div>

      <div className="flex items-center gap-1.5" onMouseDown={(e) => e.stopPropagation()}>
        <button
          type="button"
          disabled={idx === 0}
          onClick={() => handleReorderSection(section, idx, idx - 1)}
          title="Move Up"
          className="cursor-pointer rounded-full border border-neutral-500/25 px-2.5 py-1 text-[11px] font-bold transition hover:border-neutral-500/50 disabled:cursor-not-allowed disabled:opacity-30"
        >
          ↑
        </button>
        <button
          type="button"
          disabled={idx === totalCount - 1}
          onClick={() => handleReorderSection(section, idx, idx + 1)}
          title="Move Down"
          className="cursor-pointer rounded-full border border-neutral-500/25 px-2.5 py-1 text-[11px] font-bold transition hover:border-neutral-500/50 disabled:cursor-not-allowed disabled:opacity-30"
        >
          ↓
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="cursor-pointer rounded-full border border-red-500/30 px-3 py-1 text-[11px] font-bold text-red-500 transition hover:bg-red-500 hover:text-white"
        >
          {removeLabel}
        </button>
      </div>
    </div>
  );

  const subNavItems = [
    { href: '/portfolio/hero-resume', label: '1. Hero & Resume' },
    {
      href: '/portfolio/experience',
      label: `2. Experience (${activePortfolio.experience?.length || 0})`,
    },
    { href: '/portfolio/works', label: `3. Works (${activePortfolio.works?.length || 0})` },
    { href: '/portfolio/arsenal-contact', label: '4. Arsenal & Contact' },
    { href: '/portfolio/lab', label: `5. Lab (${activePortfolio.lab?.length || 0})` },
    {
      href: '/portfolio/certificates',
      label: `6. Certificates (${activePortfolio.certificates?.length || 0})`,
    },
  ];

  const isLoaded = Boolean(portfolio) && !portfolioLoading;

  return (
    <PortfolioContext.Provider
      value={{
        portfolio: activePortfolio,
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
        pendingWorkFiles,
        setPendingWorkFiles,
        pendingLabFiles1,
        setPendingLabFiles1,
        pendingLabFiles2,
        setPendingLabFiles2,
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
      }}
    >
      {!isLoaded && (
        <div className="admin-surface-card rounded-3xl p-8 text-center text-xs font-semibold opacity-70">
          Loading Portfolio CMS...
        </div>
      )}

      {/* Always keep {children} mounted in the render tree so Next.js 16 instant-navigation validation succeeds */}
      <div className={isLoaded ? 'admin-surface-card space-y-8 rounded-3xl p-4 sm:p-8' : 'hidden'}>
        {/* CMS Header */}
        <div className="flex flex-col justify-between gap-4 border-b border-neutral-500/15 pb-6 sm:flex-row sm:items-center">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest opacity-50">
              byfalguni.com Content Management
            </span>
            <h2 className="mt-1 text-xl font-black sm:text-2xl">Portfolio CMS</h2>
            <p className="mt-1 text-xs opacity-65">
              New items are added at #01. Drag any card header (⋮⋮) or use ↑/↓ to reorder sequence.
              Queued files upload on Save and clean up replaced ImageKit files automatically.
            </p>
          </div>

          <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
            {portfolioStatusMsg && (
              <span className="text-xs font-bold opacity-80">{portfolioStatusMsg}</span>
            )}
            <button
              type="button"
              disabled={savingPortfolio}
              onClick={handleSaveAndPublishPortfolio}
              className="liquid-glass-active cursor-pointer rounded-full px-6 py-3.5 text-xs font-bold shadow-md"
            >
              {savingPortfolio ? 'Uploading & Publishing...' : 'Save & Publish Portfolio CMS →'}
            </button>
          </div>
        </div>

        {/* Sub-Navigation Route Pills */}
        <nav className="flex flex-wrap gap-2">
          {subNavItems.map((s) => {
            const isActive = pathname === s.href;
            return (
              <Link
                key={s.href}
                href={s.href}
                prefetch={true}
                className={`cursor-pointer rounded-full px-4 py-2.5 text-xs font-bold transition sm:px-5 ${
                  isActive ? 'liquid-glass-active' : 'glass-subcard'
                }`}
              >
                {s.label}
              </Link>
            );
          })}
        </nav>

        {children}
      </div>
    </PortfolioContext.Provider>
  );
};