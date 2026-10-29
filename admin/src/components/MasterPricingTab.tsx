// admin/src/components/MasterPricingTab.tsx
import { useState, type FC, type Dispatch, type SetStateAction } from 'react';

type RateCategory = 'PAGES_CONTENT' | 'MOTION_UI' | 'WEBGL_3D' | 'BACKEND' | 'SEO_DEPLOY';

const CATEGORIZED_RATES: Record<
  RateCategory,
  { title: string; items: { key: string; label: string; desc: string }[] }
> = {
  PAGES_CONTENT: {
    title: 'Pages, Sections & Languages',
    items: [
      { key: 'page1', label: '1st Static Page', desc: 'Base first static page (up to 6 sections)' },
      { key: 'page2to5', label: 'Pages 2 to 5 (per page)', desc: 'Each additional static page up to 5' },
      { key: 'page6plus', label: 'Page 6+ (per page)', desc: 'Each static page beyond 5 pages' },
      { key: 'extraSectionStatic', label: 'Extra Section (Static/Basic)', desc: 'Beyond 6 sections on a page' },
      { key: 'extraSectionAdvanced', label: 'Extra Section (Adv. Animation)', desc: 'Beyond 6 sections with award motion' },
      { key: 'dynamicTemplate20', label: 'Dynamic Catalog Template (20 items)', desc: 'Uniform layout from CSV/JSON' },
      { key: 'extraDynamic10', label: 'Each Extra 10 Catalog Items', desc: 'Additional 10 items on same template' },
      { key: 'multiLangFirst', label: 'Multi-Language Setup (+1st lang)', desc: 'Language switcher + 1st extra language' },
      { key: 'multiLangExtra', label: 'Each Further Language', desc: 'Per additional language route' },
      { key: 'rtlSurcharge', label: 'Right-to-Left (RTL) Surcharge', desc: 'Arabic / Urdu layout adjustment' },
    ],
  },
  MOTION_UI: {
    title: 'Interactive Features & Motion',
    items: [
      { key: 'basicFuncFirst', label: 'Basic Functionality (1st page)', desc: 'Tabs, modals, FAQs, sliders, filters' },
      { key: 'basicFuncExtra', label: 'Basic Functionality (+/page)', desc: 'Each additional interactive page' },
      { key: 'basicAnimFirst', label: 'Basic Animations (1st page)', desc: 'Smooth scroll, fade/slide-in, hovers' },
      { key: 'basicAnimExtra', label: 'Basic Animations (+/page)', desc: 'Each additional basic animated page' },
      { key: 'advAnimFirst', label: 'Advanced Animations (1st page)', desc: 'Parallax, split-text, pinned scroll' },
      { key: 'advAnimExtra', label: 'Advanced Animations (+/page)', desc: 'Each additional award-animated page' },
      { key: 'darkLightPerPage', label: 'Dark / Light Switch (per page)', desc: 'Theme toggle per page on site' },
      { key: 'pageTransitionsPerPage', label: 'Page Transitions (per page)', desc: 'Smooth route transitions (min 2 pages)' },
      { key: 'customCursorFixed', label: 'Custom Magnetic Cursor (Fixed)', desc: 'Site-wide custom pointer' },
      { key: 'preloaderFixed', label: 'Animated Intro Preloader (Fixed)', desc: 'Site-wide loading screen' },
      { key: 'whatsappChatWidget', label: 'WhatsApp Direct Chat / Inquiry Button', desc: 'Floating or inline WhatsApp quick inquiry widget' },
      { key: 'googleMapsEmbed', label: 'Google Maps Location & Store Embed', desc: 'Interactive location pin & directions embed' },
      { key: 'mediaLightboxGallery', label: 'Image / Video Lightbox Gallery', desc: 'Interactive media carousels, sliders & lightbox' },
      { key: 'reviewsTestimonials', label: 'Reviews, Star Ratings & Testimonials', desc: 'Customer social proof & review showcase module' },
      { key: 'pdfDownloadables', label: 'Downloadable PDF Brochures / Menus', desc: 'Catalog, brochure, or menu download integration' },
      { key: 'socialMediaIntegration', label: 'Social Media Feed & Share Integration', desc: 'Social profile feeds and one-click share buttons' },
      { key: 'customCalculatorTool', label: 'Custom Price, EMI or ROI Calculator', desc: 'Interactive client-facing formula calculator' },
      { key: 'multiStepQuizFunnel', label: 'Multi-Step Quiz or Lead Funnel', desc: 'Interactive step-by-step questionnaire or funnel' },
      { key: 'customMediaPlayer', label: 'Audio / Video Custom Media Player', desc: 'Custom branded audio or video streaming player' },
    ],
  },
  WEBGL_3D: {
    title: 'WebGL & Interactive 3D',
    items: [
      { key: 'webglSceneFirst', label: '1st WebGL 3D Scene', desc: 'Interactive Three.js/WebGL scene + mobile fallback' },
      { key: 'webglSceneExtra', label: 'Each Additional 3D Scene', desc: 'Per extra 3D environment/object' },
      { key: 'customShader', label: 'Custom GPU Shader Effect', desc: 'Ripples, distortion, or glow shaders' },
      { key: 'scrollCamera', label: 'Scroll-Linked 3D Camera', desc: 'Camera rig tied to scroll timeline' },
      { key: 'mobileTuning', label: 'Extra 3D Mobile Tuning', desc: 'Additional optimization for low-end devices' },
    ],
  },
  BACKEND: {
    title: 'Backend, Auth, Database & Bundles',
    items: [
      { key: 'adminDashboardBundle', label: 'Admin Dashboard Bundle', desc: 'User Login + 3 CRUD APIs + 3 Admin Screens' },
      { key: 'extraDashboardType', label: 'Extra Dashboard Data Type', desc: '+1 CRUD API + 1 Admin Screen' },
      { key: 'blogCmsBundle', label: 'Blog / CMS Backend Bundle', desc: 'Login + Blog API + Admin UI + ImageKit' },
      { key: 'contactForm', label: 'Contact Form API + Email Alert', desc: 'Saves enquiries to DB & emails alert' },
      { key: 'newsletter', label: 'Newsletter Capture API', desc: 'Subscriber list storage for export' },
      { key: 'userLogin', label: 'User Login (Authentication)', desc: 'Sign-up, login, logout, password reset' },
      { key: 'roleBasedAccess', label: 'Role-Based Access Control', desc: 'Admin, Staff, Customer permissions' },
      { key: 'crudApi', label: 'Data Management CRUD API', desc: 'Per database collection / category' },
      { key: 'adminScreen', label: 'Private Admin Screen UI', desc: 'Visual editor per data category' },
      { key: 'imageKit', label: 'ImageKit Cloud Optimization', desc: 'Automatic cloud resize & compression' },
      { key: 'serverSearch', label: 'Server Search & Pagination', desc: 'Fast database keyword search & filters' },
      { key: 'globalState', label: 'Redux / Zustand State Memory', desc: 'Shopping cart / multi-step sync' },
      { key: 'thirdPartyApi', label: 'Third-Party API Integration', desc: 'Per external service (Maps, CRM, WhatsApp)' },
      { key: 'emailTemplates', label: 'Automated HTML Email Templates', desc: 'Branded transactional emails' },
      { key: 'bookingSystem', label: 'Appointment Booking System', desc: 'Date & time-slot reservation scheduler' },
      { key: 'paymentGateway', label: 'Payment Gateway Integration', desc: 'Razorpay, Stripe, or PayPal checkout' },
      { key: 'securityHardening', label: 'Backend Security Hardening', desc: 'Rate limiting, bot & injection shields' },
      { key: 'apiDocumentation', label: 'Written API Documentation', desc: 'Technical endpoint reference guide' },
      { key: 'liveChatChatbot', label: 'Live Chat / AI Chatbot Assistant', desc: 'Real-time visitor support chat or AI assistant' },
      { key: 'couponDiscountSystem', label: 'Coupon Codes & Promo Discounts', desc: 'Promotional codes, percentage/flat discounts & rules' },
      { key: 'pdfGeneratorSystem', label: 'PDF Invoice / Certificate Generator', desc: 'Automated dynamic PDF receipt/certificate generation' },
      { key: 'orderStatusTracking', label: 'Order / Application Status Lookup', desc: 'Live status tracker by order or reference ID' },
      { key: 'eventTicketingQr', label: 'Event Countdown & QR Ticket System', desc: 'Event registration & QR pass verification' },
    ],
  },
  SEO_DEPLOY: {
    title: 'SEO, Performance, Deployment & Hourly',
    items: [
      { key: 'nextjsSeo', label: 'Advanced Next.js SEO Setup', desc: 'Dynamic sitemaps, OpenGraph, JSON-LD' },
      { key: 'speedOptimization', label: 'Performance & Speed Tuning', desc: 'Core Web Vitals & mobile data tuning' },
      { key: 'analyticsSetup', label: 'Analytics Setup', desc: 'Traffic & visitor tracking setup' },
      { key: 'cookieBanner', label: 'Cookie Consent Banner', desc: 'Privacy consent pop-up banner' },
      { key: 'hourlyRate', label: 'Hourly Custom Dev Rate', desc: 'Billed with a 2-hour minimum' },
    ],
  },
};

