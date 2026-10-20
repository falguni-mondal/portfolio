// admin/src/components/PortfolioCmsTab.tsx
import { useState, type FC, type Dispatch, type SetStateAction } from 'react';

interface Props {
  portfolio: any;
  setPortfolio: Dispatch<SetStateAction<any>>;
}

export const PortfolioCmsTab: FC<Props> = ({ portfolio, setPortfolio }) => {
  // Default 1st tab is EXPERIENCE
  const [cmsSectionTab, setCmsSectionTab] = useState<
    'EXPERIENCE' | 'WORKS' | 'ARSENAL_CONTACT' | 'LAB' | 'CERTIFICATES'
  >('EXPERIENCE');

  const [pendingWorkFiles, setPendingWorkFiles] = useState<Record<number, File>>({});
  const [pendingLabFiles1, setPendingLabFiles1] = useState<Record<number, File>>({});
  const [pendingLabFiles2, setPendingLabFiles2] = useState<Record<number, File>>({});
  const [pendingCertFiles, setPendingCertFiles] = useState<Record<number, File>>({});
  const [savingPortfolio, setSavingPortfolio] = useState(false);
  const [portfolioStatusMsg, setPortfolioStatusMsg] = useState('');

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

  const handleSaveAndPublishPortfolio = async () => {
    if (!portfolio) return;
    setSavingPortfolio(true);
    setPortfolioStatusMsg('Uploading queued files to ImageKit...');

    try {
      const deletedFileIds: string[] = [];
      const nextWorks = [...(portfolio.works || [])];
      const nextLab = [...(portfolio.lab || [])];
      const nextCerts = [...(portfolio.certificates || [])];

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
          works: nextWorks,
          lab: nextLab,
          certificates: nextCerts,
          deletedFileIds,
        }),
      });

      if (res.ok) {
        const savedDoc = await res.json();
        setPortfolio(savedDoc);
        setPendingWorkFiles({});
        setPendingLabFiles1({});
        setPendingLabFiles2({});
        setPendingCertFiles({});
        setPortfolioStatusMsg('Published to byfalguni.com');
        setTimeout(() => setPortfolioStatusMsg(''), 3500);
      }
    } catch (err: unknown) {
      setPortfolioStatusMsg(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSavingPortfolio(false);
    }
  };

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
            Queued media files upload on Save and delete replaced old files automatically. Empty
            media defaults to /coming_soon.mp4.
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

      {/* Sub-Navigation Pills: 1. Experience -> 2. Works -> 3. Arsenal & Contact -> 4. Lab -> 5. Certificates */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'EXPERIENCE', label: `1. Experience (${portfolio.experience?.length || 0})` },
          { id: 'WORKS', label: `2. Works (${portfolio.works?.length || 0})` },
          { id: 'ARSENAL_CONTACT', label: '3. Arsenal & Contact' },
          { id: 'LAB', label: `4. Lab (${portfolio.lab?.length || 0})` },
          { id: 'CERTIFICATES', label: `5. Certificates (${portfolio.certificates?.length || 0})` },
        ].map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setCmsSectionTab(s.id as any)}
            className={`cursor-pointer rounded-full px-4 py-2.5 text-xs font-bold transition sm:px-5 ${
              cmsSectionTab === s.id ? 'liquid-glass-active' : 'glass-subcard'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* TAB 1: CAREER EXPERIENCE */}
      {cmsSectionTab === 'EXPERIENCE' && (
        <div className="space-y-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-base font-bold">Career Chapters (Experience)</h3>
              <p className="text-xs opacity-60">
                Add your companies here first. Projects linked in the Works tab automatically sync
                to their company here.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setPortfolio({
                  ...portfolio,
                  experience: [
                    ...(portfolio.experience || []),
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

              return (
                <div key={exp.id || idx} className="glass-subcard space-y-4 rounded-3xl p-4 sm:p-5">
                  <div className="flex items-center justify-between border-b border-neutral-500/15 pb-3">
                    <span className="text-xs font-bold uppercase tracking-wider opacity-50">
                      Experience #0{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setPortfolio({
                          ...portfolio,
                          experience: portfolio.experience.filter(
                            (_: any, i: number) => i !== idx
                          ),
                        })
                      }
                      className="cursor-pointer rounded-full border border-red-500/30 px-3 py-1 text-[11px] font-bold text-red-500 hover:bg-red-500 hover:text-white"
                    >
                      Remove
                    </button>
                  </div>

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
                          next[idx].name = e.target.value;
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
                          next[idx].type = e.target.value;
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
                          next[idx].role = e.target.value;
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
                          next[idx].from = e.target.value;
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
                          next[idx].to = e.target.value;
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
                        next[idx].isPresent = e.target.checked;
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

      {/* TAB 2: PROFESSIONAL WORKS */}
      {cmsSectionTab === 'WORKS' && (
        <div className="space-y-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-base font-bold">Professional Client Works</h3>
              <p className="text-xs opacity-60">
                Link each work to an Experience company. Empty video defaults to /coming_soon.mp4.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setPortfolio({
                  ...portfolio,
                  works: [
                    ...(portfolio.works || []),
                    {
                      name: '',
                      description: '',
                      companyId: portfolio.experience?.[0]?.id || '',
                      companyName: portfolio.experience?.[0]?.name || '',
                      videoUrl: '/coming_soon.mp4',
                      videoFileId: '',
                      isOngoing: true,
                      url: '',
                    },
                  ],
                })
              }
              className="liquid-glass-active cursor-pointer self-start rounded-full px-5 py-2.5 text-xs font-bold sm:self-auto"
            >
              + Add New Work
            </button>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {(portfolio.works || []).map((w: any, idx: number) => (
              <div key={idx} className="glass-subcard space-y-4 rounded-3xl p-4 sm:p-5">
                <div className="flex items-center justify-between border-b border-neutral-500/15 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider opacity-50">
                    Work #0{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setPortfolio({
                        ...portfolio,
                        works: portfolio.works.filter((_: any, i: number) => i !== idx),
                      })
                    }
                    className="cursor-pointer rounded-full border border-red-500/30 px-3 py-1 text-[11px] font-bold text-red-500 hover:bg-red-500 hover:text-white"
                  >
                    Remove Work
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold opacity-80">Project Title *</label>
                    <input
                      type="text"
                      value={w.name}
                      onChange={(e) => {
                        const next = [...portfolio.works];
                        next[idx].name = e.target.value;
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
                        next[idx].companyId = chosenId;
                        next[idx].companyName = chosenExp ? chosenExp.name : '';
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
                      next[idx].description = e.target.value;
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
                        next[idx].url = e.target.value;
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
                          next[idx].isOngoing = e.target.checked;
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
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ARSENAL & CONTACT INFO */}
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
              Contact & Social URLs
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

      {/* TAB 4: THE LAB PROJECTS */}
      {cmsSectionTab === 'LAB' && (
        <div className="space-y-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-base font-bold">The Lab (Personal & R&D Experiments)</h3>
              <p className="text-xs opacity-60">
                Dual-image WebGL hover items. Uploads on Save & deletes replaced old files.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setPortfolio({
                  ...portfolio,
                  lab: [
                    ...(portfolio.lab || []),
                    {
                      name: '',
                      image1: '/coming_soon.mp4',
                      image1FileId: '',
                      image2: '/coming_soon.mp4',
                      image2FileId: '',
                      projectUrl: '',
                      tools: ['react', 'tailwind'],
                      isOngoing: false,
                    },
                  ],
                })
              }
              className="liquid-glass-active cursor-pointer self-start rounded-full px-5 py-2.5 text-xs font-bold sm:self-auto"
            >
              + Add Lab Project
            </button>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {(portfolio.lab || []).map((l: any, idx: number) => (
              <div key={idx} className="glass-subcard space-y-4 rounded-3xl p-4 sm:p-5">
                <div className="flex items-center justify-between border-b border-neutral-500/15 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider opacity-50">
                    Lab Item #0{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setPortfolio({
                        ...portfolio,
                        lab: portfolio.lab.filter((_: any, i: number) => i !== idx),
                      })
                    }
                    className="cursor-pointer rounded-full border border-red-500/30 px-3 py-1 text-[11px] font-bold text-red-500 hover:bg-red-500 hover:text-white"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold opacity-80">Project Name *</label>
                    <input
                      type="text"
                      value={l.name}
                      onChange={(e) => {
                        const next = [...portfolio.lab];
                        next[idx].name = e.target.value;
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
                        next[idx].projectUrl = e.target.value;
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
                      next[idx].tools = e.target.value.split(',').map((s: string) => s.trim());
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
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: CERTIFICATES */}
      {cmsSectionTab === 'CERTIFICATES' && (
        <div className="space-y-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-base font-bold">Verified Credentials & Certificates</h3>
              <p className="text-xs opacity-60">
                Paste an external verification URL OR upload a certificate file to ImageKit on Save.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setPortfolio({
                  ...portfolio,
                  certificates: [
                    ...(portfolio.certificates || []),
                    {
                      name: '',
                      organization: '',
                      year: '2026',
                      certId: '',
                      url: '/coming_soon.mp4',
                      fileId: '',
                    },
                  ],
                })
              }
              className="liquid-glass-active cursor-pointer self-start rounded-full px-5 py-2.5 text-xs font-bold sm:self-auto"
            >
              + Add Certificate
            </button>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {(portfolio.certificates || []).map((c: any, idx: number) => (
              <div key={idx} className="glass-subcard space-y-4 rounded-3xl p-4 sm:p-5">
                <div className="flex items-center justify-between border-b border-neutral-500/15 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider opacity-50">
                    Certificate #0{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setPortfolio({
                        ...portfolio,
                        certificates: portfolio.certificates.filter(
                          (_: any, i: number) => i !== idx
                        ),
                      })
                    }
                    className="cursor-pointer rounded-full border border-red-500/30 px-3 py-1 text-[11px] font-bold text-red-500 hover:bg-red-500 hover:text-white"
                  >
                    Remove
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold opacity-80">Certificate Title *</label>
                  <input
                    type="text"
                    value={c.name}
                    onChange={(e) => {
                      const next = [...portfolio.certificates];
                      next[idx].name = e.target.value;
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
                        next[idx].organization = e.target.value;
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
                        next[idx].year = e.target.value;
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
                        next[idx].certId = e.target.value;
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
                        next[idx].url = e.target.value;
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
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};