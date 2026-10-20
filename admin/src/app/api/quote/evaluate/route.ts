// src/app/api/quote/evaluate/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { PricingConfigModel } from '@/models/PricingConfig';
import { evaluateProjectQuote } from '@/lib/pricingEngine';
import { corsHeaders, handleOptions } from '@/lib/cors';

export async function OPTIONS() {
  return handleOptions();
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  let masterConfig = null;
  try {
    await connectDB();
    masterConfig = await PricingConfigModel.findOne({ singletonKey: 'MASTER_PRICING' }).lean();
  } catch {
    // Falls back to built-in Playbook v3.1 defaults if DB is offline during local test
  }
  const evaluated = evaluateProjectQuote(body, masterConfig);
  return NextResponse.json(evaluated, { headers: corsHeaders() });
}