interface Props {
  pricingConfig: any;
  setPricingConfig: Dispatch<SetStateAction<any>>;
}

export const MasterPricingTab: FC<Props> = ({ pricingConfig, setPricingConfig }) => {
  const [activeRateCat, setActiveRateCat] = useState<RateCategory>('PAGES_CONTENT');
  const [savingPricing, setSavingPricing] = useState(false);
  const [syncingRate, setSyncingRate] = useState(false);
  const [pricingSavedToast, setPricingSavedToast] = useState(false);

  const handleForceExchangeRateSync = async () => {
    setSyncingRate(true);
    const res = await fetch('/api/pricing-config?syncRate=1');
    if (res.ok) {
      setPricingConfig(await res.json());
    }
    setSyncingRate(false);
  };

  return (
    <div className="admin-surface-card space-y-8 rounded-3xl p-4 sm:p-8">
      <div className="flex flex-col justify-between gap-4 border-b border-neutral-500/15 pb-6 sm:flex-row sm:items-center">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest opacity-50">
            prices.byfalguni.com Engine Configuration
          </span>
          <h2 className="mt-1 text-xl font-black sm:text-2xl">Master Price & Offer Controls</h2>
        </div>

        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          {pricingSavedToast && (
            <span className="text-xs font-bold opacity-80">✓ Saved to MongoDB</span>
          )}
          <button
            type="button"
            disabled={savingPricing}
            onClick={async () => {
              setSavingPricing(true);
              await fetch('/api/pricing-config', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pricingConfig),
              });
              setSavingPricing(false);
              setPricingSavedToast(true);
              setTimeout(() => setPricingSavedToast(false), 3000);
            }}
            className="liquid-glass-active cursor-pointer rounded-full px-7 py-3.5 text-xs font-bold shadow-md"
          >
            {savingPricing ? 'Saving...' : 'Save Master Pricing →'}
          </button>
        </div>
      </div>

      {/* Global Controls & 12h Cron Exchange Rate Telemetry */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="glass-subcard flex flex-col justify-between rounded-2xl p-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">
                Live ExchangeRate-API (12h Cron)
              </span>
              <button
                type="button"
                disabled={syncingRate}
                onClick={handleForceExchangeRateSync}
                className="cursor-pointer text-[11px] font-bold underline opacity-75 hover:opacity-100"
              >
                {syncingRate ? 'Syncing...' : 'Sync Now'}
              </button>
            </div>
            <p className="mt-2 text-xl font-black">
              $1 = ₹{pricingConfig.exchangeRateInrPerUsd || 95.15}
            </p>
            <p className="mt-0.5 font-mono text-[11px] opacity-65">
              1 INR = ${pricingConfig.usdPerInrRate || 0.01051} USD
            </p>
          </div>
          <p className="mt-2 text-[10px] opacity-50">
            Last synced:{' '}
            {pricingConfig.exchangeRateLastUpdated
              ? new Date(pricingConfig.exchangeRateLastUpdated).toLocaleString('en-IN', {
                  dateStyle: 'short',
                  timeStyle: 'short',
                })
              : 'Auto-scheduled'}
          </p>
        </div>

        <div className="glass-subcard rounded-2xl p-4">
          <label className="block text-xs font-bold opacity-80">
            Global Price Multiplier (e.g. 1.10 = +10%)
          </label>
          <p className="text-[11px] opacity-55">
            Scales all base & add-on prices across the entire calculator.
          </p>
          <input
            type="number"
            step="0.05"
            value={pricingConfig.globalMultiplier}
            onChange={(e) =>
              setPricingConfig({
                ...pricingConfig,
                globalMultiplier: Number(e.target.value),
              })
            }
            className="glass-input mt-2.5 w-full rounded-xl px-3.5 py-2 text-sm font-bold"
          />
        </div>

        <div className="glass-subcard rounded-2xl p-4">
          <label className="block text-xs font-bold opacity-80">
            Global Offer Discount % (Max 25%)
          </label>
          <p className="text-[11px] opacity-55">
            Applied strictly to final project total for seasonal/festival offers.
          </p>
          <input
            type="number"
            min={0}
            max={25}
            value={pricingConfig.activeOfferDiscountPercent}
            onChange={(e) =>
              setPricingConfig({
                ...pricingConfig,
                activeOfferDiscountPercent: Number(e.target.value),
              })
            }
            className="glass-input mt-2.5 w-full rounded-xl px-3.5 py-2 text-sm font-bold"
          />
        </div>

        <div className="glass-subcard flex flex-col justify-between rounded-2xl p-4">
          <div>
            <span className="block text-xs font-bold opacity-80">
              Indian GST Registration Status
            </span>
            <p className="mt-0.5 text-[11px] opacity-55">
              When enabled, adds +18% GST to Indian client quotes.
            </p>
          </div>
          <label className="mt-3 flex cursor-pointer items-center gap-2.5 text-xs font-bold">
            <input
              type="checkbox"
              checked={Boolean(pricingConfig.gstRegistered)}
              onChange={(e) =>
                setPricingConfig({ ...pricingConfig, gstRegistered: e.target.checked })
              }
              className="h-4 w-4 cursor-pointer"
            />
            <span>{pricingConfig.gstRegistered ? '18% GST Active' : 'No GST (<₹20L)'}</span>
          </label>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div>
        <div className="flex flex-wrap gap-2 border-b border-neutral-500/15 pb-4">
          {(Object.keys(CATEGORIZED_RATES) as RateCategory[]).map((catKey) => (
            <button
              key={catKey}
              type="button"
              onClick={() => setActiveRateCat(catKey)}
              className={`cursor-pointer rounded-full px-4 py-2 text-xs font-bold transition ${
                activeRateCat === catKey ? 'liquid-glass-active' : 'glass-subcard'
              }`}
            >
              {CATEGORIZED_RATES[catKey].title}
            </button>
          ))}
        </div>

        {activeRateCat === 'SEO_DEPLOY' && (
          <div className="glass-subcard mt-4 rounded-2xl p-4 text-xs">
            <span className="font-bold text-[#ff5733]">✓ Complimentary Deployment Policy:</span>{' '}
            <span className="opacity-80">
              One-Time Hosting Setup and Domain, DNS &amp; SSL Setup are provided free of charge
              (₹0 / $0).
            </span>
          </div>
        )}

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIZED_RATES[activeRateCat].items.map((item) => {
            const rateObj = pricingConfig.rates?.[item.key] || { inr: 0, usd: 0 };
            return (
              <div key={item.key} className="glass-subcard rounded-2xl p-4">
                <div className="text-xs font-bold">{item.label}</div>
                <p className="mt-0.5 text-[11px] opacity-60">{item.desc}</p>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase opacity-60">
                      India Billed (₹ INR)
                    </label>
                    <input
                      type="number"
                      value={rateObj.inr}
                      onChange={(e) => {
                        const newInr = Number(e.target.value);
                        const usdRate = Number(pricingConfig.usdPerInrRate || 0.01051);
                        const autoUsd =
                          newInr === 0
                            ? 0
                            : Math.max(1, Math.round(newInr * usdRate * (1.3 / 0.97)));
                        setPricingConfig({
                          ...pricingConfig,
                          rates: {
                            ...pricingConfig.rates,
                            [item.key]: { inr: newInr, usd: autoUsd },
                          },
                        });
                      }}
                      className="glass-input mt-1 w-full rounded-xl px-3 py-1.5 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase opacity-60">
                      Intl Billed ($ USD)
                    </label>
                    <input
                      type="number"
                      value={rateObj.usd}
                      onChange={(e) =>
                        setPricingConfig({
                          ...pricingConfig,
                          rates: {
                            ...pricingConfig.rates,
                            [item.key]: { ...rateObj, usd: Number(e.target.value) },
                          },
                        })
                      }
                      className="glass-input mt-1 w-full rounded-xl px-3 py-1.5 text-xs font-bold"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};