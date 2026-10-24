// admin/src/app/portfolio/lab/page.tsx
'use client';

import {
  usePortfolioCms,
  prependPendingRecord,
  removePendingRecord,
} from '@/context/PortfolioContext';

export default function LabSubpage() {
  const {
    portfolio,
    setPortfolio,
    pendingLabFiles1,
    setPendingLabFiles1,
    pendingLabFiles2,
    setPendingLabFiles2,
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
          const isDraggingThis = dragSource?.section === 'LAB' && dragSource.index === idx;
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

              <div>
                <label className="block text-xs font-bold opacity-80">
                  Primary Cover Image (Image 1) Link OR Upload File
                </label>
                <div className="mt-1.5 flex flex-col gap-2 sm:flex-row">
                  <input
                    type="text"
                    value={
                      pendingLabFiles1[idx]
                        ? `Queued: ${pendingLabFiles1[idx].name}`
                        : (l.image1 ?? '/coming_soon.mp4')
                    }
                    onChange={(e) => {
                      if (pendingLabFiles1[idx]) {
                        setPendingLabFiles1((prev) => {
                          const nextPending = { ...prev };
                          delete nextPending[idx];
                          return nextPending;
                        });
                      }
                      const next = [...portfolio.lab];
                      next[idx] = { ...next[idx], image1: e.target.value };
                      setPortfolio({ ...portfolio, lab: next });
                    }}
                    placeholder="https://... or upload file"
                    className="glass-input w-full rounded-xl px-3.5 py-2 text-xs"
                  />
                  <label className="liquid-glass-active shrink-0 cursor-pointer rounded-xl px-4 py-2 text-center text-xs font-bold">
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
                  {pendingLabFiles1[idx] && (
                    <button
                      type="button"
                      onClick={() =>
                        setPendingLabFiles1((prev) => {
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

              <div>
                <label className="block text-xs font-bold opacity-80">
                  WebGL Blob Hover Image (Image 2) Link OR Upload File
                </label>
                <div className="mt-1.5 flex flex-col gap-2 sm:flex-row">
                  <input
                    type="text"
                    value={
                      pendingLabFiles2[idx]
                        ? `Queued: ${pendingLabFiles2[idx].name}`
                        : (l.image2 ?? '/coming_soon.mp4')
                    }
                    onChange={(e) => {
                      if (pendingLabFiles2[idx]) {
                        setPendingLabFiles2((prev) => {
                          const nextPending = { ...prev };
                          delete nextPending[idx];
                          return nextPending;
                        });
                      }
                      const next = [...portfolio.lab];
                      next[idx] = { ...next[idx], image2: e.target.value };
                      setPortfolio({ ...portfolio, lab: next });
                    }}
                    placeholder="https://... or upload file"
                    className="glass-input w-full rounded-xl px-3.5 py-2 text-xs"
                  />
                  <label className="liquid-glass-active shrink-0 cursor-pointer rounded-xl px-4 py-2 text-center text-xs font-bold">
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
                  {pendingLabFiles2[idx] && (
                    <button
                      type="button"
                      onClick={() =>
                        setPendingLabFiles2((prev) => {
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