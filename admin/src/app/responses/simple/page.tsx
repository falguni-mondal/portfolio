// admin/src/app/responses/simple/page.tsx
'use client';

import { useResponses } from '@/context/ResponsesContext';
import {
  downloadClientSignedAgreementFromAdmin,
  downloadOfficialClientQuotePdfFromAdmin,
} from '@/lib/agreementPdfAdmin';
import { WEBSITE_TYPES, MOTION_TIERS } from '@/lib/pricingConstants';

export default function SimpleResponsePage() {
  const { selectedQuote, liveEval, openEditClientModal, sym } = useResponses();

  if (!selectedQuote) return null;

  const simpleChoices = selectedQuote.simpleChoices || {};
  const customNotesObj = simpleChoices.customSectionNotes || {};
  const selectedFeatureTags: string[] = Array.isArray(simpleChoices.selectedTags)
    ? simpleChoices.selectedTags
    : [];
  const isRush = Boolean(selectedQuote.rushDelivery ?? simpleChoices.rushDelivery);
  const pagesSelected = simpleChoices.pages ?? 0;
  const purposeId = simpleChoices.projectPurpose || '';
  const categoryObj = WEBSITE_TYPES.find((t) => t.id === purposeId);
  const categoryLabel = categoryObj
    ? `${categoryObj.title} (${categoryObj.id})`
    : purposeId || 'Not Selected / Custom';
  const animTierId = simpleChoices.animationTier || 'NONE';
  const motionObj = MOTION_TIERS.find((m) => m.id === animTierId);
  const motionLabel = motionObj ? `${motionObj.title} (${motionObj.badge})` : animTierId;

  const cleanExtraBriefNote =
    customNotesObj.briefExtraNote ||
    String(selectedQuote.clientDescription || '')
      .replace(/^Selected Features:.*(\n|$)/i, '')
      .trim();

  const cleanAgreementText = String(
    selectedQuote.signedAgreementText ||
      `I, ${selectedQuote.fullName} (representing ${
        selectedQuote.businessName || 'my business'
      }), with contact details ${
        selectedQuote.emailPhone
      }, hereby confirm that I have read, understood, and agreed to all terms, procedures, processes, scope boundaries, revision policies, and payment structures set forth in the Website Development Service Guide & Client Agreement.`
  ).replace(/\s*\(Version 3\.1\)/gi, '');

  return (
    <div className="mt-6 space-y-6">
      {/* Top Financial & Timeline Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="glass-subcard rounded-2xl p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">
            Client Target Budget
          </span>
          <p className="mt-1 text-xl font-black">
            {Number(selectedQuote.budget || 0) > 0
              ? `${sym}${Number(selectedQuote.budget).toLocaleString()}`
              : '0 (Quote requested)'}
          </p>
        </div>
        <div className="glass-subcard rounded-2xl p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">
            Calculated Estimate Total
          </span>
          <p className="mt-1 text-xl font-black text-[#ff5733]">
            {sym}
            {Number(liveEval?.grandTotal || 0).toLocaleString()}
          </p>
        </div>
        <div className="glass-subcard rounded-2xl p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">
            Est. Duration &amp; Revisions
          </span>
          <p className="mt-1 text-xs font-bold">
            {liveEval?.durationEstimate?.realisticDaysMin || 0}–
            {liveEval?.durationEstimate?.realisticDaysMax || 0} days •{' '}
            {liveEval?.revisions?.frontendShared || 0} FE /{' '}
            {liveEval?.revisions?.backendShared || 0} BE rev
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
            Status &amp; Source
          </span>
          <p className="mt-1 text-xs font-bold">
            {selectedQuote.status || 'NEW'} • {selectedQuote.source || 'WEBAPP'} (
            {selectedQuote.deliveryDate || 'In Progress'})
          </p>
        </div>
      </div>

      {/* CARD 01: CLIENT PERSONAL, CONTACT, REGION & BUDGET DETAILS */}
      <div className="glass-subcard space-y-3 rounded-2xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider opacity-50">
            01 • Client Personal, Contact, Region &amp; Target Budget Details
          </span>
          <button
            type="button"
            onClick={openEditClientModal}
            className="cursor-pointer text-xs font-bold text-[#ff5733] underline"
          >
            ✎ Edit Any Field
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 text-xs sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <span className="block text-[10px] font-bold uppercase opacity-50">Full Name</span>
            <p className="mt-0.5 text-sm font-bold">{selectedQuote.fullName || '—'}</p>
          </div>
          <div>
            <span className="block text-[10px] font-bold uppercase opacity-50">Email Address</span>
            <p className="mt-0.5 break-all text-sm font-bold">{selectedQuote.email || '—'}</p>
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
              Country &amp; Region
            </span>
            <p className="mt-0.5 text-sm font-bold">
              {selectedQuote.countryName || 'India'} ({selectedQuote.countryCode || 'IN'} •{' '}
              {selectedQuote.region || 'INDIA'} • {sym})
            </p>
          </div>
          <div>
            <span className="block text-[10px] font-bold uppercase opacity-50">
              Client Stated Budget
            </span>
            <p className="mt-0.5 text-sm font-bold">
              {Number(selectedQuote.budget || 0) > 0
                ? `${sym}${Number(selectedQuote.budget).toLocaleString()}`
                : '0 (Quote requested)'}
            </p>
          </div>
        </div>
      </div>

      {/* CARD 02: WEBSITE CATEGORY, PAGES & CUSTOM STRUCTURE NOTE */}
      <div className="glass-subcard space-y-4 rounded-2xl p-5">
        <span className="text-[11px] font-bold uppercase tracking-wider opacity-50">
          02 • Website Category, Page Count &amp; Custom Page Note
        </span>

        <div className="grid grid-cols-1 gap-4 text-xs sm:grid-cols-3">
          <div className="rounded-xl border border-neutral-500/15 p-3.5">
            <span className="block text-[10px] font-bold uppercase opacity-50">
              Selected Website Category
            </span>
            <p className="mt-1 text-sm font-bold">{categoryLabel}</p>
          </div>

          <div className="rounded-xl border border-neutral-500/15 p-3.5">
            <span className="block text-[10px] font-bold uppercase opacity-50">
              Pages Selected by Client
            </span>
            <p className="mt-1 text-sm font-bold">
              {pagesSelected > 0
                ? `${pagesSelected} ${pagesSelected === 1 ? 'Page' : 'Pages'}`
                : '0 (Recommend for client)'}
              {categoryObj && (
                <span className="ml-1.5 text-[11px] font-normal opacity-65">
                  (Category recommendation: ~{categoryObj.recommendedPages} pages)
                </span>
              )}
            </p>
          </div>

          <div className="rounded-xl border border-neutral-500/15 p-3.5">
            <span className="block text-[10px] font-bold uppercase opacity-50">
              Custom Category / Pages Note
            </span>
            <p className="mt-1 font-semibold">
              {customNotesObj.pagesAndTypeNote || 'No custom text provided'}
            </p>
          </div>
        </div>
      </div>

      {/* CARD 03: WEBSITE FUNCTIONALITY SELECTIONS & CUSTOM WORKFLOW NOTE */}
      <div className="glass-subcard space-y-4 rounded-2xl p-5">
        <span className="text-[11px] font-bold uppercase tracking-wider opacity-50">
          03 • Website Functionality Selections &amp; Custom Workflow Note
        </span>

        <div>
          <span className="block text-[10px] font-bold uppercase opacity-50">
            Selected Functionality Toggles ({selectedFeatureTags.length})
          </span>
          {selectedFeatureTags.length === 0 ? (
            <p className="mt-1 text-xs opacity-60">
              No functionality toggles selected by client.
            </p>
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

        <div className="rounded-xl border border-neutral-500/15 p-3.5 text-xs">
          <span className="block text-[10px] font-bold uppercase opacity-50">
            Custom Functionality &amp; Workflow Note
          </span>
          <p className="mt-1 whitespace-pre-wrap font-semibold">
            {customNotesObj.functionalityNote || 'No custom text provided'}
          </p>
        </div>
      </div>

      {/* CARD 04: MOTION, FEEL, 3D EXPERIENCE & CUSTOM MOTION NOTE */}
      <div className="glass-subcard space-y-4 rounded-2xl p-5">
        <span className="text-[11px] font-bold uppercase tracking-wider opacity-50">
          04 • Motion, Feel, 3D Experience &amp; Custom Animation Note
        </span>

        <div className="grid grid-cols-1 gap-4 text-xs sm:grid-cols-3">
          <div className="rounded-xl border border-neutral-500/15 p-3.5">
            <span className="block text-[10px] font-bold uppercase opacity-50">
              Selected Motion &amp; Feel Tier
            </span>
            <p className="mt-1 text-sm font-bold">{motionLabel}</p>
          </div>

          <div className="rounded-xl border border-neutral-500/15 p-3.5">
            <span className="block text-[10px] font-bold uppercase opacity-50">
              3D / WebGL Scenes
            </span>
            <p className="mt-1 text-sm font-bold">
              {simpleChoices.webglScenes ?? (animTierId === 'WEBGL_3D' ? 1 : 0)} Scene(s)
            </p>
          </div>

          <div className="rounded-xl border border-neutral-500/15 p-3.5">
            <span className="block text-[10px] font-bold uppercase opacity-50">
              Custom Motion / 3D Note
            </span>
            <p className="mt-1 font-semibold">
              {customNotesObj.motionAndFeelNote || 'No custom text provided'}
            </p>
          </div>
        </div>
      </div>

      {/* CARD 05: BUSINESS BRIEF, DESIGN REFERENCES & EXTRA NOTES */}
      <div className="glass-subcard space-y-4 rounded-2xl p-5">
        <span className="text-[11px] font-bold uppercase tracking-wider opacity-50">
          05 • Tell Me About Your Business &amp; Design References (Project Brief)
        </span>

        <div className="grid grid-cols-1 gap-4 text-xs sm:grid-cols-3">
          <div className="rounded-xl border border-neutral-500/15 p-3.5">
            <span className="block text-[10px] font-bold uppercase opacity-50">Business Name</span>
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
        </div>

        <div className="rounded-xl border border-neutral-500/15 p-4 text-xs">
          <span className="block text-[10px] font-bold uppercase opacity-50">
            Description of the Business
          </span>
          <p className="mt-1.5 wrap-break-words whitespace-pre-wrap text-sm font-semibold">
            {selectedQuote.businessDescription || '—'}
          </p>
        </div>

        <div className="rounded-xl border border-neutral-500/15 p-4 text-xs">
          <span className="block text-[10px] font-bold uppercase opacity-50">
            Figma Design Link OR 3 Website URLs That Client Loves
          </span>
          <p className="mt-1.5 break-words whitespace-pre-wrap text-sm font-semibold">
            {selectedQuote.designReferences || '—'}
          </p>
        </div>

        <div className="rounded-xl border border-neutral-500/15 p-4 text-xs">
          <span className="block text-[10px] font-bold uppercase opacity-50">
            Additional Brief Note (&quot;Anything Else You Want Me to Know?&quot;)
          </span>
          <p className="mt-1 whitespace-pre-wrap font-medium">
            {cleanExtraBriefNote || 'No additional brief note written.'}
          </p>
        </div>
      </div>

      {/* CARD 06: SIGNED SERVICE GUIDE & AGREEMENT RECORD + DOWNLOAD BUTTONS */}
      <div className="glass-subcard space-y-3 rounded-2xl border border-neutral-500/25 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#ff5733]">
              Signed Service Guide &amp; Agreement
            </span>
            <h4 className="mt-0.5 text-sm font-bold">
              Client Binding Electronic Acceptance Record
            </h4>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => downloadOfficialClientQuotePdfFromAdmin(selectedQuote, liveEval)}
              className="liquid-glass-active cursor-pointer rounded-full px-5 py-2.5 text-xs font-bold"
            >
              ↓ Download Official Quote PDF
            </button>

            <button
              type="button"
              onClick={() => downloadClientSignedAgreementFromAdmin(selectedQuote, liveEval)}
              className="glass-input cursor-pointer rounded-full px-5 py-2.5 text-xs font-bold"
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
          {cleanAgreementText}
        </p>

        <p className="font-mono text-[11px] opacity-60">
          Signed &amp; Accepted on:{' '}
          {new Date(selectedQuote.agreedAt || selectedQuote.createdAt).toLocaleString('en-IN', {
            dateStyle: 'full',
            timeStyle: 'medium',
          })}
        </p>
      </div>

      {/* CARD 07: UPLOADED CLIENT FILES */}
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
                📎 {a.name} {a.size ? `(${(a.size / 1024).toFixed(0)} KB)` : ''} ↗
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}