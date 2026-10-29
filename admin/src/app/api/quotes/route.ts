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
  const isManual = body.source === 'MANUAL';

  const rawFullName = String(body.fullName || '').trim();
  const fullName = rawFullName || (isManual ? 'Unnamed Client' : '');
  const email = String(body.email || '').trim();
  const phone = String(body.phone || '').trim();
  const emailPhone =
    String(body.emailPhone || '').trim() ||
    [email, phone].filter(Boolean).join(' | ') ||
    (isManual ? 'N/A' : '');

  if (!isManual && (!fullName || fullName.length < 2)) {
    return NextResponse.json(
      { error: 'Valid Full Name is required.' },
      { status: 400, headers: corsHeaders() }
    );
  }

  if (!isManual && email && !EMAIL_REGEX.test(email)) {
    return NextResponse.json(
      { error: 'Invalid email address format.' },
      { status: 400, headers: corsHeaders() }
    );
  }

  const businessName = String(body.businessName || '').trim();
  const businessDescription = String(body.businessDescription || '').trim();

  if (!isManual && (!businessDescription || businessDescription.length < 5)) {
    return NextResponse.json(
      { error: 'Description of the Business is required.' },
      { status: 400, headers: corsHeaders() }
    );
  }

  const masterConfig = await PricingConfigModel.findOne({ singletonKey: 'MASTER_PRICING' }).lean();
  const evaluated = evaluateProjectQuote(
    {
      ...(body.simpleChoices || body),
      clientDescription: body.clientDescription || '',
    },
    masterConfig
  );

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
    countryFlag: body.countryFlag || body.countryCode || 'IN',
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
    source: isManual ? 'MANUAL' : 'WEBAPP',
    signedAgreementPdfUrl: body.signedAgreementPdfUrl || '',
    signedAgreementFileId: body.signedAgreementFileId || '',
    signedAgreementText: body.signedAgreementText || '',
    agreedAt: body.agreedAt || new Date().toISOString(),
    uploadedAssets: body.uploadedAssets || [],
    simpleChoices: body.simpleChoices || {},
    complexConfig: { ...evaluated.inferredComplexConfig, isAdminComplexOverride: true },
    evaluatedQuote: evaluated,
    status: body.status || (isCompleted ? 'COMPLETED' : 'NEW'),
  });

  if (!isManual) {
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
  const {
    id,
    complexConfig,
    simpleChoices,
    status,
    isCompleted,
    deliveryDate,
    uploadedAssets,
    fullName,
    email,
    phone,
    emailPhone,
    countryName,
    countryCode,
    countryFlag,
    region,
    businessName,
    businessDescription,
    mainGoal,
    launchDateReason,
    rushDelivery,
    designReferences,
    budget,
    clientDescription,
    signedAgreementText,
    signedAgreementPdfUrl,
  } = body;

  const updateFields: Record<string, any> = {};

  if (typeof fullName === 'string') updateFields.fullName = fullName.trim() || 'Unnamed Client';
  if (typeof email === 'string') updateFields.email = email.trim();
  if (typeof phone === 'string') updateFields.phone = phone.trim();
  if (typeof emailPhone === 'string') {
    updateFields.emailPhone = emailPhone.trim();
  } else if (typeof email === 'string' || typeof phone === 'string') {
    updateFields.emailPhone =
      [String(email || '').trim(), String(phone || '').trim()].filter(Boolean).join(' | ') || 'N/A';
  }
  if (typeof countryName === 'string') updateFields.countryName = countryName;
  if (typeof countryCode === 'string') updateFields.countryCode = countryCode;
  if (typeof countryFlag === 'string') updateFields.countryFlag = countryFlag;
  if (region === 'INDIA' || region === 'INTL') updateFields.region = region;
  if (typeof businessName === 'string') updateFields.businessName = businessName.trim();
  if (typeof businessDescription === 'string')
    updateFields.businessDescription = businessDescription.trim();
  if (typeof mainGoal === 'string') updateFields.mainGoal = mainGoal.trim();
  if (typeof launchDateReason === 'string') updateFields.launchDateReason = launchDateReason.trim();
  if (typeof rushDelivery === 'boolean') updateFields.rushDelivery = rushDelivery;
  if (typeof designReferences === 'string') updateFields.designReferences = designReferences.trim();
  if (typeof budget === 'number') updateFields.budget = budget;
  if (typeof clientDescription === 'string') updateFields.clientDescription = clientDescription;
  if (typeof signedAgreementText === 'string')
    updateFields.signedAgreementText = signedAgreementText;
  if (typeof signedAgreementPdfUrl === 'string')
    updateFields.signedAgreementPdfUrl = signedAgreementPdfUrl;

  const masterConfig = await PricingConfigModel.findOne({
    singletonKey: 'MASTER_PRICING',
  }).lean();

  if (simpleChoices && !complexConfig) {
    updateFields.simpleChoices = simpleChoices;
    const evaluatedQuote = evaluateProjectQuote(
      {
        ...simpleChoices,
        clientDescription:
          typeof clientDescription === 'string' ? clientDescription : simpleChoices.clientDescription,
      },
      masterConfig
    );
    updateFields.complexConfig = {
      ...evaluatedQuote.inferredComplexConfig,
      isAdminComplexOverride: true,
    };
    updateFields.evaluatedQuote = evaluatedQuote;
    updateFields.region = evaluatedQuote.region;
    updateFields.rushDelivery = Boolean(simpleChoices.rushDelivery);
  } else if (complexConfig) {
    if (simpleChoices) {
      updateFields.simpleChoices = simpleChoices;
    }
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