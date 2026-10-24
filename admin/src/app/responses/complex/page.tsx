// admin/src/app/responses/complex/page.tsx
'use client';

import { useResponses } from '@/context/ResponsesContext';

export default function ComplexCalculatorPage() {
  const {
    complexDraft,
    setComplexDraft,
    liveEval,
    savingQuote,
    saveUpdatedClientQuote,
    sym,
  } = useResponses();

  if (!complexDraft || !liveEval) return null;

  return (
    <div className="mt-6 space-y-6">
      <div className="glass-subcard rounded-2xl p-4 sm:p-5">
        <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">
          Developer Playbook Profit Telemetry (INR Equivalent)
        </span>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
          <div>
            <span className="text-[10px] opacity-60">Gross Received</span>
            <p className="text-base font-bold sm:text-lg">
              ₹{liveEval.developerTelemetryInr.grossInrReceived.toLocaleString()}
            </p>
          </div>
          <div>
            <span className="text-[10px] opacity-60">10% Tax Pot</span>
            <p className="text-base font-bold sm:text-lg">
              -₹{liveEval.developerTelemetryInr.taxReserveInr.toLocaleString()}
            </p>
          </div>
          <div>
            <span className="text-[10px] opacity-60">Net Profit Target</span>
            <p className="text-base font-bold sm:text-lg">
              ₹{liveEval.developerTelemetryInr.netProfitAfterTaxInr.toLocaleString()}
            </p>
          </div>
          <div>
            <span className="text-[10px] opacity-60">9% Buffers</span>
            <p className="text-base font-bold opacity-70 sm:text-lg">
              -₹
              {(
                liveEval.developerTelemetryInr.caToolsBufferInr +
                liveEval.developerTelemetryInr.badDebtBufferInr
              ).toLocaleString()}
            </p>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <span className="text-[10px] font-bold opacity-80">Pure Cash Kept</span>
            <p className="text-lg font-black sm:text-xl">
              ₹{liveEval.developerTelemetryInr.pureCashKeptInr.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {[
          { key: 'pages', label: 'Static Pages', min: 1 },
          { key: 'extraSectionsStatic', label: 'Extra Static Sections', min: 0 },
          { key: 'extraSectionsAdvanced', label: 'Extra Adv. Sections', min: 0 },
          { key: 'dynamicTemplates', label: 'Dynamic Templates (20x)', min: 0 },
          { key: 'basicFunctionalityPages', label: 'Basic Func. Pages', min: 0 },
          { key: 'animationPages', label: 'Animated Pages', min: 0 },
          { key: 'webglScenes', label: '3D WebGL Scenes', min: 0 },
          { key: 'crudApiCount', label: 'CRUD Data APIs', min: 0 },
          { key: 'adminScreenCount', label: 'Admin Screens', min: 0 },
          { key: 'thirdPartyApiCount', label: 'Third-Party APIs', min: 0 },
          { key: 'extraHourlyWorkHours', label: 'Hourly Custom Work', min: 0 },
          { key: 'discountPercent', label: 'Discount %', min: 0 },
        ].map((f) => (
          <div key={f.key} className="glass-subcard rounded-2xl p-3.5">
            <label className="block text-xs font-bold opacity-80">{f.label}</label>
            <input
              type="number"
              min={f.min}
              value={complexDraft[f.key] ?? 0}
              onChange={(e) =>
                setComplexDraft({
                  ...complexDraft,
                  [f.key]: Number(e.target.value),
                })
              }
              className="glass-input mt-1.5 w-full rounded-xl px-3 py-1.5 text-sm font-bold"
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="glass-subcard rounded-2xl p-3.5">
          <label className="block text-xs font-bold">Animation Tier</label>
          <select
            value={complexDraft.animationTier}
            onChange={(e) =>
              setComplexDraft({
                ...complexDraft,
                animationTier: e.target.value,
              })
            }
            className="glass-input mt-1.5 w-full cursor-pointer rounded-xl px-3 py-2 text-xs font-bold"
          >
            <option value="NONE">NONE</option>
            <option value="BASIC">BASIC ANIMATIONS</option>
            <option value="ADVANCED">ADVANCED ANIMATIONS</option>
          </select>
        </div>

        <div className="glass-subcard rounded-2xl p-3.5">
          <label className="block text-xs font-bold">3D Model Integration</label>
          <select
            value={complexDraft.modelIntegrationTier}
            onChange={(e) =>
              setComplexDraft({
                ...complexDraft,
                modelIntegrationTier: e.target.value,
              })
            }
            className="glass-input mt-1.5 w-full cursor-pointer rounded-xl px-3 py-2 text-xs font-bold"
          >
            <option value="NONE">NONE</option>
            <option value="BASIC">BASIC</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="COMPLEX">COMPLEX</option>
          </select>
        </div>

        <div className="glass-subcard rounded-2xl p-3.5">
          <label className="block text-xs font-bold">3D Model Optimization</label>
          <select
            value={complexDraft.modelOptimizationTier}
            onChange={(e) =>
              setComplexDraft({
                ...complexDraft,
                modelOptimizationTier: e.target.value,
              })
            }
            className="glass-input mt-1.5 w-full cursor-pointer rounded-xl px-3 py-2 text-xs font-bold"
          >
            <option value="NONE">NONE</option>
            <option value="BASIC">BASIC</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="COMPLEX">COMPLEX</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {[
          { key: 'contactForm', label: 'Contact Form API' },
          { key: 'newsletter', label: 'Newsletter API' },
          { key: 'userLogin', label: 'User Login (Auth)' },
          { key: 'roleBasedAccess', label: 'Role-Based Access' },
          { key: 'adminDashboardBundle', label: 'Admin Dashboard Bundle' },
          { key: 'blogCmsBundle', label: 'Blog / CMS Bundle' },
          { key: 'imageKitIntegration', label: 'ImageKit Integration' },
          { key: 'serverSearchPagination', label: 'Server Search/Filter' },
          { key: 'globalStateManagement', label: 'Shopping Cart / Zustand' },
          { key: 'emailTemplates', label: 'HTML Email Templates' },
          { key: 'bookingSystem', label: 'Booking System' },
          { key: 'paymentGateway', label: 'Payment Gateway' },
          { key: 'securityHardening', label: 'Security Hardening' },
          { key: 'apiDocumentation', label: 'API Documentation' },
          { key: 'darkLightSwitch', label: 'Dark/Light Switch' },
          { key: 'pageTransitions', label: 'Page Transitions' },
          { key: 'customCursor', label: 'Custom Cursor' },
          { key: 'preloader', label: 'Preloader' },
          { key: 'customShader', label: 'Custom Shader' },
          { key: 'scrollLinkedCamera', label: 'Scroll 3D Camera' },
          { key: 'nextjsSeo', label: 'Next.js Adv. SEO' },
          { key: 'speedOptimization', label: 'Speed Optimization' },
          { key: 'analyticsSetup', label: 'Analytics Setup' },
          { key: 'rushDelivery', label: 'Rush Delivery (+30%)' },
        ].map((b) => (
          <button
            key={b.key}
            type="button"
            onClick={() =>
              setComplexDraft({
                ...complexDraft,
                [b.key]: !complexDraft[b.key],
              })
            }
            className={`cursor-pointer rounded-xl px-3.5 py-2.5 text-left text-xs font-bold transition ${
              complexDraft[b.key]
                ? 'liquid-glass-active'
                : 'glass-subcard opacity-80 hover:opacity-100'
            }`}
          >
            {complexDraft[b.key] ? '✓ ' : '+ '}
            {b.label}
          </button>
        ))}
      </div>

      <div className="glass-subcard rounded-2xl p-4 sm:p-5">
        <h4 className="text-xs font-bold uppercase tracking-wider opacity-60">
          Calculated Line Items ({sym}
          {Number(liveEval.grandTotal).toLocaleString()})
        </h4>
        <div className="mt-3 divide-y divide-neutral-500/15 text-xs">
          {liveEval.items.map((it: any) => (
            <div key={it.id} className="flex justify-between gap-4 py-2">
              <span className="font-semibold">{it.label}</span>
              <span className="shrink-0 font-bold">
                {sym}
                {it.cost.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={saveUpdatedClientQuote}
          disabled={savingQuote}
          className="liquid-glass-active w-full cursor-pointer rounded-full px-8 py-3.5 text-xs font-bold shadow-lg sm:w-auto"
        >
          {savingQuote ? 'Saving...' : 'Save Complex Quote Changes →'}
        </button>
      </div>
    </div>
  );
}