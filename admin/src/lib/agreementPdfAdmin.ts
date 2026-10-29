// admin/src/lib/agreementPdfAdmin.ts
import { jsPDF } from 'jspdf';

const SCOPE_COMPARISON = {
  provided: [
    'Building your website from your approved design or reference websites',
    'Frontend & backend development based on your confirmed features and scope',
    'Technical setup: mobile-friendly responsive layout, speed & basic technical SEO',
    'Complimentary deployment setup: one-time hosting setup, domain connection, DNS & SSL activation at no extra setup charge',
    'Full handover of source code and credentials after project completion and full payment',
  ],
  notProvided: [
    'UI/UX or graphic design (including Figma creation from scratch), logos and branding',
    'Writing, editing or formatting content: text copy, unstructured documents, images, photos and video production',
    'Ongoing SEO campaigns, ranking guarantees, paid ads, social media and email marketing campaigns',
    'Legal policy drafting, live training sessions and ongoing post-warranty maintenance or content updates',
    'Enterprise DevOps infrastructure (custom Kubernetes clusters, dedicated cloud DevOps retainers)',
  ],
};

const WORKFLOW_STEPS = [
  '1. Scope & Needs Submission: You submit your website category, page count, desired functionalities, motion tier, business brief, and custom notes through this configurator.',
  '2. Review & Tailored Quote: Your submitted requirements and custom notes are reviewed by ByFalguni, and a tailored project quote & timeline proposal is shared with you.',
  '3. Vision & Quote Confirmation: Mandatory written confirmation of the agreed pages, features, animations, timeline, and final quote before development begins.',
  '4. Content & Asset Handover: You supply complete text copy, logos, images, structured catalog files (CSV/Sheet/JSON), and design references.',
  '5. Build & Staging Preview: The website is developed according to the confirmed scope and shared via a private staging preview link.',
  '6. Revision Rounds: Consolidated written feedback is implemented within the included revision rounds (3 frontend rounds / 2 shared backend rounds).',
  '7. Final Version Approval: Written confirmation that the staging build matches the agreed scope; pre-launch milestone becomes due.',
  '8. Pre-Launch Settlement: Remaining balance is settled so the project is 100% paid prior to live deployment and code transfer.',
  '9. Complimentary Hosting & Go-Live: Free one-time hosting setup, custom domain connection, SSL activation, and live testing.',
  '10. Handover & 15-Day Warranty: Source code (GitHub transfer or ZIP) and credentials are handed over; 15-day free bug-fix warranty begins.',
];

