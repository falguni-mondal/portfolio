// admin/src/app/api/quotes/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { ClientQuoteModel } from '@/models/ClientQuote';
import { PricingConfigModel } from '@/models/PricingConfig';
import { evaluateProjectQuote } from '@/lib/pricingEngine';
import { sendClientQuoteNotification } from '@/lib/mailer';
import { verifyAdminToken } from '@/lib/totp';
import { corsHeaders, handleOptions } from '@/lib/cors';

export async function OPTIONS() {
  return handleOptions();
}

function sanitizeFolderPart(str: string): string {
  return (
    str
      .trim()
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '') || 'Client'
  );
}

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;



export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();

  const fullName = String(body.fullName || '').trim();
  const email = String(body.email || '').trim();
  const phone = String(body.phone || '').trim();
  const emailPhone =
    String(body.emailPhone || '').trim() || [email, phone].filter(Boolean).join(' | ');

  if (!fullName || fullName.length < 2) {
    return NextResponse.json(
      { error: 'Valid Full Name is required.' },
      { status: 400, headers: corsHeaders() }
    );
  }

  if (body.source !== 'MANUAL' && email && !EMAIL_REGEX.test(email)) {
    return NextResponse.json(
      { error: 'Invalid email address format.' },
      { status: 400, headers: corsHeaders() }
    );
  }

  const businessName = String(body.businessName || '').trim();
  const businessDescription = String(body.businessDescription || '').trim();

  if (body.source !== 'MANUAL' && (!businessDescription || businessDescription.length < 5)) {
    return NextResponse.json(
      { error: 'Description of the Business is required.' },
      { status: 400, headers: corsHeaders() }
    );
  }

  const masterConfig = await PricingConfigModel.findOne({ singletonKey: 'MASTER_PRICING' }).lean();
  const evaluated = evaluateProjectQuote(body.simpleChoices || body, masterConfig);

  const clientFolder = `/Clients/Files/${sanitizeFolderPart(fullName)}_${sanitizeFolderPart(
    phone || email || emailPhone
  )}`;

  const isCompleted = Boolean(body.isCompleted);
  const deliveryDate =
    body.deliveryDate || (isCompleted ? new Date().toISOString().split('T')[0] : '');

  const created = await ClientQuoteModel.create({
    fullName,
    email,
    phone,
    emailPhone,
    countryName: body.countryName || 'India',
    countryCode: body.countryCode || 'IN',
    countryFlag: body.countryFlag || 'IN',
    region: evaluated.region,
    businessName,
    businessDescription,
    mainGoal: body.mainGoal || '',
    launchDateReason: body.launchDateReason || '',
    rushDelivery: Boolean(body.rushDelivery ?? body.simpleChoices?.rushDelivery),
    isCompleted,
    deliveryDate,
    designReferences: body.designReferences || '',
    budget: Number(body.budget) || 0,
    clientDescription: body.clientDescription || '',
    clientFolder,
    source: body.source === 'MANUAL' ? 'MANUAL' : 'WEBAPP',
    signedAgreementPdfUrl: body.signedAgreementPdfUrl || '',
    signedAgreementFileId: body.signedAgreementFileId || '',
    signedAgreementText: body.signedAgreementText || '',
    agreedAt: body.agreedAt || new Date().toISOString(),
    uploadedAssets: body.uploadedAssets || [],
    simpleChoices: body.simpleChoices || {},
    complexConfig: { ...evaluated.inferredComplexConfig, isAdminComplexOverride: true },
    evaluatedQuote: evaluated,
    status: isCompleted ? 'COMPLETED' : 'NEW',
  });

  if (body.source !== 'MANUAL') {
    sendClientQuoteNotification(created).catch((err: unknown) => {
      console.error('Resend mail error:', err);
    });
  }

  return NextResponse.json(
    { success: true, quoteId: created._id, client: created, evaluated },
    { headers: corsHeaders() }
  );
}



export async function GET(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  if (!verifyAdminToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await connectDB();
  const quotes = await ClientQuoteModel.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(quotes);
}



export async function PUT(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  if (!verifyAdminToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await connectDB();
  const body = await req.json();
  const { id, complexConfig, status, isCompleted, deliveryDate, uploadedAssets } = body;

  const updateFields: Record<string, any> = {};

  if (complexConfig) {
    const masterConfig = await PricingConfigModel.findOne({
      singletonKey: 'MASTER_PRICING',
    }).lean();
    const evaluatedQuote = evaluateProjectQuote(
      { ...complexConfig, isAdminComplexOverride: true },
      masterConfig
    );
    updateFields.complexConfig = complexConfig;
    updateFields.evaluatedQuote = evaluatedQuote;
    updateFields.rushDelivery = Boolean(complexConfig.rushDelivery);
  }

  if (typeof isCompleted === 'boolean') {
    updateFields.isCompleted = isCompleted;
    updateFields.status = isCompleted ? 'COMPLETED' : status || 'REVIEWED';
  } else if (status) {
    updateFields.status = status;
  }

  if (typeof deliveryDate === 'string') {
    updateFields.deliveryDate = deliveryDate;
  }

  if (Array.isArray(uploadedAssets)) {
    updateFields.uploadedAssets = uploadedAssets;
  }

  const updated = await ClientQuoteModel.findByIdAndUpdate(
    id,
    { $set: updateFields },
    { returnDocument: 'after' }
  );
  return NextResponse.json(updated);
}



export async function DELETE(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  if (!verifyAdminToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await connectDB();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing quote id' }, { status: 400 });
  }
  await ClientQuoteModel.findByIdAndDelete(id);
  return NextResponse.json({ success: true, deletedId: id });
}