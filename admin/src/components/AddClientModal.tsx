// admin/src/components/AddClientModal.tsx
import { useState, type FC, type ChangeEvent } from 'react';

interface Props {
  onClose: () => void;
  onClientAdded: (newClient: any) => void;
}

const COUNTRIES = [
  { code: 'IN', name: 'India' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'SG', name: 'Singapore' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
];

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

export const AddClientModal: FC<Props> = ({ onClose, onClientAdded }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('IN');
  const [businessName, setBusinessName] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [mainGoal, setMainGoal] = useState('');
  const [launchDateReason, setLaunchDateReason] = useState('');
  const [designReferences, setDesignReferences] = useState('');
  const [budget, setBudget] = useState<number>(0);
  const [pages, setPages] = useState<number>(5);
  const [projectPurpose, setProjectPurpose] = useState('BUSINESS_CORPORATE');
  const [animationTier, setAnimationTier] = useState<'NONE' | 'BASIC' | 'ADVANCED' | 'WEBGL_3D'>(
    'BASIC'
  );
  const [rushDelivery, setRushDelivery] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [customNotes, setCustomNotes] = useState('');

  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setPendingFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    e.target.value = '';
  };

  const handleSaveManualClient = async () => {
    setError('');
    const emailPhoneCombined = [email.trim(), phone.trim()].filter(Boolean).join(' | ');

    if (!fullName.trim() || !emailPhoneCombined) {
      setError('Client Full Name and at least one Contact (Email or Phone) are required.');
      return;
    }

    if (!businessDescription.trim()) {
      setError('Description of the Business is required.');
      return;
    }

    setSaving(true);
    try {
      const folder = buildClientFolder(fullName, phone.trim() || email.trim() || emailPhoneCombined);
      const uploadedAssets: any[] = [];

      // Upload queued files to /Clients/Files/{Name}_{Contact}
      for (const file of pendingFiles) {
        const authRes = await fetch('/api/imagekit-auth');
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

      const selectedCountryObj = COUNTRIES.find((c) => c.code === countryCode) || COUNTRIES[0];
      const region = countryCode === 'IN' ? 'INDIA' : 'INTL';

      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'MANUAL',
          fullName: fullName.trim(),
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
          deliveryDate: isCompleted
            ? deliveryDate || new Date().toISOString().split('T')[0]
            : deliveryDate,
          designReferences: designReferences.trim(),
          budget,
          clientDescription: customNotes.trim(),
          uploadedAssets,
          simpleChoices: {
            region,
            budget,
            pages,
            projectPurpose,
            animationTier,
            rushDelivery,
            selectedTags: [],
            customSectionNotes: {
              briefExtraNote: customNotes.trim(),
            },
          },
        }),
      });

      if (!res.ok) throw new Error('Failed to save manual client');
      const data = await res.json();
      onClientAdded(data.client);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create client');
    } finally {
      setSaving(false);
    }
  };

  const previewFolder = buildClientFolder(
    fullName || 'Client',
    phone || email || 'Contact'
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-xs">
      <div className="admin-surface-card max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl p-6 shadow-2xl sm:p-8">
        <div className="flex items-center justify-between border-b border-neutral-500/15 pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">
              In-Person / Direct Client Entry
            </span>
            <h3 className="mt-0.5 text-xl font-black sm:text-2xl">Add Career Client Manually</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="glass-subcard cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-bold"
          >
            ✕ Close
          </button>
        </div>

        <div className="mt-5 space-y-4 text-xs">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-bold opacity-80">Full Name *</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Client Full Name"
                className="glass-input mt-1 w-full rounded-xl px-3.5 py-2.5"
              />
            </div>

            <div>
              <label className="block font-bold opacity-80">Country / Region</label>
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="glass-input mt-1 w-full cursor-pointer rounded-xl px-3.5 py-2.5 font-bold"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name} ({c.code === 'IN' ? '₹ INR' : '$ USD'})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold opacity-80">Email Address *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@company.com"
                className="glass-input mt-1 w-full rounded-xl px-3.5 py-2.5"
              />
            </div>

            <div>
              <label className="block font-bold opacity-80">Phone / WhatsApp Number *</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 9876543210"
                className="glass-input mt-1 w-full rounded-xl px-3.5 py-2.5"
              />
            </div>

            <div>
              <label className="block font-bold opacity-80">Business Name</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Studio XYZ"
                className="glass-input mt-1 w-full rounded-xl px-3.5 py-2.5"
              />
            </div>

            <div>
              <label className="block font-bold opacity-80">Client Target Budget</label>
              <input
                type="number"
                min={0}
                value={budget || ''}
                onChange={(e) => setBudget(Number(e.target.value))}
                placeholder="e.g. 25000"
                className="glass-input mt-1 w-full rounded-xl px-3.5 py-2.5 font-bold"
              />
            </div>
          </div>

          {/* Required Description of the Business */}
          <div>
            <label className="block font-bold opacity-80">Description of the Business *</label>
            <textarea
              rows={2}
              value={businessDescription}
              onChange={(e) => setBusinessDescription(e.target.value)}
              placeholder="What the business does, products/services offered, and target audience..."
              className="glass-input mt-1 w-full rounded-xl p-3"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-bold opacity-80">Main Website Goal</label>
              <input
                type="text"
                value={mainGoal}
                onChange={(e) => setMainGoal(e.target.value)}
                placeholder="Leads, Sales, Portfolio..."
                className="glass-input mt-1 w-full rounded-xl px-3.5 py-2.5"
              />
            </div>

            <div>
              <label className="block font-bold opacity-80">Ideal Launch Date & Reason</label>
              <input
                type="text"
                value={launchDateReason}
                onChange={(e) => setLaunchDateReason(e.target.value)}
                placeholder="e.g. Dec 15 — Store opening"
                className="glass-input mt-1 w-full rounded-xl px-3.5 py-2.5"
              />
            </div>

            <div>
              <label className="block font-bold opacity-80">Number of Pages</label>
              <input
                type="number"
                min={1}
                value={pages}
                onChange={(e) => setPages(Math.max(1, Number(e.target.value)))}
                className="glass-input mt-1 w-full rounded-xl px-3.5 py-2.5 font-bold"
              />
            </div>

            <div>
              <label className="block font-bold opacity-80">Website Category</label>
              <input
                type="text"
                value={projectPurpose}
                onChange={(e) => setProjectPurpose(e.target.value)}
                placeholder="ECOMMERCE / BUSINESS_CORPORATE"
                className="glass-input mt-1 w-full rounded-xl px-3.5 py-2.5 font-bold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold opacity-80">Motion Tier</label>
              <select
                value={animationTier}
                onChange={(e) => setAnimationTier(e.target.value as any)}
                className="glass-input mt-1 w-full cursor-pointer rounded-xl px-3.5 py-2.5 font-bold"
              >
                <option value="NONE">1st Tier: Completely Static</option>
                <option value="BASIC">2nd Tier: Basic Animations</option>
                <option value="ADVANCED">3rd Tier: Advanced + Smooth Scroll</option>
                <option value="WEBGL_3D">4th Tier: 3D & WebGL Experience</option>
              </select>
            </div>
          </div>

          {/* Rush & Completion Status Row */}
          <div className="glass-subcard grid grid-cols-1 gap-4 rounded-2xl p-4 sm:grid-cols-3">
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
                Delivery Date (Editable)
              </label>
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="glass-input mt-1 w-full rounded-xl px-3 py-1.5 text-xs font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold opacity-80">Design / Reference Links</label>
            <input
              type="text"
              value={designReferences}
              onChange={(e) => setDesignReferences(e.target.value)}
              placeholder="Figma link or reference websites..."
              className="glass-input mt-1 w-full rounded-xl px-3.5 py-2.5"
            />
          </div>

          <div>
            <label className="block font-bold opacity-80">Client Choices & Custom Notes</label>
            <textarea
              rows={2}
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="Any specific requirements, features, or in-person meeting notes..."
              className="glass-input mt-1 w-full rounded-xl p-3"
            />
          </div>

          {/* Multi-file upload to /Clients/Files/{Name}_{Contact} */}
          <div className="glass-subcard rounded-2xl p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="font-bold">Attach Client Files (Multi-File)</span>
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
              {saving ? 'Uploading & Saving Client...' : 'Save Client to Career Ledger →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};