const AGREEMENT_SECTIONS = [
  {
    number: '01',
    title: 'Scope Submission, Custom Quotation & Currency Policy',
    bullets: [
      'This document records your submitted project requirements, selected functionalities, custom written notes, and service terms. It is a Project Scope Submission & Service Agreement and not an automated price quote.',
      'After reviewing your submitted requirements and custom writings, ByFalguni will prepare and send an official tailored project quote and milestone schedule for your approval.',
      'Clients registered in India are billed in Indian Rupees (INR). All other clients are billed in US Dollars (USD).',
      'If you later choose to upgrade animations, add pages, or include extra features beyond your initial scope, only the additional scope difference is quoted.',
    ],
  },
  {
    number: '02',
    title: 'Revision Policy & Feedback Window',
    bullets: [
      'All frontend work (including 3D/WebGL experiences) shares 3 consolidated revision rounds across the entire website.',
      'All backend modules operate as one connected system and share 2 consolidated revision rounds in total.',
      'One revision round = one consolidated written list of adjustments within the agreed scope. Feedback sent in pieces counts as one round only if sent within 24 hours; batches sent after 24 hours count as a new round.',
      'Please send each feedback round within 5 working days of staging delivery. Silence for 5 working days treats the delivered milestone version as accepted.',
    ],
  },
  {
    number: '03',
    title: 'Payments & Milestone Structure',
    bullets: [
      'Once you approve the official quote provided by ByFalguni, the standard payment schedule is: 50% Advance (after Vision & Quote Confirmation before work starts), 25% on Final Version Approval, and 25% Pre-Launch before live deployment and code handover (larger or smaller projects may follow the milestone breakdown specified in your official quote).',
      'Development starts only after the advance payment is received. Source code, final files, and live deployment are released only after 100% payment is completed.',
      'Late payment: If a due milestone remains unpaid 7 days after its due date, work pauses and the delivery schedule shifts day for day. After 14 days, a late fee of 2% per week applies (capped at 10%).',
    ],
  },
  {
    number: '04',
    title: 'Complimentary Hosting/Domain Setup & Third-Party Renewals',
    bullets: [
      'One-time Hosting Setup and Domain, DNS & SSL connection are provided FREE of charge as part of your website deployment.',
      'All ongoing third-party renewal or subscription charges (such as annual domain registration/renewal, paid server/database tiers, or paid third-party APIs) are paid directly by you under your own accounts.',
    ],
  },
  {
    number: '05',
    title: 'Scope Boundaries & Change Requests',
    bullets: [
      'The project scope is strictly defined by the selections, custom notes, and final Vision Confirmation agreed upon before development starts.',
      'Any new page, section, feature, animation, or design-direction change requested after scope confirmation is treated as a Change Request and is quoted separately before implementation.',
    ],
  },
  {
    number: '06',
    title: 'Client Responsibilities & Project Timelines',
    bullets: [
      'You supply the approved design (or clear reference websites) and complete content (including clean CSV/Sheet/JSON files for dynamic catalog items) before development of the related section begins.',
      'You appoint a single decision-maker to provide consolidated feedback. Delays in content handover, feedback, or milestone payments pause the timeline day for day.',
      'If a project remains completely silent from the client side for 15 consecutive days, it is marked inactive. After 30 days of silence, the project is closed, the advance is retained, and restarting requires a 20% restart fee of the remaining balance.',
      'You warrant that you own or hold valid licenses for all text, images, fonts, videos, and 3D assets you supply, and that your website content complies with applicable laws (including DPDP Act / GDPR).',
    ],
  },
  {
    number: '07',
    title: 'Cancellation, IP Ownership & 15-Day Bug Warranty',
    bullets: [
      'The advance payment is non-refundable once work has started because dedicated development capacity is reserved for your project.',
      'Upon 100% payment, full ownership of custom code written exclusively for your project transfers to you, along with a perpetual license for reusable helper components.',
      'Any technical bugs (behavior not matching the confirmed scope) are fixed free of charge for 15 days after go-live. Websites are tested on modern versions of Chrome, Safari, Edge, and Firefox.',
      'Total liability for any claim is strictly limited to the amount paid by you for the project. Specific search engine rankings, traffic volume, or sales figures are not guaranteed.',
    ],
  },
  {
    number: '08',
    title: 'Confidentiality, Governing Law & Dispute Resolution',
    bullets: [
      'Both parties agree to keep account credentials and non-public business information strictly confidential.',
      'Any dispute not resolved through good-faith discussion within 15 days shall be referred to arbitration under the Arbitration and Conciliation Act, 1996 (India), governed by the laws of India, with exclusive jurisdiction in West Bengal, India.',
      'By accepting this agreement electronically, you confirm you are acting for a business or professional purpose.',
    ],
  },
];

const MOTION_TIER_LABELS: Record<string, string> = {
  NONE: '1st Tier: Completely Static (No animations / No smooth scroll)',
  BASIC: '2nd Tier: Basic Animations (Smooth scroll, fade/slide-in, hover polish)',
  ADVANCED: '3rd Tier: Advanced Animations + Smooth Scroll (Parallax, split-text, pinned scroll)',
  WEBGL_3D: '4th Tier: 3D & WebGL Experience (Advanced Animations + Interactive Three.js / WebGL 3D)',
};

function sanitizePdfText(input: string): string {
  return String(input || '')
    .replace(/₹/g, 'INR ')
    .replace(/[•·★]/g, '-')
    .replace(/[—–]/g, '-')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'");
}

