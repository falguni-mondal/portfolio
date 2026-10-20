// admin/src/lib/pricingEngine.ts
export type Region = 'INDIA' | 'INTL';

export interface ComplexQuoteConfig {
  region: Region;
  budget: number;
  lastChangedField?: string;
  discountPercent?: number;
  projectPurpose?: string;
  clientDescription?: string;
  pages: number;
  extraSectionsStatic: number;
  extraSectionsAdvanced: number;
  dynamicTemplates: number;
  extraDynamicItems10x: number;
  multiLanguageSetup: boolean;
  extraLanguages: number;
  rtlSurcharge: boolean;
  basicFunctionalityPages: number;
  animationTier: 'NONE' | 'BASIC' | 'ADVANCED';
  animationPages: number;
  darkLightSwitch: boolean;
  pageTransitions: boolean;
  customCursor: boolean;
  preloader: boolean;
  webglScenes: number;
  customShader: boolean;
  scrollLinkedCamera: boolean;
  mobileFallbackTuning: boolean;
  modelIntegrationTier: 'NONE' | 'BASIC' | 'MEDIUM' | 'COMPLEX';
  modelOptimizationTier: 'NONE' | 'BASIC' | 'MEDIUM' | 'COMPLEX';
  contactForm: boolean;
  newsletter: boolean;
  userLogin: boolean;
  roleBasedAccess: boolean;
  crudApiCount: number;
  adminScreenCount: number;
  adminDashboardBundle: boolean;
  extraDashboardTypes: number;
  blogCmsBundle: boolean;
  imageKitIntegration: boolean;
  serverSearchPagination: boolean;
  globalStateManagement: boolean;
  thirdPartyApiCount: number;
  emailTemplates: boolean;
  bookingSystem: boolean;
  paymentGateway: boolean;
  securityHardening: boolean;
  apiDocumentation: boolean;
  nextjsSeo: boolean;
  speedOptimization: boolean;
  analyticsSetup: boolean;
  cookieBanner: boolean;
  rushDelivery: boolean;
  extraHourlyWorkHours: number;
  hostingSetup: 'NONE' | 'FRONTEND' | 'FULLSTACK';
  domainDnsSsl: boolean;
  paymentMethod: 'STANDARD' | 'PAYPAL_CARD';
  isAdminComplexOverride?: boolean;
}

