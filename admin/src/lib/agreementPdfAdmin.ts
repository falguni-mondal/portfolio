// admin/src/lib/agreementPdfAdmin.ts
import { jsPDF } from 'jspdf';

const SCOPE_COMPARISON = {
  provided: [
    'Building your website from your approved design or reference websites',
    'Backend development: login, database, admin panel and APIs',
    'Technical setup: mobile-friendly layout, speed and basic technical SEO',
    'Deployment: hosting setup, domain connection, SSL and go-live',
    'Handover of source code and access after full payment',
  ],
  notProvided: [
    'UI/UX or graphic design (including Figma), logos and branding',
    'Writing, editing or formatting content: text, unstructured documents, images, photos and video',
    'SEO campaigns, ranking guarantees, marketing, social media and email marketing',
    'Legal documents, training sessions and ongoing maintenance or content updates',
    'Cloud infrastructure, Docker, Kubernetes, Redis and other DevOps work',
  ],
};

const WORKFLOW_STEPS = [
  '1. Enquiry & Discovery Call: You explain your needs; package & scope are recommended.',
  '2. Project Brief (Form A): You provide goals, audience, pages, references, assets, features, deadline & budget.',
  '3. Vision Confirmation (Form B): Mandatory written confirmation of pages, features, animations, and exclusions before work starts.',
  '4. Content & Asset Handover: You supply complete text, logos, images, structured CSV/Sheet/JSON files, and references.',
  '5. Build & Staging Preview: The website is built and shared via a private preview link.',
  '6. Revision Rounds: Consolidated written feedback is implemented within included rounds (3 frontend / 2 shared backend).',
  '7. Final Version Approval: Written confirmation that the staging build is the final version; 2nd milestone becomes due.',
  '8. Pre-Launch Payment: Remaining balance is settled so the project is 100% paid prior to deployment.',
  '9. Hosting & Go-Live: Deployment, domain connection, SSL activation, and live testing.',
  '10. Handover & 15-Day Warranty: Source code (GitHub transfer or ZIP) and credentials are handed over; 15-day free bug-fix support begins.',
];

