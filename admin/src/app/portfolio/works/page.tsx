// admin/src/app/portfolio/works/page.tsx
'use client';

import {
  usePortfolioCms,
  prependPendingRecord,
  removePendingRecord,
} from '@/context/PortfolioContext';

export default function WorksSubpage() {
  const {
    portfolio,
    setPortfolio,
    pendingWorkFiles,
    setPendingWorkFiles,
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
          const isDraggingThis = dragSource?.section === 'WORKS' && dragSource.index === idx;
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
                <label className="block text-xs font-bold opacity-80">Project Description</label>
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

              <div>
                <label className="block text-xs font-bold opacity-80">
                  Preview Video Link / Path OR Upload File (Defaults to /coming_soon.mp4)
                </label>
                <div className="mt-1.5 flex flex-col gap-2 sm:flex-row">
                  <input
                    type="text"
                    value={
                      pendingWorkFiles[idx]
                        ? `Queued: ${pendingWorkFiles[idx].name}`
                        : (w.videoUrl ?? '/coming_soon.mp4')
                    }
                    onChange={(e) => {
                      if (pendingWorkFiles[idx]) {
                        setPendingWorkFiles((prev) => {
                          const nextPending = { ...prev };
                          delete nextPending[idx];
                          return nextPending;
                        });
                      }
                      const next = [...portfolio.works];
                      next[idx] = { ...next[idx], videoUrl: e.target.value };
                      setPortfolio({ ...portfolio, works: next });
                    }}
                    placeholder="/coming_soon.mp4 or https://ik.imagekit.io/..."
                    className="glass-input w-full rounded-xl px-3.5 py-2 text-xs"
                  />
                  <label className="liquid-glass-active shrink-0 cursor-pointer rounded-xl px-4 py-2 text-center text-xs font-bold">
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
                  {pendingWorkFiles[idx] && (
                    <button
                      type="button"
                      onClick={() =>
                        setPendingWorkFiles((prev) => {
                          const nextPending = { ...prev };
                          delete nextPending[idx];
                          return nextPending;
                        })
                      }
                      className="cursor-pointer rounded-xl border border-red-500/30 px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-500 hover:text-white"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}