// admin/src/components/AddClientModal.tsx
import { useState, type FC, type ChangeEvent } from 'react';
import {
  COUNTRIES,
  WEBSITE_TYPES,
  COMMON_FUNCTIONALITY_OPTIONS,
  UNCOMMON_FUNCTIONALITY_OPTIONS,
  MOTION_TIERS,
} from '@/lib/pricingConstants';

interface Props {
  onClose: () => void;
  onClientAdded: (savedClient: any) => void;
  initialClient?: any | null;
}

function buildClientFolder(fullName: string, contact: string): string {
  const cleanName =
    fullName
      .trim()
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '') || 'Client';
  const cleanContact =
    contact
      .trim()
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '') || 'Contact';
  return `/Clients/Files/${cleanName}_${cleanContact}`;
}

export const AddClientModal: FC<Props> = ({ onClose, onClientAdded, initialClient = null }) => {
  const isEditMode = Boolean(initialClient && initialClient._id);
  const existingChoices = initialClient?.simpleChoices || {};
  const existingNotes = existingChoices.customSectionNotes || {};

  // Tab 01: Client, Contact, Region & Budget (All Optional)
  const [fullName, setFullName] = useState<string>(initialClient?.fullName || '');
  const [email, setEmail] = useState<string>(initialClient?.email || '');
  const [phone, setPhone] = useState<string>(initialClient?.phone || '');
  const [countryCode, setCountryCode] = useState<string>(initialClient?.countryCode || 'IN');
  const [countrySearch, setCountrySearch] = useState<string>('');
  const [budget, setBudget] = useState<number>(Number(initialClient?.budget ?? existingChoices.budget ?? 0));

  // Tab 02: Category, Pages & Custom Page Note (All Optional, starts at 0 pages)
  const [projectPurpose, setProjectPurpose] = useState<string>(
    existingChoices.projectPurpose ?? ''
  );
  const [pages, setPages] = useState<number>(
    Number(existingChoices.pages ?? initialClient?.complexConfig?.pages ?? 0)
  );
  const [pagesAndTypeNote, setPagesAndTypeNote] = useState<string>(
    existingNotes.pagesAndTypeNote || ''
  );

  // Tab 03: Website Functionality Toggles & Custom Functionality Note (All Optional)
  const [selectedTags, setSelectedTags] = useState<string[]>(
    Array.isArray(existingChoices.selectedTags) ? existingChoices.selectedTags : []
  );
  const [functionalityNote, setFunctionalityNote] = useState<string>(
    existingNotes.functionalityNote || ''
  );

  // Tab 04: Motion, Feel, 3D Experience & Custom Motion Note (All Optional)
  const [animationTier, setAnimationTier] = useState<'NONE' | 'BASIC' | 'ADVANCED' | 'WEBGL_3D'>(
    existingChoices.animationTier || 'NONE'
  );
  const [webglScenes, setWebglScenes] = useState<number>(
    Number(existingChoices.webglScenes ?? initialClient?.complexConfig?.webglScenes ?? 0)
  );
  const [motionAndFeelNote, setMotionAndFeelNote] = useState<string>(
    existingNotes.motionAndFeelNote || ''
  );

  // Tab 05: Business Brief, References, Extra Note, Files & Admin Status (All Optional)
  const [businessName, setBusinessName] = useState<string>(initialClient?.businessName || '');
  const [businessDescription, setBusinessDescription] = useState<string>(
    initialClient?.businessDescription || ''
  );
  const [mainGoal, setMainGoal] = useState<string>(initialClient?.mainGoal || '');
  const [launchDateReason, setLaunchDateReason] = useState<string>(
    initialClient?.launchDateReason || ''
  );
  const [rushDelivery, setRushDelivery] = useState<boolean>(
    Boolean(initialClient?.rushDelivery ?? existingChoices.rushDelivery ?? false)
  );
  const [designReferences, setDesignReferences] = useState<string>(
    initialClient?.designReferences || ''
  );
  const [briefExtraNote, setBriefExtraNote] = useState<string>(
    existingNotes.briefExtraNote || initialClient?.clientDescription || ''
  );

  // Admin Tracking Fields (All Optional)
  const [isCompleted, setIsCompleted] = useState<boolean>(Boolean(initialClient?.isCompleted));
  const [deliveryDate, setDeliveryDate] = useState<string>(initialClient?.deliveryDate || '');
  const [status, setStatus] = useState<string>(initialClient?.status || 'NEW');

  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const selectedCountryObj = COUNTRIES.find((c) => c.code === countryCode) || COUNTRIES[0];
  const sym = countryCode === 'IN' ? '₹' : '$';
  const selectedCategoryObj = WEBSITE_TYPES.find((t) => t.id === projectPurpose);
  const recommendedTags = selectedCategoryObj?.recommendedTags || [];

  const filteredCountries = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      c.code.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setPendingFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    e.target.value = '';
  };

  const handleSaveManualClient = async () => {
    setError('');
    setSaving(true);

    try {
      const cleanFullName = fullName.trim() || 'Unnamed Client';
      const emailPhoneCombined =
        [email.trim(), phone.trim()].filter(Boolean).join(' | ') || 'N/A';

      const folder = buildClientFolder(
        cleanFullName,
        phone.trim() || email.trim() || emailPhoneCombined
      );
      const uploadedAssets: any[] = Array.isArray(initialClient?.uploadedAssets)
        ? [...initialClient.uploadedAssets]
        : [];

      // Upload queued files if any
      for (const file of pendingFiles) {
        try {
          const authRes = await fetch('/api/imagekit-auth');
          if (authRes.ok) {
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
            if (upRes.ok) {
              const data = await upRes.json();
              uploadedAssets.push({
                fileId: data.fileId,
                name: data.name,
                url: data.url,
                size: data.size,
              });
            }
          }
        } catch (upErr) {
          console.warn('File upload skipped:', upErr);
        }
      }

      const region = countryCode === 'IN' ? 'INDIA' : 'INTL';
      const customSectionNotes = {
        pagesAndTypeNote: pagesAndTypeNote.trim(),
        functionalityNote: functionalityNote.trim(),
        motionAndFeelNote: motionAndFeelNote.trim(),
        briefExtraNote: briefExtraNote.trim(),
      };
      const combinedCustomNotes = [
        customSectionNotes.pagesAndTypeNote,
        customSectionNotes.functionalityNote,
        customSectionNotes.motionAndFeelNote,
        customSectionNotes.briefExtraNote,
      ]
        .filter(Boolean)
        .join('\n');

      const simpleChoicesPayload = {
        region,
        budget: Math.max(0, Number(budget) || 0),
        pages: Math.max(0, Number(pages) || 0),
        projectPurpose,
        animationTier,
        webglScenes:
          animationTier === 'WEBGL_3D' ? Math.max(1, Number(webglScenes) || 1) : Number(webglScenes) || 0,
        rushDelivery,
        selectedTags,
        customSectionNotes,
      };

      const payloadBody = {
        ...(isEditMode ? { id: initialClient._id } : { source: 'MANUAL' }),
        fullName: cleanFullName,
        email: email.trim(),
        phone: phone.trim(),
        emailPhone: emailPhoneCombined,
        countryCode: selectedCountryObj.code,
        countryName: selectedCountryObj.name,
        countryFlag: selectedCountryObj.code,
        region,
        businessName: businessName.trim(),
        businessDescription: businessDescription.trim(),
        mainGoal: mainGoal.trim(),
        launchDateReason: launchDateReason.trim(),
        rushDelivery,
        isCompleted,
        status: isCompleted ? 'COMPLETED' : status,
        deliveryDate: isCompleted
          ? deliveryDate || new Date().toISOString().split('T')[0]
          : deliveryDate,
        designReferences: designReferences.trim(),
        budget: Math.max(0, Number(budget) || 0),
        clientDescription: combinedCustomNotes,
        uploadedAssets,
        simpleChoices: simpleChoicesPayload,
      };

      const res = await fetch('/api/quotes', {
        method: isEditMode ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadBody),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to save client record');
      }

      const data = await res.json();
      onClientAdded(isEditMode ? data : data.client);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save client');
    } finally {
      setSaving(false);
    }
  };

  const previewFolder = buildClientFolder(
    fullName || 'Client',
    phone || email || 'Contact'
  );

  const renderFuncButton = (tag: string) => {
    const active = selectedTags.includes(tag);
    const isRecommended = recommendedTags.includes(tag);
    return (
      <button
        key={tag}
        type="button"
        onClick={() => toggleTag(tag)}
        className={`cursor-pointer rounded-full px-3 py-1.5 text-[11px] font-semibold transition ${
          active
            ? 'liquid-glass-active'
            : isRecommended
            ? 'glass-input border-[#ff5733]/50 opacity-95 hover:opacity-100'
            : 'glass-input opacity-80 hover:opacity-100'
        }`}
      >
        {active ? '✓ ' : '+ '}
        {tag}
        {isRecommended && !active && (
          <span className="ml-1 text-[9px] font-bold text-[#ff5733]">★</span>
        )}
      </button>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 backdrop-blur-xs sm:p-5">
      <div className="admin-surface-card max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl p-5 shadow-2xl sm:p-8">
        <div className="flex items-center justify-between border-b border-neutral-500/15 pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">
              Complete Pricing App Form • Every Field Is Optional in Admin Panel
            </span>
            <h3 className="mt-0.5 text-xl font-black sm:text-2xl">
              {isEditMode ? `Edit Client Record — ${initialClient.fullName}` : 'Add Career Client Manually'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="glass-subcard cursor-pointer rounded-full px-4 py-2 text-xs font-bold"
          >
            ✕ Close
          </button>
        </div>

        <div className="mt-6 space-y-6 text-xs">
          {/* =========================================================
              TAB 01: CLIENT, CONTACT, REGION & BUDGET (ALL OPTIONAL)
          ========================================================= */}
          <div className="glass-subcard space-y-4 rounded-2xl p-5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#ff5733]">
              01 • Client, Contact, Region &amp; Target Budget (All Optional)
            </span>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="block font-bold opacity-80">Full Name (Optional)</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="glass-input mt-1 w-full rounded-xl px-3.5 py-2.5"
                />
              </div>

              <div>
                <label className="block font-bold opacity-80">Email Address (Optional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="client@company.com"
                  className="glass-input mt-1 w-full rounded-xl px-3.5 py-2.5"
                />
              </div>

              <div>
                <label className="block font-bold opacity-80">
                  Phone / WhatsApp Number (Optional)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={countryCode === 'IN' ? '+91 9876543210' : '+1 555 234 5678'}
                  className="glass-input mt-1 w-full rounded-xl px-3.5 py-2.5"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold opacity-80">
                  Region / Country (All {COUNTRIES.length} Countries • Sets Currency Automatically)
                </label>
                <div className="mt-1 flex flex-col gap-2 sm:flex-row">
                  <input
                    type="text"
                    value={countrySearch}
                    onChange={(e) => setCountrySearch(e.target.value)}
                    placeholder="Filter country list..."
                    className="glass-input rounded-xl px-3.5 py-2.5 sm:w-48"
                  />
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="glass-input flex-1 cursor-pointer rounded-xl px-3.5 py-2.5 font-bold"
                  >
                    {filteredCountries.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name} ({c.code}) — {c.code === 'IN' ? '₹ INR' : '$ USD'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold opacity-80">
                  Client Target Budget ({sym}) (Optional)
                </label>
                <input
                  type="number"
                  min={0}
                  value={budget === 0 ? '' : budget}
                  onChange={(e) =>
                    setBudget(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))
                  }
                  placeholder={`0 (${sym})`}
                  className="glass-input mt-1 w-full rounded-xl px-3.5 py-2.5 font-bold"
                />
              </div>
            </div>
          </div>

          {/* =========================================================
              TAB 02: WEBSITE CATEGORY, PAGES & CUSTOM NOTE (ALL OPTIONAL)
          ========================================================= */}
          <div className="glass-subcard space-y-4 rounded-2xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#ff5733]">
                02 • Website Category, Page Count &amp; Custom Structure Note (All Optional)
              </span>
              {projectPurpose && (
                <button
                  type="button"
                  onClick={() => setProjectPurpose('')}
                  className="cursor-pointer text-[11px] font-bold underline opacity-70 hover:opacity-100"
                >
                  Clear Category Selection
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {WEBSITE_TYPES.map((t) => {
                const isSelected = projectPurpose === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setProjectPurpose(t.id)}
                    className={`cursor-pointer rounded-2xl p-3.5 text-left transition ${
                      isSelected ? 'liquid-glass-active' : 'glass-input opacity-85 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold">{t.title}</span>
                      <span className="text-[10px] opacity-75">~{t.recommendedPages}p</span>
                    </div>
                    <p className="mt-1 text-[11px] opacity-80">{t.desc}</p>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-3">
              <div>
                <label className="block font-bold opacity-80">
                  Number of Pages (Starts at 0 • Optional)
                </label>
                <div className="mt-1 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPages(Math.max(0, pages - 1))}
                    className="glass-input h-10 w-10 cursor-pointer rounded-xl font-bold"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min={0}
                    value={pages}
                    onChange={(e) => setPages(Math.max(0, Number(e.target.value) || 0))}
                    className="glass-input w-20 rounded-xl px-3 py-2 text-center font-black"
                  />
                  <button
                    type="button"
                    onClick={() => setPages(pages + 1)}
                    className="glass-input h-10 w-10 cursor-pointer rounded-xl font-bold"
                  >
                    +
                  </button>
                  {selectedCategoryObj && pages !== selectedCategoryObj.recommendedPages && (
                    <button
                      type="button"
                      onClick={() => setPages(selectedCategoryObj.recommendedPages)}
                      className="glass-input cursor-pointer rounded-xl px-2.5 py-2 text-[10px] font-bold"
                    >
                      Use ~{selectedCategoryObj.recommendedPages}p
                    </button>
                  )}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold opacity-80">
                  Tab 02 Custom Note — Other Website Type or Custom Page Structure (Optional)
                </label>
                <input
                  type="text"
                  value={pagesAndTypeNote}
                  onChange={(e) => setPagesAndTypeNote(e.target.value)}
                  placeholder="e.g. Need a 7-page architecture showcase with a custom project comparison page..."
                  className="glass-input mt-1 w-full rounded-xl px-3.5 py-2.5"
                />
              </div>
            </div>
          </div>

          {/* =========================================================
              TAB 03: WEBSITE FUNCTIONALITY & CUSTOM WORKFLOW NOTE (ALL OPTIONAL)
          ========================================================= */}
          <div className="glass-subcard space-y-4 rounded-2xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#ff5733]">
                03 • Website Functionality Toggles &amp; Custom Workflow Note ({selectedTags.length}{' '}
                Selected • All Optional)
              </span>
              {selectedTags.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedTags([])}
                  className="cursor-pointer text-[11px] font-bold underline opacity-70 hover:opacity-100"
                >
                  Clear All Functionalities
                </button>
              )}
            </div>

            {selectedCategoryObj && (
              <p className="text-[11px] opacity-70">
                ★ Features recommended for <strong>{selectedCategoryObj.title}</strong> are marked
                with <span className="font-bold text-[#ff5733]">★</span> (not auto-selected).
              </p>
            )}

            <div>
              <span className="block text-[10px] font-bold uppercase opacity-60">
                Common Website Functionalities
              </span>
              <div className="mt-2 flex flex-wrap gap-2">
                {COMMON_FUNCTIONALITY_OPTIONS.map(renderFuncButton)}
              </div>
            </div>

            <div className="border-t border-neutral-500/15 pt-3">
              <span className="block text-[10px] font-bold uppercase opacity-60">
                Specialized &amp; Uncommon Functionalities
              </span>
              <div className="mt-2 flex flex-wrap gap-2">
                {UNCOMMON_FUNCTIONALITY_OPTIONS.map(renderFuncButton)}
              </div>
            </div>

            <div>
              <label className="block font-bold opacity-80">
                Tab 03 Custom Note — Custom Functionality or Workflow in Client&apos;s Words
                (Optional)
              </label>
              <textarea
                rows={2}
                value={functionalityNote}
                onChange={(e) => setFunctionalityNote(e.target.value)}
                placeholder="e.g. Product showcase only without payment gateway or admin panel..."
                className="glass-input mt-1 w-full rounded-xl p-3"
              />
            </div>
          </div>

          {/* =========================================================
              TAB 04: MOTION, FEEL, 3D EXPERIENCE & CUSTOM NOTE (ALL OPTIONAL)
          ========================================================= */}
          <div className="glass-subcard space-y-4 rounded-2xl p-5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#ff5733]">
              04 • Motion, Feel, 3D Experience &amp; Custom Animation Note (All Optional)
            </span>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
              {MOTION_TIERS.map((m) => {
                const isSelected = animationTier === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setAnimationTier(m.id);
                      if (m.id === 'WEBGL_3D' && webglScenes === 0) setWebglScenes(1);
                      if (m.id !== 'WEBGL_3D') setWebglScenes(0);
                    }}
                    className={`cursor-pointer rounded-2xl p-3.5 text-left transition ${
                      isSelected ? 'liquid-glass-active' : 'glass-input opacity-85 hover:opacity-100'
                    }`}
                  >
                    <span className="text-[9px] font-bold uppercase opacity-75">{m.badge}</span>
                    <div className="mt-0.5 font-bold">{m.title}</div>
                    <p className="mt-1 text-[11px] opacity-80">{m.desc}</p>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block font-bold opacity-80">
                  Interactive 3D / WebGL Scenes (Optional)
                </label>
                <input
                  type="number"
                  min={0}
                  value={webglScenes}
                  onChange={(e) => setWebglScenes(Math.max(0, Number(e.target.value) || 0))}
                  className="glass-input mt-1 w-full rounded-xl px-3.5 py-2.5 font-bold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold opacity-80">
                  Tab 04 Custom Note — Specific Animation, Cursor, Theme-Toggle or 3D Ideas
                  (Optional)
                </label>
                <input
                  type="text"
                  value={motionAndFeelNote}
                  onChange={(e) => setMotionAndFeelNote(e.target.value)}
                  placeholder="e.g. Custom magnetic cursor, dark/light switch, rotating 3D model..."
                  className="glass-input mt-1 w-full rounded-xl px-3.5 py-2.5"
                />
              </div>
            </div>
          </div>

          {/* =========================================================
              TAB 05: BUSINESS BRIEF, REFERENCES, FILES & STATUS (ALL OPTIONAL)
          ========================================================= */}
          <div className="glass-subcard space-y-4 rounded-2xl p-5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#ff5733]">
              05 • Business Brief, Design References, Assets &amp; Project Status (All Optional)
            </span>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-bold opacity-80">Business Name (Optional)</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Studio XYZ / Noctowls"
                  className="glass-input mt-1 w-full rounded-xl px-3.5 py-2.5"
                />
              </div>

              <div>
                <label className="block font-bold opacity-80">
                  Main Website Goal (Leads, Sales, Portfolio, Pitch) (Optional)
                </label>
                <input
                  type="text"
                  value={mainGoal}
                  onChange={(e) => setMainGoal(e.target.value)}
                  placeholder="e.g. Drive online bookings and brand authority"
                  className="glass-input mt-1 w-full rounded-xl px-3.5 py-2.5"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold opacity-80">
                Description of the Business (What the business does &amp; target customers)
                (Optional)
              </label>
              <textarea
                rows={2}
                value={businessDescription}
                onChange={(e) => setBusinessDescription(e.target.value)}
                placeholder="What the business offers, products/services, and target audience..."
                className="glass-input mt-1 w-full rounded-xl p-3"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-bold opacity-80">
                  Ideal Launch Date &amp; Reason (Optional)
                </label>
                <input
                  type="text"
                  value={launchDateReason}
                  onChange={(e) => setLaunchDateReason(e.target.value)}
                  placeholder="e.g. Dec 15 — Store opening"
                  className="glass-input mt-1 w-full rounded-xl px-3.5 py-2.5"
                />
              </div>

              <div>
                <label className="block font-bold opacity-80">
                  Figma Design Link OR Reference Website URLs (Optional)
                </label>
                <input
                  type="text"
                  value={designReferences}
                  onChange={(e) => setDesignReferences(e.target.value)}
                  placeholder="https://figma.com/... or reference URLs"
                  className="glass-input mt-1 w-full rounded-xl px-3.5 py-2.5"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold opacity-80">
                Tab 05 Custom Note — Anything Else You Want Me to Know? (Optional)
              </label>
              <textarea
                rows={2}
                value={briefExtraNote}
                onChange={(e) => setBriefExtraNote(e.target.value)}
                placeholder="Any special timelines, questions, or in-person meeting notes..."
                className="glass-input mt-1 w-full rounded-xl p-3"
              />
            </div>

            {/* Rush, Status & Completion Row */}
            <div className="grid grid-cols-1 gap-4 rounded-2xl border border-neutral-500/15 p-4 sm:grid-cols-4">
              <label className="flex cursor-pointer items-center gap-2 font-bold">
                <input
                  type="checkbox"
                  checked={rushDelivery}
                  onChange={(e) => setRushDelivery(e.target.checked)}
                  className="h-4 w-4 cursor-pointer"
                />
                <span>Rush Delivery (+30%)</span>
              </label>

              <label className="flex cursor-pointer items-center gap-2 font-bold">
                <input
                  type="checkbox"
                  checked={isCompleted}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setIsCompleted(checked);
                    if (checked && !deliveryDate) {
                      setDeliveryDate(new Date().toISOString().split('T')[0]);
                    }
                  }}
                  className="h-4 w-4 cursor-pointer"
                />
                <span>Project Completed?</span>
              </label>

              <div>
                <label className="block text-[10px] font-bold uppercase opacity-60">
                  Workflow Status
                </label>
                <select
                  value={isCompleted ? 'COMPLETED' : status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    setIsCompleted(e.target.value === 'COMPLETED');
                  }}
                  className="glass-input mt-1 w-full cursor-pointer rounded-xl px-3 py-1.5 text-xs font-bold"
                >
                  <option value="NEW">NEW</option>
                  <option value="REVIEWED">REVIEWED</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase opacity-60">
                  Delivery Date (Optional)
                </label>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="glass-input mt-1 w-full rounded-xl px-3 py-1.5 text-xs font-bold"
                />
              </div>
            </div>

            {/* Multi-file upload to /Clients/Files/{Name}_{Contact} */}
            <div className="rounded-2xl border border-neutral-500/15 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="font-bold">Attach Client Files (Multi-File • Optional)</span>
                  <p className="text-[11px] opacity-60">Saves to {previewFolder}</p>
                </div>
                <label className="liquid-glass-active cursor-pointer rounded-full px-4 py-2 text-xs font-bold">
                  + Select Files
                  <input type="file" multiple className="hidden" onChange={handleFileSelect} />
                </label>
              </div>

              {pendingFiles.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {pendingFiles.map((f, i) => (
                    <span
                      key={i}
                      className="glass-input inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold"
                    >
                      {f.name}
                      <button
                        type="button"
                        onClick={() =>
                          setPendingFiles((prev) => prev.filter((_, idx) => idx !== i))
                        }
                        className="cursor-pointer font-bold opacity-60 hover:opacity-100"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {error && <p className="font-bold text-red-500">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="glass-subcard cursor-pointer rounded-full px-6 py-3 font-bold"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={handleSaveManualClient}
              className="liquid-glass-active cursor-pointer rounded-full px-7 py-3 font-bold"
            >
              {saving
                ? 'Uploading & Saving...'
                : isEditMode
                ? 'Save Updated Client Details →'
                : 'Save Client to Career Ledger →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};