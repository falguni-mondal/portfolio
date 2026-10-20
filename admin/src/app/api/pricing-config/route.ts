// admin/src/app/api/pricing-config/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { PricingConfigModel } from '@/models/PricingConfig';
import { verifyAdminToken } from '@/lib/totp';
import { initExchangeRateCron, syncExchangeRateFromApi } from '@/lib/exchangeRateCron';
import { corsHeaders, handleOptions } from '@/lib/cors';

initExchangeRateCron();

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(req: NextRequest) {
  await connectDB();
  const forceSync = new URL(req.url).searchParams.get('syncRate') === '1';

  let config: any = await PricingConfigModel.findOne({ singletonKey: 'MASTER_PRICING' }).lean();
  if (!config) {
    config = await PricingConfigModel.create({ singletonKey: 'MASTER_PRICING' });
  }

  const twelveHoursMs = 12 * 60 * 60 * 1000;
  const lastUpdated = config.exchangeRateLastUpdated
    ? new Date(config.exchangeRateLastUpdated).getTime()
    : 0;

  if (forceSync || Date.now() - lastUpdated > twelveHoursMs) {
    const synced = await syncExchangeRateFromApi(forceSync);
    if (synced) config = synced;
  }

  return NextResponse.json(config, { headers: corsHeaders() });
}

export async function PUT(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  if (!verifyAdminToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await connectDB();
  const body = await req.json();
  const updated = await PricingConfigModel.findOneAndUpdate(
    { singletonKey: 'MASTER_PRICING' },
    {
      $set: {
        globalMultiplier: body.globalMultiplier,
        gstRegistered: body.gstRegistered,
        freeHostingThresholdInr: body.freeHostingThresholdInr,
        freeHostingThresholdUsd: body.freeHostingThresholdUsd,
        activeOfferLabel: body.activeOfferLabel,
        activeOfferDiscountPercent: body.activeOfferDiscountPercent,
        rates: body.rates,
      },
    },
    { new: true, upsert: true }
  );
  return NextResponse.json(updated);
}