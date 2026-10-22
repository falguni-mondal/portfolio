// admin/src/components/PortfolioCmsTab.tsx
import {
  useState,
  useEffect,
  type FC,
  type Dispatch,
  type SetStateAction,
  type DragEvent,
} from 'react';

interface Props {
  portfolio: any;
  setPortfolio: Dispatch<SetStateAction<any>>;
}

type CmsSectionTab =
  | 'HERO_RESUME'
  | 'EXPERIENCE'
  | 'WORKS'
  | 'ARSENAL_CONTACT'
  | 'LAB'
  | 'CERTIFICATES';

type ReorderableSection = 'EXPERIENCE' | 'WORKS' | 'LAB' | 'CERTIFICATES';

const FRONTEND_BASE_URL = (
  process.env.NEXT_PUBLIC_FRONTEND_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  'https://byfalguni.com'
).replace(/\/$/, '');

const resolveAssetPreviewUrl = (rawUrl?: string, fallbackPath = ''): string => {
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

const extractDisplayFileName = (rawUrl?: string, fallback = 'Default file'): string => {
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

const moveArrayItem = <T,>(arr: T[], fromIdx: number, toIdx: number): T[] => {
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

const prependPendingRecord = <T,>(record: Record<number, T>): Record<number, T> => {
  const next: Record<number, T> = {};
  Object.entries(record).forEach(([k, val]) => {
    next[Number(k) + 1] = val;
  });
  return next;
};

const removePendingRecord = <T,>(
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

const reorderPendingRecord = <T,>(
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

export const PortfolioCmsTab: FC<Props> = ({ portfolio, setPortfolio }) => {
  const [cmsSectionTab, setCmsSectionTab] = useState<CmsSectionTab>('HERO_RESUME');

  // Pending Hero & Resume files
  const [pendingHeroDarkFile, setPendingHeroDarkFile] = useState<File | null>(null);
  const [pendingHeroLightFile, setPendingHeroLightFile] = useState<File | null>(null);
  const [pendingResumeFile, setPendingResumeFile] = useState<File | null>(null);

  // Object URLs for instant local preview of queued Hero Images & Resume PDF
  const [heroDarkObjUrl, setHeroDarkObjUrl] = useState<string | null>(null);
  const [heroLightObjUrl, setHeroLightObjUrl] = useState<string | null>(null);
  const [resumeObjUrl, setResumeObjUrl] = useState<string | null>(null);

  // Fullscreen modal state to view the Resume PDF without downloading
  const [isResumeViewerOpen, setIsResumeViewerOpen] = useState(false);

  // Pending section item files
  const [pendingWorkFiles, setPendingWorkFiles] = useState<Record<number, File>>({});
  const [pendingLabFiles1, setPendingLabFiles1] = useState<Record<number, File>>({});
  const [pendingLabFiles2, setPendingLabFiles2] = useState<Record<number, File>>({});
  const [pendingCertFiles, setPendingCertFiles] = useState<Record<number, File>>({});

  // Drag-and-drop sequence state
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

  // Manage object URLs cleanly
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

  // Clear armed drag state if mouse is released anywhere
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

  // Reorder items in Experience, Works, Lab, or Certificates & keep pending files aligned
  const handleReorderSection = (
    section: ReorderableSection,
    fromIdx: number,
    toIdx: number
  ) => {
    if (fromIdx === toIdx) return;

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

      // 1. Upload queued Dark Hero Image
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

      // 2. Upload queued Light Hero Image
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

      // 3. Upload queued Resume PDF
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

  // Resolved preview URLs for Hero Images & Resume PDF
  const activeHeroDarkUrl = portfolio.heroImageDark || '/me.webp';
  const activeHeroLightUrl = portfolio.heroImageLight || '/me_light.webp';
  const activeResumeUrl = portfolio.resumeUrl || '/falguni_mondal_resume.pdf';

  const heroDarkPreviewSrc =
    heroDarkObjUrl || resolveAssetPreviewUrl(activeHeroDarkUrl, '/me.webp');
  const heroLightPreviewSrc =
    heroLightObjUrl || resolveAssetPreviewUrl(activeHeroLightUrl, '/me_light.webp');

  // Inline PDF viewer URL (uses local blob URL when a new file is queued, or the inline PDF stream proxy for saved URLs)
  const resumeInlineViewerSrc =
    resumeObjUrl || `/api/portfolio?previewPdf=${encodeURIComponent(activeResumeUrl)}`;

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

      <div
        className="flex items-center gap-1.5"
        onMouseDown={(e) => e.stopPropagation()}
      >
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

  return (
    <div className="admin-surface-card space-y-8 rounded-3xl p-4 sm:p-8">
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

      {/* Sub-Navigation Pills */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'HERO_RESUME', label: '1. Hero & Resume' },
          { id: 'EXPERIENCE', label: `2. Experience (${portfolio.experience?.length || 0})` },
          { id: 'WORKS', label: `3. Works (${portfolio.works?.length || 0})` },
          { id: 'ARSENAL_CONTACT', label: '4. Arsenal & Contact' },
          { id: 'LAB', label: `5. Lab (${portfolio.lab?.length || 0})` },
          {
            id: 'CERTIFICATES',
            label: `6. Certificates (${portfolio.certificates?.length || 0})`,
          },
        ].map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setCmsSectionTab(s.id as CmsSectionTab)}
            className={`cursor-pointer rounded-full px-4 py-2.5 text-xs font-bold transition sm:px-5 ${
              cmsSectionTab === s.id ? 'liquid-glass-active' : 'glass-subcard'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* TAB 1: HERO IMAGE & RESUME PDF */}
      {cmsSectionTab === 'HERO_RESUME' && (
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
                value={
                  pendingResumeFile ? `Queued: ${pendingResumeFile.name}` : activeResumeUrl
                }
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
        </div>
      )}

      {/* TAB 2: CAREER EXPERIENCE */}
      {cmsSectionTab === 'EXPERIENCE' && (
        <div className="space-y-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-base font-bold">Career Chapters (Experience)</h3>
              <p className="text-xs opacity-60">
                New companies are added at #01. Drag any card header (⋮⋮) or use ↑/↓ to reorder.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setPortfolio({
                  ...portfolio,
                  experience: [
                    {
                      id: `exp-${Date.now()}`,
                      name: '',
                      type: 'digital ad agency',
                      role: 'full stack web developer',
                      from: 'nov 2025',
                      to: '',
                      isPresent: true,
                      projects: [],
                    },
                    ...(portfolio.experience || []),
                  ],
                })
              }
              className="liquid-glass-active cursor-pointer self-start rounded-full px-5 py-2.5 text-xs font-bold sm:self-auto"
            >
              + Add Company / Experience
            </button>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {(portfolio.experience || []).map((exp: any, idx: number) => {
              const expList = portfolio.experience || [];
              const autoLinkedWorks = (portfolio.works || [])
                .filter(
                  (w: any) =>
                    w.companyId === exp.id ||
                    (w.companyName &&
                      exp.name &&
                      w.companyName.toLowerCase().trim() === exp.name.toLowerCase().trim())
                )
                .map((w: any) => w.name)
                .filter(Boolean);

              const isDraggingThis =
                dragSource?.section === 'EXPERIENCE' && dragSource.index === idx;
              const isDragTarget =
                dragOverTarget?.section === 'EXPERIENCE' &&
                dragOverTarget.index === idx &&
                dragSource?.index !== idx;

              return (
                <div
                  key={exp.id || exp._id || idx}
                  draggable={
                    armedDragCard?.section === 'EXPERIENCE' && armedDragCard.index === idx
                  }
                  onDragStart={(e) => handleDragStart(e, 'EXPERIENCE', idx)}
                  onDragOver={(e) => handleDragOver(e, 'EXPERIENCE', idx)}
                  onDrop={(e) => handleDrop(e, 'EXPERIENCE', idx)}
                  onDragEnd={handleDragEnd}
                  className={`glass-subcard space-y-4 rounded-3xl p-4 transition sm:p-5 ${
                    isDraggingThis ? 'scale-[0.98] opacity-50' : ''
                  } ${isDragTarget ? 'ring-2 ring-[#FF5733]' : ''}`}
                >
                  {renderCardOrderControls(
                    'EXPERIENCE',
                    idx,
                    expList.length,
                    'Experience',
                    () =>
                      setPortfolio({
                        ...portfolio,
                        experience: portfolio.experience.filter(
                          (_: any, i: number) => i !== idx
                        ),
                      }),
                    'Remove'
                  )}

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold opacity-80">
                        Company / Organization Name *
                      </label>
                      <input
                        type="text"
                        value={exp.name}
                        onChange={(e) => {
                          const next = [...portfolio.experience];
                          next[idx] = { ...next[idx], name: e.target.value };
                          setPortfolio({ ...portfolio, experience: next });
                        }}
                        placeholder="e.g. Graphitage"
                        className="glass-input mt-1.5 w-full rounded-xl px-3.5 py-2.5 text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold opacity-80">
                        Organization Category / Type
                      </label>
                      <input
                        type="text"
                        value={exp.type}
                        onChange={(e) => {
                          const next = [...portfolio.experience];
                          next[idx] = { ...next[idx], type: e.target.value };
                          setPortfolio({ ...portfolio, experience: next });
                        }}
                        placeholder="e.g. digital ad agency"
                        className="glass-input mt-1.5 w-full rounded-xl px-3.5 py-2.5 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <label className="block text-xs font-bold opacity-80">Your Role</label>
                      <input
                        type="text"
                        value={exp.role}
                        onChange={(e) => {
                          const next = [...portfolio.experience];
                          next[idx] = { ...next[idx], role: e.target.value };
                          setPortfolio({ ...portfolio, experience: next });
                        }}
                        placeholder="full stack web developer"
                        className="glass-input mt-1.5 w-full rounded-xl px-3.5 py-2.5 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold opacity-80">Start Date</label>
                      <input
                        type="text"
                        value={exp.from}
                        onChange={(e) => {
                          const next = [...portfolio.experience];
                          next[idx] = { ...next[idx], from: e.target.value };
                          setPortfolio({ ...portfolio, experience: next });
                        }}
                        placeholder="nov 2025"
                        className="glass-input mt-1.5 w-full rounded-xl px-3.5 py-2.5 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold opacity-80">End Date</label>
                      <input
                        type="text"
                        disabled={Boolean(exp.isPresent)}
                        value={exp.isPresent ? 'Present' : exp.to}
                        onChange={(e) => {
                          const next = [...portfolio.experience];
                          next[idx] = { ...next[idx], to: e.target.value };
                          setPortfolio({ ...portfolio, experience: next });
                        }}
                        placeholder="Present"
                        className="glass-input mt-1.5 w-full rounded-xl px-3.5 py-2.5 text-xs disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <label className="flex cursor-pointer items-center gap-2 text-xs font-bold">
                    <input
                      type="checkbox"
                      checked={Boolean(exp.isPresent)}
                      onChange={(e) => {
                        const next = [...portfolio.experience];
                        next[idx] = { ...next[idx], isPresent: e.target.checked };
                        setPortfolio({ ...portfolio, experience: next });
                      }}
                      className="h-4 w-4 cursor-pointer"
                    />
                    <span>Currently working here (Present)</span>
                  </label>

                  <div className="rounded-2xl border border-neutral-500/15 p-3 text-xs">
                    <span className="block text-[10px] font-bold uppercase tracking-wider opacity-50">
                      Auto-Linked Projects from Works ({autoLinkedWorks.length})
                    </span>
                    <p className="mt-1 font-semibold">
                      {autoLinkedWorks.length > 0
                        ? autoLinkedWorks.join(' / ')
                        : 'No works assigned yet. Assign works inside the Works tab.'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: PROFESSIONAL WORKS */}
      {cmsSectionTab === 'WORKS' && (
        <div className="space-y-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-base font-bold">Professional Client Works</h3>
              <p className="text-xs opacity-60">
                New works are added at #01. Drag any card header (⋮⋮) or use ↑/↓ to reorder.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setPendingWorkFiles((prev) => prependPendingRecord(prev));
                setPortfolio({
                  ...portfolio,
                  works: [
                    {
                      _uid: `work-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                      name: '',
                      description: '',
                      companyId: portfolio.experience?.[0]?.id || '',
                      companyName: portfolio.experience?.[0]?.name || '',
                      videoUrl: '/coming_soon.mp4',
                      videoFileId: '',
                      isOngoing: true,
                      url: '',
                    },
                    ...(portfolio.works || []),
                  ],
                });
              }}
              className="liquid-glass-active cursor-pointer self-start rounded-full px-5 py-2.5 text-xs font-bold sm:self-auto"
            >
              + Add New Work
            </button>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {(portfolio.works || []).map((w: any, idx: number) => {
              const worksList = portfolio.works || [];
              const isDraggingThis =
                dragSource?.section === 'WORKS' && dragSource.index === idx;
              const isDragTarget =
                dragOverTarget?.section === 'WORKS' &&
                dragOverTarget.index === idx &&
                dragSource?.index !== idx;

              return (
                <div
                  key={w._id || w._uid || idx}
                  draggable={armedDragCard?.section === 'WORKS' && armedDragCard.index === idx}
                  onDragStart={(e) => handleDragStart(e, 'WORKS', idx)}
                  onDragOver={(e) => handleDragOver(e, 'WORKS', idx)}
                  onDrop={(e) => handleDrop(e, 'WORKS', idx)}
                  onDragEnd={handleDragEnd}
                  className={`glass-subcard space-y-4 rounded-3xl p-4 transition sm:p-5 ${
                    isDraggingThis ? 'scale-[0.98] opacity-50' : ''
                  } ${isDragTarget ? 'ring-2 ring-[#FF5733]' : ''}`}
                >
                  {renderCardOrderControls(
                    'WORKS',
                    idx,
                    worksList.length,
                    'Work',
                    () => {
                      setPendingWorkFiles((prev) => removePendingRecord(prev, idx));
                      setPortfolio({
                        ...portfolio,
                        works: portfolio.works.filter((_: any, i: number) => i !== idx),
                      });
                    },
                    'Remove Work'
                  )}

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold opacity-80">Project Title *</label>
                      <input
                        type="text"
                        value={w.name}
                        onChange={(e) => {
                          const next = [...portfolio.works];
                          next[idx] = { ...next[idx], name: e.target.value };
                          setPortfolio({ ...portfolio, works: next });
                        }}
                        placeholder="e.g. Noctowls"
                        className="glass-input mt-1.5 w-full rounded-xl px-3.5 py-2.5 text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold opacity-80">
                        Associated Experience / Company
                      </label>
                      <select
                        value={w.companyId || ''}
                        onChange={(e) => {
                          const chosenId = e.target.value;
                          const chosenExp = (portfolio.experience || []).find(
                            (ex: any) => ex.id === chosenId
                          );
                          const next = [...portfolio.works];
                          next[idx] = {
                            ...next[idx],
                            companyId: chosenId,
                            companyName: chosenExp ? chosenExp.name : '',
                          };
                          setPortfolio({ ...portfolio, works: next });
                        }}
                        className="glass-input mt-1.5 w-full cursor-pointer rounded-xl px-3.5 py-2.5 text-xs font-bold"
                      >
                        <option value="">Independent / Freelance (None)</option>
                        {(portfolio.experience || []).map((exp: any) => (
                          <option key={exp.id} value={exp.id}>
                            {exp.name} ({exp.role || 'Company'})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold opacity-80">
                      Project Description
                    </label>
                    <textarea
                      rows={2}
                      value={w.description}
                      onChange={(e) => {
                        const next = [...portfolio.works];
                        next[idx] = { ...next[idx], description: e.target.value };
                        setPortfolio({ ...portfolio, works: next });
                      }}
                      placeholder="Brief summary of the build..."
                      className="glass-input mt-1.5 w-full rounded-xl p-3 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold opacity-80">
                        Live Website URL (Blank if Ongoing)
                      </label>
                      <input
                        type="text"
                        value={w.url}
                        onChange={(e) => {
                          const next = [...portfolio.works];
                          next[idx] = { ...next[idx], url: e.target.value };
                          setPortfolio({ ...portfolio, works: next });
                        }}
                        placeholder="https://example.com"
                        className="glass-input mt-1.5 w-full rounded-xl px-3.5 py-2.5 text-xs"
                      />
                    </div>

                    <div className="flex items-end pb-1">
                      <label className="flex cursor-pointer items-center gap-2.5 text-xs font-bold">
                        <input
                          type="checkbox"
                          checked={Boolean(w.isOngoing)}
                          onChange={(e) => {
                            const next = [...portfolio.works];
                            next[idx] = { ...next[idx], isOngoing: e.target.checked };
                            setPortfolio({ ...portfolio, works: next });
                          }}
                          className="h-4 w-4 cursor-pointer"
                        />
                        <span>Mark Project as Ongoing (WIP)</span>
                      </label>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-neutral-500/15 p-3.5">
                    <label className="block text-xs font-bold opacity-80">
                      Preview Video (Uploads on Save • Defaults to /coming_soon.mp4)
                    </label>
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                      <span className="max-w-full truncate font-mono text-[11px] opacity-70">
                        {pendingWorkFiles[idx]
                          ? `Queued: ${pendingWorkFiles[idx].name}`
                          : w.videoUrl || '/coming_soon.mp4'}
                      </span>
                      <label className="liquid-glass-active cursor-pointer rounded-full px-4 py-1.5 text-[11px] font-bold">
                        Select Video File
                        <input
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) setPendingWorkFiles((prev) => ({ ...prev, [idx]: f }));
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
      )}

      {/* TAB 4: ARSENAL & CONTACT INFO */}
      {cmsSectionTab === 'ARSENAL_CONTACT' && (
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
      )}

      {/* TAB 5: THE LAB PROJECTS */}
      {cmsSectionTab === 'LAB' && (
        <div className="space-y-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-base font-bold">The Lab (Personal &amp; R&amp;D Experiments)</h3>
              <p className="text-xs opacity-60">
                New Lab projects are added at #01. Drag any card header (⋮⋮) or use ↑/↓ to reorder.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setPendingLabFiles1((prev) => prependPendingRecord(prev));
                setPendingLabFiles2((prev) => prependPendingRecord(prev));
                setPortfolio({
                  ...portfolio,
                  lab: [
                    {
                      _uid: `lab-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                      name: '',
                      image1: '/coming_soon.mp4',
                      image1FileId: '',
                      image2: '/coming_soon.mp4',
                      image2FileId: '',
                      projectUrl: '',
                      tools: ['react', 'tailwind'],
                      isOngoing: false,
                    },
                    ...(portfolio.lab || []),
                  ],
                });
              }}
              className="liquid-glass-active cursor-pointer self-start rounded-full px-5 py-2.5 text-xs font-bold sm:self-auto"
            >
              + Add Lab Project
            </button>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {(portfolio.lab || []).map((l: any, idx: number) => {
              const labList = portfolio.lab || [];
              const isDraggingThis =
                dragSource?.section === 'LAB' && dragSource.index === idx;
              const isDragTarget =
                dragOverTarget?.section === 'LAB' &&
                dragOverTarget.index === idx &&
                dragSource?.index !== idx;

              return (
                <div
                  key={l._id || l._uid || idx}
                  draggable={armedDragCard?.section === 'LAB' && armedDragCard.index === idx}
                  onDragStart={(e) => handleDragStart(e, 'LAB', idx)}
                  onDragOver={(e) => handleDragOver(e, 'LAB', idx)}
                  onDrop={(e) => handleDrop(e, 'LAB', idx)}
                  onDragEnd={handleDragEnd}
                  className={`glass-subcard space-y-4 rounded-3xl p-4 transition sm:p-5 ${
                    isDraggingThis ? 'scale-[0.98] opacity-50' : ''
                  } ${isDragTarget ? 'ring-2 ring-[#FF5733]' : ''}`}
                >
                  {renderCardOrderControls(
                    'LAB',
                    idx,
                    labList.length,
                    'Lab Item',
                    () => {
                      setPendingLabFiles1((prev) => removePendingRecord(prev, idx));
                      setPendingLabFiles2((prev) => removePendingRecord(prev, idx));
                      setPortfolio({
                        ...portfolio,
                        lab: portfolio.lab.filter((_: any, i: number) => i !== idx),
                      });
                    },
                    'Remove'
                  )}

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold opacity-80">Project Name *</label>
                      <input
                        type="text"
                        value={l.name}
                        onChange={(e) => {
                          const next = [...portfolio.lab];
                          next[idx] = { ...next[idx], name: e.target.value };
                          setPortfolio({ ...portfolio, lab: next });
                        }}
                        placeholder="e.g. Divara"
                        className="glass-input mt-1.5 w-full rounded-xl px-3.5 py-2.5 text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold opacity-80">
                        Live URL (Blank if WIP)
                      </label>
                      <input
                        type="text"
                        value={l.projectUrl}
                        onChange={(e) => {
                          const next = [...portfolio.lab];
                          next[idx] = { ...next[idx], projectUrl: e.target.value };
                          setPortfolio({ ...portfolio, lab: next });
                        }}
                        placeholder="https://..."
                        className="glass-input mt-1.5 w-full rounded-xl px-3.5 py-2.5 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold opacity-80">
                      Tech Stack / Tools Used (Comma-Separated)
                    </label>
                    <input
                      type="text"
                      value={(l.tools || []).join(', ')}
                      onChange={(e) => {
                        const next = [...portfolio.lab];
                        next[idx] = {
                          ...next[idx],
                          tools: e.target.value.split(',').map((s: string) => s.trim()),
                        };
                        setPortfolio({ ...portfolio, lab: next });
                      }}
                      placeholder="react, tailwind, gsap"
                      className="glass-input mt-1.5 w-full rounded-xl px-3.5 py-2.5 text-xs"
                    />
                  </div>

                  <div className="rounded-2xl border border-neutral-500/15 p-3">
                    <label className="block text-xs font-bold opacity-80">
                      Primary Cover Image (Image 1)
                    </label>
                    <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2">
                      <span className="max-w-full truncate font-mono text-[11px] opacity-70">
                        {pendingLabFiles1[idx]
                          ? `Queued: ${pendingLabFiles1[idx].name}`
                          : l.image1 || '/coming_soon.mp4'}
                      </span>
                      <label className="liquid-glass-active shrink-0 cursor-pointer rounded-full px-3.5 py-1.5 text-[11px] font-bold">
                        Select Image 1
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) setPendingLabFiles1((p) => ({ ...p, [idx]: f }));
                            e.target.value = '';
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-neutral-500/15 p-3">
                    <label className="block text-xs font-bold opacity-80">
                      WebGL Blob Hover Image (Image 2)
                    </label>
                    <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2">
                      <span className="max-w-full truncate font-mono text-[11px] opacity-70">
                        {pendingLabFiles2[idx]
                          ? `Queued: ${pendingLabFiles2[idx].name}`
                          : l.image2 || '/coming_soon.mp4'}
                      </span>
                      <label className="liquid-glass-active shrink-0 cursor-pointer rounded-full px-3.5 py-1.5 text-[11px] font-bold">
                        Select Image 2
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) setPendingLabFiles2((p) => ({ ...p, [idx]: f }));
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
      )}

      {/* TAB 6: CERTIFICATES */}
      {cmsSectionTab === 'CERTIFICATES' && (
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
                    <label className="block text-xs font-bold opacity-80">
                      Certificate Title *
                    </label>
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
      )}

      {/* Fullscreen In-App Resume PDF Viewer Modal (No Download Required) */}
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
};