export function inferComplexConfigFromSimple(input: any): ComplexQuoteConfig {
  const rawPages = Math.max(0, Number(input.pages) || 0);
  const rawMotion = input.animationTier || 'NONE';
  const is3DTier = rawMotion === 'WEBGL_3D';

  const base: ComplexQuoteConfig = {
    region: input.region === 'INTL' ? 'INTL' : 'INDIA',
    budget: Math.max(0, Number(input.budget) || 0),
    lastChangedField: input.lastChangedField || 'pages',
    discountPercent: Number(input.discountPercent) || 0,
    projectPurpose: input.projectPurpose || '',
    clientDescription: input.clientDescription || '',
    pages: rawPages,
    extraSectionsStatic: Number(input.extraSectionsStatic) || 0,
    extraSectionsAdvanced: Number(input.extraSectionsAdvanced) || 0,
    dynamicTemplates: Number(input.dynamicTemplates) || 0,
    extraDynamicItems10x: Number(input.extraDynamicItems10x) || 0,
    multiLanguageSetup: Boolean(input.multiLanguageSetup),
    extraLanguages: Number(input.extraLanguages) || 0,
    rtlSurcharge: Boolean(input.rtlSurcharge),
    basicFunctionalityPages: Number(input.basicFunctionalityPages) || 0,
    animationTier: is3DTier ? 'ADVANCED' : rawMotion === 'NONE' ? 'NONE' : rawMotion,
    animationPages: Number(input.animationPages) || rawPages,
    darkLightSwitch: Boolean(input.darkLightSwitch),
    pageTransitions: Boolean(input.pageTransitions),
    customCursor: Boolean(input.customCursor),
    preloader: Boolean(input.preloader),
    webglScenes: is3DTier ? Math.max(1, Number(input.webglScenes) || 1) : Number(input.webglScenes) || 0,
    customShader: Boolean(input.customShader),
    scrollLinkedCamera: Boolean(input.scrollLinkedCamera),
    mobileFallbackTuning: Boolean(input.mobileFallbackTuning),
    modelIntegrationTier: input.modelIntegrationTier || 'NONE',
    modelOptimizationTier: input.modelOptimizationTier || 'NONE',
    contactForm: Boolean(input.contactForm),
    newsletter: Boolean(input.newsletter),
    userLogin: Boolean(input.userLogin),
    roleBasedAccess: Boolean(input.roleBasedAccess),
    crudApiCount: Number(input.crudApiCount) || 0,
    adminScreenCount: Number(input.adminScreenCount) || 0,
    adminDashboardBundle: Boolean(input.adminDashboardBundle),
    extraDashboardTypes: Number(input.extraDashboardTypes) || 0,
    blogCmsBundle: Boolean(input.blogCmsBundle),
    imageKitIntegration: Boolean(input.imageKitIntegration),
    serverSearchPagination: Boolean(input.serverSearchPagination),
    globalStateManagement: Boolean(input.globalStateManagement),
    thirdPartyApiCount: Number(input.thirdPartyApiCount) || 0,
    emailTemplates: Boolean(input.emailTemplates),
    bookingSystem: Boolean(input.bookingSystem),
    paymentGateway: Boolean(input.paymentGateway),
    securityHardening: Boolean(input.securityHardening),
    apiDocumentation: Boolean(input.apiDocumentation),
    nextjsSeo: Boolean(input.nextjsSeo),
    speedOptimization: Boolean(input.speedOptimization),
    analyticsSetup: Boolean(input.analyticsSetup),
    cookieBanner: Boolean(input.cookieBanner),
    rushDelivery: Boolean(input.rushDelivery),
    extraHourlyWorkHours: Number(input.extraHourlyWorkHours) || 0,
    hostingSetup: input.hostingSetup || (rawPages > 0 ? 'FRONTEND' : 'NONE'),
    domainDnsSsl: input.domainDnsSsl !== undefined ? Boolean(input.domainDnsSsl) : rawPages > 0,
    paymentMethod: input.paymentMethod || 'STANDARD',
    isAdminComplexOverride: Boolean(input.isAdminComplexOverride),
  };

  if (base.isAdminComplexOverride) {
    return base;
  }

  const effectivePagesForFeatures = Math.max(1, rawPages);
  const tags: string[] = Array.isArray(input.selectedTags) ? input.selectedTags : [];

  if (tags.length > 0) {
    base.contactForm = tags.includes('Contact & Enquiry Form');
    base.newsletter = tags.includes('Newsletter Email Capture');
    base.userLogin = tags.includes('User Login & Member Accounts');
    base.roleBasedAccess = tags.includes('Role-Based Staff / Admin Access');
    base.adminDashboardBundle = tags.includes('Private Admin Control Panel');
    base.blogCmsBundle = tags.includes('Blog / Article Publishing CMS');
    base.globalStateManagement = tags.includes('Shopping Cart & Wishlist Memory');
    base.paymentGateway = tags.includes('Online Payment Checkout (UPI/Stripe/PayPal)');
    base.bookingSystem = tags.includes('Appointment & Slot Booking System');
    base.serverSearchPagination = tags.includes('Fast Database Search & Category Filters');
    base.multiLanguageSetup = tags.includes('Multi-Language Website Switcher');
    base.emailTemplates = tags.includes('Automated Confirmation Emails');
    base.thirdPartyApiCount = tags.includes('WhatsApp / CRM / Google Maps Integration') ? 1 : 0;
    base.nextjsSeo = tags.includes('Advanced Google SEO & Sitemaps');
    base.analyticsSetup = tags.includes('Visitor Traffic Analytics');
    base.basicFunctionalityPages = tags.includes('Interactive Tabs, Accordions & Pop-up Modals')
      ? effectivePagesForFeatures
      : 0;
  }

  const text = (base.clientDescription || '').toLowerCase();
  if (text) {
    if (/\b(login|sign up|signup|account|member)\b/.test(text)) base.userLogin = true;
    if (/\b(admin|dashboard|control panel)\b/.test(text)) base.adminDashboardBundle = true;
    if (/\b(blog|article|news)\b/.test(text)) base.blogCmsBundle = true;
    if (/\b(pay|razorpay|stripe|paypal|checkout)\b/.test(text)) base.paymentGateway = true;
    if (/\b(cart|wishlist)\b/.test(text)) base.globalStateManagement = true;
    if (/\b(search|filter|sort)\b/.test(text)) base.serverSearchPagination = true;
    if (/\b(book|booking|appointment|calendar|slot)\b/.test(text)) base.bookingSystem = true;
  }

  return base;
}

