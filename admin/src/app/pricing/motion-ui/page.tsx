// admin/src/app/pricing/motion-ui/page.tsx
'use client';

import { PricingRateGrid, type RateItemMeta } from '@/context/PricingContext';

const MOTION_UI_ITEMS: RateItemMeta[] = [
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
];

export default function MotionUiPricingPage() {
  return <PricingRateGrid items={MOTION_UI_ITEMS} />;
}