const AGREEMENT_SECTIONS = [
  {
    number: '01',
    title: 'Pricing Rules & Currency Policy',
    bullets: [
      'Clients registered in India are billed in Indian Rupees (INR). All other clients are billed in US Dollars (USD). Pricing follows where your company is registered, not your email address.',
      'Same features, same price: However you build up to a website within the rules of this document, the total is the same. If two valid routes differ, the lower valid route is charged.',
      'Upgrades & site growth cost only the difference: Upgrading animations or adding pages later costs only the exact difference, never the full price twice.',
      'Quotes are valid for 15 calendar days from generation.',
    ],
  },
  {
    number: '02',
    title: 'Revision Policy & Feedback Window (Section 5)',
    bullets: [
      'All frontend work (including 3D/WebGL) shares 3 consolidated revision rounds across the entire website.',
      'All backend modules operate as one connected system and share 2 consolidated revision rounds in total.',
      'One revision round = one consolidated written list of adjustments. Feedback sent in pieces counts as one round only if sent within 24 hours; batches sent after 24 hours count as a new round.',
      'Send each feedback round within 5 working days of delivery. Silence for 5 working days treats the delivered version as accepted.',
    ],
  },
  {
    number: '03',
    title: 'Payments, Milestones & Taxes (Section 6)',
    bullets: [
      'Standard payment schedule: 50% Advance (after Vision Confirmation & before work starts), 25% on Final Version Approval, and 25% Pre-Launch before live deployment and file handover.',
      'International orders under $60 are paid 100% upfront. International orders from $60 to $150 are paid 50% advance and 50% before go-live. Projects reaching INR 33,000 ($463) use 4 milestones (40% / 20% / 20% / 20%).',
      'Work starts only after the advance payment lands. Source code, final files, and live deployment are released only after 100% payment is received.',
      'Late payment: If a milestone is unpaid 7 days after its due date, work pauses and the delivery date moves day for day. After 14 days, a late fee of 2% per week applies (capped at 10%).',
    ],
  },
  {
    number: '04',
    title: 'Hosting, Third-Party Costs & Promotional Offer (Section 8)',
    bullets: [
      'All ongoing domain, hosting, backend server, database, and third-party subscription charges are paid directly by you under your own accounts.',
      'Promotional Offer: If your website development cost reaches or crosses INR 33,000 ($463), your 1st year of standard managed frontend hosting (worth up to INR 3,000 / $35 for Year 1) is provided FREE. Renewals from Year 2 onward and all domain, backend, and database costs remain paid by you.',
    ],
  },
  {
    number: '05',
    title: 'Scope Boundaries & Change Requests (Section 9)',
    bullets: [
      'The project scope is strictly limited to what is confirmed in your Vision Confirmation (Form B) and selected package.',
      'Any new page, section, feature, animation, or design-direction change requested after confirmation is a Change Request (Form C) and is quoted separately.',
      'Change requests up to INR 3,300 ($46) are paid 100% upfront; change requests above INR 3,300 ($46) are paid 50% upfront and 50% before go-live.',
    ],
  },
  {
    number: '06',
    title: 'Client Responsibilities & Timelines (Sections 10 & 11)',
    bullets: [
      'You supply the finished design (or clear reference websites) and complete content (including clean CSV/Sheet/JSON files for dynamic catalog items) before development of the related section begins.',
      'You appoint one single decision-maker to provide consolidated feedback within 3 working days. Delays in content, feedback, or payment pause the schedule day for day.',
      'If you are silent for 15 consecutive days, the project is marked inactive. After 30 days of silence, the project is closed, the advance is retained, and restarting requires a 20% restart fee of the remaining balance.',
      'You warrant that you own or hold valid licenses for all text, images, fonts, videos, and 3D models you supply, and that your site complies with applicable laws (including DPDP Act / GDPR).',
    ],
  },
  {
    number: '07',
    title: 'Cancellation, IP Ownership & 15-Day Warranty (Sections 13, 14 & 15)',
    bullets: [
      'The advance is non-refundable once work has started because development capacity is reserved for your project.',
      'Upon 100% payment, ownership of custom code created exclusively for your project transfers to you, along with a perpetual license for reusable components.',
      'Bugs (behavior not matching the approved scope) are fixed free of charge for 15 days after go-live. Tested on the latest two versions of Chrome, Safari, Edge, and Firefox.',
      'Total liability for any claim is strictly limited to the amount paid by you for the project. Search rankings, traffic, sales, or specific Lighthouse scores are not guaranteed ("best practices followed").',
    ],
  },
  {
    number: '08',
    title: 'Confidentiality, Governing Law & Dispute Resolution (Sections 16-20)',
    bullets: [
      'Both parties keep credentials and non-public business information confidential.',
      'Any dispute not resolved through good-faith discussion within 15 days shall be referred to arbitration under the Arbitration and Conciliation Act, 1996 (India), governed by the laws of India, with exclusive jurisdiction in West Bengal, India.',
      'By accepting this agreement electronically, you confirm you are acting for a business or professional purpose and not as a consumer.',
    ],
  },
];

function sanitizePdfText(input: string): string {
  return String(input || '')
    .replace(/₹/g, 'INR ')
    .replace(/[•·]/g, '-')
    .replace(/[—–]/g, '-')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'");
}