export function evaluateProjectQuote(rawInput: Partial<ComplexQuoteConfig>, masterConfig?: any) {
  const req = inferComplexConfigFromSimple(rawInput);
  const region: Region = req.region;
  const currencySymbol = region === 'INDIA' ? '₹' : '$';
  const mult = Number(masterConfig?.globalMultiplier || 1.0);
  const rates = masterConfig?.rates || {};

  const getRate = (key: string, defaultInr: number, defaultUsd: number) => {
    const item = rates[key] || { inr: defaultInr, usd: defaultUsd };
    const raw = region === 'INDIA' ? item.inr : item.usd;
    return Math.round(raw * mult);
  };

  const items: any[] = [];
  const autoAdjustments: string[] = [];
  const advisorInsights: string[] = [];

  const pages = Math.max(0, req.pages);

  // 1. Base Static Pages (Only added once client selects at least 1 page)[cite: 1, 20]
  if (pages > 0) {
    let baseCost = getRate('page1', 3300, 46);
    let baseDaysMin = 1;
    let baseDaysMax = 2;
    if (pages > 1) {
      const p2to5 = Math.min(pages, 5) - 1;
      baseCost += p2to5 * getRate('page2to5', 1375, 19);
      baseDaysMin += p2to5 * 0.5;
      baseDaysMax += p2to5 * 1;
    }
    if (pages > 5) {
      const p6plus = pages - 5;
      baseCost += p6plus * getRate('page6plus', 1760, 25);
      baseDaysMin += p6plus * 0.5;
      baseDaysMax += p6plus * 1;
    }

    items.push({
      id: 'pages',
      label: `Static Website Base (${pages} ${pages === 1 ? 'Page' : 'Pages'}, up to 6 sections/page)`,
      category: 'BASE',
      cost: baseCost,
      daysMin: baseDaysMin,
      daysMax: baseDaysMax,
      revisions: '3 (shared frontend)',
      note: 'Responsive build, shared header/footer, 404 screen, basic SEO & 15 days free bug support.',
    });
  }

  // 2. Content & Languages[cite: 2, 5, 6, 22, 23]
  if (req.extraSectionsStatic > 0) {
    items.push({
      id: 'extraSectionsStatic',
      label: `Extra Static/Basic Sections (${req.extraSectionsStatic})`,
      category: 'CONTENT',
      cost: req.extraSectionsStatic * getRate('extraSectionStatic', 300, 4),
      daysMin: req.extraSectionsStatic * 0.25,
      daysMax: req.extraSectionsStatic * 0.25,
      revisions: '3 (shared frontend)',
    });
  }
  if (req.extraSectionsAdvanced > 0) {
    items.push({
      id: 'extraSectionsAdvanced',
      label: `Extra Sections with Advanced Animation (${req.extraSectionsAdvanced})`,
      category: 'CONTENT',
      cost: req.extraSectionsAdvanced * getRate('extraSectionAdvanced', 825, 12),
      daysMin: req.extraSectionsAdvanced * 0.5,
      daysMax: req.extraSectionsAdvanced * 0.5,
      revisions: '3 (shared frontend)',
    });
  }
  if (req.dynamicTemplates > 0) {
    items.push({
      id: 'dynamicTemplates',
      label: `Dynamic Detail Page Templates (${req.dynamicTemplates}x, up to 20 catalog items)`,
      category: 'CONTENT',
      cost: req.dynamicTemplates * getRate('dynamicTemplate20', 3300, 46),
      daysMin: req.dynamicTemplates * 1.5,
      daysMax: req.dynamicTemplates * 1.5,
      revisions: '3 (shared frontend)',
    });
    if (req.extraDynamicItems10x > 0) {
      items.push({
        id: 'extraDynamicItems10x',
        label: `Extra Dynamic Catalog Items (+${req.extraDynamicItems10x * 10} items)`,
        category: 'CONTENT',
        cost: req.extraDynamicItems10x * getRate('extraDynamic10', 550, 8),
        daysMin: req.extraDynamicItems10x * 0.25,
        daysMax: req.extraDynamicItems10x * 0.25,
        revisions: '3 (shared frontend)',
      });
    }
  }
  if (req.multiLanguageSetup) {
    items.push({
      id: 'multiLanguageSetup',
      label: 'Multi-Language Setup (Includes 1st Extra Language)',
      category: 'CONTENT',
      cost: getRate('multiLangFirst', 3850, 54),
      daysMin: 2,
      daysMax: 2,
      revisions: '3 (shared frontend)',
    });
    if (req.extraLanguages > 0) {
      items.push({
        id: 'extraLanguages',
        label: `Additional Languages (+${req.extraLanguages})`,
        category: 'CONTENT',
        cost: req.extraLanguages * getRate('multiLangExtra', 1100, 15),
        daysMin: req.extraLanguages * 0.5,
        daysMax: req.extraLanguages * 1,
        revisions: '3 (shared frontend)',
      });
    }
    if (req.rtlSurcharge) {
      items.push({
        id: 'rtlSurcharge',
        label: 'Right-to-Left (RTL) Layout Surcharge',
        category: 'CONTENT',
        cost: getRate('rtlSurcharge', 1650, 23),
        daysMin: 1,
        daysMax: 1,
        revisions: '3 (shared frontend)',
      });
    }
  }

  // 3. Features & Animations[cite: 2, 3, 23, 24]
  const effectivePageCount = Math.max(1, pages);
  const funcPages = Math.min(effectivePageCount, Math.max(0, req.basicFunctionalityPages));
  if (funcPages > 0) {
    items.push({
      id: 'basicFunctionalityPages',
      label: `Basic Functionality (${funcPages} ${funcPages === 1 ? 'page' : 'pages'})`,
      category: 'FEATURES',
      cost:
        getRate('basicFuncFirst', 1100, 15) +
        (funcPages - 1) * getRate('basicFuncExtra', 880, 12),
      daysMin: 1 + (funcPages - 1) * 0.5,
      daysMax: 1 + (funcPages - 1) * 0.5,
      revisions: '3 (shared frontend)',
    });
  }

  const animPages = Math.min(effectivePageCount, Math.max(1, req.animationPages || effectivePageCount));
  if (req.animationTier === 'BASIC') {
    items.push({
      id: 'animationTier',
      label: `Basic Smooth Animations (${animPages} ${animPages === 1 ? 'page' : 'pages'})`,
      category: 'FEATURES',
      cost:
        getRate('basicAnimFirst', 2200, 31) +
        (animPages - 1) * getRate('basicAnimExtra', 1100, 15),
      daysMin: 1 + (animPages - 1) * 0.5,
      daysMax: 1 + (animPages - 1) * 0.5,
      revisions: '3 (shared frontend)',
    });
  } else if (req.animationTier === 'ADVANCED') {
    items.push({
      id: 'animationTier',
      label: `Advanced Award-Style Animations (${animPages} ${animPages === 1 ? 'page' : 'pages'})`,
      category: 'FEATURES',
      cost:
        getRate('advAnimFirst', 5500, 77) +
        (animPages - 1) * getRate('advAnimExtra', 2750, 39),
      daysMin: 2 + (animPages - 1) * 1,
      daysMax: 3 + (animPages - 1) * 1,
      revisions: '3 (shared frontend)',
    });
  }

  if (req.darkLightSwitch) {
    items.push({
      id: 'darkLightSwitch',
      label: `Dark / Light Theme Switch (${effectivePageCount} ${effectivePageCount === 1 ? 'page' : 'pages'})`,
      category: 'FEATURES',
      cost: effectivePageCount * getRate('darkLightPerPage', 880, 12),
      daysMin: 0.5,
      daysMax: 0.5,
      revisions: '3 (shared frontend)',
    });
  }
  if (req.pageTransitions && effectivePageCount >= 2) {
    items.push({
      id: 'pageTransitions',
      label: `Smooth Page Transitions (${effectivePageCount} pages)`,
      category: 'FEATURES',
      cost: effectivePageCount * getRate('pageTransitionsPerPage', 1650, 23),
      daysMin: 1,
      daysMax: 1,
      revisions: '3 (shared frontend)',
    });
  }
  if (req.customCursor) {
    items.push({
      id: 'customCursor',
      label: 'Custom Magnetic Cursor (Fixed Site-Wide)',
      category: 'FEATURES',
      cost: getRate('customCursorFixed', 880, 12),
      daysMin: 0.5,
      daysMax: 0.5,
      revisions: '3 (shared frontend)',
    });
  }
  if (req.preloader) {
    items.push({
      id: 'preloader',
      label: 'Animated Intro Preloader (Fixed Site-Wide)',
      category: 'FEATURES',
      cost: getRate('preloaderFixed', 1650, 23),
      daysMin: 0.5,
      daysMax: 1,
      revisions: '3 (shared frontend)',
    });
  }

  // 4. WebGL & 3D[cite: 3, 25, 26]
  if (req.webglScenes > 0) {
    items.push({
      id: 'webglScenes',
      label: `Interactive WebGL / 3D Scene (${req.webglScenes})`,
      category: 'WEBGL_3D',
      cost:
        getRate('webglSceneFirst', 14300, 201) +
        (req.webglScenes - 1) * getRate('webglSceneExtra', 6600, 93),
      daysMin: 4 + (req.webglScenes - 1) * 2,
      daysMax: 5 + (req.webglScenes - 1) * 3,
      revisions: '3 (shared frontend)',
    });
  }
  if (req.customShader) {
    items.push({
      id: 'customShader',
      label: 'Custom GPU Shader Effect',
      category: 'WEBGL_3D',
      cost: getRate('customShader', 4400, 62),
      daysMin: 2,
      daysMax: 2,
      revisions: '3 (shared frontend)',
    });
  }
  if (req.scrollLinkedCamera) {
    items.push({
      id: 'scrollLinkedCamera',
      label: 'Scroll-Linked 3D Camera Movement',
      category: 'WEBGL_3D',
      cost: getRate('scrollCamera', 4950, 69),
      daysMin: 2,
      daysMax: 2,
      revisions: '3 (shared frontend)',
    });
  }
  if (req.mobileFallbackTuning) {
    items.push({
      id: 'mobileFallbackTuning',
      label: 'Extra 3D Mobile Fallback Tuning',
      category: 'WEBGL_3D',
      cost: getRate('mobileTuning', 2750, 39),
      daysMin: 1,
      daysMax: 1,
      revisions: '3 (shared frontend)',
    });
  }

  const intTiers: Record<string, { inr: number; usd: number; label: string }> = {
    BASIC: { inr: 2200, usd: 31, label: 'Client 3D Model Integration (Basic Static)' },
    MEDIUM: { inr: 8800, usd: 124, label: 'Client 3D Model Integration (Medium Complexity)' },
    COMPLEX: { inr: 19250, usd: 270, label: 'Client 3D Model Integration (Complex Multi-Part/Rigged)' },
  };
  if (req.modelIntegrationTier !== 'NONE' && intTiers[req.modelIntegrationTier]) {
    const t = intTiers[req.modelIntegrationTier];
    items.push({
      id: 'modelIntegrationTier',
      label: t.label,
      category: 'WEBGL_3D',
      cost: Math.round((region === 'INDIA' ? t.inr : t.usd) * mult),
      daysMin: 2,
      daysMax: 4,
      revisions: '3 (shared frontend)',
    });
  }

  const optTiers: Record<string, { inr: number; usd: number; label: string }> = {
    BASIC: { inr: 1650, usd: 23, label: '3D Model Optimization (Basic Compression)' },
    MEDIUM: { inr: 8250, usd: 115, label: '3D Model Optimization (Medium Mesh/Texture Cleanup)' },
    COMPLEX: { inr: 19250, usd: 270, label: '3D Model Optimization (Complex Polygon/Rig Cleanup)' },
  };
  if (req.modelOptimizationTier !== 'NONE' && optTiers[req.modelOptimizationTier]) {
    const t = optTiers[req.modelOptimizationTier];
    items.push({
      id: 'modelOptimizationTier',
      label: t.label,
      category: 'WEBGL_3D',
      cost: Math.round((region === 'INDIA' ? t.inr : t.usd) * mult),
      daysMin: 1,
      daysMax: 3,
      revisions: '3 (shared frontend)',
    });
  }

  // 5. Backend & Dependencies[cite: 4, 5, 26, 27, 28, 29, 30]
  let needsAuth = req.userLogin;
  let crudCount = req.crudApiCount;
  let adminCount = req.adminScreenCount;
  let needsImageKit = req.imageKitIntegration;

  if (req.roleBasedAccess && !needsAuth && !req.adminDashboardBundle && !req.blogCmsBundle) {
    needsAuth = true;
    autoAdjustments.push('Role-Based Access requires User Login; automatically included.');
  }
  if (adminCount > 0 && !req.adminDashboardBundle) {
    if (!needsAuth && !req.blogCmsBundle) needsAuth = true;
    if (crudCount < adminCount) crudCount = adminCount;
  }

  let useAdminBundle = req.adminDashboardBundle;
  if (!useAdminBundle && needsAuth && crudCount >= 3 && adminCount >= 3) {
    useAdminBundle = true;
    crudCount -= 3;
    adminCount -= 3;
    autoAdjustments.push('Consolidated Login + 3 CRUD + 3 Admin Screens into Admin Dashboard Bundle.');
  }

  if (useAdminBundle) {
    items.push({
      id: 'adminDashboardBundle',
      label: 'Admin Dashboard Bundle (User Login + 3 CRUD APIs + 3 Admin Screens)',
      category: 'BACKEND',
      cost: getRate('adminDashboardBundle', 17050, 239),
      daysMin: 6,
      daysMax: 8,
      revisions: '2 (shared backend)',
    });
    if (req.extraDashboardTypes > 0) {
      items.push({
        id: 'extraDashboardTypes',
        label: `Extra Dashboard Data Categories (+${req.extraDashboardTypes})`,
        category: 'BACKEND',
        cost: req.extraDashboardTypes * getRate('extraDashboardType', 3850, 54),
        daysMin: req.extraDashboardTypes * 1.5,
        daysMax: req.extraDashboardTypes * 2,
        revisions: '2 (shared backend)',
      });
    }
  }

  if (req.blogCmsBundle) {
    items.push({
      id: 'blogCmsBundle',
      label: 'Blog / CMS Backend Bundle (Login + Blog API + Admin UI + ImageKit)',
      category: 'BACKEND',
      cost: getRate('blogCmsBundle', 12100, 170),
      daysMin: 4,
      daysMax: 5,
      revisions: '2 (shared backend)',
    });
    needsImageKit = false;
  }

  if (needsAuth && !useAdminBundle && !req.blogCmsBundle) {
    items.push({
      id: 'userLogin',
      label: 'User Login / Authentication',
      category: 'BACKEND',
      cost: getRate('userLogin', 5500, 77),
      daysMin: 2,
      daysMax: 2,
      revisions: '2 (shared backend)',
    });
  }
  if (req.roleBasedAccess) {
    items.push({
      id: 'roleBasedAccess',
      label: 'Role-Based Access Control',
      category: 'BACKEND',
      cost: getRate('roleBasedAccess', 2750, 39),
      daysMin: 1,
      daysMax: 1,
      revisions: '2 (shared backend)',
    });
  }
  if (crudCount > 0) {
    items.push({
      id: 'crudApiCount',
      label: `Data Management CRUD API (${crudCount}x)`,
      category: 'BACKEND',
      cost: crudCount * getRate('crudApi', 2750, 39),
      daysMin: crudCount,
      daysMax: crudCount,
      revisions: '2 (shared backend)',
    });
  }
  if (adminCount > 0) {
    items.push({
      id: 'adminScreenCount',
      label: `Private Admin Screen (${adminCount}x)`,
      category: 'BACKEND',
      cost: adminCount * getRate('adminScreen', 1100, 15),
      daysMin: adminCount,
      daysMax: adminCount,
      revisions: '2 (shared backend)',
    });
  }
  if (req.contactForm) {
    items.push({
      id: 'contactForm',
      label: 'Contact Form API + Database + Email Alert',
      category: 'BACKEND',
      cost: getRate('contactForm', 2750, 39),
      daysMin: 0.5,
      daysMax: 1,
      revisions: '2 (shared backend)',
    });
  }
  if (req.newsletter) {
    items.push({
      id: 'newsletter',
      label: 'Newsletter Email Capture API',
      category: 'BACKEND',
      cost: getRate('newsletter', 2200, 31),
      daysMin: 0.5,
      daysMax: 0.5,
      revisions: '2 (shared backend)',
    });
  }
  if (needsImageKit) {
    items.push({
      id: 'imageKitIntegration',
      label: 'ImageKit Cloud Optimization Integration',
      category: 'BACKEND',
      cost: getRate('imageKit', 2750, 39),
      daysMin: 0.5,
      daysMax: 1,
      revisions: '2 (shared backend)',
    });
  }
  if (req.serverSearchPagination) {
    items.push({
      id: 'serverSearchPagination',
      label: 'Server-Side Search, Filtering & Pagination',
      category: 'BACKEND',
      cost: getRate('serverSearch', 2750, 39),
      daysMin: 1,
      daysMax: 1,
      revisions: '2 (shared backend)',
    });
  }
  if (req.globalStateManagement) {
    items.push({
      id: 'globalStateManagement',
      label: 'Global State Memory (Redux / Zustand)',
      category: 'BACKEND',
      cost: getRate('globalState', 3300, 46),
      daysMin: 1,
      daysMax: 1,
      revisions: '2 (shared backend)',
    });
  }
  if (req.thirdPartyApiCount > 0) {
    items.push({
      id: 'thirdPartyApiCount',
      label: `Third-Party API Integration (${req.thirdPartyApiCount}x)`,
      category: 'BACKEND',
      cost: req.thirdPartyApiCount * getRate('thirdPartyApi', 2750, 39),
      daysMin: req.thirdPartyApiCount,
      daysMax: req.thirdPartyApiCount * 1.5,
      revisions: '2 (shared backend)',
    });
  }
  if (req.emailTemplates) {
    items.push({
      id: 'emailTemplates',
      label: 'Automated Branded HTML Email Templates',
      category: 'BACKEND',
      cost: getRate('emailTemplates', 1650, 23),
      daysMin: 0.5,
      daysMax: 1,
      revisions: '2 (shared backend)',
    });
  }
  if (req.bookingSystem) {
    items.push({
      id: 'bookingSystem',
      label: 'Online Appointment & Slot Booking System',
      category: 'BACKEND',
      cost: getRate('bookingSystem', 11000, 154),
      daysMin: 4,
      daysMax: 5,
      revisions: '2 (shared backend)',
    });
  }
  if (req.paymentGateway) {
    items.push({
      id: 'paymentGateway',
      label: 'Payment Gateway Integration (Razorpay / Stripe / PayPal)',
      category: 'BACKEND',
      cost: getRate('paymentGateway', 5500, 77),
      daysMin: 2,
      daysMax: 2,
      revisions: '2 (shared backend)',
    });
  }
  if (req.securityHardening) {
    items.push({
      id: 'securityHardening',
      label: 'Backend Security Hardening',
      category: 'BACKEND',
      cost: getRate('securityHardening', 2200, 31),
      daysMin: 0.5,
      daysMax: 1,
      revisions: '2 (shared backend)',
    });
  }
  if (req.apiDocumentation) {
    items.push({
      id: 'apiDocumentation',
      label: 'Written Backend API Documentation',
      category: 'BACKEND',
      cost: getRate('apiDocumentation', 1650, 23),
      daysMin: 0.5,
      daysMax: 1,
      revisions: '2 (shared backend)',
    });
  }

  // 6. Extras & Deployment[cite: 6, 31, 37]
  if (req.nextjsSeo) {
    items.push({
      id: 'nextjsSeo',
      label: 'Advanced Next.js SEO Setup',
      category: 'EXTRAS',
      cost: getRate('nextjsSeo', 3850, 54),
      daysMin: 1,
      daysMax: 1,
      revisions: '3 (shared frontend)',
    });
  }
  if (req.speedOptimization) {
    items.push({
      id: 'speedOptimization',
      label: 'Performance & Speed Optimization',
      category: 'EXTRAS',
      cost: getRate('speedOptimization', 2750, 39),
      daysMin: 1,
      daysMax: 1,
      revisions: '3 (shared frontend)',
    });
  }
  if (req.analyticsSetup) {
    items.push({
      id: 'analyticsSetup',
      label: 'Analytics Setup',
      category: 'EXTRAS',
      cost: getRate('analyticsSetup', 880, 12),
      daysMin: 0.25,
      daysMax: 0.25,
      revisions: 'n/a',
    });
  }
  if (req.cookieBanner) {
    items.push({
      id: 'cookieBanner',
      label: 'Cookie Consent Banner',
      category: 'EXTRAS',
      cost: getRate('cookieBanner', 1100, 15),
      daysMin: 0.5,
      daysMax: 0.5,
      revisions: '3 (shared frontend)',
    });
  }
  if (req.extraHourlyWorkHours > 0) {
    const hrs = Math.max(2, Math.ceil(req.extraHourlyWorkHours));
    items.push({
      id: 'extraHourlyWorkHours',
      label: `Custom Hourly Dev Work (${hrs} hrs)`,
      category: 'EXTRAS',
      cost: hrs * getRate('hourlyRate', 440, 10),
      daysMin: 1,
      daysMax: 2,
      revisions: 'n/a',
    });
  }

  const hasBackend = items.some((i) => i.category === 'BACKEND');
  const hasAnySelection = items.length > 0;
  const effHosting =
    hasBackend && req.hostingSetup === 'FRONTEND'
      ? 'FULLSTACK'
      : hasAnySelection && req.hostingSetup === 'NONE' && !req.isAdminComplexOverride
      ? hasBackend
        ? 'FULLSTACK'
        : 'FRONTEND'
      : req.hostingSetup;

  if (effHosting === 'FRONTEND' && hasAnySelection) {
    items.push({
      id: 'hostingSetup',
      label: 'One-Time Hosting Setup (Frontend Only)',
      category: 'DEPLOYMENT',
      cost: getRate('hostingFrontend', 1100, 15),
      daysMin: 0.5,
      daysMax: 0.5,
      revisions: 'n/a',
    });
  } else if (effHosting === 'FULLSTACK' && hasAnySelection) {
    items.push({
      id: 'hostingSetup',
      label: 'One-Time Hosting Setup (Frontend + Backend + Database)',
      category: 'DEPLOYMENT',
      cost: getRate('hostingFullstack', 2200, 31),
      daysMin: 1,
      daysMax: 1,
      revisions: 'n/a',
    });
  }

  if (req.domainDnsSsl && hasAnySelection) {
    items.push({
      id: 'domainDnsSsl',
      label: 'One-Time Domain Connection, DNS & SSL Setup',
      category: 'DEPLOYMENT',
      cost: getRate('domainDnsSsl', 550, 8),
      daysMin: 0.5,
      daysMax: 0.5,
      revisions: 'n/a',
    });
  }

  let subtotal = items.reduce((s, i) => s + i.cost, 0);
  let daysMin = items.reduce((s, i) => s + i.daysMin, 0);
  let daysMax = items.reduce((s, i) => s + i.daysMax, 0);

  if (req.rushDelivery && subtotal > 0) {
    const rushCost = Math.round(subtotal * 0.3);
    items.push({
      id: 'rushDelivery',
      label: 'Rush Delivery (+30% — Half Standard Duration)',
      category: 'EXTRAS',
      cost: rushCost,
      daysMin: 0,
      daysMax: 0,
      revisions: 'Same as build',
    });
    subtotal += rushCost;
    daysMin = Math.max(1, Math.ceil(daysMin * 0.5));
    daysMax = Math.max(1, Math.ceil(daysMax * 0.5));
  }

  const discountPercent = Math.min(
    25,
    Math.max(0, req.discountPercent || masterConfig?.activeOfferDiscountPercent || 0)
  );
  const discountAmount = discountPercent > 0 ? Math.round(subtotal * (discountPercent / 100)) : 0;
  const afterDiscount = subtotal - discountAmount;

  const gstAmount =
    region === 'INDIA' && masterConfig?.gstRegistered ? Math.round(afterDiscount * 0.18) : 0;
  const handlingFee =
    region === 'INTL' && req.paymentMethod === 'PAYPAL_CARD'
      ? Math.round(afterDiscount * 0.06)
      : 0;

  const grandTotal = afterDiscount + gstAmount + handlingFee;

  const freeThreshold =
    region === 'INDIA'
      ? masterConfig?.freeHostingThresholdInr || 33000
      : masterConfig?.freeHostingThresholdUsd || 463;
  const qualifiesFreeHosting = afterDiscount >= freeThreshold;
  const remainingToFreeHosting = Math.max(0, freeThreshold - afterDiscount);

  const budget = req.budget;
  const budgetRemaining = budget > 0 ? budget - grandTotal : 0;
  const isOverBudget = budget > 0 && grandTotal > budget;
  const budgetUsagePercent =
    budget > 0 ? Math.min(100, Math.round((grandTotal / budget) * 100)) : 0;

  let popupStatus: 'SAFE' | 'NEAR_LIMIT' | 'OVER_BUDGET' = 'SAFE';
  let popupMessage = '';

  if (grandTotal === 0 && budget === 0) {
    popupMessage = 'Enter your budget & select your options to see live pricing.';
  } else if (budget > 0) {
    if (isOverBudget) {
      popupStatus = 'OVER_BUDGET';
      popupMessage = `Budget Alert: Total (${currencySymbol}${grandTotal.toLocaleString()}) crosses your ${currencySymbol}${budget.toLocaleString()} budget by ${currencySymbol}${Math.abs(budgetRemaining).toLocaleString()}.`;
    } else if (budgetRemaining <= budget * 0.15) {
      popupStatus = 'NEAR_LIMIT';
      popupMessage = `Close to Budget: ${currencySymbol}${budgetRemaining.toLocaleString()} left from your ${currencySymbol}${budget.toLocaleString()} budget.`;
    } else {
      popupMessage = `Within Budget: ${currencySymbol}${budgetRemaining.toLocaleString()} left from your ${currencySymbol}${budget.toLocaleString()} budget.`;
    }
  } else {
    popupMessage = `Live Estimate: ${currencySymbol}${grandTotal.toLocaleString()} (Enter a budget in Tab 01 to track remaining budget).`;
  }

  const exRate = masterConfig?.exchangeRateInrPerUsd || 95.5;
  const grossInrReceived =
    region === 'INDIA' ? afterDiscount : Math.round(afterDiscount * 0.97 * exRate);
  const taxReserveInr = Math.round(grossInrReceived * (10 / 110));
  const netProfitAfterTaxInr = grossInrReceived - taxReserveInr;
  const caToolsBufferInr = Math.round(netProfitAfterTaxInr * 0.04);
  const badDebtBufferInr = Math.round(netProfitAfterTaxInr * 0.05);
  const pureCashKeptInr = netProfitAfterTaxInr - caToolsBufferInr - badDebtBufferInr;

  let milestones: any[] = [];
  if (grandTotal === 0) {
    milestones = [];
  } else if (region === 'INTL' && grandTotal < 60) {
    milestones = [
      {
        name: '100% Upfront',
        percent: 100,
        amount: grandTotal,
        trigger: 'Before work starts (<$60)',
      },
    ];
  } else if (region === 'INTL' && grandTotal <= 150) {
    const half = Math.round(grandTotal * 0.5);
    milestones = [
      { name: 'Advance', percent: 50, amount: half, trigger: 'After Vision Confirmation' },
      {
        name: 'Pre-Launch',
        percent: 50,
        amount: grandTotal - half,
        trigger: 'Before go-live & handover',
      },
    ];
  } else if (afterDiscount >= freeThreshold) {
    const m1 = Math.round(grandTotal * 0.4);
    const m2 = Math.round(grandTotal * 0.2);
    const m3 = Math.round(grandTotal * 0.2);
    const m4 = grandTotal - m1 - m2 - m3;
    milestones = [
      { name: 'Advance (M1)', percent: 40, amount: m1, trigger: 'After Vision Confirmation' },
      { name: 'Core Build (M2)', percent: 20, amount: m2, trigger: 'Frontend / Backend preview' },
      { name: 'Final Approval (M3)', percent: 20, amount: m3, trigger: 'Final staging sign-off' },
      {
        name: 'Pre-Launch (M4)',
        percent: 20,
        amount: m4,
        trigger: 'Before go-live & repo transfer',
      },
    ];
  } else {
    const m1 = Math.round(grandTotal * 0.5);
    const m2 = Math.round(grandTotal * 0.25);
    const m3 = grandTotal - m1 - m2;
    milestones = [
      { name: 'Advance', percent: 50, amount: m1, trigger: 'After Vision Confirmation' },
      { name: 'Final Approval', percent: 25, amount: m2, trigger: 'Staging build sign-off' },
      { name: 'Pre-Launch', percent: 25, amount: m3, trigger: 'Before go-live & handover' },
    ];
  }

  return {
    region,
    currencySymbol,
    inferredComplexConfig: req,
    items,
    subtotal,
    discountPercent,
    discountAmount,
    gstAmount,
    handlingFee,
    grandTotal,
    durationEstimate: {
      realisticDaysMin: grandTotal === 0 ? 0 : Math.max(1, Math.ceil(daysMin * 0.8)),
      realisticDaysMax: grandTotal === 0 ? 0 : Math.max(2, Math.ceil(daysMax * 0.85)),
    },
    revisions: {
      frontendShared: grandTotal === 0 ? 0 : 3,
      backendShared: hasBackend ? 2 : 0,
    },
    freeHostingOffer: {
      qualified: qualifiesFreeHosting,
      threshold: freeThreshold,
      remainingToUnlock: remainingToFreeHosting,
      capValue: region === 'INDIA' ? 3000 : 35,
    },
    budgetIntelligence: {
      budget,
      grandTotal,
      budgetRemaining,
      isOverBudget,
      budgetUsagePercent,
      popupStatus,
      popupMessage,
    },
    developerTelemetryInr: {
      grossInrReceived,
      taxReserveInr,
      netProfitAfterTaxInr,
      caToolsBufferInr,
      badDebtBufferInr,
      pureCashKeptInr,
    },
    autoAdjustments,
    advisorInsights,
    milestones,
  };
}