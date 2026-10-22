// admin/src/app/api/portfolio/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { PortfolioModel, INITIAL_PORTFOLIO_SEED } from '@/models/Portfolio';
import { verifyAdminToken } from '@/lib/totp';
import { deleteImageKitFiles } from '@/lib/imagekitServer';
import { corsHeaders, handleOptions } from '@/lib/cors';

const FRONTEND_SITE_URL =
  process.env.NEXT_PUBLIC_FRONTEND_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  'https://byfalguni.com';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(req: NextRequest) {
  // Inline PDF viewer stream endpoint: fetches the current resume PDF and serves it with
  // Content-Type: application/pdf & Content-Disposition: inline so it can be previewed in
  // an <iframe> and viewed in-browser without triggering a file download.
  const previewPdfParam = req.nextUrl.searchParams.get('previewPdf');
  if (previewPdfParam) {
    try {
      const targetUrl = previewPdfParam.startsWith('http')
        ? previewPdfParam
        : `${FRONTEND_SITE_URL.replace(/\/$/, '')}/${previewPdfParam.replace(/^\//, '')}`;

      const upstream = await fetch(targetUrl, { cache: 'no-store' });
      if (!upstream.ok) {
        return NextResponse.json(
          { error: `Failed to fetch PDF (${upstream.status})` },
          { status: upstream.status, headers: corsHeaders() }
        );
      }

      const arrayBuffer = await upstream.arrayBuffer();
      return new NextResponse(arrayBuffer, {
        status: 200,
        headers: {
          ...corsHeaders(),
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'inline; filename="Falguni_Mondal_Resume.pdf"',
          'Cache-Control': 'no-store, max-age=0',
        },
      });
    } catch {
      return NextResponse.json(
        { error: 'Unable to load PDF preview' },
        { status: 500, headers: corsHeaders() }
      );
    }
  }

  await connectDB();
  let doc: any = await PortfolioModel.findOne({ singletonKey: 'MASTER_PORTFOLIO' }).lean();
  if (!doc) {
    const created = await PortfolioModel.create(INITIAL_PORTFOLIO_SEED);
    doc = created.toObject();
  }

  const normalizedDoc = {
    ...INITIAL_PORTFOLIO_SEED,
    ...doc,
    heroImageDark: doc.heroImageDark || '/me.webp',
    heroImageDarkFileId: doc.heroImageDarkFileId || '',
    heroImageLight: doc.heroImageLight || '/me_light.webp',
    heroImageLightFileId: doc.heroImageLightFileId || '',
    resumeUrl: doc.resumeUrl || '/falguni_mondal_resume.pdf',
    resumeFileId: doc.resumeFileId || '',
  };

  return NextResponse.json(normalizedDoc, { headers: corsHeaders() });
}

export async function PUT(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  if (!verifyAdminToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();
  const payload = await req.json();

  // 1. Delete any replaced old ImageKit files passed from Admin
  if (Array.isArray(payload.deletedFileIds) && payload.deletedFileIds.length > 0) {
    await deleteImageKitFiles(payload.deletedFileIds);
  }

  // 2. Sanitize Hero Images (Dark & Light) and Resume PDF URLs
  const heroImageDark =
    payload.heroImageDark && String(payload.heroImageDark).trim() !== ''
      ? String(payload.heroImageDark).trim()
      : '/me.webp';
  const heroImageDarkFileId = payload.heroImageDarkFileId || '';

  const heroImageLight =
    payload.heroImageLight && String(payload.heroImageLight).trim() !== ''
      ? String(payload.heroImageLight).trim()
      : '/me_light.webp';
  const heroImageLightFileId = payload.heroImageLightFileId || '';

  const resumeUrl =
    payload.resumeUrl && String(payload.resumeUrl).trim() !== ''
      ? String(payload.resumeUrl).trim()
      : '/falguni_mondal_resume.pdf';
  const resumeFileId = payload.resumeFileId || '';

  // 3. Enforce "/coming_soon.mp4" fallback on empty media URLs in Works, Lab, and Certificates
  const sanitizedWorks = (payload.works || []).map((w: any) => ({
    name: w.name || '',
    description: w.description || '',
    companyId: w.companyId || '',
    companyName: w.companyName || '',
    videoUrl:
      w.videoUrl && String(w.videoUrl).trim() !== ''
        ? String(w.videoUrl).trim()
        : '/coming_soon.mp4',
    videoFileId: w.videoFileId || '',
    isOngoing: Boolean(w.isOngoing),
    url: w.url || '',
  }));

  const sanitizedLab = (payload.lab || []).map((l: any) => ({
    name: l.name || '',
    image1:
      l.image1 && String(l.image1).trim() !== '' ? String(l.image1).trim() : '/coming_soon.mp4',
    image1FileId: l.image1FileId || '',
    image2:
      l.image2 && String(l.image2).trim() !== '' ? String(l.image2).trim() : '/coming_soon.mp4',
    image2FileId: l.image2FileId || '',
    projectUrl: l.projectUrl || '',
    tools: Array.isArray(l.tools) ? l.tools : [],
    isOngoing: Boolean(l.isOngoing),
  }));

  const sanitizedCerts = (payload.certificates || []).map((c: any) => ({
    name: c.name || '',
    organization: c.organization || '',
    year: c.year || '',
    certId: c.certId || '',
    url: c.url && String(c.url).trim() !== '' ? String(c.url).trim() : '/coming_soon.mp4',
    fileId: c.fileId || '',
  }));

  // 4. Automatically populate each Experience's `projects` array from Works linked to that company
  const sanitizedExperience = (payload.experience || []).map((exp: any) => {
    const linkedProjectNames = sanitizedWorks
      .filter(
        (w: any) =>
          (w.companyId && w.companyId === exp.id) ||
          (w.companyName &&
            exp.name &&
            w.companyName.toLowerCase().trim() === exp.name.toLowerCase().trim())
      )
      .map((w: any) => w.name)
      .filter(Boolean);

    return {
      id: exp.id || `exp-${Date.now()}`,
      name: exp.name || '',
      type: exp.type || '',
      role: exp.role || '',
      from: exp.from || '',
      to: exp.to || '',
      isPresent: Boolean(exp.isPresent),
      projects: linkedProjectNames,
    };
  });

  const updated = await PortfolioModel.findOneAndUpdate(
    { singletonKey: 'MASTER_PORTFOLIO' },
    {
      $set: {
        heroImageDark,
        heroImageDarkFileId,
        heroImageLight,
        heroImageLightFileId,
        resumeUrl,
        resumeFileId,
        arsenal: payload.arsenal || [],
        experience: sanitizedExperience,
        works: sanitizedWorks,
        lab: sanitizedLab,
        certificates: sanitizedCerts,
        contact: payload.contact || {},
      },
    },
    { new: true, upsert: true }
  );

  return NextResponse.json(updated);
}