// admin/src/app/pricing/backend/page.tsx
'use client';

import { PricingRateGrid, type RateItemMeta } from '@/context/PricingContext';

const BACKEND_ITEMS: RateItemMeta[] = [
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
];

export default function BackendPricingPage() {
  return <PricingRateGrid items={BACKEND_ITEMS} />;
}