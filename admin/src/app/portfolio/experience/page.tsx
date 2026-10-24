// admin/src/app/portfolio/experience/page.tsx
'use client';

import { usePortfolioCms } from '@/context/PortfolioContext';

export default function ExperienceSubpage() {
  const {
    portfolio,
    setPortfolio,
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
  );
}