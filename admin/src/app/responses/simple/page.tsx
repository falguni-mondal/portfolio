// admin/src/app/responses/simple/page.tsx
'use client';

import { useResponses } from '@/context/ResponsesContext';
import { downloadClientSignedAgreementFromAdmin } from '@/lib/agreementPdfAdmin';

export default function SimpleResponsePage() {
  const { selectedQuote, liveEval, sym } = useResponses();

  if (!selectedQuote) return null;

  const customNotesObj = selectedQuote.simpleChoices?.customSectionNotes || {};
  const selectedFeatureTags: string[] = selectedQuote.simpleChoices?.selectedTags || [];
  const isRush = Boolean(
    selectedQuote.rushDelivery ?? selectedQuote.simpleChoices?.rushDelivery
  );

  const cleanExtraBriefNote =
    customNotesObj.briefExtraNote ||
    String(selectedQuote.clientDescription || '')
      .replace(/^Selected Features:.*(\n|$)/i, '')
      .trim();

  return (
    <div className="mt-6 space-y-6">
      {/* Top Financial & Timeline Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="glass-subcard rounded-2xl p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">
            Client Target Budget
          </span>
          <p className="mt-1 text-xl font-black">
            {sym}
            {Number(selectedQuote.budget || 0).toLocaleString()}
          </p>
        </div>
        <div className="glass-subcard rounded-2xl p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">
            Calculated Quote Total
          </span>
          <p className="mt-1 text-xl font-black">
            {sym}
            {Number(liveEval?.grandTotal || 0).toLocaleString()}
          </p>
        </div>
        <div className="glass-subcard rounded-2xl p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">
            Rush Delivery (+30%)
          </span>
          <p className="mt-1 text-sm font-bold">
            {isRush ? 'Yes (Rush Requested)' : 'No (Standard Timeline)'}
          </p>
        </div>
        <div className="glass-subcard rounded-2xl p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">
            Delivery Date
          </span>
          <p className="mt-1 text-sm font-bold">
            {selectedQuote.deliveryDate || 'Not delivered yet'}
          </p>
        </div>
      </div>

      {/* CARD A: TAB 01 — CLIENT PERSONAL & CONTACT DETAILS */}
      <div className="glass-subcard space-y-3 rounded-2xl p-5">
        <span className="text-[11px] font-bold uppercase tracking-wider opacity-50">
          01 • Client Personal, Contact &amp; Region Details
        </span>
        <div className="grid grid-cols-1 gap-4 text-xs sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <span className="block text-[10px] font-bold uppercase opacity-50">Full Name</span>
            <p className="mt-0.5 text-sm font-bold">{selectedQuote.fullName}</p>
          </div>
          <div>
            <span className="block text-[10px] font-bold uppercase opacity-50">Email Address</span>
            <p className="mt-0.5 break-all text-sm font-bold">
              {selectedQuote.email || selectedQuote.emailPhone || '—'}
            </p>
          </div>
          <div>
            <span className="block text-[10px] font-bold uppercase opacity-50">
              Phone / WhatsApp
            </span>
            <p className="mt-0.5 text-sm font-bold">
              {selectedQuote.phone || selectedQuote.emailPhone || '—'}
            </p>
          </div>
          <div>
            <span className="block text-[10px] font-bold uppercase opacity-50">
              Region &amp; Currency
            </span>
            <p className="mt-0.5 text-sm font-bold">
              {selectedQuote.countryName} ({selectedQuote.region} • {sym})
            </p>
          </div>
        </div>
      </div>

      {/* CARD B: TAB 05 — TELL ME ABOUT YOUR BUSINESS & DESIGN REFERENCES */}
      <div className="glass-subcard space-y-4 rounded-2xl p-5">
        <span className="text-[11px] font-bold uppercase tracking-wider opacity-50">
          05 • Tell Me About Your Business &amp; Design References (Mandatory Brief)
        </span>

        <div className="grid grid-cols-1 gap-4 text-xs sm:grid-cols-3">
          <div className="rounded-xl border border-neutral-500/15 p-3.5">
            <span className="block text-[10px] font-bold uppercase opacity-50">
              Business Name &amp; What It Does
            </span>
            <p className="mt-1 text-sm font-bold">{selectedQuote.businessName || '—'}</p>
          </div>

          <div className="rounded-xl border border-neutral-500/15 p-3.5">
            <span className="block text-[10px] font-bold uppercase opacity-50">
              Main Website Goal
            </span>
            <p className="mt-1 text-sm font-bold">{selectedQuote.mainGoal || '—'}</p>
          </div>

          <div className="rounded-xl border border-neutral-500/15 p-3.5">
            <span className="block text-[10px] font-bold uppercase opacity-50">
              Ideal Launch Date &amp; Reason
            </span>
            <p className="mt-1 text-sm font-bold">{selectedQuote.launchDateReason || '—'}</p>
          </div>

          <div className="rounded-xl border border-neutral-500/15 p-4">
            <span className="block text-[10px] font-bold uppercase opacity-50">
              Description of the Business
            </span>
            <p className="mt-1.5 wrap-break-words whitespace-pre-wrap text-sm font-semibold">
              {selectedQuote.businessDescription || '—'}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-500/15 p-4">
          <span className="block text-[10px] font-bold uppercase opacity-50">
            Figma Design Link OR 3 Website URLs That You Love
          </span>
          <p className="mt-1.5 break-words whitespace-pre-wrap text-sm font-semibold">
            {selectedQuote.designReferences || '—'}
          </p>
        </div>

        <div className="rounded-xl border border-neutral-500/15 p-4 text-xs">
          <span className="block text-[10px] font-bold uppercase opacity-50">
            Anything Else You Want Me to Know? (Optional Brief Note)
          </span>
          <p className="mt-1 font-medium">
            {cleanExtraBriefNote || 'No additional brief note written.'}
          </p>
        </div>
      </div>

      {/* CARD C: TABS 02, 03 & 04 — SCOPE CHOICES, FUNCTIONALITIES & CUSTOM NOTES */}
      <div className="glass-subcard space-y-4 rounded-2xl p-5">
        <span className="text-[11px] font-bold uppercase tracking-wider opacity-50">
          02–04 • Website Scope Choices, Functionalities &amp; Section Notes
        </span>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="glass-input rounded-full px-3.5 py-1.5 font-bold">
            Website Category: {selectedQuote.simpleChoices?.projectPurpose || 'Custom'}
          </span>
          <span className="glass-input rounded-full px-3.5 py-1.5 font-bold">
            Pages Selected: {selectedQuote.simpleChoices?.pages || 1}
          </span>
          <span className="glass-input rounded-full px-3.5 py-1.5 font-bold">
            Motion &amp; Feel Tier: {selectedQuote.simpleChoices?.animationTier || 'NONE'}
          </span>
          <span className="glass-input rounded-full px-3.5 py-1.5 font-bold">
            Rush Delivery: {isRush ? 'Yes (+30%)' : 'No'}
          </span>
        </div>

        <div>
          <span className="block text-[10px] font-bold uppercase opacity-50">
            Selected Functionality Options ({selectedFeatureTags.length})
          </span>
          {selectedFeatureTags.length === 0 ? (
            <p className="mt-1 text-xs opacity-60">No functionality tags selected.</p>
          ) : (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {selectedFeatureTags.map((t: string) => (
                <span
                  key={t}
                  className="rounded-full bg-neutral-500/15 px-3 py-1 text-xs font-semibold"
                >
                  ✓ {t}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 border-t border-neutral-500/15 pt-4 text-xs sm:grid-cols-3">
          <div className="rounded-xl border border-neutral-500/15 p-3">
            <span className="block text-[10px] font-bold uppercase opacity-50">
              Tab 02 Custom Category/Pages Note
            </span>
            <p className="mt-1 font-medium">
              {customNotesObj.pagesAndTypeNote || 'No custom text provided'}
            </p>
          </div>

          <div className="rounded-xl border border-neutral-500/15 p-3">
            <span className="block text-[10px] font-bold uppercase opacity-50">
              Tab 03 Custom Motion/3D Note
            </span>
            <p className="mt-1 font-medium">
              {customNotesObj.motionAndFeelNote || 'No custom text provided'}
            </p>
          </div>

          <div className="rounded-xl border border-neutral-500/15 p-3">
            <span className="block text-[10px] font-bold uppercase opacity-50">
              Tab 04 Custom Functionality Note
            </span>
            <p className="mt-1 font-medium">
              {customNotesObj.functionalityNote || 'No custom text provided'}
            </p>
          </div>
        </div>
      </div>

      {/* CARD D: SIGNED SERVICE GUIDE & AGREEMENT RECORD + DOWNLOAD BUTTON */}
      <div className="glass-subcard space-y-3 rounded-2xl border border-neutral-500/25 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#ff5733]">
              Signed Service Guide &amp; Agreement (v3.1)
            </span>
            <h4 className="mt-0.5 text-sm font-bold">
              Client Binding Electronic Acceptance Record
            </h4>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => downloadClientSignedAgreementFromAdmin(selectedQuote, liveEval)}
              className="liquid-glass-active cursor-pointer rounded-full px-5 py-2.5 text-xs font-bold"
            >
              ↓ Download Signed Agreement PDF
            </button>

            {selectedQuote.signedAgreementPdfUrl && (
              <a
                href={selectedQuote.signedAgreementPdfUrl}
                target="_blank"
                rel="noreferrer"
                className="glass-input cursor-pointer rounded-full px-4 py-2 text-xs font-bold"
              >
                View ImageKit Cloud Copy ↗
              </a>
            )}
          </div>
        </div>

        <p className="rounded-xl bg-neutral-500/10 p-4 text-xs font-medium leading-relaxed">
          {selectedQuote.signedAgreementText ||
            `I, ${selectedQuote.fullName} (representing ${
              selectedQuote.businessName || 'my business'
            }), with contact details ${
              selectedQuote.emailPhone
            }, hereby confirm that I have read, understood, and agreed to all agreements, procedures, processes, scope boundaries, revision policies, and payment schedules set forth in the Website Development Service Guide, Pricing & Agreement (Version 3.1).`}
        </p>

        <p className="font-mono text-[11px] opacity-60">
          Signed &amp; Accepted on:{' '}
          {new Date(selectedQuote.agreedAt || selectedQuote.createdAt).toLocaleString('en-IN', {
            dateStyle: 'full',
            timeStyle: 'medium',
          })}
        </p>
      </div>

      {/* CARD E: UPLOADED CLIENT FILES */}
      <div className="glass-subcard rounded-2xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] font-bold uppercase opacity-50">
            Uploaded Client Project Assets ({(selectedQuote.uploadedAssets || []).length})
          </span>
          {selectedQuote.clientFolder && (
            <span className="font-mono text-[11px] opacity-60">
              ImageKit Folder: {selectedQuote.clientFolder}
            </span>
          )}
        </div>
        {(selectedQuote.uploadedAssets || []).length === 0 ? (
          <p className="mt-1 text-xs opacity-60">No project files uploaded.</p>
        ) : (
          <div className="mt-2.5 flex flex-wrap gap-2">
            {selectedQuote.uploadedAssets.map((a: any, i: number) => (
              <a
                key={a.fileId || i}
                href={a.url}
                target="_blank"
                rel="noreferrer"
                className="glass-input cursor-pointer rounded-full px-4 py-2 text-xs font-bold"
              >
                📎 {a.name} ↗
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}