export function downloadClientSignedAgreementFromAdmin(quoteDoc: any, liveEval: any) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const maxTextWidth = pageWidth - margin * 2 - 12;
  let y = 40;

  const sym = quoteDoc.region === 'INDIA' ? 'INR ' : 'USD $';
  const agreedAtDate = quoteDoc.agreedAt || quoteDoc.createdAt || new Date().toISOString();
  const agreedAtFormatted = new Date(agreedAtDate).toLocaleString('en-IN', {
    dateStyle: 'long',
    timeStyle: 'short',
  });

  const acceptanceText =
    quoteDoc.signedAgreementText ||
    `I, ${quoteDoc.fullName} (representing ${
      quoteDoc.businessName || 'my business'
    }), with contact details ${
      quoteDoc.emailPhone
    }, hereby confirm that I have read, understood, and agreed to all agreements, procedures, processes, scope boundaries, revision policies, and payment schedules set forth in the Website Development Service Guide, Pricing & Agreement (Version 3.1). I confirm that the project brief and scope selections submitted by me accurately reflect my requirements, and I acknowledge that this electronic acceptance (recorded on ${agreedAtFormatted}) is legally binding.`;

  const ensureSpace = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 45) {
      doc.addPage();
      y = 45;
    }
  };

  const writeWrappedParagraph = (
    text: string,
    fontSize = 9,
    fontStyle: 'normal' | 'bold' = 'normal',
    indent = 0
  ) => {
    doc.setFont('helvetica', fontStyle);
    doc.setFontSize(fontSize);
    const clean = sanitizePdfText(text);
    const lines = doc.splitTextToSize(clean, maxTextWidth - indent);
    const lineHeight = fontSize + 3.5;
    ensureSpace(lines.length * lineHeight + 4);
    doc.text(lines, margin + indent, y);
    y += lines.length * lineHeight + 2;
  };

  // Header Banner
  doc.setFillColor(20, 20, 22);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 62, 6, 6, 'F');
  doc.setTextColor(255, 87, 51);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(
    'BYFALGUNI (BYF.)  |  VERSION 3.1  |  OFFICIAL CLIENT AGREEMENT & PROJECT BRIEF',
    margin + 16,
    y + 22
  );

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12.5);
  doc.text(
    'Website Development: Service Guide, Procedures & Signed Agreement',
    margin + 16,
    y + 43
  );
  y += 82;

  // Section 1: Summary
  doc.setTextColor(20, 20, 20);
  writeWrappedParagraph('1. Client & Project Brief Summary (Form A & Vision Summary)', 11, 'bold');
  y += 2;

  const grandTotal = Number(liveEval?.grandTotal ?? quoteDoc.evaluatedQuote?.grandTotal ?? 0);
  const items = liveEval?.items ?? quoteDoc.evaluatedQuote?.items ?? [];
  const milestones = liveEval?.milestones ?? quoteDoc.evaluatedQuote?.milestones ?? [];
  const tags: string[] = quoteDoc.simpleChoices?.selectedTags || [];
  const notes = quoteDoc.simpleChoices?.customSectionNotes || {};

  const summaryItems = [
    `Client Full Name: ${quoteDoc.fullName}   |   Contact: ${quoteDoc.emailPhone}`,
    `Business Name & Overview: ${quoteDoc.businessName || 'N/A'}`,
    `Description of the Business: ${quoteDoc.businessDescription || 'N/A'}`,
    `Region / Country: ${quoteDoc.countryName} (${quoteDoc.region})`,
    `Main Website Goal: ${quoteDoc.mainGoal || 'N/A'}`,
    `Ideal Launch Date & Reason: ${quoteDoc.launchDateReason || 'N/A'}   |   Rush Delivery: ${
      quoteDoc.rushDelivery ? 'Yes (+30%)' : 'No'
    }`,
    `Website Category: ${quoteDoc.simpleChoices?.projectPurpose || 'Custom'}   |   Pages: ${
      quoteDoc.simpleChoices?.pages || 1
    }   |   Motion Tier: ${quoteDoc.simpleChoices?.animationTier || 'NONE'}`,
    `Client Target Budget: ${sym}${Number(quoteDoc.budget || 0).toLocaleString()}   |   Estimated Project Total: ${sym}${grandTotal.toLocaleString()}`,
    `Design / Reference URLs: ${quoteDoc.designReferences || 'N/A'}`,
  ];

  for (const item of summaryItems) {
    writeWrappedParagraph(item, 9, 'normal', 4);
  }

  if (tags.length > 0) {
    writeWrappedParagraph(
      `Selected Functionality (${tags.length}): ${tags.join(', ')}`,
      9,
      'normal',
      4
    );
  }
  if (notes.pagesAndTypeNote) {
    writeWrappedParagraph(`Category / Pages Note: ${notes.pagesAndTypeNote}`, 9, 'normal', 4);
  }
  if (notes.motionAndFeelNote) {
    writeWrappedParagraph(`Motion & 3D Note: ${notes.motionAndFeelNote}`, 9, 'normal', 4);
  }
  if (notes.functionalityNote) {
    writeWrappedParagraph(`Custom Functionality Note: ${notes.functionalityNote}`, 9, 'normal', 4);
  }
  if (notes.briefExtraNote) {
    writeWrappedParagraph(`Additional Brief Note: ${notes.briefExtraNote}`, 9, 'normal', 4);
  }

  // Section 2: Cost Breakdown
  y += 6;
  writeWrappedParagraph('2. Calculated Cost Breakdown & Payment Milestones', 11, 'bold');
  y += 2;
  for (const it of items) {
    writeWrappedParagraph(
      `- ${it.label}: ${sym}${Number(it.cost).toLocaleString()}`,
      9,
      'normal',
      6
    );
  }

  if (milestones.length > 0) {
    y += 4;
    writeWrappedParagraph('Payment Schedule:', 9.5, 'bold', 4);
    for (const m of milestones) {
      writeWrappedParagraph(
        `- ${m.name} (${m.percent}%): ${sym}${Number(m.amount).toLocaleString()} (${m.trigger})`,
        9,
        'normal',
        8
      );
    }
  }

  // Section 3: 10-Step Process
  y += 6;
  writeWrappedParagraph('3. How We Work Together - The 10-Step Process', 11, 'bold');
  y += 2;
  for (const step of WORKFLOW_STEPS) {
    writeWrappedParagraph(step, 8.8, 'normal', 4);
  }

  // Section 4: Scope
  y += 6;
  writeWrappedParagraph(
    '4. Scope of Services: What Is Provided vs. What Is Not Included',
    11,
    'bold'
  );
  y += 2;
  writeWrappedParagraph('What I Provide:', 9.5, 'bold', 4);
  for (const p of SCOPE_COMPARISON.provided) {
    writeWrappedParagraph(`+ ${p}`, 8.8, 'normal', 8);
  }
  y += 3;
  writeWrappedParagraph('What I Do NOT Provide (Explicitly Out of Scope):', 9.5, 'bold', 4);
  for (const np of SCOPE_COMPARISON.notProvided) {
    writeWrappedParagraph(`- ${np}`, 8.8, 'normal', 8);
  }

  // Section 5: Clauses
  y += 6;
  for (const sec of AGREEMENT_SECTIONS) {
    ensureSpace(32);
    writeWrappedParagraph(`Clause ${sec.number}: ${sec.title}`, 10, 'bold', 0);
    for (const b of sec.bullets) {
      writeWrappedParagraph(`- ${b}`, 8.8, 'normal', 8);
    }
    y += 3;
  }

  // Binding Acceptance Box
  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.2);
  const cleanAcceptance = sanitizePdfText(acceptanceText);
  const boxInnerWidth = pageWidth - margin * 2 - 28;
  const wrappedAcceptance = doc.splitTextToSize(cleanAcceptance, boxInnerWidth);
  const boxHeight = wrappedAcceptance.length * 13 + 48;

  ensureSpace(boxHeight + 16);

  doc.setDrawColor(20, 20, 22);
  doc.setLineWidth(1.2);
  doc.setFillColor(246, 246, 248);
  doc.roundedRect(margin, y, pageWidth - margin * 2, boxHeight, 6, 6, 'FD');

  doc.setTextColor(255, 87, 51);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('CLIENT ELECTRONIC ACCEPTANCE & SIGNATURE RECORD', margin + 14, y + 19);

  doc.setTextColor(20, 20, 20);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.2);
  doc.text(wrappedAcceptance, margin + 14, y + 36);

  const cleanFileName = `ByFalguni_Signed_Agreement_${
    String(quoteDoc.fullName || 'Client')
      .trim()
      .replace(/[^a-zA-Z0-9_-]/g, '_')
  }.pdf`;
  doc.save(cleanFileName);
}