export function downloadClientSignedAgreementFromAdmin(quoteDoc: any, _liveEval?: any) {
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

  const cleanSavedText = String(quoteDoc.signedAgreementText || '').replace(
    /\s*\(Version 3\.1\)/gi,
    ''
  );
  const acceptanceText =
    cleanSavedText ||
    `I, ${quoteDoc.fullName || 'Client'}${
      quoteDoc.businessName ? ` (representing ${quoteDoc.businessName})` : ''
    }, with contact details ${
      quoteDoc.emailPhone || 'N/A'
    }, hereby confirm that I have read, understood, and agreed to all terms, procedures, processes, scope boundaries, revision policies, and payment structures set forth in the Website Development Service Guide & Client Agreement. I confirm that the project brief, scope choices, and custom written notes submitted by me accurately reflect my requirements, that an official project quote will be shared after reviewing this submission, and I acknowledge that this electronic acceptance (recorded on ${agreedAtFormatted}) is legally binding.`;

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
    'BYFALGUNI (BYF.)  |  OFFICIAL CLIENT PROJECT BRIEF & SERVICE AGREEMENT',
    margin + 16,
    y + 22
  );

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12.5);
  doc.text(
    'Website Development: Submitted Scope, Custom Notes & Signed Agreement',
    margin + 16,
    y + 43
  );
  y += 82;

  // Section 1: Summary of Client Choices (No Tab labels)
  doc.setTextColor(20, 20, 20);
  writeWrappedParagraph('1. Client Details, Selected Choices & Project Brief', 11, 'bold');
  y += 2;

  const tags: string[] = quoteDoc.simpleChoices?.selectedTags || [];
  const notes = quoteDoc.simpleChoices?.customSectionNotes || {};
  const pagesCount = quoteDoc.simpleChoices?.pages ?? 0;
  const animTier = quoteDoc.simpleChoices?.animationTier || 'NONE';
  const motionLabel = MOTION_TIER_LABELS[animTier] || animTier;

  const summaryItems = [
    `Client Full Name: ${quoteDoc.fullName || 'N/A'}`,
    `Email Address: ${quoteDoc.email || 'N/A'}   |   Phone / WhatsApp: ${quoteDoc.phone || quoteDoc.emailPhone || 'N/A'}`,
    `Country / Region: ${quoteDoc.countryName || 'India'} (${quoteDoc.region || 'INDIA'})   |   Client Stated Target Budget: ${
      Number(quoteDoc.budget) > 0 ? `${sym}${Number(quoteDoc.budget).toLocaleString()}` : 'Not specified (Custom quote requested)'
    }`,
    `Selected Website Category: ${quoteDoc.simpleChoices?.projectPurpose || 'Custom / Not Specified'}`,
    `Selected Number of Pages: ${
      pagesCount > 0
        ? `${pagesCount} ${pagesCount === 1 ? 'Page' : 'Pages'}`
        : '0 (To be recommended based on project brief)'
    }`,
    `Selected Motion & Visual Tier: ${motionLabel}`,
    `Business / Project Name: ${quoteDoc.businessName || 'N/A'}`,
    `Main Website Goal: ${quoteDoc.mainGoal || 'N/A'}`,
    `Description of the Business: ${quoteDoc.businessDescription || 'N/A'}`,
    `Ideal Launch Date & Reason: ${quoteDoc.launchDateReason || 'N/A'}   |   Priority / Rush Delivery: ${
      quoteDoc.rushDelivery ? 'Yes (Requested)' : 'No (Standard Timeline)'
    }`,
    `Figma Design Link / Reference Website URLs: ${quoteDoc.designReferences || 'N/A'}`,
    `Hosting & Domain Setup: Included Free of Charge (No one-time setup fee)`,
  ];

  for (const item of summaryItems) {
    writeWrappedParagraph(`- ${item}`, 9, 'normal', 4);
  }

  // Section 2: Selected Functionalities & Custom Writings (No Tab labels)
  y += 6;
  writeWrappedParagraph('2. Selected Functionalities & Client Custom Writings', 11, 'bold');
  y += 2;

  if (tags.length > 0) {
    writeWrappedParagraph(
      `Selected Functionality Options (${tags.length} selected):`,
      9.5,
      'bold',
      4
    );
    writeWrappedParagraph(tags.map((t) => `[x] ${t}`).join('   |   '), 8.8, 'normal', 8);
  } else {
    writeWrappedParagraph(
      'Selected Functionality Options: None selected (Frontend-only or described in custom notes below).',
      9,
      'normal',
      4
    );
  }

  y += 3;
  writeWrappedParagraph('Client Custom Writings:', 9.5, 'bold', 4);
  writeWrappedParagraph(
    `- Custom Website Category & Page Structure Note: ${
      notes.pagesAndTypeNote?.trim() || 'None provided'
    }`,
    8.8,
    'normal',
    8
  );
  writeWrappedParagraph(
    `- Custom Functionality & Workflow Note: ${
      notes.functionalityNote?.trim() || 'None provided'
    }`,
    8.8,
    'normal',
    8
  );
  writeWrappedParagraph(
    `- Custom Motion, Animation & 3D Note: ${
      notes.motionAndFeelNote?.trim() || 'None provided'
    }`,
    8.8,
    'normal',
    8
  );
  writeWrappedParagraph(
    `- Additional Project Brief Note: ${
      notes.briefExtraNote?.trim() || quoteDoc.clientDescription?.trim() || 'None provided'
    }`,
    8.8,
    'normal',
    8
  );

  if (Array.isArray(quoteDoc.uploadedAssets) && quoteDoc.uploadedAssets.length > 0) {
    writeWrappedParagraph(
      `- Attached Project Asset Files (${quoteDoc.uploadedAssets.length}): ${quoteDoc.uploadedAssets
        .map((a: any) => a.name)
        .join(', ')}`,
      8.8,
      'normal',
      8
    );
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

/**
 * Generates and downloads an Official Client Quote & Milestone Proposal PDF from the Admin Panel
 */
export function downloadOfficialClientQuotePdfFromAdmin(quoteDoc: any, liveEval: any) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const maxTextWidth = pageWidth - margin * 2 - 12;
  let y = 40;

  const evalData = liveEval || quoteDoc.evaluatedQuote || {};
  const sym = quoteDoc.region === 'INDIA' ? 'INR ' : 'USD $';
  const generatedDate = new Date().toLocaleDateString('en-IN', {
    dateStyle: 'long',
  });

  const ensureSpace = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 45) {
      doc.addPage();
      y = 45;
    }
  };

  const writeWrappedParagraph = (
    text: string,
    fontSize = 9.5,
    fontStyle: 'normal' | 'bold' = 'normal',
    indent = 0
  ) => {
    doc.setFont('helvetica', fontStyle);
    doc.setFontSize(fontSize);
    const clean = sanitizePdfText(text);
    const lines = doc.splitTextToSize(clean, maxTextWidth - indent);
    const lineHeight = fontSize + 4;
    ensureSpace(lines.length * lineHeight + 4);
    doc.text(lines, margin + indent, y);
    y += lines.length * lineHeight + 2;
  };

  // Header Banner
  doc.setFillColor(20, 20, 22);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 66, 6, 6, 'F');
  doc.setTextColor(255, 87, 51);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(
    `BYFALGUNI (BYF.)  |  OFFICIAL PROJECT QUOTATION & PROPOSAL  |  ${generatedDate.toUpperCase()}`,
    margin + 16,
    y + 23
  );

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.text(
    `Custom Website Development Quote for ${sanitizePdfText(quoteDoc.businessName || quoteDoc.fullName || 'Client')}`,
    margin + 16,
    y + 45
  );
  y += 86;

  // Section 1: Client & Project Overview
  doc.setTextColor(20, 20, 20);
  writeWrappedParagraph('1. Client & Project Overview', 11, 'bold');
  y += 2;

  const overviewLines = [
    `Prepared For: ${quoteDoc.fullName || 'Client'} (${quoteDoc.businessName || 'Direct Project'})`,
    `Contact: ${quoteDoc.emailPhone || quoteDoc.email || quoteDoc.phone || 'N/A'}   |   Region: ${
      quoteDoc.countryName || 'India'
    } (${quoteDoc.region || 'INDIA'})`,
    `Main Website Goal: ${quoteDoc.mainGoal || 'Custom Website Development'}`,
    `Estimated Delivery Timeline: ${evalData.durationEstimate?.realisticDaysMin || 1}-${
      evalData.durationEstimate?.realisticDaysMax || 2
    } working days${quoteDoc.rushDelivery ? ' (Priority Rush Timeline Applied)' : ''}`,
    `Included Revision Rounds: ${evalData.revisions?.frontendShared || 3} Consolidated Frontend Rounds${
      (evalData.revisions?.backendShared || 0) > 0
        ? ` + ${evalData.revisions.backendShared} Shared Backend Rounds`
        : ''
    }`,
    `One-Time Hosting & Domain/SSL Setup: FREE (Included at no extra setup charge)`,
  ];

  for (const line of overviewLines) {
    writeWrappedParagraph(`- ${line}`, 9.2, 'normal', 4);
  }

  // Section 2: Itemized Scope & Price Breakdown
  y += 8;
  writeWrappedParagraph('2. Itemized Scope & Cost Breakdown', 11, 'bold');
  y += 2;

  const items: any[] = Array.isArray(evalData.items) ? evalData.items : [];
  if (items.length === 0) {
    writeWrappedParagraph('- Custom Project Scope: To be finalized', 9.2, 'normal', 6);
  } else {
    for (const item of items) {
      writeWrappedParagraph(
        `- ${item.label}: ${sym}${Number(item.cost || 0).toLocaleString()}`,
        9.2,
        'normal',
        6
      );
      if (item.note) {
        writeWrappedParagraph(`  (${item.note})`, 8.2, 'normal', 12);
      }
    }
  }

  y += 4;
  if (Number(evalData.discountAmount || 0) > 0) {
    writeWrappedParagraph(
      `Subtotal: ${sym}${Number(evalData.subtotal || 0).toLocaleString()}`,
      9.5,
      'normal',
      4
    );
    writeWrappedParagraph(
      `Special Discount (${evalData.discountPercent}%): -${sym}${Number(
        evalData.discountAmount
      ).toLocaleString()}`,
      9.5,
      'bold',
      4
    );
  }
  if (Number(evalData.gstAmount || 0) > 0) {
    writeWrappedParagraph(
      `GST (18%): +${sym}${Number(evalData.gstAmount).toLocaleString()}`,
      9.5,
      'normal',
      4
    );
  }

  // Total Box
  y += 6;
  ensureSpace(46);
  doc.setFillColor(246, 246, 248);
  doc.setDrawColor(20, 20, 22);
  doc.setLineWidth(1);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 36, 6, 6, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(20, 20, 20);
  doc.text('FINAL PROJECT QUOTE TOTAL:', margin + 14, y + 22);
  doc.setTextColor(255, 87, 51);
  doc.setFontSize(12.5);
  doc.text(
    sanitizePdfText(`${sym}${Number(evalData.grandTotal || 0).toLocaleString()}`),
    pageWidth - margin - 14,
    y + 22,
    { align: 'right' }
  );
  y += 50;

  // Section 3: Payment Milestones
  doc.setTextColor(20, 20, 20);
  const milestones: any[] = Array.isArray(evalData.milestones) ? evalData.milestones : [];
  if (milestones.length > 0) {
    writeWrappedParagraph('3. Payment Milestone Schedule', 11, 'bold');
    y += 2;
    for (const m of milestones) {
      writeWrappedParagraph(
        `- ${m.name} (${m.percent}%): ${sym}${Number(m.amount || 0).toLocaleString()}  -  Due: ${
          m.trigger
        }`,
        9.2,
        'normal',
        6
      );
    }
  }

  // Section 4: Next Steps
  y += 8;
  writeWrappedParagraph('4. Quote Validity & Next Steps', 11, 'bold');
  y += 2;
  writeWrappedParagraph(
    '- This official quotation is valid for 15 calendar days from the date of issue.',
    9,
    'normal',
    4
  );
  writeWrappedParagraph(
    '- To confirm and kick off development, please reply with your confirmation and complete the Advance milestone payment.',
    9,
    'normal',
    4
  );
  writeWrappedParagraph(
    '- Includes 15-day post-launch free bug-fix warranty and full source code handover upon completion.',
    9,
    'normal',
    4
  );

  const cleanFileName = `ByFalguni_Official_Quote_${
    String(quoteDoc.fullName || 'Client')
      .trim()
      .replace(/[^a-zA-Z0-9_-]/g, '_')
  }.pdf`;
  doc.save(cleanFileName);
}