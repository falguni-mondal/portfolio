// admin/src/app/api/portfolio/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { PortfolioModel, INITIAL_PORTFOLIO_SEED } from '@/models/Portfolio';
import { verifyAdminToken } from '@/lib/totp';
import { deleteImageKitFiles } from '@/lib/imagekitServer';
import { corsHeaders, handleOptions } from '@/lib/cors';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET() {
  await connectDB();
  let doc = await PortfolioModel.findOne({ singletonKey: 'MASTER_PORTFOLIO' }).lean();
  if (!doc) {
    doc = await PortfolioModel.create(INITIAL_PORTFOLIO_SEED);
  }
  return NextResponse.json(doc, { headers: corsHeaders() });
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

  // 2. Enforce "/coming_soon.mp4" fallback on empty media URLs in Works, Lab, and Certificates
  const sanitizedWorks = (payload.works || []).map((w: any) => ({
    ...w,
    videoUrl: w.videoUrl && String(w.videoUrl).trim() !== '' ? w.videoUrl.trim() : '/coming_soon.mp4',
    videoFileId: w.videoFileId || '',
    companyId: w.companyId || '',
    companyName: w.companyName || '',
  }));

  const sanitizedLab = (payload.lab || []).map((l: any) => ({
    ...l,
    image1: l.image1 && String(l.image1).trim() !== '' ? l.image1.trim() : '/coming_soon.mp4',
    image1FileId: l.image1FileId || '',
    image2: l.image2 && String(l.image2).trim() !== '' ? l.image2.trim() : '/coming_soon.mp4',
    image2FileId: l.image2FileId || '',
  }));

  const sanitizedCerts = (payload.certificates || []).map((c: any) => ({
    ...c,
    url: c.url && String(c.url).trim() !== '' ? c.url.trim() : '/coming_soon.mp4',
    fileId: c.fileId || '',
  }));

  // 3. Automatically populate each Experience's `projects` array from Works linked to that company
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
      ...exp,
      projects: linkedProjectNames,
    };
  });

  const updated = await PortfolioModel.findOneAndUpdate(
    { singletonKey: 'MASTER_PORTFOLIO' },
    {
      $set: {
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